// Coqui VITS Multilingual Plugin for LNReader
// Zero-authentication neural speech synthesis via Hugging Face Space (mbarnig/lb_de_fr_en_pt_COQUI_VITS_TTS)
// Features 8 speakers across 5 European languages (English, German, French, Portuguese, Luxembourgish).

var PLUGIN_ID = 'coqui-vits-tts';
var PLUGIN_NAME = 'Coqui VITS (Multilingual)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "Bernard:English",
    "name": "Coqui VITS Bernard (English)",
    "lang": "en-US",
    "gender": "Male",
    "speaker": "Bernard",
    "language": "English"
  },
  {
    "id": "Bernard:Deutsch",
    "name": "Coqui VITS Bernard (Deutsch)",
    "lang": "de-DE",
    "gender": "Male",
    "speaker": "Bernard",
    "language": "Deutsch"
  },
  {
    "id": "Bernard:Français",
    "name": "Coqui VITS Bernard (Français)",
    "lang": "fr-FR",
    "gender": "Male",
    "speaker": "Bernard",
    "language": "Français"
  },
  {
    "id": "Bernard:Português",
    "name": "Coqui VITS Bernard (Português)",
    "lang": "pt-PT",
    "gender": "Male",
    "speaker": "Bernard",
    "language": "Português"
  },
  {
    "id": "Bernard:Lëtzebuergesch",
    "name": "Coqui VITS Bernard (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Male",
    "speaker": "Bernard",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Bunny:English",
    "name": "Coqui VITS Bunny (English)",
    "lang": "en-US",
    "gender": "Female",
    "speaker": "Bunny",
    "language": "English"
  },
  {
    "id": "Bunny:Deutsch",
    "name": "Coqui VITS Bunny (Deutsch)",
    "lang": "de-DE",
    "gender": "Female",
    "speaker": "Bunny",
    "language": "Deutsch"
  },
  {
    "id": "Bunny:Français",
    "name": "Coqui VITS Bunny (Français)",
    "lang": "fr-FR",
    "gender": "Female",
    "speaker": "Bunny",
    "language": "Français"
  },
  {
    "id": "Bunny:Português",
    "name": "Coqui VITS Bunny (Português)",
    "lang": "pt-PT",
    "gender": "Female",
    "speaker": "Bunny",
    "language": "Português"
  },
  {
    "id": "Bunny:Lëtzebuergesch",
    "name": "Coqui VITS Bunny (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Female",
    "speaker": "Bunny",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Ed:English",
    "name": "Coqui VITS Ed (English)",
    "lang": "en-US",
    "gender": "Male",
    "speaker": "Ed",
    "language": "English"
  },
  {
    "id": "Ed:Deutsch",
    "name": "Coqui VITS Ed (Deutsch)",
    "lang": "de-DE",
    "gender": "Male",
    "speaker": "Ed",
    "language": "Deutsch"
  },
  {
    "id": "Ed:Français",
    "name": "Coqui VITS Ed (Français)",
    "lang": "fr-FR",
    "gender": "Male",
    "speaker": "Ed",
    "language": "Français"
  },
  {
    "id": "Ed:Português",
    "name": "Coqui VITS Ed (Português)",
    "lang": "pt-PT",
    "gender": "Male",
    "speaker": "Ed",
    "language": "Português"
  },
  {
    "id": "Ed:Lëtzebuergesch",
    "name": "Coqui VITS Ed (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Male",
    "speaker": "Ed",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Guy:English",
    "name": "Coqui VITS Guy (English)",
    "lang": "en-US",
    "gender": "Male",
    "speaker": "Guy",
    "language": "English"
  },
  {
    "id": "Guy:Deutsch",
    "name": "Coqui VITS Guy (Deutsch)",
    "lang": "de-DE",
    "gender": "Male",
    "speaker": "Guy",
    "language": "Deutsch"
  },
  {
    "id": "Guy:Français",
    "name": "Coqui VITS Guy (Français)",
    "lang": "fr-FR",
    "gender": "Male",
    "speaker": "Guy",
    "language": "Français"
  },
  {
    "id": "Guy:Português",
    "name": "Coqui VITS Guy (Português)",
    "lang": "pt-PT",
    "gender": "Male",
    "speaker": "Guy",
    "language": "Português"
  },
  {
    "id": "Guy:Lëtzebuergesch",
    "name": "Coqui VITS Guy (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Male",
    "speaker": "Guy",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Judith:English",
    "name": "Coqui VITS Judith (English)",
    "lang": "en-US",
    "gender": "Female",
    "speaker": "Judith",
    "language": "English"
  },
  {
    "id": "Judith:Deutsch",
    "name": "Coqui VITS Judith (Deutsch)",
    "lang": "de-DE",
    "gender": "Female",
    "speaker": "Judith",
    "language": "Deutsch"
  },
  {
    "id": "Judith:Français",
    "name": "Coqui VITS Judith (Français)",
    "lang": "fr-FR",
    "gender": "Female",
    "speaker": "Judith",
    "language": "Français"
  },
  {
    "id": "Judith:Português",
    "name": "Coqui VITS Judith (Português)",
    "lang": "pt-PT",
    "gender": "Female",
    "speaker": "Judith",
    "language": "Português"
  },
  {
    "id": "Judith:Lëtzebuergesch",
    "name": "Coqui VITS Judith (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Female",
    "speaker": "Judith",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Kerstin:English",
    "name": "Coqui VITS Kerstin (English)",
    "lang": "en-US",
    "gender": "Female",
    "speaker": "Kerstin",
    "language": "English"
  },
  {
    "id": "Kerstin:Deutsch",
    "name": "Coqui VITS Kerstin (Deutsch)",
    "lang": "de-DE",
    "gender": "Female",
    "speaker": "Kerstin",
    "language": "Deutsch"
  },
  {
    "id": "Kerstin:Français",
    "name": "Coqui VITS Kerstin (Français)",
    "lang": "fr-FR",
    "gender": "Female",
    "speaker": "Kerstin",
    "language": "Français"
  },
  {
    "id": "Kerstin:Português",
    "name": "Coqui VITS Kerstin (Português)",
    "lang": "pt-PT",
    "gender": "Female",
    "speaker": "Kerstin",
    "language": "Português"
  },
  {
    "id": "Kerstin:Lëtzebuergesch",
    "name": "Coqui VITS Kerstin (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Female",
    "speaker": "Kerstin",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Linda:English",
    "name": "Coqui VITS Linda (English)",
    "lang": "en-US",
    "gender": "Female",
    "speaker": "Linda",
    "language": "English"
  },
  {
    "id": "Linda:Deutsch",
    "name": "Coqui VITS Linda (Deutsch)",
    "lang": "de-DE",
    "gender": "Female",
    "speaker": "Linda",
    "language": "Deutsch"
  },
  {
    "id": "Linda:Français",
    "name": "Coqui VITS Linda (Français)",
    "lang": "fr-FR",
    "gender": "Female",
    "speaker": "Linda",
    "language": "Français"
  },
  {
    "id": "Linda:Português",
    "name": "Coqui VITS Linda (Português)",
    "lang": "pt-PT",
    "gender": "Female",
    "speaker": "Linda",
    "language": "Português"
  },
  {
    "id": "Linda:Lëtzebuergesch",
    "name": "Coqui VITS Linda (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Female",
    "speaker": "Linda",
    "language": "Lëtzebuergesch"
  },
  {
    "id": "Thorsten:English",
    "name": "Coqui VITS Thorsten (English)",
    "lang": "en-US",
    "gender": "Male",
    "speaker": "Thorsten",
    "language": "English"
  },
  {
    "id": "Thorsten:Deutsch",
    "name": "Coqui VITS Thorsten (Deutsch)",
    "lang": "de-DE",
    "gender": "Male",
    "speaker": "Thorsten",
    "language": "Deutsch"
  },
  {
    "id": "Thorsten:Français",
    "name": "Coqui VITS Thorsten (Français)",
    "lang": "fr-FR",
    "gender": "Male",
    "speaker": "Thorsten",
    "language": "Français"
  },
  {
    "id": "Thorsten:Português",
    "name": "Coqui VITS Thorsten (Português)",
    "lang": "pt-PT",
    "gender": "Male",
    "speaker": "Thorsten",
    "language": "Português"
  },
  {
    "id": "Thorsten:Lëtzebuergesch",
    "name": "Coqui VITS Thorsten (Lëtzebuergesch)",
    "lang": "lb-LU",
    "gender": "Male",
    "speaker": "Thorsten",
    "language": "Lëtzebuergesch"
  }
];

