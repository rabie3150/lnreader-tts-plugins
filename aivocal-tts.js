// AIVocal Free TTS plugin for LNReader React Native JS runtime.
// Uses the undocumented aivocal.io web-playground endpoint anonymously.
// No API key required: the quota is keyed on an `anonymous_user_id` cookie
// (exactly 1 free synthesis per ID, NOT per IP), so the plugin generates a
// fresh random UUID per chunk — effectively unlimited usage.
// Runs on the JS thread; the app handles parallel chunk synthesis.

const API_BASE_URL = 'https://aivocal.io/api/v1';
const SUBMIT_URL = `${API_BASE_URL}/text-to-speech/speech`;
const POLL_URL = `${API_BASE_URL}/text-to-speech/speech/`; // + speech_id
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const CODE_SUCCESS = 100000;
const CODE_QUOTA_EXCEEDED = 100212; // "Free trial limit exceeded"

const POLL_INTERVAL_MS = 1200;
const POLL_TIMEOUT_MS = 45000;

const VALID_EMOTIONS = ['calm', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];

// Free Kokoro voices (supplier=2) usable anonymously. These are hardcoded in
// the aivocal.io frontend and exposed by no API; catalog voices are premium.
const FREE_VOICES = [
  // English (American)
  { id: 'af_kore', name: 'Kore (US)', languages: ['en'], gender: 'female' },
  { id: 'af_jessica', name: 'Jessica (US)', languages: ['en'], gender: 'female' },
  { id: 'af_nicole', name: 'Nicole (US)', languages: ['en'], gender: 'female' },
  { id: 'af_nova', name: 'Nova (US)', languages: ['en'], gender: 'female' },
  { id: 'af_river', name: 'River (US)', languages: ['en'], gender: 'female' },
  { id: 'af_sarah', name: 'Sarah (US)', languages: ['en'], gender: 'female' },
  { id: 'af_sky', name: 'Sky (US)', languages: ['en'], gender: 'female' },
  { id: 'am_adam', name: 'Adam (US)', languages: ['en'], gender: 'male' },
  { id: 'am_echo', name: 'Echo (US)', languages: ['en'], gender: 'male' },
  { id: 'am_eric', name: 'Eric (US)', languages: ['en'], gender: 'male' },
  { id: 'am_fenrir', name: 'Fenrir (US)', languages: ['en'], gender: 'male' },
  { id: 'am_liam', name: 'Liam (US)', languages: ['en'], gender: 'male' },
  { id: 'am_michael', name: 'Michael (US)', languages: ['en'], gender: 'male' },
  { id: 'am_onyx', name: 'Onyx (US)', languages: ['en'], gender: 'male' },
  { id: 'am_puck', name: 'Puck (US)', languages: ['en'], gender: 'male' },
  // English (British)
  { id: 'bf_alice', name: 'Alice (GB)', languages: ['en'], gender: 'female' },
  { id: 'bf_emma', name: 'Emma (GB)', languages: ['en'], gender: 'female' },
  { id: 'bf_isabella', name: 'Isabella (GB)', languages: ['en'], gender: 'female' },
  { id: 'bf_lily', name: 'Lily (GB)', languages: ['en'], gender: 'female' },
  { id: 'bm_daniel', name: 'Daniel (GB)', languages: ['en'], gender: 'male' },
  { id: 'bm_fable', name: 'Fable (GB)', languages: ['en'], gender: 'male' },
  { id: 'bm_george', name: 'George (GB)', languages: ['en'], gender: 'male' },
  { id: 'bm_lewis', name: 'Lewis (GB)', languages: ['en'], gender: 'male' },
  // Other languages
  { id: 'ff_siwis', name: 'Siwis', languages: ['fr'], gender: 'female' },
  { id: 'hf_alpha', name: 'Alpha', languages: ['hi'], gender: 'female' },
  { id: 'hf_beta', name: 'Beta', languages: ['hi'], gender: 'female' },
  { id: 'hm_omega', name: 'Omega', languages: ['hi'], gender: 'male' },
  { id: 'hm_psi', name: 'Psi', languages: ['hi'], gender: 'male' },
  { id: 'if_sara', name: 'Sara', languages: ['it'], gender: 'female' },
  { id: 'im_nicola', name: 'Nicola', languages: ['it'], gender: 'male' },
];

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildHeaders(anonymousId) {
  // The backend gates on a browser User-Agent + Accept header
  // (code 100111 "invalid client source" otherwise); Origin/Referer are
  // spoofed for consistency but not validated server-side.
  return {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': BROWSER_USER_AGENT,
    'Origin': 'https://aivocal.io',
    'Referer': 'https://aivocal.io/ai-voice-generator',
    'Cookie': `anonymous_user_id=${anonymousId}`,
  };
}

