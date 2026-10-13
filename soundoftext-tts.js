// Sound of Text Free TTS plugin for LNReader React Native JS runtime.
// Uses api.soundoftext.com to access 60+ Google Translate neural voice languages.
// No API key required. Returns MP3 audio at 24 kHz.
// Runs on the JS thread; the app handles parallel chunk synthesis.

const API_BASE_URL = 'https://api.soundoftext.com/sounds';
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const POLL_INTERVAL_MS = 600;
const POLL_TIMEOUT_MS = 15000;

const VOICES = [
  {
    "id": "af-ZA",
    "name": "Afrikaans (af-ZA)",
    "languages": [
      "af"
    ]
  },
  {
    "id": "sq",
    "name": "Albanian (sq)",
    "languages": [
      "sq"
    ]
  },
  {
    "id": "ar-AE",
    "name": "Arabic (ar-AE)",
    "languages": [
      "ar"
    ]
  },
  {
    "id": "hy",
    "name": "Armenian (hy)",
    "languages": [
      "hy"
    ]
  },
  {
    "id": "bn-BD",
    "name": "Bengali (Bangladesh) (bn-BD)",
    "languages": [
      "bn"
    ]
  },
  {
    "id": "bn-IN",
    "name": "Bengali (India) (bn-IN)",
    "languages": [
      "bn"
    ]
  },
  {
    "id": "bs",
    "name": "Bosnian (bs)",
    "languages": [
      "bs"
    ]
  },
  {
    "id": "my",
    "name": "Burmese (Myanmar) (my)",
    "languages": [
      "my"
    ]
  },
  {
    "id": "ca-ES",
    "name": "Catalan (ca-ES)",
    "languages": [
      "ca"
    ]
  },
  {
    "id": "cmn-Hant-TW",
    "name": "Chinese (cmn-Hant-TW)",
    "languages": [
      "cmn"
    ]
  },
  {
    "id": "hr-HR",
    "name": "Croatian (hr-HR)",
    "languages": [
      "hr"
    ]
  },
  {
    "id": "cs-CZ",
    "name": "Czech (cs-CZ)",
    "languages": [
      "cs"
    ]
  },
  {
    "id": "da-DK",
    "name": "Danish (da-DK)",
    "languages": [
      "da"
    ]
  },
  {
    "id": "nl-NL",
    "name": "Dutch (nl-NL)",
    "languages": [
      "nl"
    ]
  },
  {
    "id": "en-AU",
    "name": "English (Australia) (en-AU)",
    "languages": [
      "en"
    ]
  },
  {
    "id": "en-GB",
    "name": "English (United Kingdom) (en-GB)",
    "languages": [
      "en"
    ]
  },
  {
    "id": "en-US",
    "name": "English (United States) (en-US)",
    "languages": [
      "en"
    ]
  },
  {
    "id": "eo",
    "name": "Esperanto (eo)",
    "languages": [
      "eo"
    ]
  },
  {
    "id": "et",
    "name": "Estonian (et)",
    "languages": [
      "et"
    ]
  },
  {
    "id": "fil-PH",
    "name": "Filipino (fil-PH)",
    "languages": [
      "fil"
    ]
  },
  {
    "id": "fi-FI",
    "name": "Finnish (fi-FI)",
    "languages": [
      "fi"
    ]
  },
  {
    "id": "fr-FR",
    "name": "French (fr-FR)",
    "languages": [
      "fr"
    ]
  },
  {
    "id": "fr-CA",
    "name": "French (Canada) (fr-CA)",
    "languages": [
      "fr"
    ]
  },
  {
    "id": "de-DE",
    "name": "German (de-DE)",
    "languages": [
      "de"
    ]
  },
  {
    "id": "el-GR",
    "name": "Greek (el-GR)",
    "languages": [
      "el"
    ]
  },
  {
    "id": "gu",
    "name": "Gujarati (gu)",
    "languages": [
      "gu"
    ]
  },
  {
    "id": "hi-IN",
    "name": "Hindi (hi-IN)",
    "languages": [
      "hi"
    ]
  },
  {
    "id": "hu-HU",
    "name": "Hungarian (hu-HU)",
    "languages": [
      "hu"
    ]
  },
  {
    "id": "is-IS",
    "name": "Icelandic (is-IS)",
    "languages": [
      "is"
    ]
  },
  {
    "id": "id-ID",
    "name": "Indonesian (id-ID)",
    "languages": [
      "id"
    ]
  },
  {
    "id": "it-IT",
    "name": "Italian (it-IT)",
    "languages": [
      "it"
    ]
  },
  {
    "id": "ja-JP",
    "name": "Japanese (Japan) (ja-JP)",
    "languages": [
      "ja"
    ]
  },
  {
    "id": "kn",
    "name": "Kannada (kn)",
    "languages": [
      "kn"
    ]
  },
  {
    "id": "km",
    "name": "Khmer (km)",
    "languages": [
      "km"
    ]
  },
  {
    "id": "ko-KR",
    "name": "Korean (ko-KR)",
    "languages": [
      "ko"
    ]
  },
  {
    "id": "la",
    "name": "Latin (la)",
    "languages": [
      "la"
    ]
  },
  {
    "id": "lv",
    "name": "Latvian (lv)",
    "languages": [
      "lv"
    ]
  },
  {
    "id": "mk",
    "name": "Macedonian (mk)",
    "languages": [
      "mk"
    ]
  },
  {
    "id": "ml",
    "name": "Malayalam (ml)",
    "languages": [
      "ml"
    ]
  },
  {
    "id": "mr",
    "name": "Marathi (mr)",
    "languages": [
      "mr"
    ]
  },
  {
    "id": "ne",
    "name": "Nepali (ne)",
    "languages": [
      "ne"
    ]
  },
  {
    "id": "nb-NO",
    "name": "Norwegian (nb-NO)",
    "languages": [
      "nb"
    ]
  },
  {
    "id": "pl-PL",
    "name": "Polish (pl-PL)",
    "languages": [
      "pl"
    ]
  },
  {
    "id": "pt-BR",
    "name": "Portuguese (pt-BR)",
    "languages": [
      "pt"
    ]
  },
  {
    "id": "ro-RO",
    "name": "Romanian (ro-RO)",
    "languages": [
      "ro"
    ]
  },
  {
    "id": "ru-RU",
    "name": "Russian (ru-RU)",
    "languages": [
      "ru"
    ]
  },
  {
    "id": "sr-RS",
    "name": "Serbian (sr-RS)",
    "languages": [
      "sr"
    ]
  },
  {
    "id": "si",
    "name": "Sinhala (si)",
    "languages": [
      "si"
    ]
  },
  {
    "id": "sk-SK",
    "name": "Slovak (sk-SK)",
    "languages": [
      "sk"
    ]
  },
  {
    "id": "es-MX",
    "name": "Spanish (Mexico) (es-MX)",
    "languages": [
      "es"
    ]
  },
  {
    "id": "es-ES",
    "name": "Spanish (Spain) (es-ES)",
    "languages": [
      "es"
    ]
  },
  {
    "id": "sw",
    "name": "Swahili (sw)",
    "languages": [
      "sw"
    ]
  },
  {
    "id": "sv-SE",
    "name": "Swedish (sv-SE)",
    "languages": [
      "sv"
    ]
  },
  {
    "id": "ta",
    "name": "Tamil (ta)",
    "languages": [
      "ta"
    ]
  },
  {
    "id": "te",
    "name": "Telugu (te)",
    "languages": [
      "te"
    ]
  },
  {
    "id": "th-TH",
    "name": "Thai (th-TH)",
    "languages": [
      "th"
    ]
  },
  {
    "id": "tr-TR",
    "name": "Turkish (tr-TR)",
    "languages": [
      "tr"
    ]
  },
  {
    "id": "uk-UA",
    "name": "Ukrainian (uk-UA)",
    "languages": [
      "uk"
    ]
  },
  {
    "id": "ur",
    "name": "Urdu (ur)",
    "languages": [
      "ur"
    ]
  },
  {
    "id": "vi-VN",
    "name": "Vietnamese (vi-VN)",
    "languages": [
      "vi"
    ]
  },
  {
    "id": "cy",
    "name": "Welsh (cy)",
    "languages": [
      "cy"
    ]
  }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildHeaders() {
  return {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': BROWSER_USER_AGENT,
  };
}

async function downloadAudio(audioUrl) {
  const resp = await fetch(audioUrl, {
    method: 'GET',
    headers: { 'User-Agent': BROWSER_USER_AGENT },
  });
  if (!resp.ok) {
    throw new Error(`[SoundOfText] Audio download HTTP ${resp.status}`);
  }
  return new Uint8Array(await resp.arrayBuffer());
}

async function submitSpeech(text, voice) {
  const payload = JSON.stringify({
    engine: 'Google',
    data: {
      text: text,
      voice: voice,
    },
  });

  const resp = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: buildHeaders(),
    body: payload,
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`[SoundOfText] Submit HTTP ${resp.status}: ${errText.slice(0, 120)}`);
  }

  const data = await resp.json();
  if (!data || !data.success || !data.id) {
    throw new Error('[SoundOfText] Submit returned no task id');
  }
  return data.id;
}

