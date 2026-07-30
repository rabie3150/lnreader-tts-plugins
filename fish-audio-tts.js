// Fish Audio TTS plugin for LNReader React Native JS runtime.
// Uses the official Fish Audio API (/v1/tts). Requires an API key.
// Runs on the JS thread; the app handles parallel chunk synthesis.

const API_URL = 'https://api.fish.audio/v1/tts';
const LIST_VOICES_URL = 'https://api.fish.audio/model/default-voices?language=en';
const LIST_VOICES_WEB_URL = 'https://api.fish.audio/model/web?page_size=50&page_number=1&title=&language=en&sort_by=score';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function synthesizeSingleRequest(text, voice, model, speed, apiKey) {
  const payload = {
    text,
    reference_id: voice,
    format: 'mp3',
    latency: 'balanced',
    normalize: true,
    sample_rate: 44100,
    mp3_bitrate: 128,
    prosody: {
      speed: speed,
      volume: 0,
      normalize_loudness: true,
    },
  };

  console.log(`FishAudio synthesize textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'model': model,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(payload),
  });

  console.log(`FishAudio response status=${resp.status}`);

  if (!resp.ok) {
    const errText = await resp.text();
    console.log(`FishAudio HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
    throw new Error(`Fish Audio TTS HTTP ${resp.status}: ${errText.slice(0, 100)}`);
  }

  const audioBytes = new Uint8Array(await resp.arrayBuffer());
  console.log(`FishAudio SUCCESS audio=${audioBytes.length} bytes`);
  return audioBytes;
}

async function synthesizeWithRetry(text, voice, model, speed, apiKey, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice, model, speed, apiKey);
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
  id: 'fish-audio-tts',
  name: 'Fish Audio TTS',
  version: '1.0.0',
  description:
    'Fish Audio TTS using the official API. Requires a Fish Audio API key. Returns MP3 audio at 44.1 kHz.',
  maxCharsPerRequest: 3000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 18,

  configSchema: [
    {
      key: 'apiKey',
      type: 'text',
      label: 'API Key',
      defaultValue: '',
      description: 'Fish Audio API key (Bearer token). Get one from fish.audio.',
    },
    {
      key: 'model',
      type: 'select',
      label: 'Model',
      defaultValue: 's2.1-pro-free',
      options: [
        { label: 'S2.1 Pro (Free Tier)', value: 's2.1-pro-free' },
        { label: 'S2.1 Pro', value: 's2.1-pro' },
      ],
    },
  ],

  getVoices: async function (options) {
    const apiKey = (options && options.pluginSettings && options.pluginSettings.apiKey) || '';
    if (!apiKey) {
      console.log('FishAudio getVoices: no API key configured');
      return [];
    }

    try {
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      };

      // Try default voices first (small, curated list)
      let resp = await fetch(LIST_VOICES_URL, { headers });
      let data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(v => ({
          id: v._id,
          name: v.title || v._id,
          languages: (v.languages || ['en']).map(l => l.toLowerCase()),
          description: v.description || '',
        }));
      }

      // Fallback to web listing
      resp = await fetch(LIST_VOICES_WEB_URL, { headers });
      data = await resp.json();
      const items = data.items || [];
      return items.map(v => ({
        id: v._id,
        name: v.title || v._id,
        languages: (v.languages || ['en']).map(l => l.toLowerCase()),
        description: v.description || '',
      }));
    } catch (e) {
      console.log('FishAudio getVoices error:', e?.message || e);
      return [];
    }
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      console.log('FishAudio SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const apiKey = settings.apiKey || '';
    if (!apiKey) {
      throw new Error('Fish Audio API key is required. Enter it in plugin settings.');
    }

    const voice = options.voiceId || settings.voice || 'bf322df2096a46f18c579d0baa36f41d';
    const model = settings.model || 's2.1-pro-free';
    const speed = options.speed || 1.0;

    console.log(`FishAudio synthesize START textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

    const audio = await synthesizeWithRetry(text, voice, model, speed, apiKey, 2);

    console.log(`FishAudio FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 44100,
    };
  },
};
