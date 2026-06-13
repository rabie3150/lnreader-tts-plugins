// Inworld AI TTS plugin for LNReader QuickJS runtime.
// Designed for synchronous execution: fetch(), resp.text(), and resp.json()
// are blocking. The native orchestrator runs multiple synthesize() calls in
// parallel (one per chunk), so this plugin only handles a single chunk.

const API_URL = 'https://inworld.ai/api/create-speech';
const LIST_VOICES_URL = 'https://inworld.ai/api/list-voices';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function base64ToBytes(base64) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function log(msg) {
  try {
    const { NativeModules } = require('react-native');
    NativeModules.TtsStreamingModule.log('Inworld', msg);
  } catch {}
}

function preprocessInworldText(text) {
  return text.replace(/\[([^\[\]]+)\]/g, (match, content) => {
    const trimmed = content.trim();
    if (!trimmed) return match;
    return `[in a robotic system tone] ${trimmed} [in narration tone]`;
  });
}

function isValidWavHeader(bytes) {
  return (
    bytes.length >= 44 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  );
}

function getWavFmtParams(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  return {
    audioFormat: view.getUint16(20, true),
    numChannels: view.getUint16(22, true),
    sampleRate: view.getUint32(24, true),
    bitsPerSample: view.getUint16(34, true),
  };
}

function combineWavChunks(chunks) {
  const validChunks = chunks.filter(isValidWavHeader);
  if (validChunks.length === 0) {
    throw new Error('No valid WAV chunks to combine');
  }
  if (validChunks.length === 1) {
    return validChunks[0];
  }

  const refFmt = getWavFmtParams(validChunks[0]);
  for (let i = 1; i < validChunks.length; i++) {
    const fmt = getWavFmtParams(validChunks[i]);
    if (
      fmt.audioFormat !== refFmt.audioFormat ||
      fmt.numChannels !== refFmt.numChannels ||
      fmt.sampleRate !== refFmt.sampleRate ||
      fmt.bitsPerSample !== refFmt.bitsPerSample
    ) {
      throw new Error(`WAV chunk ${i} fmt mismatch`);
    }
  }

  const header = new Uint8Array(validChunks[0].slice(0, 44));
  let pcmLength = 0;
  for (const chunk of validChunks) {
    pcmLength += chunk.length - 44;
  }

  const view = new DataView(header.buffer, header.byteOffset);
  view.setUint32(4, 36 + pcmLength, true);
  view.setUint32(40, pcmLength, true);

  const result = new Uint8Array(44 + pcmLength);
  result.set(header, 0);
  let offset = 44;
  for (const chunk of validChunks) {
    result.set(chunk.slice(44), offset);
    offset += chunk.length - 44;
  }

  return result;
}

function synthesizeSingleRequest(text, voice, model, speed) {
  const uid = uuidv4();

  const payload = {
    text,
    voiceId: voice,
    modelId: model,
    temperature: 1.0,
    applyTextNormalization: 'ON',
    timestampType: 'TIMESTAMP_TYPE_UNSPECIFIED',
    audioConfig: {
      audioEncoding: 'LINEAR16',
      sampleRateHertz: 24000,
      speakingRate: speed,
    },
  };

  log(`synthesizeSingleRequest textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

  const resp = fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `inworld_uid=${uid}`,
      'Origin': 'https://inworld.ai',
      'Referer': 'https://inworld.ai/',
    },
    body: JSON.stringify(payload),
  });

  log(`RESPONSE status=${resp.status}`);

  if (!resp.ok) {
    const errText = resp.text();
    log(`HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
    throw new Error(`Inworld TTS HTTP ${resp.status}`);
  }

  const bodyText = resp.text();
  const lines = bodyText.split('\n').filter(l => l.trim());
  log(`NDJSON lines=${lines.length}`);

  const audioChunks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const data = JSON.parse(line);
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      const base64Audio = data.result?.audioContent;
      if (base64Audio) {
        audioChunks.push(base64ToBytes(base64Audio));
      }
    } catch (e) {
      log(`LINE${i} PARSE ERROR: ${e.message || e}`);
    }
  }

  if (audioChunks.length === 0) {
    throw new Error('Inworld TTS response missing audioContent');
  }

  log(`SUCCESS chunks=${audioChunks.length}`);

  if (audioChunks.length === 1) {
    return audioChunks[0];
  }
  return combineWavChunks(audioChunks);
}

function synthesizeWithRetry(text, voice, model, speed, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return synthesizeSingleRequest(text, voice, model, speed);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        // Synchronous sleep using a busy loop (QuickJS has no setTimeout).
        const until = Date.now() + 1000 * (attempt + 1);
        while (Date.now() < until) {}
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'inworld-tts',
  name: 'Inworld AI TTS',
  version: '1.0.0',
  description:
    'Free TTS using Inworld AI. Synthesized on the native IO thread; parallel chunk synthesis is handled by the LNReader TTS engine.',
  maxCharsPerRequest: 900,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 13,

  configSchema: [
    {
      key: 'model',
      type: 'select',
      label: 'Model',
      defaultValue: 'inworld-tts-1.5-mini',
      options: [
        { label: '1.5 mini (fastest streaming)', value: 'inworld-tts-1.5-mini' },
        { label: '1.5 max (best quality)', value: 'inworld-tts-1.5-max' },
        { label: 'Inworld TTS 1', value: 'inworld-tts-1' },
        { label: 'Inworld TTS 2', value: 'inworld-tts-2' },
      ],
    },
  ],

  getVoices: function () {
    try {
      const uid = uuidv4();
      const resp = fetch(LIST_VOICES_URL, {
        headers: {
          'Cookie': `inworld_uid=${uid}`,
          'Origin': 'https://inworld.ai',
          'Referer': 'https://inworld.ai/',
        },
      });
      const data = resp.json();
      return (data.voices || []).map(v => ({
        id: v.voiceId,
        name: v.displayName || v.voiceId,
        languages: (v.languages || ['en']).map(l => l.toLowerCase()),
        description: v.description || '',
      }));
    } catch {
      return [];
    }
  },

  synthesize: function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      log('SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const voice = (options && options.pluginSettings && options.pluginSettings.voice) || 'Elliot';
    const model = (options && options.pluginSettings && options.pluginSettings.model) || 'inworld-tts-1.5-mini';
    const speed = (options && options.speed) || 1.0;

    log(`synthesize START textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

    const processedText = preprocessInworldText(text);
    const audio = synthesizeWithRetry(processedText, voice, model, speed, 2);

    log(`FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: 'wav',
      sampleRate: 24000,
    };
  },
};