async function pollSpeech(soundId) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  const pollUrl = `${API_BASE_URL}/${soundId}`;

  while (Date.now() < deadline) {
    const resp = await fetch(pollUrl, {
      method: 'GET',
      headers: buildHeaders(),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`[SoundOfText] Poll HTTP ${resp.status}: ${errText.slice(0, 120)}`);
    }

    const data = await resp.json();
    if (data.status === 'Done' && data.location) {
      return data.location;
    }
    if (data.status === 'Error') {
      throw new Error(`[SoundOfText] Synthesis task error: ${data.message || 'unknown'}`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`[SoundOfText] Task ${soundId} timed out after ${POLL_TIMEOUT_MS}ms`);
}

async function synthesizeSingleRequest(text, voice) {
  console.log(`[SoundOfText] submit voice=${voice} textLen=${text.length}`);
  const soundId = await submitSpeech(text, voice);
  const audioUrl = await pollSpeech(soundId);
  console.log(`[SoundOfText] audio ready: ${audioUrl}`);
  return await downloadAudio(audioUrl);
}

async function synthesizeWithRetry(text, voice, maxRetries) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice);
    } catch (err) {
      lastErr = err;
      console.log(`[SoundOfText] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'soundoftext-tts',
  name: 'Sound of Text (Google)',
  version: '1.0.0',
  description:
    'Free Google Translate TTS via api.soundoftext.com with 60+ language accents. No API key required. Returns MP3 audio.',
  author: 'LNReader',
  url: 'soundoftext-tts.js',

  maxCharsPerRequest: 100,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 20,

  configSchema: [],

  getVoices: async function () {
    return VOICES.map(v => ({
      id: v.id,
      name: v.name,
      languages: v.languages,
    }));
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      console.log('[SoundOfText] SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const voice = (options && options.voiceId) || 'en-US';
    console.log(`[SoundOfText] synthesize START textLen=${text.length} voice=${voice}`);

    const audio = await synthesizeWithRetry(text, voice, 2);
    console.log(`[SoundOfText] FINAL audio=${audio.length} bytes`);

    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 24000,
    };
  },
};
