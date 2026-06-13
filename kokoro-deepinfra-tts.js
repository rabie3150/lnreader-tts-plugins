// Kokoro TTS (DeepInfra) plugin for LNReader QuickJS runtime.
// Uses the DeepInfra inference endpoint for the hexgrad/Kokoro-82M model.
// Supports speed control and multiple output formats.

const API_URL = 'https://api.deepinfra.com/v1/inference/hexgrad/Kokoro-82M?version=2f0893cb40f2ae8356e8e1f7463e52236425f5fd';
const DEFAULT_SAMPLE_RATE = 24000;

// Curated voice list from deepinfra_tts/config/voices.py.
// Format: id, language, gender (parsed from description), description.
const VOICES = [
  { id: 'af_heart', name: 'af_heart', language: 'American English', gender: 'female', description: 'American English - af_heart (🚺❤️, A)' },
  { id: 'af_alloy', name: 'af_alloy', language: 'American English', gender: 'female', description: 'American English - af_alloy (🚺, B, MM minutes, C)' },
  { id: 'af_aoede', name: 'af_aoede', language: 'American English', gender: 'female', description: 'American English - af_aoede (🚺, B, H hours, C+)' },
  { id: 'af_bella', name: 'af_bella', language: 'American English', gender: 'female', description: 'American English - af_bella (🚺🔥, A, HH hours, A-)' },
  { id: 'af_jessica', name: 'af_jessica', language: 'American English', gender: 'female', description: 'American English - af_jessica (🚺, C, MM minutes, D)' },
  { id: 'af_kore', name: 'af_kore', language: 'American English', gender: 'female', description: 'American English - af_kore (🚺, B, H hours, C+)' },
  { id: 'af_nicole', name: 'af_nicole', language: 'American English', gender: 'female', description: 'American English - af_nicole (🚺🎧, B, HH hours, B-)' },
  { id: 'af_nova', name: 'af_nova', language: 'American English', gender: 'female', description: 'American English - af_nova (🚺, B, MM minutes, C)' },
  { id: 'af_river', name: 'af_river', language: 'American English', gender: 'female', description: 'American English - af_river (🚺, C, MM minutes, D)' },
  { id: 'af_sarah', name: 'af_sarah', language: 'American English', gender: 'female', description: 'American English - af_sarah (🚺, B, H hours, C+)' },
  { id: 'af_sky', name: 'af_sky', language: 'American English', gender: 'female', description: 'American English - af_sky (🚺, B, M minutes 🤏, C-)' },
  { id: 'am_adam', name: 'am_adam', language: 'American English', gender: 'male', description: 'American English - am_adam (🚹, D, H hours, F+)' },
  { id: 'am_echo', name: 'am_echo', language: 'American English', gender: 'male', description: 'American English - am_echo (🚹, C, MM minutes, D)' },
  { id: 'am_eric', name: 'am_eric', language: 'American English', gender: 'male', description: 'American English - am_eric (🚹, C, MM minutes, D)' },
  { id: 'am_fenrir', name: 'am_fenrir', language: 'American English', gender: 'male', description: 'American English - am_fenrir (🚹, B, H hours, C+)' },
  { id: 'am_liam', name: 'am_liam', language: 'American English', gender: 'male', description: 'American English - am_liam (🚹, C, MM minutes, D)' },
  { id: 'am_michael', name: 'am_michael', language: 'American English', gender: 'male', description: 'American English - am_michael (🚹, B, H hours, C+)' },
  { id: 'am_onyx', name: 'am_onyx', language: 'American English', gender: 'male', description: 'American English - am_onyx (🚹, C, MM minutes, D)' },
  { id: 'am_puck', name: 'am_puck', language: 'American English', gender: 'male', description: 'American English - am_puck (🚹, B, H hours, C+)' },
  { id: 'am_santa', name: 'am_santa', language: 'American English', gender: 'male', description: 'American English - am_santa (🚹, C, M minutes 🤏, D-)' },
  { id: 'bf_alice', name: 'bf_alice', language: 'British English', gender: 'female', description: 'British English - bf_alice (🚺, C, MM minutes, D)' },
  { id: 'bf_emma', name: 'bf_emma', language: 'British English', gender: 'female', description: 'British English - bf_emma (🚺, B, HH hours, B-)' },
  { id: 'bf_isabella', name: 'bf_isabella', language: 'British English', gender: 'female', description: 'British English - bf_isabella (🚺, B, MM minutes, C)' },
  { id: 'bf_lily', name: 'bf_lily', language: 'British English', gender: 'female', description: 'British English - bf_lily (🚺, C, MM minutes, D)' },
  { id: 'bm_daniel', name: 'bm_daniel', language: 'British English', gender: 'male', description: 'British English - bm_daniel (🚹, C, MM minutes, D)' },
  { id: 'bm_fable', name: 'bm_fable', language: 'British English', gender: 'male', description: 'British English - bm_fable (🚹, B, MM minutes, C)' },
  { id: 'bm_george', name: 'bm_george', language: 'British English', gender: 'male', description: 'British English - bm_george (🚹, B, MM minutes, C)' },
  { id: 'bm_lewis', name: 'bm_lewis', language: 'British English', gender: 'male', description: 'British English - bm_lewis (🚹, C, H hours, D+)' },
  { id: 'jf_alpha', name: 'jf_alpha', language: 'Japanese', gender: 'female', description: 'Japanese - jf_alpha (🚺, B, H hours, C+)' },
  { id: 'jf_gongitsune', name: 'jf_gongitsune', language: 'Japanese', gender: 'female', description: 'Japanese - jf_gongitsune (🚺, B, MM minutes, C)' },
  { id: 'jf_nezumi', name: 'jf_nezumi', language: 'Japanese', gender: 'female', description: 'Japanese - jf_nezumi (🚺, B, M minutes 🤏, C-)' },
  { id: 'jf_tebukuro', name: 'jf_tebukuro', language: 'Japanese', gender: 'female', description: 'Japanese - jf_tebukuro (🚺, B, MM minutes, C)' },
  { id: 'jm_kumo', name: 'jm_kumo', language: 'Japanese', gender: 'male', description: 'Japanese - jm_kumo (🚹, B, M minutes 🤏, C-)' },
  { id: 'zf_xiaobei', name: 'zf_xiaobei', language: 'Mandarin Chinese', gender: 'female', description: 'Mandarin Chinese - zf_xiaobei (🚺, C, MM minutes, D)' },
  { id: 'zf_xiaoni', name: 'zf_xiaoni', language: 'Mandarin Chinese', gender: 'female', description: 'Mandarin Chinese - zf_xiaoni (🚺, C, MM minutes, D)' },
  { id: 'zf_xiaoxiao', name: 'zf_xiaoxiao', language: 'Mandarin Chinese', gender: 'female', description: 'Mandarin Chinese - zf_xiaoxiao (🚺, C, MM minutes, D)' },
  { id: 'zf_xiaoyi', name: 'zf_xiaoyi', language: 'Mandarin Chinese', gender: 'female', description: 'Mandarin Chinese - zf_xiaoyi (🚺, C, MM minutes, D)' },
  { id: 'zm_yunjian', name: 'zm_yunjian', language: 'Mandarin Chinese', gender: 'male', description: 'Mandarin Chinese - zm_yunjian (🚹, C, MM minutes, D)' },
  { id: 'zm_yunxi', name: 'zm_yunxi', language: 'Mandarin Chinese', gender: 'male', description: 'Mandarin Chinese - zm_yunxi (🚹, C, MM minutes, D)' },
  { id: 'zm_yunxia', name: 'zm_yunxia', language: 'Mandarin Chinese', gender: 'male', description: 'Mandarin Chinese - zm_yunxia (🚹, C, MM minutes, D)' },
  { id: 'zm_yunyang', name: 'zm_yunyang', language: 'Mandarin Chinese', gender: 'male', description: 'Mandarin Chinese - zm_yunyang (🚹, C, MM minutes, D)' },
  { id: 'ef_dora', name: 'ef_dora', language: 'Spanish', gender: 'female', description: 'Spanish - ef_dora (🚺)' },
  { id: 'em_alex', name: 'em_alex', language: 'Spanish', gender: 'male', description: 'Spanish - em_alex (🚹)' },
  { id: 'em_santa', name: 'em_santa', language: 'Spanish', gender: 'male', description: 'Spanish - em_santa (🚹)' },
  { id: 'ff_siwis', name: 'ff_siwis', language: 'French', gender: 'female', description: 'French - ff_siwis (🚺, B, <11 hours, B-)' },
  { id: 'hf_alpha', name: 'hf_alpha', language: 'Hindi', gender: 'female', description: 'Hindi - hf_alpha (🚺, B, MM minutes, C)' },
  { id: 'hf_beta', name: 'hf_beta', language: 'Hindi', gender: 'female', description: 'Hindi - hf_beta (🚺, B, MM minutes, C)' },
  { id: 'hm_omega', name: 'hm_omega', language: 'Hindi', gender: 'male', description: 'Hindi - hm_omega (🚹, B, MM minutes, C)' },
  { id: 'hm_psi', name: 'hm_psi', language: 'Hindi', gender: 'male', description: 'Hindi - hm_psi (🚹, B, MM minutes, C)' },
  { id: 'if_sara', name: 'if_sara', language: 'Italian', gender: 'female', description: 'Italian - if_sara (🚺, B, MM minutes, C)' },
  { id: 'im_nicola', name: 'im_nicola', language: 'Italian', gender: 'male', description: 'Italian - im_nicola (🚹, B, MM minutes, C)' },
  { id: 'pf_dora', name: 'pf_dora', language: 'Brazilian Portuguese', gender: 'female', description: 'Brazilian Portuguese - pf_dora (🚺)' },
  { id: 'pm_alex', name: 'pm_alex', language: 'Brazilian Portuguese', gender: 'male', description: 'Brazilian Portuguese - pm_alex (🚹)' },
  { id: 'pm_santa', name: 'pm_santa', language: 'Brazilian Portuguese', gender: 'male', description: 'Brazilian Portuguese - pm_santa (🚹)' },
];

