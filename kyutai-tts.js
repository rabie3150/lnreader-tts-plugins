// Kyutai TTS plugin for LNReader QuickJS runtime.
// Streams PCM audio over WebSocket from Kyutai's public TTS service,
// decodes MessagePack frames, converts float32 PCM to int16, and wraps it in WAV.

const WS_URL = 'wss://unmute.sh/tts-server/api/tts_streaming';
const ORIGIN = 'https://kyutai.org';
const SAMPLE_RATE = 24000;
const DEFAULT_VOICE_ID = 'expresso_ex04-ex01_narration_001_channel1_605s';

function log(msg) {
  console.log('[Kyutai]', msg);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function formatWsError(event) {
  if (!event) return 'unknown';
  const parts = [];
  if (event.message) parts.push('message=' + event.message);
  if (event.code) parts.push('code=' + event.code);
  if (event.reason) parts.push('reason=' + event.reason);
  return parts.join(' ') || 'unknown';
}

function openWebSocket(url) {
  return new Promise((resolve, reject) => {
    let openTimer = null;
    let lastError = 'unknown';
    // React Native's WebSocket supports custom headers on Android via the
    // third options argument, but Kyutai works without them and some RN builds
    // reject the options object. Keep the constructor simple.
    const ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    const buffer = [];
    const pending = [];

    const pushMessage = msg => {
      if (pending.length > 0) {
        pending.shift().resolve(msg);
      } else {
        buffer.push(msg);
      }
    };

    ws.onopen = () => {
      clearTimeout(openTimer);
      ws.onerror = event => pushMessage({ type: 'error', reason: formatWsError(event) });
      ws.onclose = () => pushMessage({ type: 'close' });
      resolve(ws);
    };

    ws.onerror = event => {
      lastError = formatWsError(event);
      clearTimeout(openTimer);
      reject(new Error('WebSocket open failed: ' + lastError));
      try { ws.close(); } catch {}
    };

    ws.onclose = event => {
      clearTimeout(openTimer);
      reject(new Error('WebSocket closed before open: ' + formatWsError(event)));
    };

    ws.onmessage = event => {
      const isString = typeof event.data === 'string';
      pushMessage({ type: isString ? 'text' : 'binary', data: event.data });
    };

    ws._kyutaiBuffer = buffer;
    ws._kyutaiPending = pending;

    openTimer = setTimeout(() => {
      reject(new Error('WebSocket open timeout'));
      try { ws.close(); } catch {}
    }, 30000);
  });
}

async function wsReceive(ws, timeoutMs) {
  if (ws._kyutaiBuffer.length > 0) {
    return ws._kyutaiBuffer.shift();
  }
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve({ type: 'timeout' }), timeoutMs);
    ws._kyutaiPending.push({
      resolve: msg => {
        clearTimeout(timer);
        resolve(msg);
      },
    });
  });
}

function wsSend(ws, data) {
  ws.send(data);
}

function utf8BytesToString(bytes, start, length) {
  let result = '';
  let i = start;
  const end = start + length;
  while (i < end) {
    let c = bytes[i];
    if (c < 0x80) {
      result += String.fromCharCode(c);
      i++;
    } else if (c < 0xc0) {
      result += String.fromCharCode(c);
      i++;
    } else if (c < 0xe0) {
      if (i + 1 >= end) break;
      const c2 = bytes[i + 1];
      result += String.fromCharCode(((c & 0x1f) << 6) | (c2 & 0x3f));
      i += 2;
    } else if (c < 0xf0) {
      if (i + 2 >= end) break;
      const c2 = bytes[i + 1];
      const c3 = bytes[i + 2];
      result += String.fromCharCode(((c & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (c3 & 0x3f));
      i += 3;
    } else {
      if (i + 3 >= end) break;
      const c2 = bytes[i + 1];
      const c3 = bytes[i + 2];
      const c4 = bytes[i + 3];
      let code = ((c & 0x07) << 18) | ((c2 & 0x3f) << 12) | ((c3 & 0x3f) << 6) | (c4 & 0x3f);
      if (code > 0xffff) {
        code -= 0x10000;
        result += String.fromCharCode(0xd800 + (code >> 10));
        result += String.fromCharCode(0xdc00 + (code & 0x3ff));
      } else {
        result += String.fromCharCode(code);
      }
      i += 4;
    }
  }
  return result;
}

function encodeString(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c < 0xd800 || c >= 0xe000) {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      i++;
      c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

function buildMsgpackString(str) {
  const encoded = encodeString(str);
  const len = encoded.length;
  let header;
  if (len < 32) {
    header = new Uint8Array([0xa0 | len]);
  } else if (len < 256) {
    header = new Uint8Array([0xd9, len]);
  } else if (len < 65536) {
    header = new Uint8Array([0xda, len >> 8, len & 0xff]);
  } else {
    header = new Uint8Array([0xdb, (len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff]);
  }
  const result = new Uint8Array(header.length + len);
  result.set(header, 0);
  result.set(encoded, header.length);
  return result;
}

function packTextMessage(text) {
  const typeKey = buildMsgpackString('type');
  const typeVal = buildMsgpackString('Text');
  const textKey = buildMsgpackString('text');
  const textVal = buildMsgpackString(text);
  const total = 1 + typeKey.length + typeVal.length + textKey.length + textVal.length;
  const result = new Uint8Array(total);
  result[0] = 0x82;
  let offset = 1;
  result.set(typeKey, offset); offset += typeKey.length;
  result.set(typeVal, offset); offset += typeVal.length;
  result.set(textKey, offset); offset += textKey.length;
  result.set(textVal, offset);
  return result;
}

function packEosMessage() {
  const typeKey = buildMsgpackString('type');
  const typeVal = buildMsgpackString('Eos');
  const result = new Uint8Array(1 + typeKey.length + typeVal.length);
  result[0] = 0x81;
  result.set(typeKey, 1);
  result.set(typeVal, 1 + typeKey.length);
  return result;
}

function readUint16BE(bytes, offset) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readUint32BE(bytes, offset) {
  return (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
}

function decodeMsgpack(bytes, offset) {
  const b = bytes[offset];
  if (b <= 0x7f) {
    return { value: b, offset: offset + 1 };
  }
  if (b >= 0xe0) {
    return { value: b - 0x100, offset: offset + 1 };
  }
  if (b >= 0x80 && b <= 0x8f) {
    const size = b & 0x0f;
    const obj = {};
    let off = offset + 1;
    for (let i = 0; i < size; i++) {
      const keyRes = decodeMsgpack(bytes, off);
      const valRes = decodeMsgpack(bytes, keyRes.offset);
      obj[keyRes.value] = valRes.value;
      off = valRes.offset;
    }
    return { value: obj, offset: off };
  }
  if (b >= 0x90 && b <= 0x9f) {
    const size = b & 0x0f;
    const arr = [];
    let off = offset + 1;
    for (let i = 0; i < size; i++) {
      const res = decodeMsgpack(bytes, off);
      arr.push(res.value);
      off = res.offset;
    }
    return { value: arr, offset: off };
  }
  if (b >= 0xa0 && b <= 0xbf) {
    const len = b & 0x1f;
    const str = utf8BytesToString(bytes, offset + 1, len);
    return { value: str, offset: offset + 1 + len };
  }
  switch (b) {
    case 0xc0: return { value: null, offset: offset + 1 };
    case 0xc2: return { value: false, offset: offset + 1 };
    case 0xc3: return { value: true, offset: offset + 1 };
    case 0xc4: {
      const len = bytes[offset + 1];
      return { value: bytes.slice(offset + 2, offset + 2 + len), offset: offset + 2 + len };
    }
    case 0xc5: {
      const len = readUint16BE(bytes, offset + 1);
      return { value: bytes.slice(offset + 3, offset + 3 + len), offset: offset + 3 + len };
    }
    case 0xc6: {
      const len = readUint32BE(bytes, offset + 1);
      return { value: bytes.slice(offset + 5, offset + 5 + len), offset: offset + 5 + len };
    }
    case 0xca: {
      const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 1, 4);
      return { value: view.getFloat32(0, false), offset: offset + 5 };
    }
    case 0xcb: {
      const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 1, 8);
      return { value: view.getFloat64(0, false), offset: offset + 9 };
    }
    case 0xd9: {
      const len = bytes[offset + 1];
      const str = utf8BytesToString(bytes, offset + 2, len);
      return { value: str, offset: offset + 2 + len };
    }
    case 0xda: {
      const len = readUint16BE(bytes, offset + 1);
      const str = utf8BytesToString(bytes, offset + 3, len);
      return { value: str, offset: offset + 3 + len };
    }
    case 0xdb: {
      const len = readUint32BE(bytes, offset + 1);
      const str = utf8BytesToString(bytes, offset + 5, len);
      return { value: str, offset: offset + 5 + len };
    }
    case 0xdc: {
      const size = readUint16BE(bytes, offset + 1);
      const arr = [];
      let off = offset + 3;
      for (let i = 0; i < size; i++) {
        const res = decodeMsgpack(bytes, off);
        arr.push(res.value);
        off = res.offset;
      }
      return { value: arr, offset: off };
    }
    case 0xdd: {
      const size = readUint32BE(bytes, offset + 1);
      const arr = [];
      let off = offset + 5;
      for (let i = 0; i < size; i++) {
        const res = decodeMsgpack(bytes, off);
        arr.push(res.value);
        off = res.offset;
      }
      return { value: arr, offset: off };
    }
    case 0xde: {
      const size = readUint16BE(bytes, offset + 1);
      const obj = {};
      let off = offset + 3;
      for (let i = 0; i < size; i++) {
        const keyRes = decodeMsgpack(bytes, off);
        const valRes = decodeMsgpack(bytes, keyRes.offset);
        obj[keyRes.value] = valRes.value;
        off = valRes.offset;
      }
      return { value: obj, offset: off };
    }
    case 0xdf: {
      const size = readUint32BE(bytes, offset + 1);
      const obj = {};
      let off = offset + 5;
      for (let i = 0; i < size; i++) {
        const keyRes = decodeMsgpack(bytes, off);
        const valRes = decodeMsgpack(bytes, keyRes.offset);
        obj[keyRes.value] = valRes.value;
        off = valRes.offset;
      }
      return { value: obj, offset: off };
    }
    default:
      throw new Error('Unsupported msgpack type: 0x' + b.toString(16));
  }
}

function decodeAllMsgpack(bytes) {
  const messages = [];
  let offset = 0;
  while (offset < bytes.length) {
    const res = decodeMsgpack(bytes, offset);
    messages.push(res.value);
    offset = res.offset;
  }
  return messages;
}

function floatSamplesToInt16Pcm(samples) {
  const pcm = new Uint8Array(samples.length * 2);
  const view = new DataView(pcm.buffer);
  for (let i = 0; i < samples.length; i++) {
    let s = samples[i];
    if (s < -1) s = -1;
    if (s > 1) s = 1;
    const scaled = s * 32767;
    const intSample = scaled >= 0 ? Math.floor(scaled) : Math.ceil(scaled);
    view.setInt16(i * 2, intSample, true);
  }
  return pcm;
}

function buildWav(pcmData, sampleRate) {
  const channels = 1;
  const sampleWidth = 2;
  const dataChunkSize = pcmData.length;
  const fileSize = 36 + dataChunkSize;

  const wav = new Uint8Array(44 + dataChunkSize);
  const view = new DataView(wav.buffer);

  let offset = 0;
  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      wav[offset++] = str.charCodeAt(i);
    }
  }
  function writeUint32LE(val) {
    view.setUint32(offset, val, true);
    offset += 4;
  }
  function writeUint16LE(val) {
    view.setUint16(offset, val, true);
    offset += 2;
  }

  writeString('RIFF');
  writeUint32LE(fileSize);
  writeString('WAVE');
  writeString('fmt ');
  writeUint32LE(16);
  writeUint16LE(1);
  writeUint16LE(channels);
  writeUint32LE(sampleRate);
  writeUint32LE(sampleRate * channels * sampleWidth);
  writeUint16LE(channels * sampleWidth);
  writeUint16LE(sampleWidth * 8);
  writeString('data');
  writeUint32LE(dataChunkSize);
  wav.set(pcmData, offset);

  return wav;
}

function resolveVoiceId(voiceInput) {
  if (!voiceInput) {
    return DEFAULT_VOICE_ID;
  }
  if (voiceInput.indexOf('/') >= 0) {
    return voiceInput;
  }
  for (let i = 0; i < KYUTAI_VOICES.length; i++) {
    if (KYUTAI_VOICES[i].id === voiceInput) {
      return KYUTAI_VOICES[i].apiId;
    }
  }
  const idx = voiceInput.indexOf('_');
  if (idx >= 0) {
    return voiceInput.slice(0, idx) + '/' + voiceInput.slice(idx + 1) + '.wav';
  }
  return voiceInput;
}

function encodeURIComponentShim(str) {
  const reserved = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~';
  let result = '';
  const bytes = encodeString(str);
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    const c = String.fromCharCode(b);
    if (reserved.indexOf(c) >= 0) {
      result += c;
    } else {
      result += '%' + (b < 16 ? '0' : '') + b.toString(16).toUpperCase();
    }
  }
  return result;
}