function checkApiCode(data, context) {
  const code = data && data.code;
  if (code === CODE_SUCCESS) return;
  const message = (data && data.message) || 'unknown error';
  if (code === CODE_QUOTA_EXCEEDED) {
    const err = new Error(`AIVocal quota exhausted: ${message}`);
    err.quotaExceeded = true;
    throw err;
  }
  throw new Error(`AIVocal ${context}: ${message} (code ${code})`);
}

async function submitSpeech(text, voice, emotion, speed, anonymousId) {
  const payload = {
    commerical_use: false, // sic — field name is misspelled server-side
    voice_id: voice,
    supplier: 2, // 2 = free Kokoro voices; 1 = premium (login required)
    content: text,
    voice_source: 1,
    voice_setting: { speed: speed, pitch: 0, emotion: emotion, volume: 1 },
    title: `LNReader_${Date.now()}`,
  };

  const resp = await fetch(SUBMIT_URL, {
    method: 'POST',
    headers: buildHeaders(anonymousId),
    body: JSON.stringify(payload),
  });

  console.log(`[AIVocal] submit status=${resp.status}`);

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`AIVocal submit HTTP ${resp.status}: ${errText.slice(0, 120)}`);
  }

  const data = await resp.json();
  checkApiCode(data, 'submit failed');
  const speechId = data.data && data.data.speech_id;
  if (!speechId) throw new Error('AIVocal submit returned no speech_id');
  return speechId;
}

async function pollSpeech(speechId, anonymousId) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const resp = await fetch(POLL_URL + speechId, {
      method: 'GET',
      headers: buildHeaders(anonymousId),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`AIVocal poll HTTP ${resp.status}: ${errText.slice(0, 120)}`);
    }
    const data = await resp.json();
    checkApiCode(data, 'poll failed');
    const task = data.data || {};
    if (task.status === 'success' && task.audio_url) {
      console.log(`[AIVocal] task ${speechId} done`);
      return task.audio_url;
    }
    if (task.status === 'failed' || task.error) {
      throw new Error(`AIVocal task failed: ${task.error || task.status}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`AIVocal task ${speechId} timed out after ${POLL_TIMEOUT_MS}ms`);
}

async function downloadAudio(audioUrl) {
  // Public CDN — no auth, cookie, or Referer required.
  const resp = await fetch(audioUrl, {
    method: 'GET',
    headers: { 'User-Agent': BROWSER_USER_AGENT },
  });
  if (!resp.ok) {
    throw new Error(`AIVocal audio download HTTP ${resp.status}`);
  }
  return new Uint8Array(await resp.arrayBuffer());
}

async function synthesizeSingleRequest(text, voice, emotion, speed) {
  // Fresh anonymous identity per chunk: quota is exactly 1 synthesis per
  // anonymous_user_id (cookie-keyed, not IP-keyed), so a fresh UUID per
  // request makes usage effectively unlimited. Rotation below is a fallback.
  let anonymousId = uuidv4();
  let lastErr;
  for (let rotation = 0; rotation < 3; rotation++) {
    try {
      const speechId = await submitSpeech(text, voice, emotion, speed, anonymousId);
      const audioUrl = await pollSpeech(speechId, anonymousId);
      return await downloadAudio(audioUrl);
    } catch (err) {
      lastErr = err;
      if (err && err.quotaExceeded && rotation < 2) {
        anonymousId = uuidv4();
        console.log(`[AIVocal] quota hit; rotated anonymous ID (${rotation + 1}/2)`);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

async function synthesizeWithRetry(text, voice, emotion, speed, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice, emotion, speed);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'aivocal-tts',
  name: 'AIVocal TTS (Free)',
  version: '1.0.0',
  description:
    'Free anonymous AIVocal.io TTS with 30 Kokoro voices and emotion control. No API key required. Returns WAV audio at 24 kHz.',
  maxCharsPerRequest: 3000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 15,

  configSchema: [
    {
      key: 'emotion',
      type: 'select',
      label: 'Emotion',
      defaultValue: 'calm',
      options: VALID_EMOTIONS.map(e => ({
        label: e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
      })),
    },
  ],

  getVoices: async function () {
    return FREE_VOICES.map(v => ({
      id: v.id,
      name: v.name,
      languages: v.languages,
      gender: v.gender,
    }));
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      console.log('[AIVocal] SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const voice = options.voiceId || 'bm_george';
    const emotion = VALID_EMOTIONS.includes(settings.emotion) ? settings.emotion : 'calm';
    // Server range is 0.5–2.0; clamp the app's speed value into it.
    let speed = options.speed || 1.0;
    speed = Math.min(2.0, Math.max(0.5, speed));

    console.log(
      `[AIVocal] synthesize START textLen=${text.length} voice=${voice} emotion=${emotion} speed=${speed}`
    );

    const audio = await synthesizeWithRetry(text, voice, emotion, speed, 2);

    console.log(`[AIVocal] FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: 'wav',
      sampleRate: 24000,
    };
  },
};
