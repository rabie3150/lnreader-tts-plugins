// Kokoro Free TTS (Kokoro-82M) Plugin for LNReader
// Zero-authentication open-weight neural speech synthesis via Hugging Face Space (RobinsAIWorld/Kokoro-TTS-cpu)
// No API key required. High fidelity 82M parameter neural TTS.

var PLUGIN_ID = 'kokoro-free-tts';
var PLUGIN_NAME = 'Kokoro TTS (Free 82M)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "af_heart",
    "name": "Kokoro Heart \u2764\ufe0f (af_heart)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_bella",
    "name": "Kokoro Bella \ud83d\udd25 (af_bella)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_nicole",
    "name": "Kokoro Nicole \ud83c\udfa7 (af_nicole)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_aoede",
    "name": "Kokoro Aoede (af_aoede)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_kore",
    "name": "Kokoro Kore (af_kore)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_sarah",
    "name": "Kokoro Sarah (af_sarah)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_nova",
    "name": "Kokoro Nova (af_nova)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_sky",
    "name": "Kokoro Sky (af_sky)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_alloy",
    "name": "Kokoro Alloy (af_alloy)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_jessica",
    "name": "Kokoro Jessica (af_jessica)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "af_river",
    "name": "Kokoro River (af_river)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "am_michael",
    "name": "Kokoro Michael (am_michael)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_fenrir",
    "name": "Kokoro Fenrir (am_fenrir)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_puck",
    "name": "Kokoro Puck (am_puck)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_echo",
    "name": "Kokoro Echo (am_echo)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_eric",
    "name": "Kokoro Eric (am_eric)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_liam",
    "name": "Kokoro Liam (am_liam)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_onyx",
    "name": "Kokoro Onyx (am_onyx)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_santa",
    "name": "Kokoro Santa (am_santa)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "am_adam",
    "name": "Kokoro Adam (am_adam)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "bf_emma",
    "name": "Kokoro Emma (bf_emma)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "bf_isabella",
    "name": "Kokoro Isabella (bf_isabella)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "bf_alice",
    "name": "Kokoro Alice (bf_alice)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "bf_lily",
    "name": "Kokoro Lily (bf_lily)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "bm_george",
    "name": "Kokoro George (bm_george)",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "bm_fable",
    "name": "Kokoro Fable (bm_fable)",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "bm_lewis",
    "name": "Kokoro Lewis (bm_lewis)",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "bm_daniel",
    "name": "Kokoro Daniel (bm_daniel)",
    "lang": "en-GB",
    "gender": "Male"
  }
];

var configSchema = [
  {
    key: 'defaultVoice',
    label: 'Default Voice',
    type: 'select',
    defaultValue: 'af_heart',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
  },
  {
    key: 'speed',
    label: 'Speech Speed (0.5 - 2.0)',
    type: 'select',
    defaultValue: '1.0',
    options: [
      { label: '0.75x', value: '0.75' },
      { label: '0.9x', value: '0.9' },
      { label: '1.0x (Normal)', value: '1.0' },
      { label: '1.1x', value: '1.1' },
      { label: '1.25x', value: '1.25' },
      { label: '1.5x', value: '1.5' }
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
  var voice = options.voice || 'af_heart';
  var speedVal = 1.0;
  if (options.speed !== undefined && options.speed !== null) {
    var parsed = parseFloat(options.speed);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
      speedVal = parsed;
    }
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  // Kokoro limit is ~500 chars per call
  if (cleanText.length > 500) {
    cleanText = cleanText.substring(0, 500);
  }

  var spaceBase = 'https://robinsaiworld-kokoro-tts-cpu.hf.space';

  // 1. Submit prediction job via Gradio 5 SSE endpoint
  var callUrl = spaceBase + '/gradio_api/call/predict';
  var payload = {
    data: [
      cleanText,
      voice,
      speedVal
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
    throw new Error('Kokoro TTS submission failed: HTTP ' + callResp.status);
  }

  var callData = await callResp.json();
  var eventId = callData.event_id;
  if (!eventId) {
    throw new Error('Kokoro TTS returned no event_id: ' + JSON.stringify(callData));
  }

  // 2. Stream SSE until complete event
  var sseUrl = spaceBase + '/gradio_api/call/predict/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('Kokoro TTS SSE stream failed: HTTP ' + sseResp.status);
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
    throw new Error('Could not parse audio URL from Kokoro SSE: ' + sseText.slice(0, 300));
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Kokoro audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Kokoro returned empty audio buffer');
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

  throw lastError || new Error('Kokoro TTS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free open-weight neural TTS (Kokoro-82M) via Hugging Face Space. High-quality human-like prosody with 28 expressive American & British voices. Returns WAV audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 500,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 20,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
