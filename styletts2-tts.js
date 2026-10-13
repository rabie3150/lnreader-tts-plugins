// StyleTTS 2 Plugin for LNReader
// Zero-authentication open-weight neural speech synthesis via Hugging Face Space (Pendrokar/style-tts-2)
// High-fidelity diffusion-based speech synthesis with human-level prosody.

var PLUGIN_ID = 'styletts2-tts';
var PLUGIN_NAME = 'StyleTTS 2 (Free)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "f-us-1",
    "name": "StyleTTS 2 Female US 1 (f-us-1)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "f-us-2",
    "name": "StyleTTS 2 Female US 2 (f-us-2)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "f-us-3",
    "name": "StyleTTS 2 Female US 3 (f-us-3)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "f-us-4",
    "name": "StyleTTS 2 Female US 4 (f-us-4)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "m-us-1",
    "name": "StyleTTS 2 Male US 1 (m-us-1)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "m-us-2",
    "name": "StyleTTS 2 Male US 2 (m-us-2)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "m-us-3",
    "name": "StyleTTS 2 Male US 3 (m-us-3)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "m-us-4",
    "name": "StyleTTS 2 Male US 4 (m-us-4)",
    "lang": "en-US",
    "gender": "Male"
  }
];

var configSchema = [
  {
    key: 'voice',
    label: 'Voice / Speaker',
    type: 'select',
    default: 'f-us-1',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
  },
  {
    key: 'language',
    label: 'Target Language',
    type: 'select',
    default: 'en-us',
    options: [
      { label: 'English (US)', value: 'en-us' },
      { label: 'French (fr)', value: 'fr' },
      { label: 'German (de)', value: 'de' },
      { label: 'Spanish (es)', value: 'es' },
      { label: 'Italian (it)', value: 'it' },
      { label: 'Portuguese (pt)', value: 'pt' },
      { label: 'Russian (ru)', value: 'ru' },
      { label: 'Polish (pl)', value: 'pl' },
      { label: 'Czech (cs)', value: 'cs' },
      { label: 'Danish (da)', value: 'da' },
      { label: 'Dutch (nl)', value: 'nl' },
      { label: 'Estonian (et)', value: 'et' },
      { label: 'Finnish (fi)', value: 'fi' },
      { label: 'Greek (el)', value: 'el' },
      { label: 'Norwegian (no)', value: 'no' },
      { label: 'Slovenian (sl)', value: 'sl' },
      { label: 'Swedish (sv)', value: 'sv' },
      { label: 'Turkish (tr)', value: 'tr' },
      { label: 'Japanese (jb)', value: 'jb' }
    ]
  },
  {
    key: 'diffusionSteps',
    label: 'Diffusion Steps (Quality vs Speed)',
    type: 'select',
    default: '3',
    options: [
      { label: 'Fast (2 steps)', value: '2' },
      { label: 'Standard (3 steps)', value: '3' },
      { label: 'High Quality (5 steps)', value: '5' }
    ]
  }
];

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

function sanitizeText(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim();
}

async function doSynthesize(text, options) {
  options = options || {};
  var voice = options.voice || 'f-us-1';
  var lang = options.language || 'en-us';
  var steps = 3;
  if (options.diffusionSteps) {
    var parsedSteps = parseInt(options.diffusionSteps, 10);
    if (!isNaN(parsedSteps) && parsedSteps >= 1 && parsedSteps <= 10) {
      steps = parsedSteps;
    }
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 500) {
    cleanText = cleanText.substring(0, 500);
  }

  var spaceBase = 'https://pendrokar-style-tts-2.hf.space';

  // 1. Submit prediction job via Gradio 5 SSE endpoint
  var callUrl = spaceBase + '/gradio_api/call/synthesize';
  var payload = {
    data: [
      cleanText,
      voice,
      lang,
      steps
    ]
  };

  var callResp = await fetch(callUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    },
    body: JSON.stringify(payload)
  });

  if (!callResp.ok) {
    throw new Error('StyleTTS 2 submission failed: HTTP ' + callResp.status);
  }

  var callData = await callResp.json();
  var eventId = callData.event_id;
  if (!eventId) {
    throw new Error('StyleTTS 2 returned no event_id: ' + JSON.stringify(callData));
  }

  // 2. Stream SSE until complete event
  var sseUrl = spaceBase + '/gradio_api/call/synthesize/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('StyleTTS 2 SSE stream failed: HTTP ' + sseResp.status);
  }

  var sseText = await sseResp.text();
  var audioUrl = null;
  var lines = sseText.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf('data:') === 0) {
      try {
        var parsed = JSON.parse(line.substring(5).trim());
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
          var audioObj = parsed[0];
          if (audioObj.url) {
            audioUrl = audioObj.url;
          } else if (audioObj.path) {
            audioUrl = spaceBase + '/gradio_api/file=' + audioObj.path;
          }
          break;
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not parse audio URL from StyleTTS 2 SSE: ' + sseText.slice(0, 300));
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('StyleTTS 2 audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('StyleTTS 2 returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'wav',
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

  throw lastError || new Error('StyleTTS 2 synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free open-weight neural TTS (StyleTTS 2) via Hugging Face Space. Diffusion-based human-like prosody with 8 expressive US voices and 19 languages. Returns WAV audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 500,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 18,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
