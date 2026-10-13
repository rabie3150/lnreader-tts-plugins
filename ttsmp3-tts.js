// TTSMP3 (Amazon Polly) Free TTS plugin for LNReader React Native JS runtime.
// Uses ttsmp3.com's public endpoint to access 60+ Amazon Polly voices.
// No API key required. Returns MP3 audio at 24 kHz.
// Runs on the JS thread; the app handles parallel chunk synthesis.

const ENDPOINT = 'https://ttsmp3.com/makemp3_new.php';
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const VOICES = [
  {
    "id": "Zeina",
    "name": "Arabic / Zeina",
    "languages": [
      "ar"
    ]
  },
  {
    "id": "Nicole",
    "name": "Australian English / Nicole",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Russell",
    "name": "Australian English / Russell",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Ricardo",
    "name": "Brazilian Portuguese / Ricardo",
    "languages": [
      "pt"
    ]
  },
  {
    "id": "Camila",
    "name": "Brazilian Portuguese / Camila",
    "languages": [
      "pt"
    ]
  },
  {
    "id": "Vitoria",
    "name": "Brazilian Portuguese / Vit\u00f3ria",
    "languages": [
      "pt"
    ]
  },
  {
    "id": "Brian",
    "name": "British English / Brian",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Amy",
    "name": "British English / Amy",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Emma",
    "name": "British English / Emma",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Chantal",
    "name": "Canadian French / Chantal",
    "languages": [
      "fr"
    ]
  },
  {
    "id": "Enrique",
    "name": "Castilian Spanish / Enrique",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Lucia",
    "name": "Castilian Spanish / Lucia",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Conchita",
    "name": "Castilian Spanish / Conchita",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Zhiyu",
    "name": "Chinese Mandarin / Zhiyu",
    "languages": [
      "zh"
    ]
  },
  {
    "id": "Naja",
    "name": "Danish / Naja",
    "languages": [
      "da"
    ]
  },
  {
    "id": "Mads",
    "name": "Danish / Mads",
    "languages": [
      "da"
    ]
  },
  {
    "id": "Ruben",
    "name": "Dutch / Ruben",
    "languages": [
      "nl"
    ]
  },
  {
    "id": "Lotte",
    "name": "Dutch / Lotte",
    "languages": [
      "nl"
    ]
  },
  {
    "id": "Mathieu",
    "name": "French / Mathieu",
    "languages": [
      "fr"
    ]
  },
  {
    "id": "Celine",
    "name": "French / C\u00e9line",
    "languages": [
      "fr"
    ]
  },
  {
    "id": "Lea",
    "name": "French / L\u00e9a",
    "languages": [
      "fr"
    ]
  },
  {
    "id": "Vicki",
    "name": "German / Vicki",
    "languages": [
      "de"
    ]
  },
  {
    "id": "Marlene",
    "name": "German / Marlene",
    "languages": [
      "de"
    ]
  },
  {
    "id": "Hans",
    "name": "German / Hans",
    "languages": [
      "de"
    ]
  },
  {
    "id": "Karl",
    "name": "Icelandic / Karl",
    "languages": [
      "is"
    ]
  },
  {
    "id": "Dora",
    "name": "Icelandic / D\u00f3ra",
    "languages": [
      "is"
    ]
  },
  {
    "id": "Aditi",
    "name": "Indian English / Aditi",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Raveena",
    "name": "Indian English / Raveena",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Giorgio",
    "name": "Italian / Giorgio",
    "languages": [
      "it"
    ]
  },
  {
    "id": "Carla",
    "name": "Italian / Carla",
    "languages": [
      "it"
    ]
  },
  {
    "id": "Bianca",
    "name": "Italian / Bianca",
    "languages": [
      "it"
    ]
  },
  {
    "id": "Takumi",
    "name": "Japanese / Takumi",
    "languages": [
      "ja"
    ]
  },
  {
    "id": "Mizuki",
    "name": "Japanese / Mizuki",
    "languages": [
      "ja"
    ]
  },
  {
    "id": "Seoyeon",
    "name": "Korean / Seoyeon",
    "languages": [
      "ko"
    ]
  },
  {
    "id": "Mia",
    "name": "Mexican Spanish / Mia",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Liv",
    "name": "Norwegian / Liv",
    "languages": [
      "no"
    ]
  },
  {
    "id": "Jan",
    "name": "Polish / Jan",
    "languages": [
      "pl"
    ]
  },
  {
    "id": "Maja",
    "name": "Polish / Maja",
    "languages": [
      "pl"
    ]
  },
  {
    "id": "Ewa",
    "name": "Polish / Ewa",
    "languages": [
      "pl"
    ]
  },
  {
    "id": "Jacek",
    "name": "Polish / Jacek",
    "languages": [
      "pl"
    ]
  },
  {
    "id": "Cristiano",
    "name": "Portuguese / Cristiano",
    "languages": [
      "pt"
    ]
  },
  {
    "id": "Ines",
    "name": "Portuguese / In\u00eas",
    "languages": [
      "pt"
    ]
  },
  {
    "id": "Carmen",
    "name": "Romanian / Carmen",
    "languages": [
      "ro"
    ]
  },
  {
    "id": "Tatyana",
    "name": "Russian / Tatyana",
    "languages": [
      "ru"
    ]
  },
  {
    "id": "Maxim",
    "name": "Russian / Maxim",
    "languages": [
      "ru"
    ]
  },
  {
    "id": "Astrid",
    "name": "Swedish / Astrid",
    "languages": [
      "sv"
    ]
  },
  {
    "id": "Filiz",
    "name": "Turkish / Filiz",
    "languages": [
      "tr"
    ]
  },
  {
    "id": "Kimberly",
    "name": "US English / Kimberly",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Ivy",
    "name": "US English / Ivy",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Kendra",
    "name": "US English / Kendra",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Justin",
    "name": "US English / Justin",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Joey",
    "name": "US English / Joey",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Matthew",
    "name": "US English / Matthew",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Salli",
    "name": "US English / Salli",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Joanna",
    "name": "US English / Joanna",
    "languages": [
      "en"
    ]
  },
  {
    "id": "Penelope",
    "name": "US Spanish / Pen\u00e9lope",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Lupe",
    "name": "US Spanish / Lupe",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Miguel",
    "name": "US Spanish / Miguel",
    "languages": [
      "es"
    ]
  },
  {
    "id": "Gwyneth",
    "name": "Welsh / Gwyneth",
    "languages": [
      "cy"
    ]
  },
  {
    "id": "Geraint",
    "name": "Welsh English / Geraint",
    "languages": [
      "en"
    ]
  }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildHeaders() {
  return {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': BROWSER_USER_AGENT,
    'Origin': 'https://ttsmp3.com',
    'Referer': 'https://ttsmp3.com/',
  };
}

async function downloadAudio(audioUrl) {
  const resp = await fetch(audioUrl, {
    method: 'GET',
    headers: { 'User-Agent': BROWSER_USER_AGENT },
  });
  if (!resp.ok) {
    throw new Error(`[TTSMP3] Audio download HTTP ${resp.status}`);
  }
  return new Uint8Array(await resp.arrayBuffer());
}

async function synthesizeSingleRequest(text, voice) {
  const body = 'msg=' + encodeURIComponent(text) + '&lang=' + encodeURIComponent(voice) + '&source=ttsmp3';

  console.log(`[TTSMP3] POST ${ENDPOINT} voice=${voice} textLen=${text.length}`);

  const resp = await fetch(ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(),
    body: body,
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`[TTSMP3] HTTP ${resp.status}: ${errText.slice(0, 120)}`);
  }

  const data = await resp.json();
  if (!data || data.Error !== 0 || !data.URL) {
    const msg = (data && (data.message || data.Text || data.Error)) || 'Unknown error';
    throw new Error(`[TTSMP3] API Error: ${msg}`);
  }

  console.log(`[TTSMP3] Audio generated: ${data.URL}`);
  return await downloadAudio(data.URL);
}

async function synthesizeWithRetry(text, voice, maxRetries) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice);
    } catch (err) {
      lastErr = err;
      console.log(`[TTSMP3] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'ttsmp3-tts',
  name: 'TTSMP3 (Amazon Polly)',
  version: '1.0.0',
  description:
    'Free Amazon Polly TTS via ttsmp3.com with 60+ natural voices across 20+ languages. No API key required. Returns MP3 audio.',
  author: 'LNReader',
  url: 'ttsmp3-tts.js',

  maxCharsPerRequest: 1000,
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
      console.log('[TTSMP3] SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const voice = (options && options.voiceId) || 'Matthew';
    console.log(`[TTSMP3] synthesize START textLen=${text.length} voice=${voice}`);

    const audio = await synthesizeWithRetry(text, voice, 2);
    console.log(`[TTSMP3] FINAL audio=${audio.length} bytes`);

    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 24000,
    };
  },
};
