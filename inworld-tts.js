// Inworld AI TTS plugin for LNReader React Native JS runtime.
// Runs on the JS thread; the app handles parallel chunk synthesis.

const API_URL = 'https://inworld.ai/api/create-speech';
const LIST_VOICES_URL = 'https://inworld.ai/api/list-voices';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function combineMp3Chunks(chunks) {
  // MP3 is a streaming format; concatenating chunks is safe.
  let totalLength = 0;
  for (const chunk of chunks) {
    totalLength += chunk.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function synthesizeSingleRequest(text, voice, model, speed) {
  const uid = uuidv4();

  const payload = {
    text,
    voiceId: voice,
    modelId: model,
    deliveryMode: 'CREATIVE',
    audioConfig: {
      audioEncoding: 'MP3',
      sampleRateHertz: 48000,
      speakingRate: speed,
    },
  };

  console.log(`Inworld synthesize textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Cookie': `inworld_uid=${uid}`,
      'Origin': 'https://inworld.ai',
      'Referer': 'https://inworld.ai/tts',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(payload),
  });

  console.log(`Inworld response status=${resp.status}`);

  if (!resp.ok) {
    const errText = await resp.text();
    console.log(`Inworld HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
    throw new Error(`Inworld TTS HTTP ${resp.status}`);
  }

  const bodyText = await resp.text();
  const lines = bodyText.split('\n').filter(l => l.trim());
  console.log(`Inworld NDJSON lines=${lines.length}`);

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
      console.log(`Inworld LINE${i} PARSE ERROR: ${e.message || e}`);
    }
  }

  if (audioChunks.length === 0) {
    throw new Error('Inworld TTS response missing audioContent');
  }

  console.log(`Inworld SUCCESS chunks=${audioChunks.length}`);

  if (audioChunks.length === 1) {
    return audioChunks[0];
  }
  return combineMp3Chunks(audioChunks);
}

async function synthesizeWithRetry(text, voice, model, speed, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice, model, speed);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'inworld-tts',
  name: 'Inworld AI TTS',
  version: '1.2.1',
  description:
    'Free TTS using Inworld AI. Returns MP3 audio at 48 kHz. Runs in the JS runtime; parallel chunk synthesis is handled by the LNReader TTS engine.',
  maxCharsPerRequest: 900,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 13,

  configSchema: [
    {
      key: 'model',
      type: 'select',
      label: 'Model',
      defaultValue: 'inworld-tts-2',
      options: [
        { label: 'Inworld TTS 2 (MP3)', value: 'inworld-tts-2' },
        { label: 'Inworld TTS 1', value: 'inworld-tts-1' },
        { label: '1.5 mini (streaming)', value: 'inworld-tts-1.5-mini' },
        { label: '1.5 max (streaming)', value: 'inworld-tts-1.5-max' },
      ],
    },
  ],

  getVoices: async function () {
    try {
      const uid = uuidv4();
      const resp = await fetch(LIST_VOICES_URL, {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'Cookie': `inworld_uid=${uid}`,
          'Origin': 'https://inworld.ai',
          'Referer': 'https://inworld.ai/tts',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      });
      const data = await resp.json();
      return (data.voices || []).map(v => ({
        id: v.voiceId,
        name: v.displayName || v.voiceId,
        languages: (v.languages || ['en']).map(l => l.toLowerCase()),
        description: v.description || '',
      }));
    } catch (e) {
      console.log('Inworld getVoices error:', e?.message || e);
      return [];
    }
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      console.log('Inworld SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const voice = options.voiceId || settings.voice || 'Sarah';
    const model = settings.model || 'inworld-tts-2';
    const speed = options.speed || 1.0;

    console.log(`Inworld synthesize START textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

    const audio = await synthesizeWithRetry(text, voice, model, speed, 2);

    console.log(`Inworld FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 48000,
    };
  },
};