var configSchema = [
  {
    key: 'defaultVoice',
    label: 'Default Voice & Language',
    type: 'select',
    defaultValue: 'Linda:English',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
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
  var voiceKey = options.voice || 'Linda:English';
  var speaker = 'Linda';
  var lang = 'English';

  var parts = voiceKey.split(':');
  if (parts.length >= 2) {
    speaker = parts[0];
    lang = parts[1];
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 500) {
    cleanText = cleanText.substring(0, 500);
  }

  var spaceBase = 'https://mbarnig-lb-de-fr-en-pt-coqui-vits-tts.hf.space';

  // 1. Submit prediction job via Gradio 4 SSE endpoint
  var callUrl = spaceBase + '/call/predict';
  var payload = {
    data: [
      cleanText,
      speaker,
      lang
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
    throw new Error('Coqui VITS submission failed: HTTP ' + callResp.status);
  }

  var callData = await callResp.json();
  var eventId = callData.event_id;
  if (!eventId) {
    throw new Error('Coqui VITS returned no event_id: ' + JSON.stringify(callData));
  }

  // 2. Stream SSE until complete event
  var sseUrl = spaceBase + '/call/predict/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('Coqui VITS SSE stream failed: HTTP ' + sseResp.status);
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
            audioUrl = spaceBase + '/file=' + audioObj.path;
          }
          break;
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not parse audio URL from Coqui VITS SSE: ' + sseText.slice(0, 300));
  }

  // Fix Gradio 4 relative path typo where /call/predict results in /c/file=
  if (audioUrl.indexOf('/c/file=') !== -1) {
    audioUrl = audioUrl.replace('/c/file=', '/file=');
  } else if (audioUrl.indexOf('/cal/file=') !== -1) {
    audioUrl = audioUrl.replace('/cal/file=', '/file=');
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Coqui VITS audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Coqui VITS returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'wav',
    sampleRate: 22050
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

  throw lastError || new Error('Coqui VITS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free multilingual neural TTS (Coqui VITS) via Hugging Face Space. Features 8 speakers supporting English, German, French, Portuguese, and Luxembourgish. Returns WAV audio.',
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
