// ResponsiveVoice TTS Plugin for LNReader
// Zero-authentication, multi-language speech synthesis engine

var PLUGIN_ID = 'responsivevoice-tts';
var PLUGIN_NAME = 'ResponsiveVoice TTS';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "Albanian Male",
    "name": "Albanian Male",
    "lang": "sq-AL",
    "gender": "Male"
  },
  {
    "id": "Arabic Female",
    "name": "Arabic Female",
    "lang": "ar-SA",
    "gender": "Female"
  },
  {
    "id": "Armenian Male",
    "name": "Armenian Male",
    "lang": "hy-AM",
    "gender": "Female"
  },
  {
    "id": "Australian Female",
    "name": "Australian Female",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "Australian Male",
    "name": "Australian Male",
    "lang": "en-AU",
    "gender": "Male"
  },
  {
    "id": "Bangla Bangladesh Female",
    "name": "Bangla Bangladesh Female",
    "lang": "bn-BD",
    "gender": "Female"
  },
  {
    "id": "Bangla Bangladesh Male",
    "name": "Bangla Bangladesh Male",
    "lang": "bn-BD",
    "gender": "Male"
  },
  {
    "id": "Bangla India Female",
    "name": "Bangla India Female",
    "lang": "bn-IN",
    "gender": "Female"
  },
  {
    "id": "Bangla India Male",
    "name": "Bangla India Male",
    "lang": "bn-IN",
    "gender": "Male"
  },
  {
    "id": "Bosnian Male",
    "name": "Bosnian Male",
    "lang": "bs",
    "gender": "Male"
  },
  {
    "id": "Brazilian Portuguese Female",
    "name": "Brazilian Portuguese Female",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "Catalan Male",
    "name": "Catalan Male",
    "lang": "ca-ES",
    "gender": "Male"
  },
  {
    "id": "Chinese (Hong Kong) Female",
    "name": "Chinese (Hong Kong) Female",
    "lang": "zh-HK",
    "gender": "Female"
  },
  {
    "id": "Chinese (Hong Kong) Male",
    "name": "Chinese (Hong Kong) Male",
    "lang": "zh-HK",
    "gender": "Male"
  },
  {
    "id": "Chinese Female",
    "name": "Chinese Female",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "Chinese Male",
    "name": "Chinese Male",
    "lang": "zh-CN",
    "gender": "Male"
  },
  {
    "id": "Chinese Taiwan Female",
    "name": "Chinese Taiwan Female",
    "lang": "zh-TW",
    "gender": "Female"
  },
  {
    "id": "Croatian Male",
    "name": "Croatian Male",
    "lang": "hr-HR",
    "gender": "Male"
  },
  {
    "id": "Czech Female",
    "name": "Czech Female",
    "lang": "cs-CZ",
    "gender": "Female"
  },
  {
    "id": "Danish Female",
    "name": "Danish Female",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "Deutsch Female",
    "name": "Deutsch Female",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "Deutsch Male",
    "name": "Deutsch Male",
    "lang": "de-DE",
    "gender": "Male"
  },
  {
    "id": "Dutch Female",
    "name": "Dutch Female",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "Dutch Male",
    "name": "Dutch Male",
    "lang": "nl-NL",
    "gender": "Male"
  },
  {
    "id": "Esperanto Male",
    "name": "Esperanto Male",
    "lang": "eo",
    "gender": "Male"
  },
  {
    "id": "Estonian Male",
    "name": "Estonian Male",
    "lang": "et-EE",
    "gender": "Male"
  },
  {
    "id": "Fallback UK Female",
    "name": "Fallback UK Female",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "Filipino Female",
    "name": "Filipino Female",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "French Canadian Female",
    "name": "French Canadian Female",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "French Female",
    "name": "French Female",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "French Male",
    "name": "French Male",
    "lang": "fr-FR",
    "gender": "Male"
  },
  {
    "id": "Greek Female",
    "name": "Greek Female",
    "lang": "el-GR",
    "gender": "Female"
  },
  {
    "id": "Hindi Female",
    "name": "Hindi Female",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "Hindi Male",
    "name": "Hindi Male",
    "lang": "hi-IN",
    "gender": "Male"
  },
  {
    "id": "Hungarian Female",
    "name": "Hungarian Female",
    "lang": "hu-HU",
    "gender": "Female"
  },
  {
    "id": "Indonesian Female",
    "name": "Indonesian Female",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "Indonesian Male",
    "name": "Indonesian Male",
    "lang": "id-ID",
    "gender": "Male"
  },
  {
    "id": "Italian Female",
    "name": "Italian Female",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "Italian Male",
    "name": "Italian Male",
    "lang": "it-IT",
    "gender": "Male"
  },
  {
    "id": "Japanese Female",
    "name": "Japanese Female",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "Japanese Male",
    "name": "Japanese Male",
    "lang": "ja-JP",
    "gender": "Male"
  },
  {
    "id": "Korean Female",
    "name": "Korean Female",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "Korean Male",
    "name": "Korean Male",
    "lang": "ko-KR",
    "gender": "Male"
  },
  {
    "id": "Latin Male",
    "name": "Latin Male",
    "lang": "la",
    "gender": "Male"
  },
  {
    "id": "Latvian Male",
    "name": "Latvian Male",
    "lang": "lv-LV",
    "gender": "Male"
  },
  {
    "id": "Macedonian Male",
    "name": "Macedonian Male",
    "lang": "mk-MK",
    "gender": "Male"
  },
  {
    "id": "Moldavian Female",
    "name": "Moldavian Female",
    "lang": "md",
    "gender": "Female"
  },
  {
    "id": "Montenegrin Male",
    "name": "Montenegrin Male",
    "lang": "me",
    "gender": "Male"
  },
  {
    "id": "Norwegian Female",
    "name": "Norwegian Female",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "Norwegian Male",
    "name": "Norwegian Male",
    "lang": "nb-NO",
    "gender": "Male"
  },
  {
    "id": "Polish Female",
    "name": "Polish Female",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "Polish Male",
    "name": "Polish Male",
    "lang": "pl-PL",
    "gender": "Male"
  },
  {
    "id": "Portuguese Female",
    "name": "Portuguese Female",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "Portuguese Male",
    "name": "Portuguese Male",
    "lang": "pt-BR",
    "gender": "Male"
  },
  {
    "id": "Romanian Female",
    "name": "Romanian Female",
    "lang": "ro-RO",
    "gender": "Female"
  },
  {
    "id": "Russian Female",
    "name": "Russian Female",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "Serbian Male",
    "name": "Serbian Male",
    "lang": "sr-RS",
    "gender": "Male"
  },
  {
    "id": "Sinhala",
    "name": "Sinhala",
    "lang": "si-LK",
    "gender": "Female"
  },
  {
    "id": "Spanish Female",
    "name": "Spanish Female",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "Spanish Latin American Female",
    "name": "Spanish Latin American Female",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "Swahili Male",
    "name": "Swahili Male",
    "lang": "sw-KE",
    "gender": "Male"
  },
  {
    "id": "Swedish Female",
    "name": "Swedish Female",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "Swedish Male",
    "name": "Swedish Male",
    "lang": "sv-SE",
    "gender": "Male"
  },
  {
    "id": "Tamil Female",
    "name": "Tamil Female",
    "lang": "hi-IN",
    "gender": "Male"
  },
  {
    "id": "Tamil Male",
    "name": "Tamil Male",
    "lang": "hi-IN",
    "gender": "Male"
  },
  {
    "id": "Thai Female",
    "name": "Thai Female",
    "lang": "th-TH",
    "gender": "Female"
  },
  {
    "id": "Turkish Female",
    "name": "Turkish Female",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "Turkish Male",
    "name": "Turkish Male",
    "lang": "tr-TR",
    "gender": "Male"
  },
  {
    "id": "UK English Male",
    "name": "UK English Male",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "US English Female",
    "name": "US English Female",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "US English Male",
    "name": "US English Male",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "Ukrainian Female",
    "name": "Ukrainian Female",
    "lang": "uk-UA",
    "gender": "Female"
  },
  {
    "id": "Vietnamese Female",
    "name": "Vietnamese Female",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "Vietnamese Male",
    "name": "Vietnamese Male",
    "lang": "vi-VN",
    "gender": "Male"
  },
  {
    "id": "Welsh Male",
    "name": "Welsh Male",
    "lang": "cy",
    "gender": "Male"
  }
];

