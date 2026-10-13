// Readloud TTS Plugin for LNReader
// Zero-authentication Amazon Polly / Ivona voice synthesis

var PLUGIN_ID = 'readloud-tts';
var PLUGIN_NAME = 'Readloud TTS';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "Eric",
    "name": "Eric - Male voice ( English / American )",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "Brian",
    "name": "Brian - Male voice ( English / British )",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "Ivy",
    "name": "Ivy - Child's girl voice ( English / American )",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "Joey",
    "name": "Joey - Male voice ( English / American )",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "Salli",
    "name": "Sally - Girl's voice ( English / American )",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "Giorgio",
    "name": "Giorgio - Voce maschile ( Italian )",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "Justin",
    "name": "Justin - Child's boy voice ( English / American )",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "Ricardo",
    "name": "Ricardo - Voz masculina ( Portuguese / Brazilian )",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "Jennifer",
    "name": "Jennifer - Female voice ( English / American )",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "Emma",
    "name": "Emma - Female voice ( English / British )",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "Kimberly",
    "name": "Kimberly - Female voice ( English / American )",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "Conchita",
    "name": "Conchita - Voz femenina ( Spanish / Castilian )",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "Amy",
    "name": "Amy - Female voice ( English / British )",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "Kendra",
    "name": "Kendra - Female voice ( English / American )",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "Russell",
    "name": "Russell - Male voice ( English / Australian )",
    "lang": "en-AU",
    "gender": "Male"
  },
  {
    "id": "Marlene",
    "name": "Marlene - Frauenstimme ( German )",
    "lang": "de-DE",
    "gender": "Male"
  },
  {
    "id": "Enrique",
    "name": "Enrique - Voz masculina ( Spanish / Castilian )",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "Skippy the Chipmunk",
    "name": "Skippy the Chipmunk - Funny toy voice ( English / American )",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "Geraint",
    "name": "Geraint - Male voice ( English / Welsh )",
    "lang": "cy-GB",
    "gender": "Male"
  },
  {
    "id": "Nicole",
    "name": "Nicole - Female voice ( English / Australian )",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "Carla",
    "name": "Carla - Voce femminile ( Italian )",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "Gwyneth",
    "name": "Gwyneth - Female voice ( English / Welsh )",
    "lang": "cy-GB",
    "gender": "Female"
  },
  {
    "id": "Ruben",
    "name": "Ruben - Mannelijke stem ( Dutch )",
    "lang": "nl-NL",
    "gender": "Male"
  },
  {
    "id": "Hans",
    "name": "Hans - Männerstimme ( German )",
    "lang": "de-DE",
    "gender": "Male"
  },
  {
    "id": "Mathieu",
    "name": "Mathieu - Voix masculine ( French )",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "Cristiano",
    "name": "Cristiano - Voz masculina ( Portuguese )",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "Astrid",
    "name": "Astrid - Kvinnlig röst ( Swedish )",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "Tatyana",
    "name": "Татьяна - Женский голос ( Russian )",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "Mads",
    "name": "Mads - Mandlig stemme ( Danish )",
    "lang": "da-DK",
    "gender": "Male"
  },
  {
    "id": "Chantal",
    "name": "Chantal - Voix de femme ( French / Canadian )",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "Filiz",
    "name": "Filiz - Kadın sesi ( Turkish )",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "Naja",
    "name": "Naja - Kvinde stemme ( Danish )",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "Liv",
    "name": "Liv - Kvinne stemme ( Norwegian )",
    "lang": "no-NO",
    "gender": "Female"
  },
  {
    "id": "Lotte",
    "name": "Lotte - Vrouwelijke stem ( Dutch )",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "Jan",
    "name": "Jan - Męski głos ( Polish )",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "Jacek",
    "name": "Jacek - Męski głos ( Polish )",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "Agnieszka",
    "name": "Agnieszka - Kobiecy głos ( Polish )",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "Karl",
    "name": "Karl - Male rödd ( Icelandic )",
    "lang": "is-IS",
    "gender": "Male"
  },
  {
    "id": "Ewa",
    "name": "Ewa - Kobiecy głos ( Polish )",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "Maja",
    "name": "Maja - Kobiecy głos ( Polish )",
    "lang": "pl-PL",
    "gender": "Female"
  }
];

var DEFAULT_VOICE = 'Brian';

var configSchema = {
  voice: {
    title: 'Voice',
    description: 'Select speech synthesis voice',
    type: 'string',
    enum: VOICES.map(function(v) { return v.id; }),
    default: DEFAULT_VOICE
  },
  speed: {
    title: 'Speed (-10 to 10)',
    description: 'Voice speed adjustment (default: 0)',
    type: 'number',
    default: 0
  },
  pitch: {
    title: 'Pitch (-10 to 10)',
    description: 'Voice pitch adjustment (default: 0)',
    type: 'number',
    default: 0
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
  var speedVal = options && typeof options.speed === 'number' ? Math.round(options.speed) : 0;
  var pitchVal = options && typeof options.pitch === 'number' ? Math.round(options.pitch) : 0;

  speedVal = Math.min(Math.max(speedVal, -10), 10);
  pitchVal = Math.min(Math.max(pitchVal, -10), 10);

  var bodyParams = new URLSearchParams({
    but1: text,
    fruits: voiceId,
    butS: speedVal.toString(),
    butP: pitchVal.toString(),
    butPauses: '0',
    butt0: 'Listen'
  });

  var postHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Origin': 'https://readloud.net',
    'Referer': 'https://readloud.net/'
  };

  var response = await fetch('https://readloud.net/', {
    method: 'POST',
    headers: postHeaders,
    body: bodyParams.toString()
  });

  if (!response.ok) {
    var errText = await response.text().catch(function() { return ''; });
    throw new Error('Readloud request failed: HTTP ' + response.status + ' ' + response.statusText + ' ' + errText);
  }

  var html = await response.text();
  var match = html.match(/['"](\/tmp\/[^'"]+\.mp3)['"]/i);

  if (!match || !match[1]) {
    throw new Error('Failed to parse generated audio URL from Readloud response');
  }

  var audioPath = match[1];
  var audioUrl = 'https://readloud.net' + audioPath;

  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'Referer': 'https://readloud.net/'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Failed to download audio from Readloud: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Readloud returned empty audio buffer');
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

  throw lastError || new Error('Readloud synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free Amazon Polly / Ivona TTS via readloud.net with 40 voices across 18 languages. No API key required. Returns MP3 audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 2000,
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
