// VoxWorker TTS Plugin for LNReader
// Zero-authentication multi-engine speech synthesis (RHVoice & Yandex SpeechKit Pro)
// Generous free tier, no API key, high reliability.

var PLUGIN_ID = 'voxworker-tts';
var PLUGIN_NAME = 'VoxWorker TTS (Free)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  { "id": "rh-bdl", "name": "John (English - RHVoice)", "lang": "en-US", "gender": "Male" },
  { "id": "rh-slt", "name": "Kelly (English - RHVoice)", "lang": "en-US", "gender": "Female" },
  { "id": "ya-alena-n", "name": "Alena Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Female" },
  { "id": "ya-filipp-n", "name": "Filipp Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Male" },
  { "id": "ya-ermil-n", "name": "Valeriy Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Male" },
  { "id": "ya-jane-n", "name": "Olga Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Female" },
  { "id": "ya-omazh-n", "name": "Irina Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Female" },
  { "id": "ya-zahar-n", "name": "Petr Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Male" },
  { "id": "ya-marina-n", "name": "Natalia Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Female" },
  { "id": "ya-madi-n", "name": "Denis Pro (Russian - Yandex Neural)", "lang": "ru-RU", "gender": "Male" },
  { "id": "rh-oleg", "name": "Oleg (Russian - RHVoice)", "lang": "ru-RU", "gender": "Male" },
  { "id": "rh-mikhail", "name": "Mikhail (Russian - RHVoice)", "lang": "ru-RU", "gender": "Male" },
  { "id": "rh-anna", "name": "Anna (Russian - RHVoice)", "lang": "ru-RU", "gender": "Female" },
  { "id": "rh-arina", "name": "Maria (Russian - RHVoice)", "lang": "ru-RU", "gender": "Female" },
  { "id": "rh-irina", "name": "Elena (Russian - RHVoice)", "lang": "ru-RU", "gender": "Female" },
  { "id": "rh-anatol", "name": "Volodymyr (Ukrainian - RHVoice)", "lang": "uk-UA", "gender": "Male" },
  { "id": "rh-natalia", "name": "Olena (Ukrainian - RHVoice)", "lang": "uk-UA", "gender": "Female" }
];

var configSchema = [
  {
    key: 'voice',
    label: 'Voice / Speaker',
    type: 'select',
    default: 'rh-bdl',
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
  },
  {
    key: 'pitch',
    label: 'Voice Pitch',
    type: 'select',
    default: '0.0',
    options: [
      { label: 'Lower (-0.5)', value: '-0.5' },
      { label: 'Normal (0.0)', value: '0.0' },
      { label: 'Higher (+0.5)', value: '+0.5' }
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

var cachedSessionId = null;
var sessionTimestamp = 0;

async function getSessionId() {
  var now = Date.now();
  if (cachedSessionId && (now - sessionTimestamp < 10 * 60 * 1000)) {
    return cachedSessionId;
  }

  var resp = await fetch('https://voxworker.com/en', {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!resp.ok) {
    throw new Error('Failed to fetch VoxWorker session: HTTP ' + resp.status);
  }

  var html = await resp.text();
  var match = html.match(/name="sessionId"\s+value="([^"]+)"/);
  if (!match || !match[1]) {
    throw new Error('Could not extract sessionId from VoxWorker');
  }

  cachedSessionId = match[1];
  sessionTimestamp = now;
  return cachedSessionId;
}

async function doSynthesize(text, options) {
  options = options || {};
  var voice = options.voice || 'rh-bdl';
  var speedVal = options.speed || '1.0';
  var pitchVal = options.pitch || '0.0';

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 1000) {
    cleanText = cleanText.substring(0, 1000);
  }

  var sessionId = await getSessionId();

  var formBody = new URLSearchParams({
    textId: '',
    sessionId: sessionId,
    voice: voice,
    speed: speedVal,
    pitch: pitchVal,
    text: cleanText
  }).toString();

  var convertResp = await fetch('https://voxworker.com/ajax/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://voxworker.com',
      'Referer': 'https://voxworker.com/en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    },
    body: formBody
  });

  if (!convertResp.ok) {
    // Invalidate cached session if rejected
    cachedSessionId = null;
    throw new Error('VoxWorker conversion request failed: HTTP ' + convertResp.status);
  }

  var convertData = await convertResp.json();
  var audioUrl = null;

  if (convertData.status === 'ok') {
    audioUrl = convertData.downloadUrl || convertData.voiceUrl;
  } else if (convertData.status === 'queue') {
    var taskId = convertData.taskId;
    if (!taskId) {
      throw new Error('VoxWorker queued but provided no taskId');
    }

    // Poll status up to 30 seconds
    for (var i = 0; i < 30; i++) {
      await sleep(1000);
      var statusResp = await fetch('https://voxworker.com/ajax/status?id=' + encodeURIComponent(taskId), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://voxworker.com/en',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
        }
      });
      if (statusResp.ok) {
        var statusData = await statusResp.json();
        if (statusData.status === 'ok') {
          audioUrl = statusData.downloadUrl || statusData.voiceUrl;
          break;
        } else if (statusData.status === 'error') {
          throw new Error('VoxWorker synthesis task error: ' + (statusData.error || statusData.errorText));
        }
      }
    }
  } else {
    cachedSessionId = null;
    throw new Error('VoxWorker returned non-ok status: ' + JSON.stringify(convertData));
  }

  if (!audioUrl) {
    throw new Error('VoxWorker synthesis timed out without audio URL');
  }

  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'Referer': 'https://voxworker.com/en',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('VoxWorker audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('VoxWorker returned empty audio buffer');
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

  throw lastError || new Error('VoxWorker synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free multi-engine speech synthesis (RHVoice & Yandex SpeechKit Pro neural models) via VoxWorker. High reliability, natural voices in English, Russian, and Ukrainian. Returns MP3 audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 1000,
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