function log(msg) {
  try {
    const { NativeModules } = require('react-native');
    NativeModules.TtsStreamingModule.log('KokoroDeepInfra', msg);
  } catch {}
}

function base64ToBytes(base64) {
  const buffer = base64ToArrayBuffer(base64);
  return new Uint8Array(buffer);
}

function langToCode(language) {
  switch (language) {
    case 'American English': return 'en-us';
    case 'British English': return 'en-gb';
    case 'Japanese': return 'ja-jp';
    case 'Mandarin Chinese': return 'zh-cn';
    case 'Spanish': return 'es-es';
    case 'French': return 'fr-fr';
    case 'Hindi': return 'hi-in';
    case 'Italian': return 'it-it';
    case 'Brazilian Portuguese': return 'pt-br';
    default: return 'en';
  }
}

function formatFromOutputFormat(outputFormat) {
  const lower = (outputFormat || 'mp3').toLowerCase();
  if (lower.indexOf('mp3') >= 0) return 'mp3';
  if (lower.indexOf('wav') >= 0) return 'wav';
  if (lower.indexOf('opus') >= 0) return 'opus';
  if (lower.indexOf('flac') >= 0) return 'flac';
  if (lower.indexOf('pcm') >= 0) return 'wav';
  return 'mp3';
}

