// ChatTTS (2Noise) Plugin for LNReader
// Zero-authentication open-weight conversational TTS via Hugging Face Space (rainnee/ChatTTS)
// State-of-the-art conversational prosody, natural pauses, and expressive speech.

var PLUGIN_ID = 'chattts-tts';
var PLUGIN_NAME = 'ChatTTS (Free Conversational)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "2",
    "name": "ChatTTS Voice 1 (Seed 2 - Conversational)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "42",
    "name": "ChatTTS Voice 2 (Seed 42 - Balanced)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "100",
    "name": "ChatTTS Voice 3 (Seed 100 - Deep)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "500",
    "name": "ChatTTS Voice 4 (Seed 500 - Storyteller)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "1000",
    "name": "ChatTTS Voice 5 (Seed 1000 - Friendly)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "2222",
    "name": "ChatTTS Voice 6 (Seed 2222 - Casual)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "3333",
    "name": "ChatTTS Voice 7 (Seed 3333 - Narrative)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "5555",
    "name": "ChatTTS Voice 8 (Seed 5555 - Neutral)",
    "lang": "en-US",
    "gender": "Female"
  }
];

var configSchema = [
  {
    key: 'voice',
    label: 'Voice / Speaker Seed',
    type: 'select',
    default: '2',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
  },
  {
    key: 'temperature',
    label: 'Audio Temperature (Variability)',
    type: 'select',
    default: '0.3',
    options: [
      { label: 'Low Variability (0.1)', value: '0.1' },
      { label: 'Standard (0.3)', value: '0.3' },
      { label: 'Expressive (0.5)', value: '0.5' }
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
  var seedVal = 2;
  if (options.voice) {
    var parsedSeed = parseInt(options.voice, 10);
    if (!isNaN(parsedSeed)) {
      seedVal = parsedSeed;
    }
  }

  var tempVal = 0.3;
  if (options.temperature) {
    var parsedTemp = parseFloat(options.temperature);
    if (!isNaN(parsedTemp)) {
      tempVal = parsedTemp;
    }
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 400) {
    cleanText = cleanText.substring(0, 400);
  }

  var spaceBase = 'https://rainnee-chattts.hf.space';
  var sessionHash = 'sess_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  // 1. Submit prediction job via Gradio 4 queue/join endpoint
  var joinUrl = spaceBase + '/queue/join';
  var payload = {
    data: [
      cleanText,
      tempVal,
      0.7,   // top_p
      20,    // top_k
      seedVal,
      42,    // text seed
      false  // refine text (faster)
    ],
    fn_index: 2,
    session_hash: sessionHash
  };

  var joinResp = await fetch(joinUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    },
    body: JSON.stringify(payload)
  });

  if (!joinResp.ok) {
    throw new Error('ChatTTS queue submission failed: HTTP ' + joinResp.status);
  }

  // 2. Poll SSE queue stream until process_completed
  var sseUrl = spaceBase + '/queue/data?session_hash=' + sessionHash;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('ChatTTS SSE stream failed: HTTP ' + sseResp.status);
  }

  var sseText = await sseResp.text();
  var audioUrl = null;
  var lines = sseText.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf('data:') === 0) {
      try {
        var ev = JSON.parse(line.substring(5).trim());
        if (ev.msg === 'process_completed' && ev.output && Array.isArray(ev.output.data) && ev.output.data.length > 0) {
          var audioObj = ev.output.data[0];
          if (typeof audioObj === 'string') {
            audioUrl = audioObj;
          } else if (audioObj && audioObj.url) {
            audioUrl = audioObj.url;
          } else if (audioObj && audioObj.path) {
            audioUrl = spaceBase + '/file=' + audioObj.path;
          }
          break;
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not parse audio output from ChatTTS queue: ' + sseText.slice(0, 300));
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('ChatTTS audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('ChatTTS returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'wav',
    sampleRate: 24000
  };
}

async function synthesizeWithRetry(text, options, maxRetries) {
  if (maxRetries === undefined) maxRetries = 2;
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
        await sleep(attempt * 1500);
      }
    }
  }

  throw lastError || new Error('ChatTTS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free open-weight conversational neural TTS (2Noise ChatTTS) via Hugging Face Space. Unmatched conversational prosody, natural cadence, and expressive speech. Returns WAV audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 400,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 10,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 2);
  }
};