async function synthesizeSingleRequest(text, voiceId, cfgAlpha) {
  const requestId = uuidv4().slice(0, 8);
  const encodedVoice = encodeURIComponentShim(voiceId);
  const url = WS_URL +
    '?voice=' + encodedVoice +
    '&cfg_alpha=' + cfgAlpha +
    '&format=PcmMessagePack' +
    '&auth_id=public_token' +
    '&request_id=' + requestId;

  log('connecting to ' + url);

  const ws = await openWebSocket(url);

  wsSend(ws, packTextMessage(text));
  wsSend(ws, packEosMessage());

  const audioMessages = [];
  let receivedAny = false;
  let timeoutMs = 30000; // Wait longer for the first audio chunk.

  while (true) {
    const msg = await wsReceive(ws, timeoutMs);
    if (msg.type === 'binary') {
      receivedAny = true;
      timeoutMs = 1500; // After first chunk, expect chunks back-to-back.
      audioMessages.push(new Uint8Array(msg.data));
    } else if (msg.type === 'text') {
      // ignore metadata frames
    } else if (msg.type === 'close') {
      break;
    } else if (msg.type === 'error') {
      throw new Error('Kyutai WebSocket error: ' + (msg.reason || 'unknown'));
    } else if (msg.type === 'timeout') {
      if (receivedAny) {
        // No new audio for timeoutMs; assume end of stream.
        break;
      }
      throw new Error('Kyutai WebSocket timed out waiting for first audio chunk');
    }
  }

  ws.close();

  if (!receivedAny) {
    throw new Error('No audio data received from Kyutai');
  }

  let totalLen = 0;
  for (let i = 0; i < audioMessages.length; i++) {
    totalLen += audioMessages[i].length;
  }
  const allBytes = new Uint8Array(totalLen);
  let off = 0;
  for (let i = 0; i < audioMessages.length; i++) {
    allBytes.set(audioMessages[i], off);
    off += audioMessages[i].length;
  }

  let messages;
  try {
    messages = decodeAllMsgpack(allBytes);
  } catch (e) {
    log('msgpack decode failed: ' + (e.message || e));
    throw new Error('Failed to decode Kyutai MessagePack audio: ' + (e.message || e));
  }

  const allSamples = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg && typeof msg === 'object') {
      const msgType = msg.type;
      if (msgType === 'Audio') {
        const pcm = msg.pcm;
        if (Array.isArray(pcm)) {
          for (let j = 0; j < pcm.length; j++) {
            allSamples.push(pcm[j]);
          }
        }
      }
    }
  }

  if (allSamples.length === 0) {
    throw new Error('No PCM samples found in Kyutai response');
  }

  log('received ' + allSamples.length + ' samples');

  const pcmData = floatSamplesToInt16Pcm(allSamples);
  const wav = buildWav(pcmData, SAMPLE_RATE);

  return {
    audioContent: wav.buffer,
    format: 'wav',
    sampleRate: SAMPLE_RATE,
  };
}

