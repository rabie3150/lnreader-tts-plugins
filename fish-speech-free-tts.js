// Fish Audio (Fish Speech) Plugin for LNReader
// Zero-authentication open-weight neural speech synthesis via Hugging Face Space (pineconeT94/Fish-Speech)
// Dual-transformer autoregressive speech synthesis with studio fidelity.

var PLUGIN_ID = 'fish-speech-free-tts';
var PLUGIN_NAME = 'Fish Audio (Free 44.1kHz)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  { "id": "0", "name": "Fish Speech Neutral (Seed 0)", "lang": "en-US", "gender": "Male" },
  { "id": "42", "name": "Fish Speech Storyteller (Seed 42)", "lang": "en-US", "gender": "Female" },
  { "id": "100", "name": "Fish Speech Conversational (Seed 100)", "lang": "en-US", "gender": "Male" },
  { "id": "500", "name": "Fish Speech Dynamic (Seed 500)", "lang": "en-US", "gender": "Female" },
  { "id": "1000", "name": "Fish Speech Deep Resonance (Seed 1000)", "lang": "en-US", "gender": "Male" },
  { "id": "2024", "name": "Fish Speech Articulate (Seed 2024)", "lang": "en-US", "gender": "Female" },
  { "id": "3333", "name": "Fish Speech Friendly (Seed 3333)", "lang": "en-US", "gender": "Male" },
  { "id": "7777", "name": "Fish Speech Dramatic (Seed 7777)", "lang": "en-US", "gender": "Male" }
];

var configSchema = [
  {
    key: 'voice',
    label: 'Voice / Speaker Seed',
    type: 'select',
    default: '0',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
  },
  {
    key: 'temperature',
    label: 'Temperature (Expressiveness)',
    type: 'select',
    default: '0.7',
    options: [
      { label: 'Stable (0.5)', value: '0.5' },
      { label: 'Balanced (0.7)', value: '0.7' },
      { label: 'Expressive (0.9)', value: '0.9' }
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
  var seed = options.voice || '0';
  var temp = 0.7;
  if (options.temperature) {
    var parsedTemp = parseFloat(options.temperature);
    if (!isNaN(parsedTemp)) {
      temp = parsedTemp;
    }
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 500) {
    cleanText = cleanText.substring(0, 500);
  }

  var spaceBase = 'https://pineconet94-fish-speech.hf.space';

  // 1. Submit prediction job via Gradio 5 SSE endpoint
  var callUrl = spaceBase + '/gradio_api/call/inference_wrapper';
  var payload = {
    data: [
      cleanText,
      false,  // enable reference audio
      null,   // reference audio
      '',     // reference text
      0,      // max tokens per batch (0 = no limit)
      200,    // iterative prompt length
      0.7,    // top_p
      1.2,    // repetition penalty
      temp,   // temperature
      String(seed),
      1       // batch infer nums
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
    throw new Error('Fish Speech submission failed: HTTP ' + callResp.status);
  }

  var callData = await callResp.json();
  var eventId = callData.event_id;
  if (!eventId) {
    throw new Error('Fish Speech returned no event_id: ' + JSON.stringify(callData));
  }

  // 2. Stream SSE until completion event
  var sseUrl = spaceBase + '/gradio_api/call/inference_wrapper/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('Fish Speech SSE stream failed: HTTP ' + sseResp.status);
  }

  var sseText = await sseResp.text();
  var audioUrl = null;
  var lines = sseText.split('\n');

  for (var i = lines.length - 1; i >= 0; i--) {
    var line = lines[i].trim();
    if (line.indexOf('data:') === 0) {
      try {
        var parsed = JSON.parse(line.substring(5).trim());
        if (Array.isArray(parsed) && parsed.length > 1 && parsed[1]) {
          var audioItem = parsed[1];
          var val = audioItem.value || audioItem;
          if (val.path) {
            audioUrl = spaceBase + '/gradio_api/file=' + val.path;
            break;
          } else if (val.url) {
            audioUrl = val.url.replace('/gradio_api/gradio_api/', '/gradio_api/');
            break;
          }
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not parse audio output from Fish Speech SSE: ' + sseText.slice(-300));
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Fish Speech audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Fish Speech returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'wav',
    sampleRate: 44100
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

  throw lastError || new Error('Fish Speech synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free open-weight neural TTS (Fish Audio / Fish Speech) via Hugging Face Space. High-fidelity dual-transformer architecture with 8 expressive voice seeds. Returns 44.1 kHz WAV.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 500,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 15,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