// Lookup map for fast voice metadata access
var VOICE_MAP = {};
for (var i = 0; i < VOICES.length; i++) {
  VOICE_MAP[VOICES[i].id] = VOICES[i];
}

var DEFAULT_VOICE = 'US English Female';

var configSchema = {
  voice: {
    title: 'Voice',
    description: 'Select speech synthesis voice',
    type: 'string',
    enum: VOICES.map(function(v) { return v.id; }),
    default: DEFAULT_VOICE
  },
  pitch: {
    title: 'Pitch (0.1 - 1.0)',
    description: 'Voice pitch multiplier (default: 0.5)',
    type: 'number',
    default: 0.5
  },
  rate: {
    title: 'Speed / Rate (0.1 - 1.0)',
    description: 'Speech speed multiplier (default: 0.5)',
    type: 'number',
    default: 0.5
  }
};

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

function hasSpeakableText(text) {
  return /[\p{L}\p{N}]/u.test(text);
}

async function doSynthesize(text, options) {
  if (!text || !hasSpeakableText(text)) {
    throw new Error('No speakable text');
  }

  var voiceId = (options && options.voice) || DEFAULT_VOICE;
  var voiceMeta = VOICE_MAP[voiceId] || VOICE_MAP[DEFAULT_VOICE] || { lang: 'en-US', gender: 'Female' };
  
  var genderParam = voiceMeta.gender === 'Female' ? 'f' : 'm';
  var langParam = voiceMeta.lang || 'en-US';
  
  var pitchVal = options && typeof options.pitch === 'number' ? options.pitch : 0.5;
  var rateVal = options && typeof options.rate === 'number' ? options.rate : 0.5;
  
  // Clamp values to safe 0.1 - 1.0 range
  pitchVal = Math.min(Math.max(pitchVal, 0.1), 1.0);
  rateVal = Math.min(Math.max(rateVal, 0.1), 1.0);

  var queryParams = new URLSearchParams({
    t: text,
    tl: langParam,
    sv: 'g1',
    vn: '',
    pitch: pitchVal.toString(),
    rate: rateVal.toString(),
    vol: '1',
    gender: genderParam,
    key: 'FQ9r4hgY'
  });

  var url = 'https://code.responsivevoice.org/getvoice.php?' + queryParams.toString();

  var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Referer': 'https://responsivevoice.org/'
  };

  var response = await fetch(url, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    var errText = await response.text().catch(function() { return ''; });
    throw new Error('ResponsiveVoice synthesis failed: HTTP ' + response.status + ' ' + response.statusText + ' ' + errText);
  }

  var arrayBuffer = await response.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('ResponsiveVoice returned empty audio data');
  }

  return {
    audioContent: arrayBuffer,
    format: 'mp3',
    sampleRate: 24000
  };
}

async function synthesizeWithRetry(text, options, maxRetries) {
  if (maxRetries === undefined) maxRetries = 3;
  var lastError = null;

  for (var attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await doSynthesize(text, options);
    } catch (err) {
      lastError = err;
      if (err && err.message === 'No speakable text') {
        throw err;
      }
      console.warn('[' + PLUGIN_ID + '] Synthesis attempt ' + attempt + ' failed: ' + (err ? err.message : String(err)));
      if (attempt < maxRetries) {
        await sleep(attempt * 1000);
      }
    }
  }

  throw lastError || new Error('ResponsiveVoice synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free multilingual text-to-speech using ResponsiveVoice without login. Supports 75+ voices across 40+ languages. Returns MP3 audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 1000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 18,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