async function synthesizeWithRetry(text, voiceId, cfgAlpha, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voiceId, cfgAlpha);
    } catch (err) {
      lastErr = err;
      log('synthesize attempt ' + attempt + ' failed: ' + (err.message || err));
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

const KYUTAI_VOICES = [
  { id: "expresso_ex03-ex01_laughing_001_channel1_188s", apiId: "expresso/ex03-ex01_laughing_001_channel1_188s.wav", name: "Show host (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Show host (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex04-ex02_angry_001_channel1_119s", apiId: "expresso/ex04-ex02_angry_001_channel1_119s.wav", name: "Angry (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Angry (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex03-ex01_angry_001_channel1_201s", apiId: "expresso/ex03-ex01_angry_001_channel1_201s.wav", name: "Angry (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Angry (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex04-ex02_calm_001_channel2_336s", apiId: "expresso/ex04-ex02_calm_001_channel2_336s.wav", name: "Calming (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Calming (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex03-ex01_calm_001_channel1_1143s", apiId: "expresso/ex03-ex01_calm_001_channel1_1143s.wav", name: "Calming (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Calming (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex04-ex02_confused_001_channel1_499s", apiId: "expresso/ex04-ex02_confused_001_channel1_499s.wav", name: "Confused (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Confused (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex03-ex01_confused_001_channel1_909s", apiId: "expresso/ex03-ex01_confused_001_channel1_909s.wav", name: "Confused (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Confused (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex01-ex02_default_001_channel2_198s", apiId: "expresso/ex01-ex02_default_001_channel2_198s.wav", name: "Default (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Default (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex04-ex02_desire_001_channel2_694s", apiId: "expresso/ex04-ex02_desire_001_channel2_694s.wav", name: "Desire (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Desire (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex03-ex01_desire_004_channel2_580s", apiId: "expresso/ex03-ex01_desire_004_channel2_580s.wav", name: "Desire (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Desire (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex04-ex02_fearful_001_channel1_316s", apiId: "expresso/ex04-ex02_fearful_001_channel1_316s.wav", name: "Fearful (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Fearful (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex03-ex01_sleepy_001_channel1_619s", apiId: "expresso/ex03-ex01_sleepy_001_channel1_619s.wav", name: "Jazz radio (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Jazz radio (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex04-ex01_narration_001_channel1_605s", apiId: "expresso/ex04-ex01_narration_001_channel1_605s.wav", name: "Narration (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Narration (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex04-ex01_sympathetic-sad_008_channel2_453s", apiId: "expresso/ex04-ex01_sympathetic-sad_008_channel2_453s.wav", name: "Sad (IE, m)", languages: ["English (Expressive)"], gender: "male", description: "Sad (IE, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex03-ex02_sympathetic-sad_008_channel2_268s", apiId: "expresso/ex03-ex02_sympathetic-sad_008_channel2_268s.wav", name: "Sad (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Sad (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex04-ex02_sarcastic_001_channel2_466s", apiId: "expresso/ex04-ex02_sarcastic_001_channel2_466s.wav", name: "Sarcastic (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Sarcastic (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex03-ex01_sarcastic_001_channel2_491s", apiId: "expresso/ex03-ex01_sarcastic_001_channel2_491s.wav", name: "Sarcastic (US, m)", languages: ["English (Expressive)"], gender: "male", description: "Sarcastic (US, m) (English (Expressive), male) [Expresso]" },
  { id: "expresso_ex04-ex03_whisper_001_channel1_198s", apiId: "expresso/ex04-ex03_whisper_001_channel1_198s.wav", name: "Whisper (US, f)", languages: ["English (Expressive)"], gender: "female", description: "Whisper (US, f) (English (Expressive), female) [Expresso]" },
  { id: "expresso_ex01-ex02_default_001_channel1_168s", apiId: "expresso/ex01-ex02_default_001_channel1_168s.wav", name: "Ex01-Ex02 Default 001 Channel1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Default 001 Channel1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_enunciated_001_channel1_432s", apiId: "expresso/ex01-ex02_enunciated_001_channel1_432s.wav", name: "Ex01-Ex02 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_enunciated_001_channel2_354s", apiId: "expresso/ex01-ex02_enunciated_001_channel2_354s.wav", name: "Ex01-Ex02 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_fast_001_channel1_104s", apiId: "expresso/ex01-ex02_fast_001_channel1_104s.wav", name: "Ex01-Ex02 Fast 001 Channel1 10", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Fast 001 Channel1 10 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_fast_001_channel2_73s", apiId: "expresso/ex01-ex02_fast_001_channel2_73s.wav", name: "Ex01-Ex02 Fast 001 Channel2 73", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Fast 001 Channel2 73 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_projected_001_channel1_46s", apiId: "expresso/ex01-ex02_projected_001_channel1_46s.wav", name: "Ex01-Ex02 Projected 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Projected 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_projected_002_channel2_248s", apiId: "expresso/ex01-ex02_projected_002_channel2_248s.wav", name: "Ex01-Ex02 Projected 002 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Projected 002 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_whisper_001_channel1_579s", apiId: "expresso/ex01-ex02_whisper_001_channel1_579s.wav", name: "Ex01-Ex02 Whisper 001 Channel1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Whisper 001 Channel1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex01-ex02_whisper_001_channel2_717s", apiId: "expresso/ex01-ex02_whisper_001_channel2_717s.wav", name: "Ex01-Ex02 Whisper 001 Channel2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex01-Ex02 Whisper 001 Channel2 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_angry_001_channel2_181s", apiId: "expresso/ex03-ex01_angry_001_channel2_181s.wav", name: "Ex03-Ex01 Angry 001 Channel2 1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Angry 001 Channel2 1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_awe_001_channel1_1323s", apiId: "expresso/ex03-ex01_awe_001_channel1_1323s.wav", name: "Ex03-Ex01 Awe 001 Channel1 132", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Awe 001 Channel1 132 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_awe_001_channel2_1290s", apiId: "expresso/ex03-ex01_awe_001_channel2_1290s.wav", name: "Ex03-Ex01 Awe 001 Channel2 129", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Awe 001 Channel2 129 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_calm_001_channel2_1081s", apiId: "expresso/ex03-ex01_calm_001_channel2_1081s.wav", name: "Ex03-Ex01 Calm 001 Channel2 10", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Calm 001 Channel2 10 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_confused_001_channel2_816s", apiId: "expresso/ex03-ex01_confused_001_channel2_816s.wav", name: "Ex03-Ex01 Confused 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Confused 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_desire_004_channel1_545s", apiId: "expresso/ex03-ex01_desire_004_channel1_545s.wav", name: "Ex03-Ex01 Desire 004 Channel1 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Desire 004 Channel1  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_disgusted_004_channel1_170s", apiId: "expresso/ex03-ex01_disgusted_004_channel1_170s.wav", name: "Ex03-Ex01 Disgusted 004 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Disgusted 004 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_enunciated_001_channel1_388s", apiId: "expresso/ex03-ex01_enunciated_001_channel1_388s.wav", name: "Ex03-Ex01 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_enunciated_001_channel2_576s", apiId: "expresso/ex03-ex01_enunciated_001_channel2_576s.wav", name: "Ex03-Ex01 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_happy_001_channel1_334s", apiId: "expresso/ex03-ex01_happy_001_channel1_334s.wav", name: "Ex03-Ex01 Happy 001 Channel1 3", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Happy 001 Channel1 3 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_happy_001_channel2_257s", apiId: "expresso/ex03-ex01_happy_001_channel2_257s.wav", name: "Ex03-Ex01 Happy 001 Channel2 2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Happy 001 Channel2 2 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_laughing_002_channel2_232s", apiId: "expresso/ex03-ex01_laughing_002_channel2_232s.wav", name: "Ex03-Ex01 Laughing 002 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Laughing 002 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_nonverbal_001_channel2_37s", apiId: "expresso/ex03-ex01_nonverbal_001_channel2_37s.wav", name: "Ex03-Ex01 Nonverbal 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Nonverbal 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_nonverbal_006_channel1_62s", apiId: "expresso/ex03-ex01_nonverbal_006_channel1_62s.wav", name: "Ex03-Ex01 Nonverbal 006 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Nonverbal 006 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_sarcastic_001_channel1_435s", apiId: "expresso/ex03-ex01_sarcastic_001_channel1_435s.wav", name: "Ex03-Ex01 Sarcastic 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Sarcastic 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex01_sleepy_001_channel2_662s", apiId: "expresso/ex03-ex01_sleepy_001_channel2_662s.wav", name: "Ex03-Ex01 Sleepy 001 Channel2 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex01 Sleepy 001 Channel2  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_animal-animaldir_002_channel2_89s", apiId: "expresso/ex03-ex02_animal-animaldir_002_channel2_89s.wav", name: "Ex03-Ex02 Animal-Animaldir 002", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Animal-Animaldir 002 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_animal-animaldir_003_channel1_32s", apiId: "expresso/ex03-ex02_animal-animaldir_003_channel1_32s.wav", name: "Ex03-Ex02 Animal-Animaldir 003", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Animal-Animaldir 003 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_animaldir-animal_008_channel1_147s", apiId: "expresso/ex03-ex02_animaldir-animal_008_channel1_147s.wav", name: "Ex03-Ex02 Animaldir-Animal 008", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Animaldir-Animal 008 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_animaldir-animal_008_channel2_136s", apiId: "expresso/ex03-ex02_animaldir-animal_008_channel2_136s.wav", name: "Ex03-Ex02 Animaldir-Animal 008", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Animaldir-Animal 008 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_child-childdir_001_channel1_291s", apiId: "expresso/ex03-ex02_child-childdir_001_channel1_291s.wav", name: "Ex03-Ex02 Child-Childdir 001 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Child-Childdir 001 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_child-childdir_001_channel2_69s", apiId: "expresso/ex03-ex02_child-childdir_001_channel2_69s.wav", name: "Ex03-Ex02 Child-Childdir 001 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Child-Childdir 001 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_childdir-child_004_channel1_308s", apiId: "expresso/ex03-ex02_childdir-child_004_channel1_308s.wav", name: "Ex03-Ex02 Childdir-Child 004 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Childdir-Child 004 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_childdir-child_004_channel2_187s", apiId: "expresso/ex03-ex02_childdir-child_004_channel2_187s.wav", name: "Ex03-Ex02 Childdir-Child 004 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Childdir-Child 004 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_laughing_001_channel1_248s", apiId: "expresso/ex03-ex02_laughing_001_channel1_248s.wav", name: "Ex03-Ex02 Laughing 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Laughing 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_laughing_001_channel2_234s", apiId: "expresso/ex03-ex02_laughing_001_channel2_234s.wav", name: "Ex03-Ex02 Laughing 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Laughing 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_narration_001_channel1_674s", apiId: "expresso/ex03-ex02_narration_001_channel1_674s.wav", name: "Ex03-Ex02 Narration 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Narration 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_narration_002_channel2_1136s", apiId: "expresso/ex03-ex02_narration_002_channel2_1136s.wav", name: "Ex03-Ex02 Narration 002 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Narration 002 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_sad-sympathetic_001_channel1_454s", apiId: "expresso/ex03-ex02_sad-sympathetic_001_channel1_454s.wav", name: "Ex03-Ex02 Sad-Sympathetic 001 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Sad-Sympathetic 001  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_sad-sympathetic_001_channel2_400s", apiId: "expresso/ex03-ex02_sad-sympathetic_001_channel2_400s.wav", name: "Ex03-Ex02 Sad-Sympathetic 001 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Sad-Sympathetic 001  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex03-ex02_sympathetic-sad_008_channel1_215s", apiId: "expresso/ex03-ex02_sympathetic-sad_008_channel1_215s.wav", name: "Ex03-Ex02 Sympathetic-Sad 008 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex03-Ex02 Sympathetic-Sad 008  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_animal-animaldir_006_channel1_196s", apiId: "expresso/ex04-ex01_animal-animaldir_006_channel1_196s.wav", name: "Ex04-Ex01 Animal-Animaldir 006", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Animal-Animaldir 006 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_animal-animaldir_006_channel2_49s", apiId: "expresso/ex04-ex01_animal-animaldir_006_channel2_49s.wav", name: "Ex04-Ex01 Animal-Animaldir 006", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Animal-Animaldir 006 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_animaldir-animal_001_channel1_118s", apiId: "expresso/ex04-ex01_animaldir-animal_001_channel1_118s.wav", name: "Ex04-Ex01 Animaldir-Animal 001", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Animaldir-Animal 001 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_animaldir-animal_004_channel2_88s", apiId: "expresso/ex04-ex01_animaldir-animal_004_channel2_88s.wav", name: "Ex04-Ex01 Animaldir-Animal 004", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Animaldir-Animal 004 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_child-childdir_003_channel2_283s", apiId: "expresso/ex04-ex01_child-childdir_003_channel2_283s.wav", name: "Ex04-Ex01 Child-Childdir 003 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Child-Childdir 003 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_child-childdir_004_channel1_118s", apiId: "expresso/ex04-ex01_child-childdir_004_channel1_118s.wav", name: "Ex04-Ex01 Child-Childdir 004 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Child-Childdir 004 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_childdir-child_001_channel1_228s", apiId: "expresso/ex04-ex01_childdir-child_001_channel1_228s.wav", name: "Ex04-Ex01 Childdir-Child 001 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Childdir-Child 001 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_childdir-child_001_channel2_420s", apiId: "expresso/ex04-ex01_childdir-child_001_channel2_420s.wav", name: "Ex04-Ex01 Childdir-Child 001 C", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Childdir-Child 001 C (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_disgusted_001_channel1_130s", apiId: "expresso/ex04-ex01_disgusted_001_channel1_130s.wav", name: "Ex04-Ex01 Disgusted 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Disgusted 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_disgusted_001_channel2_325s", apiId: "expresso/ex04-ex01_disgusted_001_channel2_325s.wav", name: "Ex04-Ex01 Disgusted 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Disgusted 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_laughing_001_channel1_306s", apiId: "expresso/ex04-ex01_laughing_001_channel1_306s.wav", name: "Ex04-Ex01 Laughing 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Laughing 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_laughing_001_channel2_293s", apiId: "expresso/ex04-ex01_laughing_001_channel2_293s.wav", name: "Ex04-Ex01 Laughing 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Laughing 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_narration_001_channel2_686s", apiId: "expresso/ex04-ex01_narration_001_channel2_686s.wav", name: "Ex04-Ex01 Narration 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Narration 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_sad-sympathetic_001_channel1_267s", apiId: "expresso/ex04-ex01_sad-sympathetic_001_channel1_267s.wav", name: "Ex04-Ex01 Sad-Sympathetic 001 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Sad-Sympathetic 001  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_sad-sympathetic_001_channel2_346s", apiId: "expresso/ex04-ex01_sad-sympathetic_001_channel2_346s.wav", name: "Ex04-Ex01 Sad-Sympathetic 001 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Sad-Sympathetic 001  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex01_sympathetic-sad_008_channel1_415s", apiId: "expresso/ex04-ex01_sympathetic-sad_008_channel1_415s.wav", name: "Ex04-Ex01 Sympathetic-Sad 008 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex01 Sympathetic-Sad 008  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_angry_001_channel2_150s", apiId: "expresso/ex04-ex02_angry_001_channel2_150s.wav", name: "Ex04-Ex02 Angry 001 Channel2 1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Angry 001 Channel2 1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_awe_001_channel1_982s", apiId: "expresso/ex04-ex02_awe_001_channel1_982s.wav", name: "Ex04-Ex02 Awe 001 Channel1 982", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Awe 001 Channel1 982 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_awe_001_channel2_1013s", apiId: "expresso/ex04-ex02_awe_001_channel2_1013s.wav", name: "Ex04-Ex02 Awe 001 Channel2 101", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Awe 001 Channel2 101 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_bored_001_channel1_254s", apiId: "expresso/ex04-ex02_bored_001_channel1_254s.wav", name: "Ex04-Ex02 Bored 001 Channel1 2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Bored 001 Channel1 2 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_bored_001_channel2_232s", apiId: "expresso/ex04-ex02_bored_001_channel2_232s.wav", name: "Ex04-Ex02 Bored 001 Channel2 2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Bored 001 Channel2 2 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_calm_002_channel1_480s", apiId: "expresso/ex04-ex02_calm_002_channel1_480s.wav", name: "Ex04-Ex02 Calm 002 Channel1 48", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Calm 002 Channel1 48 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_confused_001_channel2_488s", apiId: "expresso/ex04-ex02_confused_001_channel2_488s.wav", name: "Ex04-Ex02 Confused 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Confused 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_desire_001_channel1_657s", apiId: "expresso/ex04-ex02_desire_001_channel1_657s.wav", name: "Ex04-Ex02 Desire 001 Channel1 ", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Desire 001 Channel1  (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_disgusted_001_channel2_98s", apiId: "expresso/ex04-ex02_disgusted_001_channel2_98s.wav", name: "Ex04-Ex02 Disgusted 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Disgusted 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_disgusted_004_channel1_169s", apiId: "expresso/ex04-ex02_disgusted_004_channel1_169s.wav", name: "Ex04-Ex02 Disgusted 004 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Disgusted 004 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_enunciated_001_channel1_496s", apiId: "expresso/ex04-ex02_enunciated_001_channel1_496s.wav", name: "Ex04-Ex02 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_enunciated_001_channel2_898s", apiId: "expresso/ex04-ex02_enunciated_001_channel2_898s.wav", name: "Ex04-Ex02 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_fearful_001_channel2_266s", apiId: "expresso/ex04-ex02_fearful_001_channel2_266s.wav", name: "Ex04-Ex02 Fearful 001 Channel2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Fearful 001 Channel2 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_happy_001_channel1_118s", apiId: "expresso/ex04-ex02_happy_001_channel1_118s.wav", name: "Ex04-Ex02 Happy 001 Channel1 1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Happy 001 Channel1 1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_happy_001_channel2_140s", apiId: "expresso/ex04-ex02_happy_001_channel2_140s.wav", name: "Ex04-Ex02 Happy 001 Channel2 1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Happy 001 Channel2 1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_laughing_001_channel1_147s", apiId: "expresso/ex04-ex02_laughing_001_channel1_147s.wav", name: "Ex04-Ex02 Laughing 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Laughing 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_laughing_001_channel2_159s", apiId: "expresso/ex04-ex02_laughing_001_channel2_159s.wav", name: "Ex04-Ex02 Laughing 001 Channel", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Laughing 001 Channel (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_nonverbal_004_channel1_18s", apiId: "expresso/ex04-ex02_nonverbal_004_channel1_18s.wav", name: "Ex04-Ex02 Nonverbal 004 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Nonverbal 004 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_nonverbal_004_channel2_71s", apiId: "expresso/ex04-ex02_nonverbal_004_channel2_71s.wav", name: "Ex04-Ex02 Nonverbal 004 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Nonverbal 004 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex02_sarcastic_001_channel1_519s", apiId: "expresso/ex04-ex02_sarcastic_001_channel1_519s.wav", name: "Ex04-Ex02 Sarcastic 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex02 Sarcastic 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_default_001_channel1_3s", apiId: "expresso/ex04-ex03_default_001_channel1_3s.wav", name: "Ex04-Ex03 Default 001 Channel1", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Default 001 Channel1 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_default_002_channel2_239s", apiId: "expresso/ex04-ex03_default_002_channel2_239s.wav", name: "Ex04-Ex03 Default 002 Channel2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Default 002 Channel2 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_enunciated_001_channel1_86s", apiId: "expresso/ex04-ex03_enunciated_001_channel1_86s.wav", name: "Ex04-Ex03 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_enunciated_001_channel2_342s", apiId: "expresso/ex04-ex03_enunciated_001_channel2_342s.wav", name: "Ex04-Ex03 Enunciated 001 Chann", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Enunciated 001 Chann (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_fast_001_channel1_208s", apiId: "expresso/ex04-ex03_fast_001_channel1_208s.wav", name: "Ex04-Ex03 Fast 001 Channel1 20", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Fast 001 Channel1 20 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_fast_001_channel2_25s", apiId: "expresso/ex04-ex03_fast_001_channel2_25s.wav", name: "Ex04-Ex03 Fast 001 Channel2 25", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Fast 001 Channel2 25 (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_projected_001_channel1_192s", apiId: "expresso/ex04-ex03_projected_001_channel1_192s.wav", name: "Ex04-Ex03 Projected 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Projected 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_projected_001_channel2_179s", apiId: "expresso/ex04-ex03_projected_001_channel2_179s.wav", name: "Ex04-Ex03 Projected 001 Channe", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Projected 001 Channe (English (Expressive), neutral) [Expresso]" },
  { id: "expresso_ex04-ex03_whisper_002_channel2_266s", apiId: "expresso/ex04-ex03_whisper_002_channel2_266s.wav", name: "Ex04-Ex03 Whisper 002 Channel2", languages: ["English (Expressive)"], gender: "neutral", description: "Ex04-Ex03 Whisper 002 Channel2 (English (Expressive), neutral) [Expresso]" },
  { id: "alba-mackenna_a-moment-by", apiId: "alba-mackenna/a-moment-by.wav", name: "A-Moment-By", languages: ["English (Studio)"], gender: "neutral", description: "A-Moment-By (English (Studio), neutral) [Alba]" },
  { id: "alba-mackenna_announcer", apiId: "alba-mackenna/announcer.wav", name: "Announcer", languages: ["English (Studio)"], gender: "neutral", description: "Announcer (English (Studio), neutral) [Alba]" },
  { id: "alba-mackenna_casual", apiId: "alba-mackenna/casual.wav", name: "Casual", languages: ["English (Studio)"], gender: "neutral", description: "Casual (English (Studio), neutral) [Alba]" },
  { id: "alba-mackenna_merchant", apiId: "alba-mackenna/merchant.wav", name: "Merchant", languages: ["English (Studio)"], gender: "neutral", description: "Merchant (English (Studio), neutral) [Alba]" },
  { id: "voice-donations_0a67", apiId: "voice-donations/0a67.wav", name: "0A67", languages: ["English"], gender: "neutral", description: "0A67 (English, neutral) [Donation]" },
  { id: "voice-donations_1410", apiId: "voice-donations/1410.wav", name: "1410", languages: ["English"], gender: "neutral", description: "1410 (English, neutral) [Donation]" },
  { id: "voice-donations_1dd0", apiId: "voice-donations/1dd0.wav", name: "1Dd0", languages: ["English"], gender: "neutral", description: "1Dd0 (English, neutral) [Donation]" },
  { id: "voice-donations_2181", apiId: "voice-donations/2181.wav", name: "2181", languages: ["English"], gender: "neutral", description: "2181 (English, neutral) [Donation]" },
  { id: "voice-donations_245e", apiId: "voice-donations/245e.wav", name: "245E", languages: ["English"], gender: "neutral", description: "245E (English, neutral) [Donation]" },
  { id: "voice-donations_29da", apiId: "voice-donations/29da.wav", name: "29Da", languages: ["English"], gender: "neutral", description: "29Da (English, neutral) [Donation]" },
  { id: "voice-donations_30c5", apiId: "voice-donations/30c5.wav", name: "30C5", languages: ["English"], gender: "neutral", description: "30C5 (English, neutral) [Donation]" },
  { id: "voice-donations_3973", apiId: "voice-donations/3973.wav", name: "3973", languages: ["English"], gender: "neutral", description: "3973 (English, neutral) [Donation]" },
  { id: "voice-donations_4189", apiId: "voice-donations/4189.wav", name: "4189", languages: ["English"], gender: "neutral", description: "4189 (English, neutral) [Donation]" },
  { id: "voice-donations_468c", apiId: "voice-donations/468c.wav", name: "468C", languages: ["English"], gender: "neutral", description: "468C (English, neutral) [Donation]" },
  { id: "voice-donations_4b70", apiId: "voice-donations/4b70.wav", name: "4B70", languages: ["English"], gender: "neutral", description: "4B70 (English, neutral) [Donation]" },
  { id: "voice-donations_5b55", apiId: "voice-donations/5b55.wav", name: "5B55", languages: ["English"], gender: "neutral", description: "5B55 (English, neutral) [Donation]" },
  { id: "voice-donations_6148", apiId: "voice-donations/6148.wav", name: "6148", languages: ["English"], gender: "neutral", description: "6148 (English, neutral) [Donation]" },
  { id: "voice-donations_7909", apiId: "voice-donations/7909.wav", name: "7909", languages: ["English"], gender: "neutral", description: "7909 (English, neutral) [Donation]" },
  { id: "voice-donations_8935", apiId: "voice-donations/8935.wav", name: "8935", languages: ["English"], gender: "neutral", description: "8935 (English, neutral) [Donation]" },
  { id: "voice-donations_8dc9", apiId: "voice-donations/8dc9.wav", name: "8Dc9", languages: ["English"], gender: "neutral", description: "8Dc9 (English, neutral) [Donation]" },
  { id: "voice-donations_92f0", apiId: "voice-donations/92f0.wav", name: "92F0", languages: ["English"], gender: "neutral", description: "92F0 (English, neutral) [Donation]" },
  { id: "voice-donations_9a2e", apiId: "voice-donations/9a2e.wav", name: "9A2E", languages: ["English"], gender: "neutral", description: "9A2E (English, neutral) [Donation]" },
  { id: "voice-donations_ASEN", apiId: "voice-donations/ASEN.wav", name: "Asen", languages: ["English"], gender: "neutral", description: "Asen (English, neutral) [Donation]" },
  { id: "voice-donations_Aadi", apiId: "voice-donations/Aadi.wav", name: "Aadi", languages: ["English"], gender: "neutral", description: "Aadi (English, neutral) [Donation]" },
  { id: "voice-donations_AbD", apiId: "voice-donations/AbD.wav", name: "Abd", languages: ["English"], gender: "neutral", description: "Abd (English, neutral) [Donation]" },
  { id: "voice-donations_Abhinox", apiId: "voice-donations/Abhinox.wav", name: "Abhinox", languages: ["English"], gender: "neutral", description: "Abhinox (English, neutral) [Donation]" },
  { id: "voice-donations_Abo_Ayman", apiId: "voice-donations/Abo_Ayman.wav", name: "Abo Ayman", languages: ["English"], gender: "neutral", description: "Abo Ayman (English, neutral) [Donation]" },
  { id: "voice-donations_Abob_Malay", apiId: "voice-donations/Abob_Malay.wav", name: "Abob Malay", languages: ["English"], gender: "neutral", description: "Abob Malay (English, neutral) [Donation]" },
  { id: "voice-donations_AgentCobra", apiId: "voice-donations/AgentCobra.wav", name: "Agentcobra", languages: ["English"], gender: "neutral", description: "Agentcobra (English, neutral) [Donation]" },
  { id: "voice-donations_Ajith", apiId: "voice-donations/Ajith.wav", name: "Ajith", languages: ["English"], gender: "neutral", description: "Ajith (English, neutral) [Donation]" },
  { id: "voice-donations_Alejandro_espanol_latino", apiId: "voice-donations/Alejandro_espanol_latino.wav", name: "Alejandro Espanol Latino", languages: ["English"], gender: "neutral", description: "Alejandro Espanol Latino (English, neutral) [Donation]" },
  { id: "voice-donations_Allen", apiId: "voice-donations/Allen.wav", name: "Allen", languages: ["English"], gender: "neutral", description: "Allen (English, neutral) [Donation]" },
  { id: "voice-donations_AmitNag", apiId: "voice-donations/AmitNag.wav", name: "Amitnag", languages: ["English"], gender: "neutral", description: "Amitnag (English, neutral) [Donation]" },
  { id: "voice-donations_Andrea", apiId: "voice-donations/Andrea.wav", name: "Andrea", languages: ["English"], gender: "neutral", description: "Andrea (English, neutral) [Donation]" },
  { id: "voice-donations_Andrea_(Spanish)", apiId: "voice-donations/Andrea_(Spanish).wav", name: "Andrea (Spanish)", languages: ["English"], gender: "neutral", description: "Andrea (Spanish) (English, neutral) [Donation]" },
  { id: "voice-donations_Aon", apiId: "voice-donations/Aon.wav", name: "Aon", languages: ["English"], gender: "neutral", description: "Aon (English, neutral) [Donation]" },
  { id: "voice-donations_Aryobe", apiId: "voice-donations/Aryobe.wav", name: "Aryobe", languages: ["English"], gender: "neutral", description: "Aryobe (English, neutral) [Donation]" },
  { id: "voice-donations_Bijay", apiId: "voice-donations/Bijay.wav", name: "Bijay", languages: ["English"], gender: "neutral", description: "Bijay (English, neutral) [Donation]" },
  { id: "voice-donations_Blake", apiId: "voice-donations/Blake.wav", name: "Blake", languages: ["English"], gender: "neutral", description: "Blake (English, neutral) [Donation]" },
  { id: "voice-donations_Bobby_McFern", apiId: "voice-donations/Bobby_McFern.wav", name: "Bobby Mcfern", languages: ["English"], gender: "neutral", description: "Bobby Mcfern (English, neutral) [Donation]" },
  { id: "voice-donations_Breaking_1", apiId: "voice-donations/Breaking_1.wav", name: "Breaking 1", languages: ["English"], gender: "neutral", description: "Breaking 1 (English, neutral) [Donation]" },
  { id: "voice-donations_BrokenHypocrite", apiId: "voice-donations/BrokenHypocrite.wav", name: "Brokenhypocrite", languages: ["English"], gender: "neutral", description: "Brokenhypocrite (English, neutral) [Donation]" },
  { id: "voice-donations_Butter", apiId: "voice-donations/Butter.wav", name: "Butter", languages: ["English"], gender: "neutral", description: "Butter (English, neutral) [Donation]" },
  { id: "voice-donations_CPS_001", apiId: "voice-donations/CPS_001.wav", name: "Cps 001", languages: ["English"], gender: "neutral", description: "Cps 001 (English, neutral) [Donation]" },
  { id: "voice-donations_Chujus", apiId: "voice-donations/Chujus.wav", name: "Chujus", languages: ["English"], gender: "neutral", description: "Chujus (English, neutral) [Donation]" },
  { id: "voice-donations_Darya_khan", apiId: "voice-donations/Darya_khan.wav", name: "Darya Khan", languages: ["English"], gender: "neutral", description: "Darya Khan (English, neutral) [Donation]" },
  { id: "voice-donations_Deepak", apiId: "voice-donations/Deepak.wav", name: "Deepak", languages: ["English"], gender: "neutral", description: "Deepak (English, neutral) [Donation]" },
  { id: "voice-donations_Dhruv_Rao", apiId: "voice-donations/Dhruv_Rao.wav", name: "Dhruv Rao", languages: ["English"], gender: "neutral", description: "Dhruv Rao (English, neutral) [Donation]" },
  { id: "voice-donations_Dil", apiId: "voice-donations/Dil.wav", name: "Dil", languages: ["English"], gender: "neutral", description: "Dil (English, neutral) [Donation]" },
  { id: "voice-donations_Enrique", apiId: "voice-donations/Enrique.wav", name: "Enrique", languages: ["English"], gender: "neutral", description: "Enrique (English, neutral) [Donation]" },
  { id: "voice-donations_Enrique_(Spanish)", apiId: "voice-donations/Enrique_(Spanish).wav", name: "Enrique (Spanish)", languages: ["English"], gender: "neutral", description: "Enrique (Spanish) (English, neutral) [Donation]" },
  { id: "voice-donations_Ernesto_Y", apiId: "voice-donations/Ernesto_Y.wav", name: "Ernesto Y", languages: ["English"], gender: "neutral", description: "Ernesto Y (English, neutral) [Donation]" },
  { id: "voice-donations_Eshan", apiId: "voice-donations/Eshan.wav", name: "Eshan", languages: ["English"], gender: "neutral", description: "Eshan (English, neutral) [Donation]" },
  { id: "voice-donations_Esteban_Aguirre_Arias", apiId: "voice-donations/Esteban_Aguirre_Arias.wav", name: "Esteban Aguirre Arias", languages: ["English"], gender: "neutral", description: "Esteban Aguirre Arias (English, neutral) [Donation]" },
  { id: "voice-donations_Ferdinand", apiId: "voice-donations/Ferdinand.wav", name: "Ferdinand", languages: ["English"], gender: "neutral", description: "Ferdinand (English, neutral) [Donation]" },
  { id: "voice-donations_FlorDaddy", apiId: "voice-donations/FlorDaddy.wav", name: "Flordaddy", languages: ["English"], gender: "neutral", description: "Flordaddy (English, neutral) [Donation]" },
  { id: "voice-donations_Fred_Mara", apiId: "voice-donations/Fred_Mara.wav", name: "Fred Mara", languages: ["English"], gender: "neutral", description: "Fred Mara (English, neutral) [Donation]" },
  { id: "voice-donations_Giovanne", apiId: "voice-donations/Giovanne.wav", name: "Giovanne", languages: ["English"], gender: "neutral", description: "Giovanne (English, neutral) [Donation]" },
  { id: "voice-donations_Glenn", apiId: "voice-donations/Glenn.wav", name: "Glenn", languages: ["English"], gender: "neutral", description: "Glenn (English, neutral) [Donation]" },
  { id: "voice-donations_Goku", apiId: "voice-donations/Goku.wav", name: "Goku", languages: ["English"], gender: "neutral", description: "Goku (English, neutral) [Donation]" },
  { id: "voice-donations_Haku", apiId: "voice-donations/Haku.wav", name: "Haku", languages: ["English"], gender: "neutral", description: "Haku (English, neutral) [Donation]" },
  { id: "voice-donations_Hannah", apiId: "voice-donations/Hannah.wav", name: "Hannah", languages: ["English"], gender: "neutral", description: "Hannah (English, neutral) [Donation]" },
  { id: "voice-donations_Hardik_Clone", apiId: "voice-donations/Hardik_Clone.wav", name: "Hardik Clone", languages: ["English"], gender: "neutral", description: "Hardik Clone (English, neutral) [Donation]" },
  { id: "voice-donations_Hillbilly_Jim", apiId: "voice-donations/Hillbilly_Jim.wav", name: "Hillbilly Jim", languages: ["English"], gender: "neutral", description: "Hillbilly Jim (English, neutral) [Donation]" },
  { id: "voice-donations_Hkl", apiId: "voice-donations/Hkl.wav", name: "Hkl", languages: ["English"], gender: "neutral", description: "Hkl (English, neutral) [Donation]" },
  { id: "voice-donations_Ilyass_yea", apiId: "voice-donations/Ilyass_yea.wav", name: "Ilyass Yea", languages: ["English"], gender: "neutral", description: "Ilyass Yea (English, neutral) [Donation]" },
  { id: "voice-donations_Indian_guy", apiId: "voice-donations/Indian_guy.wav", name: "Indian Guy", languages: ["English"], gender: "neutral", description: "Indian Guy (English, neutral) [Donation]" },
  { id: "voice-donations_Ineedthisnow", apiId: "voice-donations/Ineedthisnow.wav", name: "Ineedthisnow", languages: ["English"], gender: "neutral", description: "Ineedthisnow (English, neutral) [Donation]" },
  { id: "voice-donations_JJis2123", apiId: "voice-donations/JJis2123.wav", name: "Jjis2123", languages: ["English"], gender: "neutral", description: "Jjis2123 (English, neutral) [Donation]" },
  { id: "voice-donations_JOSHE", apiId: "voice-donations/JOSHE.wav", name: "Joshe", languages: ["English"], gender: "neutral", description: "Joshe (English, neutral) [Donation]" },
  { id: "voice-donations_James", apiId: "voice-donations/James.wav", name: "James", languages: ["English"], gender: "neutral", description: "James (English, neutral) [Donation]" },
  { id: "voice-donations_Jaspino", apiId: "voice-donations/Jaspino.wav", name: "Jaspino", languages: ["English"], gender: "neutral", description: "Jaspino (English, neutral) [Donation]" },
  { id: "voice-donations_Jaw", apiId: "voice-donations/Jaw.wav", name: "Jaw", languages: ["English"], gender: "neutral", description: "Jaw (English, neutral) [Donation]" },
  { id: "voice-donations_Jeff_Andrew", apiId: "voice-donations/Jeff_Andrew.wav", name: "Jeff Andrew", languages: ["English"], gender: "neutral", description: "Jeff Andrew (English, neutral) [Donation]" },
  { id: "voice-donations_Jeffrey", apiId: "voice-donations/Jeffrey.wav", name: "Jeffrey", languages: ["English"], gender: "neutral", description: "Jeffrey (English, neutral) [Donation]" },
  { id: "voice-donations_Jeremy_Q", apiId: "voice-donations/Jeremy_Q.wav", name: "Jeremy Q", languages: ["English"], gender: "neutral", description: "Jeremy Q (English, neutral) [Donation]" },
  { id: "voice-donations_Jimmy", apiId: "voice-donations/Jimmy.wav", name: "Jimmy", languages: ["English"], gender: "neutral", description: "Jimmy (English, neutral) [Donation]" },
  { id: "voice-donations_Joaopedrobil1", apiId: "voice-donations/Joaopedrobil1.wav", name: "Joaopedrobil1", languages: ["English"], gender: "neutral", description: "Joaopedrobil1 (English, neutral) [Donation]" },
  { id: "voice-donations_John_Triguero", apiId: "voice-donations/John_Triguero.wav", name: "John Triguero", languages: ["English"], gender: "neutral", description: "John Triguero (English, neutral) [Donation]" },
  { id: "voice-donations_Karti", apiId: "voice-donations/Karti.wav", name: "Karti", languages: ["English"], gender: "neutral", description: "Karti (English, neutral) [Donation]" },
  { id: "voice-donations_Koorosh", apiId: "voice-donations/Koorosh.wav", name: "Koorosh", languages: ["English"], gender: "neutral", description: "Koorosh (English, neutral) [Donation]" },
  { id: "voice-donations_LC", apiId: "voice-donations/LC.wav", name: "Lc", languages: ["English"], gender: "neutral", description: "Lc (English, neutral) [Donation]" },
  { id: "voice-donations_L_Roy", apiId: "voice-donations/L_Roy.wav", name: "L Roy", languages: ["English"], gender: "neutral", description: "L Roy (English, neutral) [Donation]" },
  { id: "voice-donations_Lake", apiId: "voice-donations/Lake.wav", name: "Lake", languages: ["English"], gender: "neutral", description: "Lake (English, neutral) [Donation]" },
  { id: "voice-donations_Lara", apiId: "voice-donations/Lara.wav", name: "Lara", languages: ["English"], gender: "neutral", description: "Lara (English, neutral) [Donation]" },
  { id: "voice-donations_Latin_Accent", apiId: "voice-donations/Latin_Accent.wav", name: "Latin Accent", languages: ["English"], gender: "neutral", description: "Latin Accent (English, neutral) [Donation]" },
  { id: "voice-donations_Louis", apiId: "voice-donations/Louis.wav", name: "Louis", languages: ["English"], gender: "neutral", description: "Louis (English, neutral) [Donation]" },
  { id: "voice-donations_Lucas", apiId: "voice-donations/Lucas.wav", name: "Lucas", languages: ["English"], gender: "neutral", description: "Lucas (English, neutral) [Donation]" },
  { id: "voice-donations_MJDePedro", apiId: "voice-donations/MJDePedro.wav", name: "Mjdepedro", languages: ["English"], gender: "neutral", description: "Mjdepedro (English, neutral) [Donation]" },
  { id: "voice-donations_Maisako", apiId: "voice-donations/Maisako.wav", name: "Maisako", languages: ["English"], gender: "neutral", description: "Maisako (English, neutral) [Donation]" },
  { id: "voice-donations_Manahen", apiId: "voice-donations/Manahen.wav", name: "Manahen", languages: ["English"], gender: "neutral", description: "Manahen (English, neutral) [Donation]" },
  { id: "voice-donations_Marshal_Indian", apiId: "voice-donations/Marshal_Indian.wav", name: "Marshal Indian", languages: ["English"], gender: "neutral", description: "Marshal Indian (English, neutral) [Donation]" },
  { id: "voice-donations_Midlands_Bedfordshire_Dialect", apiId: "voice-donations/Midlands_Bedfordshire_Dialect.wav", name: "Midlands Bedfordshire Dialect", languages: ["English"], gender: "neutral", description: "Midlands Bedfordshire Dialect (English, neutral) [Donation]" },
  { id: "voice-donations_Moses", apiId: "voice-donations/Moses.wav", name: "Moses", languages: ["English"], gender: "neutral", description: "Moses (English, neutral) [Donation]" },
  { id: "voice-donations_MrHat", apiId: "voice-donations/MrHat.wav", name: "Mrhat", languages: ["English"], gender: "neutral", description: "Mrhat (English, neutral) [Donation]" },
  { id: "voice-donations_Muhtasim&#39;s_Voice", apiId: "voice-donations/Muhtasim&#39;s_Voice.wav", name: "voice-donations/Muhtasim\'s_Voice.wav", languages: ["English"], gender: "neutral", description: "voice-donations/Muhtasim\'s_Voice.wav (English, neutral) [Donation]" },
  { id: "voice-donations_Mystery_Sir", apiId: "voice-donations/Mystery_Sir.wav", name: "Mystery Sir", languages: ["English"], gender: "neutral", description: "Mystery Sir (English, neutral) [Donation]" },
  { id: "voice-donations_Narrum", apiId: "voice-donations/Narrum.wav", name: "Narrum", languages: ["English"], gender: "neutral", description: "Narrum (English, neutral) [Donation]" },
  { id: "voice-donations_Nick", apiId: "voice-donations/Nick.wav", name: "Nick", languages: ["English"], gender: "neutral", description: "Nick (English, neutral) [Donation]" },
  { id: "voice-donations_P0LFR", apiId: "voice-donations/P0LFR.wav", name: "P0Lfr", languages: ["French"], gender: "neutral", description: "P0Lfr (French, neutral) [Donation]" },
  { id: "voice-donations_Parthiban", apiId: "voice-donations/Parthiban.wav", name: "Parthiban", languages: ["English"], gender: "neutral", description: "Parthiban (English, neutral) [Donation]" },
  { id: "voice-donations_Prakash369", apiId: "voice-donations/Prakash369.wav", name: "Prakash369", languages: ["English"], gender: "neutral", description: "Prakash369 (English, neutral) [Donation]" },
  { id: "voice-donations_Puzzle", apiId: "voice-donations/Puzzle.wav", name: "Puzzle", languages: ["English"], gender: "neutral", description: "Puzzle (English, neutral) [Donation]" },
  { id: "voice-donations_Qasim_Wali_Khan", apiId: "voice-donations/Qasim_Wali_Khan.wav", name: "Qasim Wali Khan", languages: ["English"], gender: "neutral", description: "Qasim Wali Khan (English, neutral) [Donation]" },
  { id: "voice-donations_RAJ", apiId: "voice-donations/RAJ.wav", name: "Raj", languages: ["English"], gender: "neutral", description: "Raj (English, neutral) [Donation]" },
  { id: "voice-donations_Rafaelpazv", apiId: "voice-donations/Rafaelpazv.wav", name: "Rafaelpazv", languages: ["English"], gender: "neutral", description: "Rafaelpazv (English, neutral) [Donation]" },
  { id: "voice-donations_Raj25", apiId: "voice-donations/Raj25.wav", name: "Raj25", languages: ["English"], gender: "neutral", description: "Raj25 (English, neutral) [Donation]" },
  { id: "voice-donations_Ramu", apiId: "voice-donations/Ramu.wav", name: "Ramu", languages: ["English"], gender: "neutral", description: "Ramu (English, neutral) [Donation]" },
  { id: "voice-donations_Ranjith", apiId: "voice-donations/Ranjith.wav", name: "Ranjith", languages: ["English"], gender: "neutral", description: "Ranjith (English, neutral) [Donation]" },
  { id: "voice-donations_Richard_cuban", apiId: "voice-donations/Richard_cuban.wav", name: "Richard Cuban", languages: ["English"], gender: "neutral", description: "Richard Cuban (English, neutral) [Donation]" },
  { id: "voice-donations_Roscoe", apiId: "voice-donations/Roscoe.wav", name: "Roscoe", languages: ["English"], gender: "neutral", description: "Roscoe (English, neutral) [Donation]" },
  { id: "voice-donations_Rup", apiId: "voice-donations/Rup.wav", name: "Rup", languages: ["English"], gender: "neutral", description: "Rup (English, neutral) [Donation]" },
  { id: "voice-donations_STONE", apiId: "voice-donations/STONE.wav", name: "Stone", languages: ["English"], gender: "neutral", description: "Stone (English, neutral) [Donation]" },
  { id: "voice-donations_Selfie", apiId: "voice-donations/Selfie.wav", name: "Selfie", languages: ["English"], gender: "neutral", description: "Selfie (English, neutral) [Donation]" },
  { id: "voice-donations_Sheddy", apiId: "voice-donations/Sheddy.wav", name: "Sheddy", languages: ["English"], gender: "neutral", description: "Sheddy (English, neutral) [Donation]" },
  { id: "voice-donations_Siddh_Indian", apiId: "voice-donations/Siddh_Indian.wav", name: "Siddh Indian", languages: ["English"], gender: "neutral", description: "Siddh Indian (English, neutral) [Donation]" },
  { id: "voice-donations_Sir_TJ", apiId: "voice-donations/Sir_TJ.wav", name: "Sir Tj", languages: ["English"], gender: "neutral", description: "Sir Tj (English, neutral) [Donation]" },
  { id: "voice-donations_Sp46", apiId: "voice-donations/Sp46.wav", name: "Sp46", languages: ["English"], gender: "neutral", description: "Sp46 (English, neutral) [Donation]" },
  { id: "voice-donations_Sr_Erick", apiId: "voice-donations/Sr_Erick.wav", name: "Sr Erick", languages: ["English"], gender: "neutral", description: "Sr Erick (English, neutral) [Donation]" },
  { id: "voice-donations_Standollars", apiId: "voice-donations/Standollars.wav", name: "Standollars", languages: ["English"], gender: "neutral", description: "Standollars (English, neutral) [Donation]" },
  { id: "voice-donations_TESLLA", apiId: "voice-donations/TESLLA.wav", name: "Teslla", languages: ["English"], gender: "neutral", description: "Teslla (English, neutral) [Donation]" },
  { id: "voice-donations_TheFin", apiId: "voice-donations/TheFin.wav", name: "Thefin", languages: ["English"], gender: "neutral", description: "Thefin (English, neutral) [Donation]" },
  { id: "voice-donations_The_Sustainabler", apiId: "voice-donations/The_Sustainabler.wav", name: "The Sustainabler", languages: ["English"], gender: "neutral", description: "The Sustainabler (English, neutral) [Donation]" },
  { id: "voice-donations_The_other_brother", apiId: "voice-donations/The_other_brother.wav", name: "The Other Brother", languages: ["English"], gender: "neutral", description: "The Other Brother (English, neutral) [Donation]" },
  { id: "voice-donations_Titorium", apiId: "voice-donations/Titorium.wav", name: "Titorium", languages: ["English"], gender: "neutral", description: "Titorium (English, neutral) [Donation]" },
  { id: "voice-donations_Umair", apiId: "voice-donations/Umair.wav", name: "Umair", languages: ["English"], gender: "neutral", description: "Umair (English, neutral) [Donation]" },
  { id: "voice-donations_Vexat", apiId: "voice-donations/Vexat.wav", name: "Vexat", languages: ["English"], gender: "neutral", description: "Vexat (English, neutral) [Donation]" },
  { id: "voice-donations_Victor_Garcia", apiId: "voice-donations/Victor_Garcia.wav", name: "Victor Garcia", languages: ["English"], gender: "neutral", description: "Victor Garcia (English, neutral) [Donation]" },
  { id: "voice-donations_Vivaldi", apiId: "voice-donations/Vivaldi.wav", name: "Vivaldi", languages: ["English"], gender: "neutral", description: "Vivaldi (English, neutral) [Donation]" },
  { id: "voice-donations_W_A_H", apiId: "voice-donations/W_A_H.wav", name: "W A H", languages: ["English"], gender: "neutral", description: "W A H (English, neutral) [Donation]" },
  { id: "voice-donations_Wealthiest", apiId: "voice-donations/Wealthiest.wav", name: "Wealthiest", languages: ["English"], gender: "neutral", description: "Wealthiest (English, neutral) [Donation]" },
  { id: "voice-donations_WhisperInEar", apiId: "voice-donations/WhisperInEar.wav", name: "Whisperinear", languages: ["English"], gender: "neutral", description: "Whisperinear (English, neutral) [Donation]" },
  { id: "voice-donations_Yesid", apiId: "voice-donations/Yesid.wav", name: "Yesid", languages: ["English"], gender: "neutral", description: "Yesid (English, neutral) [Donation]" },
  { id: "voice-donations_Youfied", apiId: "voice-donations/Youfied.wav", name: "Youfied", languages: ["English"], gender: "neutral", description: "Youfied (English, neutral) [Donation]" },
  { id: "voice-donations_Yuush", apiId: "voice-donations/Yuush.wav", name: "Yuush", languages: ["English"], gender: "neutral", description: "Yuush (English, neutral) [Donation]" },
  { id: "voice-donations_a59a", apiId: "voice-donations/a59a.wav", name: "A59A", languages: ["English"], gender: "neutral", description: "A59A (English, neutral) [Donation]" },
  { id: "voice-donations_a6f9", apiId: "voice-donations/a6f9.wav", name: "A6F9", languages: ["English"], gender: "neutral", description: "A6F9 (English, neutral) [Donation]" },
  { id: "voice-donations_a96a", apiId: "voice-donations/a96a.wav", name: "A96A", languages: ["English"], gender: "neutral", description: "A96A (English, neutral) [Donation]" },
  { id: "voice-donations_aepeak", apiId: "voice-donations/aepeak.wav", name: "Aepeak", languages: ["English"], gender: "neutral", description: "Aepeak (English, neutral) [Donation]" },
  { id: "voice-donations_amazon_box", apiId: "voice-donations/amazon_box.wav", name: "Amazon Box", languages: ["English"], gender: "neutral", description: "Amazon Box (English, neutral) [Donation]" },
  { id: "voice-donations_awais_shah", apiId: "voice-donations/awais_shah.wav", name: "Awais Shah", languages: ["English"], gender: "neutral", description: "Awais Shah (English, neutral) [Donation]" },
  { id: "voice-donations_bathri", apiId: "voice-donations/bathri.wav", name: "Bathri", languages: ["English"], gender: "neutral", description: "Bathri (English, neutral) [Donation]" },
  { id: "voice-donations_bc98", apiId: "voice-donations/bc98.wav", name: "Bc98", languages: ["English"], gender: "neutral", description: "Bc98 (English, neutral) [Donation]" },
  { id: "voice-donations_bevi", apiId: "voice-donations/bevi.wav", name: "Bevi", languages: ["English"], gender: "neutral", description: "Bevi (English, neutral) [Donation]" },
  { id: "voice-donations_boom", apiId: "voice-donations/boom.wav", name: "Boom", languages: ["English"], gender: "neutral", description: "Boom (English, neutral) [Donation]" },
  { id: "voice-donations_cybina", apiId: "voice-donations/cybina.wav", name: "Cybina", languages: ["English"], gender: "neutral", description: "Cybina (English, neutral) [Donation]" },
  { id: "voice-donations_d4a9", apiId: "voice-donations/d4a9.wav", name: "D4A9", languages: ["English"], gender: "neutral", description: "D4A9 (English, neutral) [Donation]" },
  { id: "voice-donations_dce6", apiId: "voice-donations/dce6.wav", name: "Dce6", languages: ["English"], gender: "neutral", description: "Dce6 (English, neutral) [Donation]" },
  { id: "voice-donations_dwp", apiId: "voice-donations/dwp.wav", name: "Dwp", languages: ["English"], gender: "neutral", description: "Dwp (English, neutral) [Donation]" },
  { id: "voice-donations_e819", apiId: "voice-donations/e819.wav", name: "E819", languages: ["English"], gender: "neutral", description: "E819 (English, neutral) [Donation]" },
  { id: "voice-donations_edd4", apiId: "voice-donations/edd4.wav", name: "Edd4", languages: ["English"], gender: "neutral", description: "Edd4 (English, neutral) [Donation]" },
  { id: "voice-donations_english_with_german_accent", apiId: "voice-donations/english_with_german_accent.wav", name: "English With German Accent", languages: ["English"], gender: "neutral", description: "English With German Accent (English, neutral) [Donation]" },
  { id: "voice-donations_erihppas", apiId: "voice-donations/erihppas.wav", name: "Erihppas", languages: ["English"], gender: "neutral", description: "Erihppas (English, neutral) [Donation]" },
  { id: "voice-donations_f179", apiId: "voice-donations/f179.wav", name: "F179", languages: ["English"], gender: "neutral", description: "F179 (English, neutral) [Donation]" },
  { id: "voice-donations_f9cf", apiId: "voice-donations/f9cf.wav", name: "F9Cf", languages: ["English"], gender: "neutral", description: "F9Cf (English, neutral) [Donation]" },
  { id: "voice-donations_fa52", apiId: "voice-donations/fa52.wav", name: "Fa52", languages: ["English"], gender: "neutral", description: "Fa52 (English, neutral) [Donation]" },
  { id: "voice-donations_fc96", apiId: "voice-donations/fc96.wav", name: "Fc96", languages: ["English"], gender: "neutral", description: "Fc96 (English, neutral) [Donation]" },
  { id: "voice-donations_gmaskell92", apiId: "voice-donations/gmaskell92.wav", name: "Gmaskell92", languages: ["English"], gender: "neutral", description: "Gmaskell92 (English, neutral) [Donation]" },
  { id: "voice-donations_hielos_1", apiId: "voice-donations/hielos_1.wav", name: "Hielos 1", languages: ["English"], gender: "neutral", description: "Hielos 1 (English, neutral) [Donation]" },
  { id: "voice-donations_hielos_2", apiId: "voice-donations/hielos_2.wav", name: "Hielos 2", languages: ["English"], gender: "neutral", description: "Hielos 2 (English, neutral) [Donation]" },
  { id: "voice-donations_injul", apiId: "voice-donations/injul.wav", name: "Injul", languages: ["English"], gender: "neutral", description: "Injul (English, neutral) [Donation]" },
  { id: "voice-donations_kbrn1", apiId: "voice-donations/kbrn1.wav", name: "Kbrn1", languages: ["English"], gender: "neutral", description: "Kbrn1 (English, neutral) [Donation]" },
  { id: "voice-donations_oldNerd", apiId: "voice-donations/oldNerd.wav", name: "Oldnerd", languages: ["English"], gender: "neutral", description: "Oldnerd (English, neutral) [Donation]" },
  { id: "voice-donations_oldNerd2", apiId: "voice-donations/oldNerd2.wav", name: "Oldnerd2", languages: ["English"], gender: "neutral", description: "Oldnerd2 (English, neutral) [Donation]" },
  { id: "voice-donations_oldNerd3", apiId: "voice-donations/oldNerd3.wav", name: "Oldnerd3", languages: ["English"], gender: "neutral", description: "Oldnerd3 (English, neutral) [Donation]" },
  { id: "voice-donations_ra_XOr", apiId: "voice-donations/ra_XOr.wav", name: "Ra Xor", languages: ["English"], gender: "neutral", description: "Ra Xor (English, neutral) [Donation]" },
  { id: "voice-donations_rewi", apiId: "voice-donations/rewi.wav", name: "Rewi", languages: ["English"], gender: "neutral", description: "Rewi (English, neutral) [Donation]" },
  { id: "voice-donations_robert", apiId: "voice-donations/robert.wav", name: "Robert", languages: ["English"], gender: "neutral", description: "Robert (English, neutral) [Donation]" },
  { id: "voice-donations_robert2", apiId: "voice-donations/robert2.wav", name: "Robert2", languages: ["English"], gender: "neutral", description: "Robert2 (English, neutral) [Donation]" },
  { id: "voice-donations_siddharth_khanna", apiId: "voice-donations/siddharth_khanna.wav", name: "Siddharth Khanna", languages: ["English"], gender: "neutral", description: "Siddharth Khanna (English, neutral) [Donation]" },
  { id: "voice-donations_solace", apiId: "voice-donations/solace.wav", name: "Solace", languages: ["English"], gender: "neutral", description: "Solace (English, neutral) [Donation]" },
  { id: "voice-donations_stein", apiId: "voice-donations/stein.wav", name: "Stein", languages: ["English"], gender: "neutral", description: "Stein (English, neutral) [Donation]" },
  { id: "voice-donations_surazy", apiId: "voice-donations/surazy.wav", name: "Surazy", languages: ["English"], gender: "neutral", description: "Surazy (English, neutral) [Donation]" },
  { id: "voice-donations_temp-007", apiId: "voice-donations/temp-007.wav", name: "Temp-007", languages: ["English"], gender: "neutral", description: "Temp-007 (English, neutral) [Donation]" },
  { id: "voice-donations_thepolishdane", apiId: "voice-donations/thepolishdane.wav", name: "Thepolishdane", languages: ["English"], gender: "neutral", description: "Thepolishdane (English, neutral) [Donation]" },
  { id: "voice-donations_vinayak", apiId: "voice-donations/vinayak.wav", name: "Vinayak", languages: ["English"], gender: "neutral", description: "Vinayak (English, neutral) [Donation]" },
  { id: "voice-donations_willbas", apiId: "voice-donations/willbas.wav", name: "Willbas", languages: ["English"], gender: "neutral", description: "Willbas (English, neutral) [Donation]" },
  { id: "voice-donations_zerocool", apiId: "voice-donations/zerocool.wav", name: "Zerocool", languages: ["English"], gender: "neutral", description: "Zerocool (English, neutral) [Donation]" },
  { id: "cml-tts_fr_12977_10625_000037-0001", apiId: "cml-tts/fr/12977_10625_000037-0001.wav", name: "CML 12977 (FR, f)", languages: ["French"], gender: "female", description: "CML 12977 (FR, f) (French, female) [CML-TTS]" },
  { id: "cml-tts_fr_1406_1028_000009-0003", apiId: "cml-tts/fr/1406_1028_000009-0003.wav", name: "CML 1406 (FR, m)", languages: ["French"], gender: "male", description: "CML 1406 (FR, m) (French, male) [CML-TTS]" },
  { id: "cml-tts_fr_2154_2576_000020-0003", apiId: "cml-tts/fr/2154_2576_000020-0003.wav", name: "CML 2154 (FR, f)", languages: ["French"], gender: "female", description: "CML 2154 (FR, f) (French, female) [CML-TTS]" },
  { id: "cml-tts_fr_4724_3731_000031-0001", apiId: "cml-tts/fr/4724_3731_000031-0001.wav", name: "CML 4724 (FR, m)", languages: ["French"], gender: "male", description: "CML 4724 (FR, m) (French, male) [CML-TTS]" },
  { id: "cml-tts_fr_10087_11650_000028-0002", apiId: "cml-tts/fr/10087_11650_000028-0002.wav", name: "10087 11650 000028-0002", languages: ["French"], gender: "neutral", description: "10087 11650 000028-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_10177_10625_000134-0003", apiId: "cml-tts/fr/10177_10625_000134-0003.wav", name: "10177 10625 000134-0003", languages: ["French"], gender: "neutral", description: "10177 10625 000134-0003 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_10179_11051_000005-0001", apiId: "cml-tts/fr/10179_11051_000005-0001.wav", name: "10179 11051 000005-0001", languages: ["French"], gender: "neutral", description: "10179 11051 000005-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_12080_11650_000047-0001", apiId: "cml-tts/fr/12080_11650_000047-0001.wav", name: "12080 11650 000047-0001", languages: ["French"], gender: "neutral", description: "12080 11650 000047-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_12205_11650_000004-0002", apiId: "cml-tts/fr/12205_11650_000004-0002.wav", name: "12205 11650 000004-0002", languages: ["French"], gender: "neutral", description: "12205 11650 000004-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_1591_1028_000108-0004", apiId: "cml-tts/fr/1591_1028_000108-0004.wav", name: "1591 1028 000108-0004", languages: ["French"], gender: "neutral", description: "1591 1028 000108-0004 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_1770_1028_000036-0002", apiId: "cml-tts/fr/1770_1028_000036-0002.wav", name: "1770 1028 000036-0002", languages: ["French"], gender: "neutral", description: "1770 1028 000036-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_2114_1656_000053-0001", apiId: "cml-tts/fr/2114_1656_000053-0001.wav", name: "2114 1656 000053-0001", languages: ["French"], gender: "neutral", description: "2114 1656 000053-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_2216_1745_000007-0001", apiId: "cml-tts/fr/2216_1745_000007-0001.wav", name: "2216 1745 000007-0001", languages: ["French"], gender: "neutral", description: "2216 1745 000007-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_2223_1745_000009-0002", apiId: "cml-tts/fr/2223_1745_000009-0002.wav", name: "2223 1745 000009-0002", languages: ["French"], gender: "neutral", description: "2223 1745 000009-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_2465_1943_000152-0002", apiId: "cml-tts/fr/2465_1943_000152-0002.wav", name: "2465 1943 000152-0002", languages: ["French"], gender: "neutral", description: "2465 1943 000152-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_296_1028_000022-0001", apiId: "cml-tts/fr/296_1028_000022-0001.wav", name: "296 1028 000022-0001", languages: ["French"], gender: "neutral", description: "296 1028 000022-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_3267_1902_000075-0001", apiId: "cml-tts/fr/3267_1902_000075-0001.wav", name: "3267 1902 000075-0001", languages: ["French"], gender: "neutral", description: "3267 1902 000075-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_4193_3103_000004-0001", apiId: "cml-tts/fr/4193_3103_000004-0001.wav", name: "4193 3103 000004-0001", languages: ["French"], gender: "neutral", description: "4193 3103 000004-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_4482_3103_000063-0001", apiId: "cml-tts/fr/4482_3103_000063-0001.wav", name: "4482 3103 000063-0001", languages: ["French"], gender: "neutral", description: "4482 3103 000063-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_4937_3731_000004-0001", apiId: "cml-tts/fr/4937_3731_000004-0001.wav", name: "4937 3731 000004-0001", languages: ["French"], gender: "neutral", description: "4937 3731 000004-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_5207_3078_000031-0002", apiId: "cml-tts/fr/5207_3078_000031-0002.wav", name: "5207 3078 000031-0002", languages: ["French"], gender: "neutral", description: "5207 3078 000031-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_5476_3103_000072-0001", apiId: "cml-tts/fr/5476_3103_000072-0001.wav", name: "5476 3103 000072-0001", languages: ["French"], gender: "neutral", description: "5476 3103 000072-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_577_394_000070-0001", apiId: "cml-tts/fr/577_394_000070-0001.wav", name: "577 394 000070-0001", languages: ["French"], gender: "neutral", description: "577 394 000070-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_5790_4893_000052-0001", apiId: "cml-tts/fr/5790_4893_000052-0001.wav", name: "5790 4893 000052-0001", languages: ["French"], gender: "neutral", description: "5790 4893 000052-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_579_2548_000015-0001", apiId: "cml-tts/fr/579_2548_000015-0001.wav", name: "579 2548 000015-0001", languages: ["French"], gender: "neutral", description: "579 2548 000015-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_5830_4703_000037-0001", apiId: "cml-tts/fr/5830_4703_000037-0001.wav", name: "5830 4703 000037-0001", languages: ["French"], gender: "neutral", description: "5830 4703 000037-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_6318_7016_000027-0002", apiId: "cml-tts/fr/6318_7016_000027-0002.wav", name: "6318 7016 000027-0002", languages: ["French"], gender: "neutral", description: "6318 7016 000027-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_7142_2432_000124-0003", apiId: "cml-tts/fr/7142_2432_000124-0003.wav", name: "7142 2432 000124-0003", languages: ["French"], gender: "neutral", description: "7142 2432 000124-0003 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_7400_2928_000100-0001", apiId: "cml-tts/fr/7400_2928_000100-0001.wav", name: "7400 2928 000100-0001", languages: ["French"], gender: "neutral", description: "7400 2928 000100-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_7591_6742_000149-0002", apiId: "cml-tts/fr/7591_6742_000149-0002.wav", name: "7591 6742 000149-0002", languages: ["French"], gender: "neutral", description: "7591 6742 000149-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_7601_7727_000062-0001", apiId: "cml-tts/fr/7601_7727_000062-0001.wav", name: "7601 7727 000062-0001", languages: ["French"], gender: "neutral", description: "7601 7727 000062-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_7762_8734_000048-0002", apiId: "cml-tts/fr/7762_8734_000048-0002.wav", name: "7762 8734 000048-0002", languages: ["French"], gender: "neutral", description: "7762 8734 000048-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_8128_7016_000047-0002", apiId: "cml-tts/fr/8128_7016_000047-0002.wav", name: "8128 7016 000047-0002", languages: ["French"], gender: "neutral", description: "8128 7016 000047-0002 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_928_486_000075-0001", apiId: "cml-tts/fr/928_486_000075-0001.wav", name: "928 486 000075-0001", languages: ["French"], gender: "neutral", description: "928 486 000075-0001 (French, neutral) [CML-TTS]" },
  { id: "cml-tts_fr_9834_9697_000150-0003", apiId: "cml-tts/fr/9834_9697_000150-0003.wav", name: "9834 9697 000150-0003", languages: ["French"], gender: "neutral", description: "9834 9697 000150-0003 (French, neutral) [CML-TTS]" },
  { id: "vctk_p226_023", apiId: "vctk/p226_023.wav", name: "VCTK 226 (UK, m)", languages: ["English UK"], gender: "male", description: "VCTK 226 (UK, m) (English UK, male) [VCTK]" },
  { id: "vctk_p228_023", apiId: "vctk/p228_023.wav", name: "VCTK 228 (UK, f)", languages: ["English UK"], gender: "female", description: "VCTK 228 (UK, f) (English UK, female) [VCTK]" },
  { id: "vctk_p231_023", apiId: "vctk/p231_023.wav", name: "VCTK 231 (UK, f)", languages: ["English UK"], gender: "female", description: "VCTK 231 (UK, f) (English UK, female) [VCTK]" },
  { id: "vctk_p255_023", apiId: "vctk/p255_023.wav", name: "VCTK 255 (UK, m)", languages: ["English UK"], gender: "male", description: "VCTK 255 (UK, m) (English UK, male) [VCTK]" },
  { id: "vctk_p277_023", apiId: "vctk/p277_023.wav", name: "VCTK 277 (UK, f)", languages: ["English UK"], gender: "female", description: "VCTK 277 (UK, f) (English UK, female) [VCTK]" },
  { id: "vctk_p292_023", apiId: "vctk/p292_023.wav", name: "VCTK 292 (UK, m)", languages: ["English UK"], gender: "male", description: "VCTK 292 (UK, m) (English UK, male) [VCTK]" },
  { id: "vctk_p225_023", apiId: "vctk/p225_023.wav", name: "P225 023", languages: ["English (Research)"], gender: "neutral", description: "P225 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p227_023", apiId: "vctk/p227_023.wav", name: "P227 023", languages: ["English (Research)"], gender: "neutral", description: "P227 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p229_023", apiId: "vctk/p229_023.wav", name: "P229 023", languages: ["English (Research)"], gender: "neutral", description: "P229 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p230_023", apiId: "vctk/p230_023.wav", name: "P230 023", languages: ["English (Research)"], gender: "neutral", description: "P230 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p232_023", apiId: "vctk/p232_023.wav", name: "P232 023", languages: ["English (Research)"], gender: "neutral", description: "P232 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p233_023", apiId: "vctk/p233_023.wav", name: "P233 023", languages: ["English (Research)"], gender: "neutral", description: "P233 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p234_023", apiId: "vctk/p234_023.wav", name: "P234 023", languages: ["English (Research)"], gender: "neutral", description: "P234 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p236_023", apiId: "vctk/p236_023.wav", name: "P236 023", languages: ["English (Research)"], gender: "neutral", description: "P236 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p237_023", apiId: "vctk/p237_023.wav", name: "P237 023", languages: ["English (Research)"], gender: "neutral", description: "P237 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p238_023", apiId: "vctk/p238_023.wav", name: "P238 023", languages: ["English (Research)"], gender: "neutral", description: "P238 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p239_023", apiId: "vctk/p239_023.wav", name: "P239 023", languages: ["English (Research)"], gender: "neutral", description: "P239 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p240_023", apiId: "vctk/p240_023.wav", name: "P240 023", languages: ["English (Research)"], gender: "neutral", description: "P240 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p241_023", apiId: "vctk/p241_023.wav", name: "P241 023", languages: ["English (Research)"], gender: "neutral", description: "P241 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p243_023", apiId: "vctk/p243_023.wav", name: "P243 023", languages: ["English (Research)"], gender: "neutral", description: "P243 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p244_023", apiId: "vctk/p244_023.wav", name: "P244 023", languages: ["English (Research)"], gender: "neutral", description: "P244 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p245_023", apiId: "vctk/p245_023.wav", name: "P245 023", languages: ["English (Research)"], gender: "neutral", description: "P245 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p246_023", apiId: "vctk/p246_023.wav", name: "P246 023", languages: ["English (Research)"], gender: "neutral", description: "P246 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p247_023", apiId: "vctk/p247_023.wav", name: "P247 023", languages: ["English (Research)"], gender: "neutral", description: "P247 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p248_023", apiId: "vctk/p248_023.wav", name: "P248 023", languages: ["English (Research)"], gender: "neutral", description: "P248 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p249_023", apiId: "vctk/p249_023.wav", name: "P249 023", languages: ["English (Research)"], gender: "neutral", description: "P249 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p250_023", apiId: "vctk/p250_023.wav", name: "P250 023", languages: ["English (Research)"], gender: "neutral", description: "P250 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p251_023", apiId: "vctk/p251_023.wav", name: "P251 023", languages: ["English (Research)"], gender: "neutral", description: "P251 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p252_023", apiId: "vctk/p252_023.wav", name: "P252 023", languages: ["English (Research)"], gender: "neutral", description: "P252 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p253_023", apiId: "vctk/p253_023.wav", name: "P253 023", languages: ["English (Research)"], gender: "neutral", description: "P253 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p254_023", apiId: "vctk/p254_023.wav", name: "P254 023", languages: ["English (Research)"], gender: "neutral", description: "P254 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p256_023", apiId: "vctk/p256_023.wav", name: "P256 023", languages: ["English (Research)"], gender: "neutral", description: "P256 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p257_023", apiId: "vctk/p257_023.wav", name: "P257 023", languages: ["English (Research)"], gender: "neutral", description: "P257 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p258_023", apiId: "vctk/p258_023.wav", name: "P258 023", languages: ["English (Research)"], gender: "neutral", description: "P258 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p259_023", apiId: "vctk/p259_023.wav", name: "P259 023", languages: ["English (Research)"], gender: "neutral", description: "P259 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p260_023", apiId: "vctk/p260_023.wav", name: "P260 023", languages: ["English (Research)"], gender: "neutral", description: "P260 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p261_023", apiId: "vctk/p261_023.wav", name: "P261 023", languages: ["English (Research)"], gender: "neutral", description: "P261 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p262_023", apiId: "vctk/p262_023.wav", name: "P262 023", languages: ["English (Research)"], gender: "neutral", description: "P262 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p263_023", apiId: "vctk/p263_023.wav", name: "P263 023", languages: ["English (Research)"], gender: "neutral", description: "P263 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p264_023", apiId: "vctk/p264_023.wav", name: "P264 023", languages: ["English (Research)"], gender: "neutral", description: "P264 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p265_023", apiId: "vctk/p265_023.wav", name: "P265 023", languages: ["English (Research)"], gender: "neutral", description: "P265 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p266_023", apiId: "vctk/p266_023.wav", name: "P266 023", languages: ["English (Research)"], gender: "neutral", description: "P266 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p267_023", apiId: "vctk/p267_023.wav", name: "P267 023", languages: ["English (Research)"], gender: "neutral", description: "P267 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p269_023", apiId: "vctk/p269_023.wav", name: "P269 023", languages: ["English (Research)"], gender: "neutral", description: "P269 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p270_023", apiId: "vctk/p270_023.wav", name: "P270 023", languages: ["English (Research)"], gender: "neutral", description: "P270 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p271_023", apiId: "vctk/p271_023.wav", name: "P271 023", languages: ["English (Research)"], gender: "neutral", description: "P271 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p272_023", apiId: "vctk/p272_023.wav", name: "P272 023", languages: ["English (Research)"], gender: "neutral", description: "P272 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p273_023", apiId: "vctk/p273_023.wav", name: "P273 023", languages: ["English (Research)"], gender: "neutral", description: "P273 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p274_023", apiId: "vctk/p274_023.wav", name: "P274 023", languages: ["English (Research)"], gender: "neutral", description: "P274 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p275_023", apiId: "vctk/p275_023.wav", name: "P275 023", languages: ["English (Research)"], gender: "neutral", description: "P275 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p276_023", apiId: "vctk/p276_023.wav", name: "P276 023", languages: ["English (Research)"], gender: "neutral", description: "P276 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p278_023", apiId: "vctk/p278_023.wav", name: "P278 023", languages: ["English (Research)"], gender: "neutral", description: "P278 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p279_023", apiId: "vctk/p279_023.wav", name: "P279 023", languages: ["English (Research)"], gender: "neutral", description: "P279 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p280_023", apiId: "vctk/p280_023.wav", name: "P280 023", languages: ["English (Research)"], gender: "neutral", description: "P280 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p281_023", apiId: "vctk/p281_023.wav", name: "P281 023", languages: ["English (Research)"], gender: "neutral", description: "P281 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p282_023", apiId: "vctk/p282_023.wav", name: "P282 023", languages: ["English (Research)"], gender: "neutral", description: "P282 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p283_023", apiId: "vctk/p283_023.wav", name: "P283 023", languages: ["English (Research)"], gender: "neutral", description: "P283 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p284_023", apiId: "vctk/p284_023.wav", name: "P284 023", languages: ["English (Research)"], gender: "neutral", description: "P284 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p285_023", apiId: "vctk/p285_023.wav", name: "P285 023", languages: ["English (Research)"], gender: "neutral", description: "P285 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p286_023", apiId: "vctk/p286_023.wav", name: "P286 023", languages: ["English (Research)"], gender: "neutral", description: "P286 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p287_023", apiId: "vctk/p287_023.wav", name: "P287 023", languages: ["English (Research)"], gender: "neutral", description: "P287 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p288_023", apiId: "vctk/p288_023.wav", name: "P288 023", languages: ["English (Research)"], gender: "neutral", description: "P288 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p293_023", apiId: "vctk/p293_023.wav", name: "P293 023", languages: ["English (Research)"], gender: "neutral", description: "P293 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p294_023", apiId: "vctk/p294_023.wav", name: "P294 023", languages: ["English (Research)"], gender: "neutral", description: "P294 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p297_023", apiId: "vctk/p297_023.wav", name: "P297 023", languages: ["English (Research)"], gender: "neutral", description: "P297 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p298_023", apiId: "vctk/p298_023.wav", name: "P298 023", languages: ["English (Research)"], gender: "neutral", description: "P298 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p299_023", apiId: "vctk/p299_023.wav", name: "P299 023", languages: ["English (Research)"], gender: "neutral", description: "P299 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p300_023", apiId: "vctk/p300_023.wav", name: "P300 023", languages: ["English (Research)"], gender: "neutral", description: "P300 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p301_023", apiId: "vctk/p301_023.wav", name: "P301 023", languages: ["English (Research)"], gender: "neutral", description: "P301 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p302_023", apiId: "vctk/p302_023.wav", name: "P302 023", languages: ["English (Research)"], gender: "neutral", description: "P302 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p303_023", apiId: "vctk/p303_023.wav", name: "P303 023", languages: ["English (Research)"], gender: "neutral", description: "P303 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p304_023", apiId: "vctk/p304_023.wav", name: "P304 023", languages: ["English (Research)"], gender: "neutral", description: "P304 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p305_023", apiId: "vctk/p305_023.wav", name: "P305 023", languages: ["English (Research)"], gender: "neutral", description: "P305 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p306_023", apiId: "vctk/p306_023.wav", name: "P306 023", languages: ["English (Research)"], gender: "neutral", description: "P306 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p307_023", apiId: "vctk/p307_023.wav", name: "P307 023", languages: ["English (Research)"], gender: "neutral", description: "P307 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p308_023", apiId: "vctk/p308_023.wav", name: "P308 023", languages: ["English (Research)"], gender: "neutral", description: "P308 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p310_023", apiId: "vctk/p310_023.wav", name: "P310 023", languages: ["English (Research)"], gender: "neutral", description: "P310 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p311_023", apiId: "vctk/p311_023.wav", name: "P311 023", languages: ["English (Research)"], gender: "neutral", description: "P311 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p312_023", apiId: "vctk/p312_023.wav", name: "P312 023", languages: ["English (Research)"], gender: "neutral", description: "P312 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p313_023", apiId: "vctk/p313_023.wav", name: "P313 023", languages: ["English (Research)"], gender: "neutral", description: "P313 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p314_023", apiId: "vctk/p314_023.wav", name: "P314 023", languages: ["English (Research)"], gender: "neutral", description: "P314 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p315_023", apiId: "vctk/p315_023.wav", name: "P315 023", languages: ["English (Research)"], gender: "neutral", description: "P315 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p316_023", apiId: "vctk/p316_023.wav", name: "P316 023", languages: ["English (Research)"], gender: "neutral", description: "P316 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p317_023", apiId: "vctk/p317_023.wav", name: "P317 023", languages: ["English (Research)"], gender: "neutral", description: "P317 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p318_023", apiId: "vctk/p318_023.wav", name: "P318 023", languages: ["English (Research)"], gender: "neutral", description: "P318 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p323_023", apiId: "vctk/p323_023.wav", name: "P323 023", languages: ["English (Research)"], gender: "neutral", description: "P323 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p326_023", apiId: "vctk/p326_023.wav", name: "P326 023", languages: ["English (Research)"], gender: "neutral", description: "P326 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p329_023", apiId: "vctk/p329_023.wav", name: "P329 023", languages: ["English (Research)"], gender: "neutral", description: "P329 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p330_023", apiId: "vctk/p330_023.wav", name: "P330 023", languages: ["English (Research)"], gender: "neutral", description: "P330 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p333_023", apiId: "vctk/p333_023.wav", name: "P333 023", languages: ["English (Research)"], gender: "neutral", description: "P333 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p334_023", apiId: "vctk/p334_023.wav", name: "P334 023", languages: ["English (Research)"], gender: "neutral", description: "P334 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p335_023", apiId: "vctk/p335_023.wav", name: "P335 023", languages: ["English (Research)"], gender: "neutral", description: "P335 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p336_023", apiId: "vctk/p336_023.wav", name: "P336 023", languages: ["English (Research)"], gender: "neutral", description: "P336 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p339_023", apiId: "vctk/p339_023.wav", name: "P339 023", languages: ["English (Research)"], gender: "neutral", description: "P339 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p341_023", apiId: "vctk/p341_023.wav", name: "P341 023", languages: ["English (Research)"], gender: "neutral", description: "P341 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p343_023", apiId: "vctk/p343_023.wav", name: "P343 023", languages: ["English (Research)"], gender: "neutral", description: "P343 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p345_023", apiId: "vctk/p345_023.wav", name: "P345 023", languages: ["English (Research)"], gender: "neutral", description: "P345 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p347_023", apiId: "vctk/p347_023.wav", name: "P347 023", languages: ["English (Research)"], gender: "neutral", description: "P347 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p351_023", apiId: "vctk/p351_023.wav", name: "P351 023", languages: ["English (Research)"], gender: "neutral", description: "P351 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p360_023", apiId: "vctk/p360_023.wav", name: "P360 023", languages: ["English (Research)"], gender: "neutral", description: "P360 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p361_023", apiId: "vctk/p361_023.wav", name: "P361 023", languages: ["English (Research)"], gender: "neutral", description: "P361 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p363_023", apiId: "vctk/p363_023.wav", name: "P363 023", languages: ["English (Research)"], gender: "neutral", description: "P363 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p364_023", apiId: "vctk/p364_023.wav", name: "P364 023", languages: ["English (Research)"], gender: "neutral", description: "P364 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p374_023", apiId: "vctk/p374_023.wav", name: "P374 023", languages: ["English (Research)"], gender: "neutral", description: "P374 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_p376_023", apiId: "vctk/p376_023.wav", name: "P376 023", languages: ["English (Research)"], gender: "neutral", description: "P376 023 (English (Research), neutral) [VCTK]" },
  { id: "vctk_s5_023", apiId: "vctk/s5_023.wav", name: "S5 023", languages: ["English (Research)"], gender: "neutral", description: "S5 023 (English (Research), neutral) [VCTK]" },
  { id: "unmute-prod-website_degaulle-2", apiId: "unmute-prod-website/degaulle-2.wav", name: "Unmute - Charles de Gaulle", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Charles de Gaulle (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_developer-1", apiId: "unmute-prod-website/developer-1.mp3", name: "Unmute - Dev", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Dev (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_developpeuse-3", apiId: "unmute-prod-website/developpeuse-3.wav", name: "Unmute - Développeuse", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Développeuse (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_fabieng-enhanced-v2", apiId: "unmute-prod-website/fabieng-enhanced-v2.wav", name: "Unmute - Fabieng", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Fabieng (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_freesound_440565_why-is-there-educationwav", apiId: "unmute-prod-website/freesound/440565_why-is-there-educationwav.mp3", name: "Unmute - Gertrude", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Gertrude (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_freesound_519189_request-42---hmm-i-dont-knowwav", apiId: "unmute-prod-website/freesound/519189_request-42---hmm-i-dont-knowwav.mp3", name: "Unmute - Quiz show", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Quiz show (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_p329_022", apiId: "unmute-prod-website/p329_022.wav", name: "Unmute - Watercooler", languages: ["English (Studio)"], gender: "neutral", description: "Unmute - Watercooler (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_default_voice", apiId: "unmute-prod-website/default_voice.wav", name: "Default Voice", languages: ["English (Studio)"], gender: "neutral", description: "Default Voice (English (Studio), neutral) [Unmute]" },
  { id: "unmute-prod-website_ex04_narration_longform_00001", apiId: "unmute-prod-website/ex04_narration_longform_00001.wav", name: "Ex04 Narration Longform 00001", languages: ["English (Studio)"], gender: "neutral", description: "Ex04 Narration Longform 00001 (English (Studio), neutral) [Unmute]" },
  { id: "ears_p003_freeform_speech_01", apiId: "ears/p003/freeform_speech_01.wav", name: "EARS dataset - Speaker 003", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 003 (English (Research), neutral) [EARS]" },
  { id: "ears_p013_freeform_speech_01", apiId: "ears/p013/freeform_speech_01.wav", name: "EARS dataset - Speaker 013", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 013 (English (Research), neutral) [EARS]" },
  { id: "ears_p022_freeform_speech_01", apiId: "ears/p022/freeform_speech_01.wav", name: "EARS dataset - Speaker 022", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 022 (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_adoration_freeform", apiId: "ears/p031/emo_adoration_freeform.wav", name: "EARS dataset - Speaker 031", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 031 (English (Research), neutral) [EARS]" },
  { id: "ears_p040_freeform_speech_01", apiId: "ears/p040/freeform_speech_01.wav", name: "EARS dataset - Speaker 040", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 040 (English (Research), neutral) [EARS]" },
  { id: "ears_p051_freeform_speech_01", apiId: "ears/p051/freeform_speech_01.wav", name: "EARS dataset - Speaker 051", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 051 (English (Research), neutral) [EARS]" },
  { id: "ears_p060_freeform_speech_01", apiId: "ears/p060/freeform_speech_01.wav", name: "EARS dataset - Speaker 060", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 060 (English (Research), neutral) [EARS]" },
  { id: "ears_p070_freeform_speech_01", apiId: "ears/p070/freeform_speech_01.wav", name: "EARS dataset - Speaker 070", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 070 (English (Research), neutral) [EARS]" },
  { id: "ears_p080_freeform_speech_01", apiId: "ears/p080/freeform_speech_01.wav", name: "EARS dataset - Speaker 080", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 080 (English (Research), neutral) [EARS]" },
  { id: "ears_p091_freeform_speech_01", apiId: "ears/p091/freeform_speech_01.wav", name: "EARS dataset - Speaker 091", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 091 (English (Research), neutral) [EARS]" },
  { id: "ears_p105_freeform_speech_01", apiId: "ears/p105/freeform_speech_01.wav", name: "EARS dataset - Speaker 105", languages: ["English (Research)"], gender: "neutral", description: "EARS dataset - Speaker 105 (English (Research), neutral) [EARS]" },
  { id: "ears_p001_freeform_speech_01", apiId: "ears/p001/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p002_freeform_speech_01", apiId: "ears/p002/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_adoration_freeform", apiId: "ears/p003/emo_adoration_freeform.wav", name: "Emo Adoration Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Adoration Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_amazement_freeform", apiId: "ears/p003/emo_amazement_freeform.wav", name: "Emo Amazement Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Amazement Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_amusement_freeform", apiId: "ears/p003/emo_amusement_freeform.wav", name: "Emo Amusement Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Amusement Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_anger_freeform", apiId: "ears/p003/emo_anger_freeform.wav", name: "Emo Anger Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Anger Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_confusion_freeform", apiId: "ears/p003/emo_confusion_freeform.wav", name: "Emo Confusion Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Confusion Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_contentment_freeform", apiId: "ears/p003/emo_contentment_freeform.wav", name: "Emo Contentment Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Contentment Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_cuteness_freeform", apiId: "ears/p003/emo_cuteness_freeform.wav", name: "Emo Cuteness Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Cuteness Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_desire_freeform", apiId: "ears/p003/emo_desire_freeform.wav", name: "Emo Desire Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Desire Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_disappointment_freeform", apiId: "ears/p003/emo_disappointment_freeform.wav", name: "Emo Disappointment Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Disappointment Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_disgust_freeform", apiId: "ears/p003/emo_disgust_freeform.wav", name: "Emo Disgust Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Disgust Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_distress_freeform", apiId: "ears/p003/emo_distress_freeform.wav", name: "Emo Distress Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Distress Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_embarassment_freeform", apiId: "ears/p003/emo_embarassment_freeform.wav", name: "Emo Embarassment Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Embarassment Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_extasy_freeform", apiId: "ears/p003/emo_extasy_freeform.wav", name: "Emo Extasy Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Extasy Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_fear_freeform", apiId: "ears/p003/emo_fear_freeform.wav", name: "Emo Fear Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Fear Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_guilt_freeform", apiId: "ears/p003/emo_guilt_freeform.wav", name: "Emo Guilt Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Guilt Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_interest_freeform", apiId: "ears/p003/emo_interest_freeform.wav", name: "Emo Interest Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Interest Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_neutral_freeform", apiId: "ears/p003/emo_neutral_freeform.wav", name: "Emo Neutral Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Neutral Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_pain_freeform", apiId: "ears/p003/emo_pain_freeform.wav", name: "Emo Pain Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Pain Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_pride_freeform", apiId: "ears/p003/emo_pride_freeform.wav", name: "Emo Pride Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Pride Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_realization_freeform", apiId: "ears/p003/emo_realization_freeform.wav", name: "Emo Realization Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Realization Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_relief_freeform", apiId: "ears/p003/emo_relief_freeform.wav", name: "Emo Relief Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Relief Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_sadness_freeform", apiId: "ears/p003/emo_sadness_freeform.wav", name: "Emo Sadness Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Sadness Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p003_emo_serenity_freeform", apiId: "ears/p003/emo_serenity_freeform.wav", name: "Emo Serenity Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Serenity Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p004_freeform_speech_01", apiId: "ears/p004/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p005_freeform_speech_01", apiId: "ears/p005/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p006_freeform_speech_01", apiId: "ears/p006/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p007_freeform_speech_01", apiId: "ears/p007/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p008_freeform_speech_01", apiId: "ears/p008/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p009_freeform_speech_01", apiId: "ears/p009/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p010_freeform_speech_01", apiId: "ears/p010/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p011_freeform_speech_01", apiId: "ears/p011/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p012_freeform_speech_01", apiId: "ears/p012/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p014_freeform_speech_01", apiId: "ears/p014/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p015_freeform_speech_01", apiId: "ears/p015/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p016_freeform_speech_01", apiId: "ears/p016/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p017_freeform_speech_01", apiId: "ears/p017/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p018_freeform_speech_01", apiId: "ears/p018/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p019_freeform_speech_01", apiId: "ears/p019/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p020_freeform_speech_01", apiId: "ears/p020/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p021_freeform_speech_01", apiId: "ears/p021/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p023_freeform_speech_01", apiId: "ears/p023/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p024_freeform_speech_01", apiId: "ears/p024/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p025_freeform_speech_01", apiId: "ears/p025/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p026_freeform_speech_01", apiId: "ears/p026/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p027_freeform_speech_01", apiId: "ears/p027/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p028_freeform_speech_01", apiId: "ears/p028/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p029_freeform_speech_01", apiId: "ears/p029/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p030_freeform_speech_01", apiId: "ears/p030/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_amazement_freeform", apiId: "ears/p031/emo_amazement_freeform.wav", name: "Emo Amazement Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Amazement Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_amusement_freeform", apiId: "ears/p031/emo_amusement_freeform.wav", name: "Emo Amusement Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Amusement Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_anger_freeform", apiId: "ears/p031/emo_anger_freeform.wav", name: "Emo Anger Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Anger Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_confusion_freeform", apiId: "ears/p031/emo_confusion_freeform.wav", name: "Emo Confusion Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Confusion Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_contentment_freeform", apiId: "ears/p031/emo_contentment_freeform.wav", name: "Emo Contentment Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Contentment Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_cuteness_freeform", apiId: "ears/p031/emo_cuteness_freeform.wav", name: "Emo Cuteness Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Cuteness Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_desire_freeform", apiId: "ears/p031/emo_desire_freeform.wav", name: "Emo Desire Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Desire Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_disappointment_freeform", apiId: "ears/p031/emo_disappointment_freeform.wav", name: "Emo Disappointment Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Disappointment Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_disgust_freeform", apiId: "ears/p031/emo_disgust_freeform.wav", name: "Emo Disgust Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Disgust Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_distress_freeform", apiId: "ears/p031/emo_distress_freeform.wav", name: "Emo Distress Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Distress Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_embarassment_freeform", apiId: "ears/p031/emo_embarassment_freeform.wav", name: "Emo Embarassment Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Embarassment Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_extasy_freeform", apiId: "ears/p031/emo_extasy_freeform.wav", name: "Emo Extasy Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Extasy Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_fear_freeform", apiId: "ears/p031/emo_fear_freeform.wav", name: "Emo Fear Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Fear Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_guilt_freeform", apiId: "ears/p031/emo_guilt_freeform.wav", name: "Emo Guilt Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Guilt Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_interest_freeform", apiId: "ears/p031/emo_interest_freeform.wav", name: "Emo Interest Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Interest Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_neutral_freeform", apiId: "ears/p031/emo_neutral_freeform.wav", name: "Emo Neutral Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Neutral Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_pain_freeform", apiId: "ears/p031/emo_pain_freeform.wav", name: "Emo Pain Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Pain Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_pride_freeform", apiId: "ears/p031/emo_pride_freeform.wav", name: "Emo Pride Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Pride Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_realization_freeform", apiId: "ears/p031/emo_realization_freeform.wav", name: "Emo Realization Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Realization Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_relief_freeform", apiId: "ears/p031/emo_relief_freeform.wav", name: "Emo Relief Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Relief Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_sadness_freeform", apiId: "ears/p031/emo_sadness_freeform.wav", name: "Emo Sadness Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Sadness Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_emo_serenity_freeform", apiId: "ears/p031/emo_serenity_freeform.wav", name: "Emo Serenity Freeform", languages: ["English (Research)"], gender: "neutral", description: "Emo Serenity Freeform (English (Research), neutral) [EARS]" },
  { id: "ears_p031_freeform_speech_01", apiId: "ears/p031/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p032_freeform_speech_01", apiId: "ears/p032/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p033_freeform_speech_01", apiId: "ears/p033/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p034_freeform_speech_01", apiId: "ears/p034/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p035_freeform_speech_01", apiId: "ears/p035/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p036_freeform_speech_01", apiId: "ears/p036/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p037_freeform_speech_01", apiId: "ears/p037/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p038_freeform_speech_01", apiId: "ears/p038/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p039_freeform_speech_01", apiId: "ears/p039/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p041_freeform_speech_01", apiId: "ears/p041/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p042_freeform_speech_01", apiId: "ears/p042/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p043_freeform_speech_01", apiId: "ears/p043/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p044_freeform_speech_01", apiId: "ears/p044/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p045_freeform_speech_01", apiId: "ears/p045/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p046_freeform_speech_01", apiId: "ears/p046/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p047_freeform_speech_01", apiId: "ears/p047/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p048_freeform_speech_01", apiId: "ears/p048/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p049_freeform_speech_01", apiId: "ears/p049/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p050_freeform_speech_01", apiId: "ears/p050/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p052_freeform_speech_01", apiId: "ears/p052/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p053_freeform_speech_01", apiId: "ears/p053/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p054_freeform_speech_01", apiId: "ears/p054/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p055_freeform_speech_01", apiId: "ears/p055/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p056_freeform_speech_01", apiId: "ears/p056/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p057_freeform_speech_01", apiId: "ears/p057/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p058_freeform_speech_01", apiId: "ears/p058/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p059_freeform_speech_01", apiId: "ears/p059/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p061_freeform_speech_01", apiId: "ears/p061/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p062_freeform_speech_01", apiId: "ears/p062/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p063_freeform_speech_01", apiId: "ears/p063/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p064_freeform_speech_01", apiId: "ears/p064/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p065_freeform_speech_01", apiId: "ears/p065/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p066_freeform_speech_01", apiId: "ears/p066/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p067_freeform_speech_01", apiId: "ears/p067/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p068_freeform_speech_01", apiId: "ears/p068/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p069_freeform_speech_01", apiId: "ears/p069/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p071_freeform_speech_01", apiId: "ears/p071/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p072_freeform_speech_01", apiId: "ears/p072/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p073_freeform_speech_01", apiId: "ears/p073/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p074_freeform_speech_01", apiId: "ears/p074/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p075_freeform_speech_01", apiId: "ears/p075/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p076_freeform_speech_01", apiId: "ears/p076/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p077_freeform_speech_01", apiId: "ears/p077/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p078_freeform_speech_01", apiId: "ears/p078/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p079_freeform_speech_01", apiId: "ears/p079/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p081_freeform_speech_01", apiId: "ears/p081/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p082_freeform_speech_01", apiId: "ears/p082/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p083_freeform_speech_01", apiId: "ears/p083/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p084_freeform_speech_01", apiId: "ears/p084/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p085_freeform_speech_01", apiId: "ears/p085/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p086_freeform_speech_01", apiId: "ears/p086/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p087_freeform_speech_01", apiId: "ears/p087/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p088_freeform_speech_01", apiId: "ears/p088/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p089_freeform_speech_01", apiId: "ears/p089/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p090_freeform_speech_01", apiId: "ears/p090/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p092_freeform_speech_01", apiId: "ears/p092/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p093_freeform_speech_01", apiId: "ears/p093/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p094_freeform_speech_01", apiId: "ears/p094/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p095_freeform_speech_01", apiId: "ears/p095/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p096_freeform_speech_01", apiId: "ears/p096/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p097_freeform_speech_01", apiId: "ears/p097/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p098_freeform_speech_01", apiId: "ears/p098/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p099_freeform_speech_01", apiId: "ears/p099/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p100_freeform_speech_01", apiId: "ears/p100/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p101_freeform_speech_01", apiId: "ears/p101/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p102_freeform_speech_01", apiId: "ears/p102/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p103_freeform_speech_01", apiId: "ears/p103/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p104_freeform_speech_01", apiId: "ears/p104/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p107_freeform_speech_01", apiId: "ears/p107/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
  { id: "ears_p106_freeform_speech_01", apiId: "ears/p106/freeform_speech_01.wav", name: "Freeform Speech 01", languages: ["English (Research)"], gender: "neutral", description: "Freeform Speech 01 (English (Research), neutral) [EARS]" },
];
// Total voices: 584

module.exports.default = {
  id: 'kyutai-tts',
  name: 'Kyutai TTS',
  version: '1.0.3',
  description: 'Free Kyutai TTS via WebSocket streaming. 200+ voices, no API key required. Returns 24 kHz WAV.',
  maxCharsPerRequest: 5000,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 18,

  configSchema: [
    {
      key: 'cfgAlpha',
      type: 'slider',
      label: 'CFG Alpha',
      defaultValue: 1.5,
      min: 0.5,
      max: 3.0,
      step: 0.1,
      description: 'Classifier-Free Guidance strength. Higher values make output adhere more closely to the voice.',
    },
  ],

  getVoices: async function () {
    return KYUTAI_VOICES.map(v => ({
      id: v.id,
      name: v.name,
      languages: v.languages,
      gender: v.gender,
      description: v.description,
    }));
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      throw new Error('No speakable text');
    }

    const settings = options.pluginSettings || {};
    const voiceInput = options.voiceId || DEFAULT_VOICE_ID;
    const cfgAlpha = settings.cfgAlpha !== undefined ? settings.cfgAlpha : 1.5;

    log('synthesize START textLen=' + text.length + ' voice=' + voiceInput + ' cfgAlpha=' + cfgAlpha);

    const voiceId = resolveVoiceId(voiceInput);
    const audio = await synthesizeWithRetry(text, voiceId, cfgAlpha, 2);

    log('FINAL audio=' + audio.audioContent.byteLength + ' bytes');
    return {
      audioContent: audio.audioContent,
      format: audio.format,
      sampleRate: audio.sampleRate,
    };
  },
};
