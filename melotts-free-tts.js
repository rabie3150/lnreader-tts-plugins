// MeloTTS (MyShell AI) Plugin for LNReader
// Zero-authentication open-weight multilingual speech synthesis via Hugging Face Space (sumittechmero/MeloTTS)
// High-speed, natural prosody, and multiple native regional accents.

var PLUGIN_ID = 'melotts-free-tts';
var PLUGIN_NAME = 'MeloTTS (Free Multilingual)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  { "id": "EN-Default", "name": "English (Default Accent)", "lang": "en-US", "gender": "Female", "melo_lang": "EN" },
  { "id": "EN-US", "name": "English (American Accent)", "lang": "en-US", "gender": "Female", "melo_lang": "EN" },
  { "id": "EN-BR", "name": "English (British Accent)", "lang": "en-GB", "gender": "Female", "melo_lang": "EN" },
  { "id": "EN-AU", "name": "English (Australian Accent)", "lang": "en-AU", "gender": "Female", "melo_lang": "EN" },
  { "id": "EN_INDIA", "name": "English (Indian Accent)", "lang": "en-IN", "gender": "Female", "melo_lang": "EN" },
  { "id": "ES", "name": "Spanish (Castilian)", "lang": "es-ES", "gender": "Female", "melo_lang": "ES" },
  { "id": "FR", "name": "French", "lang": "fr-FR", "gender": "Female", "melo_lang": "FR" },
  { "id": "ZH", "name": "Chinese (Mandarin)", "lang": "zh-CN", "gender": "Female", "melo_lang": "ZH" },
  { "id": "JP", "name": "Japanese", "lang": "ja-JP", "gender": "Female", "melo_lang": "JP" },
  { "id": "KR", "name": "Korean", "lang": "ko-KR", "gender": "Female", "melo_lang": "KR" }
];

var configSchema = [
  {
    key: 'voice',
    label: 'Voice / Regional Accent',
    type: 'select',
    default: 'EN-Default',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
  },
  {
    key: 'speed',
    label: 'Speech Speed',
    type: 'select',
    default: '1.0',
    options: [
      { label: '0.8x (Slower)', value: '0.8' },
      { label: '1.0x (Normal)', value: '1.0' },
      { label: '1.2x (Faster)', value: '1.2' },
      { label: '1.5x (Fast)', value: '1.5' }
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
  var voiceId = options.voice || 'EN-Default';
  var speedVal = 1.0;
  if (options.speed !== undefined && options.speed !== null) {
    var parsedSpeed = parseFloat(options.speed);
    if (!isNaN(parsedSpeed) && parsedSpeed >= 0.5 && parsedSpeed <= 2.0) {
      speedVal = parsedSpeed;
    }
  }

  // Find matching melo_lang parameter
  var meloLang = 'EN';
  for (var i = 0; i < VOICES.length; i++) {
    if (VOICES[i].id === voiceId) {
      meloLang = VOICES[i].melo_lang;
      break;
    }
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 500) {
    cleanText = cleanText.substring(0, 500);
  }

  var spaceBase = 'https://sumittechmero-melotts.hf.space';

  // 1. Submit prediction job via Gradio 4 call endpoint
  var callUrl = spaceBase + '/call/synthesize';
  var payload = {
    data: [
      cleanText,
      voiceId,
      speedVal,
      meloLang
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
    throw new Error('MeloTTS submission failed: HTTP ' + callResp.status);
  }

  var callData = await callResp.json();
  var eventId = callData.event_id;
  if (!eventId) {
    throw new Error('MeloTTS returned no event_id: ' + JSON.stringify(callData));
  }

  // 2. Stream SSE until completion event
  var sseUrl = spaceBase + '/call/synthesize/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('MeloTTS SSE stream failed: HTTP ' + sseResp.status);
  }

  var sseText = await sseResp.text();
  var audioUrl = null;
  var lines = sseText.split('\n');

  for (var j = lines.length - 1; j >= 0; j--) {
    var line = lines[j].trim();
    if (line.indexOf('data:') === 0) {
      try {
        var parsed = JSON.parse(line.substring(5).trim());
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
          var audioItem = parsed[0];
          if (audioItem.path) {
            audioUrl = spaceBase + '/file=' + audioItem.path;
            break;
          } else if (audioItem.url) {
            audioUrl = audioItem.url.replace('/call/file=', '/file=');
            break;
          }
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not parse audio output from MeloTTS SSE: ' + sseText.slice(-300));
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('MeloTTS audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('MeloTTS returned empty audio buffer');
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

  throw lastError || new Error('MeloTTS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free open-weight multilingual neural TTS (MyShell MeloTTS) via Hugging Face Space. Rapid synthesis with natural accents in English, Spanish, French, Chinese, Japanese, and Korean. Returns 44.1 kHz WAV.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 500,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 25,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