function sleepMs(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {}
}

function synthesizeSingleRequest(text, voiceIds, outputFormat, speed, apiKey) {
  const payload = {
    text: text,
    output_format: outputFormat,
    preset_voice: voiceIds,
    speed: speed,
  };

  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = 'Bearer ' + apiKey;
  }

  log(`synthesizeSingleRequest textLen=${text.length} voices=${voiceIds.join(',')} format=${outputFormat} speed=${speed}`);

  const resp = fetch(API_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  log(`RESPONSE status=${resp.status}`);

  if (!resp.ok) {
    const errText = resp.text();
    log(`HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
    throw new Error(`Kokoro TTS HTTP ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const result = resp.json();
  let audioB64 = result.audio;

  if (!audioB64) {
    throw new Error('Kokoro TTS response missing audio');
  }

  if (audioB64.indexOf('data:') === 0) {
    const comma = audioB64.indexOf(',');
    if (comma >= 0) {
      audioB64 = audioB64.slice(comma + 1);
    }
  }

  const audioBytes = base64ToBytes(audioB64);
  log(`SUCCESS audio=${audioBytes.length} bytes`);

  return audioBytes;
}

function synthesizeWithRetry(text, voiceIds, outputFormat, speed, apiKey, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return synthesizeSingleRequest(text, voiceIds, outputFormat, speed, apiKey);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        sleepMs(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'kokoro-deepinfra-tts',
  name: 'Kokoro TTS (DeepInfra)',
  version: '1.0.1',
  description:
    'Kokoro TTS via DeepInfra. State-of-the-art open-source TTS with multi-language voices and speed control. Requires a DeepInfra API key.',
  maxCharsPerRequest: 2000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 15,

  configSchema: [
    {
      key: 'apiKey',
      type: 'text',
      label: 'DeepInfra API Key',
      description: 'Your DeepInfra API key. Get one at https://deepinfra.com/dash/api_keys.',
      required: true,
    },
    {
      key: 'outputFormat',
      type: 'select',
      label: 'Output Format',
      defaultValue: 'mp3',
      options: [
        { label: 'MP3', value: 'mp3' },
        { label: 'WAV', value: 'wav' },
        { label: 'Opus', value: 'opus' },
        { label: 'FLAC', value: 'flac' },
      ],
    },
    {
      key: 'speed',
      type: 'slider',
      label: 'Speed',
      defaultValue: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.1,
      description: 'Speech speed (0.5 = slow, 2.0 = fast).',
    },
  ],

  getVoices: function () {
    return VOICES.map(function (v) {
      return {
        id: v.id,
        name: v.name,
        languages: [langToCode(v.language)],
        gender: v.gender,
        description: v.description,
      };
    });
  },

  synthesize: function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      log('SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const apiKey = settings.apiKey;
    const voiceId = (options && options.voiceId) || 'af_bella';
    const outputFormat = settings.outputFormat || 'mp3';
    const schemaSpeed = typeof settings.speed === 'number' ? settings.speed : 1.0;
    const speed = options && typeof options.speed === 'number' ? options.speed : schemaSpeed;

    const voiceIds = [voiceId];

    log(`synthesize START textLen=${text.length} voices=${voiceIds.join(',')} format=${outputFormat} speed=${speed}`);

    const audio = synthesizeWithRetry(text, voiceIds, outputFormat, speed, apiKey, 2);

    log(`FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: formatFromOutputFormat(outputFormat),
      sampleRate: DEFAULT_SAMPLE_RATE,
    };
  },
};
