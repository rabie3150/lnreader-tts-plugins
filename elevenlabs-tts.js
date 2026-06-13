// ElevenLabs TTS plugin for LNReader QuickJS runtime.
// Supports authenticated mode (API key) and anonymous mode (hCaptcha token).
// The /stream/with-timestamps endpoint returns NDJSON lines containing
// audio_base64 fields; we concatenate them into a single MP3 byte stream.

const HARDCODED_VOICES = [
  { id: 'NNl6r8mD7vthiJatiJt1', name: 'Rachel', languages: ['en'], gender: 'female', description: 'Default ElevenLabs anonymous voice.' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Adam', languages: ['en'], gender: 'male', description: 'Common ElevenLabs shared voice.' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', languages: ['en'], gender: 'male', description: 'Laid-Back, Casual, Resonant.' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', languages: ['en'], gender: 'female', description: 'Mature, Reassuring, Confident.' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', languages: ['en'], gender: 'female', description: 'Enthusiast, Quirky Attitude.' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', languages: ['en'], gender: 'male', description: 'Deep, Confident, Energetic.' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', languages: ['en'], gender: 'male', description: 'Warm, Captivating Storyteller.' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', languages: ['en'], gender: 'male', description: 'Husky Trickster.' },
];

function base64ToBytes(base64) {
  const buffer = base64ToArrayBuffer(base64);
  return new Uint8Array(buffer);
}

function sleep(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {}
}

function parseNdjsonAudio(bodyText) {
  const lines = bodyText.split('\n').filter(function (line) { return line.trim(); });
  const chunks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let data;
    try {
      data = JSON.parse(line);
    } catch (e) {
      continue;
    }
    if (!data || typeof data !== 'object') {
      continue;
    }
    if (data.error) {
      throw new Error('ElevenLabs API error: ' + (data.error.message || JSON.stringify(data.error)));
    }
    if (data.audio_base64) {
      chunks.push(base64ToBytes(data.audio_base64));
    }
  }

  if (chunks.length === 0) {
    throw new Error('ElevenLabs API returned no audio chunks.');
  }

  let total = 0;
  for (let i = 0; i < chunks.length; i++) {
    total += chunks[i].length;
  }

  const combined = new Uint8Array(total);
  let offset = 0;
  for (let i = 0; i < chunks.length; i++) {
    combined.set(chunks[i], offset);
    offset += chunks[i].length;
  }

  return combined;
}

function synthesizeAuthenticated(text, voiceId, settings, speed) {
  const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId + '/stream/with-timestamps';
  const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'xi-api-key': settings.apiKey,
  };
  const payload = {
    text: text,
    model_id: settings.modelId || 'eleven_v3',
    voice_settings: { speed: speed },
    language_code: settings.languageCode || 'en',
  };

  console.log('ElevenLabs authenticated request: voice=' + voiceId + ' model=' + payload.model_id + ' speed=' + speed);

  const resp = fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = resp.text();
    throw new Error('ElevenLabs HTTP ' + resp.status + ': ' + errText.slice(0, 300));
  }

  return parseNdjsonAudio(resp.text());
}

function synthesizeAnonymous(text, voiceId, settings, speed) {
  const hcaptchaToken = settings.hcaptchaToken || '';

  const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId + '/stream/with-timestamps/anonymous';
  const headers = {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,fr-FR;q=0.7,ar;q=0.6',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Origin': 'https://elevenlabs.io',
    'Pragma': 'no-cache',
    'Priority': 'u=1, i',
    'Referer': 'https://elevenlabs.io/',
    'Sec-CH-UA': '"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"',
    'Sec-CH-UA-Mobile': '?0',
    'Sec-CH-UA-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0',
  };
  const payload = {
    text: text,
    model_id: settings.modelId || 'eleven_v3',
    voice_settings: { speed: speed },
    hcaptcha_token: hcaptchaToken,
    language_code: settings.languageCode || 'en',
  };

  console.log('ElevenLabs anonymous request: voice=' + voiceId + ' model=' + payload.model_id + ' speed=' + speed);

  const resp = fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = resp.text();
    throw new Error('ElevenLabs HTTP ' + resp.status + ': ' + errText.slice(0, 300));
  }

  return parseNdjsonAudio(resp.text());
}

function synthesizeWithRetry(text, voiceId, settings, speed, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (settings.apiKey) {
        return synthesizeAuthenticated(text, voiceId, settings, speed);
      }
      return synthesizeAnonymous(text, voiceId, settings, speed);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        console.log('ElevenLabs synthesis attempt ' + (attempt + 1) + ' failed, retrying...');
        sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'elevenlabs-tts',
  name: 'ElevenLabs TTS',
  version: '1.0.0',
  description: 'Premium ElevenLabs TTS supporting API-key authenticated mode and hCaptcha anonymous mode. Returns MP3 audio.',
  maxCharsPerRequest: 5000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 18,

  configSchema: [
    {
      key: 'apiKey',
      type: 'text',
      label: 'API Key',
      defaultValue: '',
      description: 'Your ElevenLabs API key (xi-api-key). If provided, authenticated mode is used and the full voice catalog is fetched.',
    },
    {
      key: 'modelId',
      type: 'text',
      label: 'Model ID',
      defaultValue: 'eleven_v3',
      description: 'ElevenLabs model to use for synthesis (e.g. eleven_v3, eleven_multilingual_v2).',
    },
    {
      key: 'languageCode',
      type: 'text',
      label: 'Language Code',
      defaultValue: 'en',
      description: 'Language code for synthesis (e.g. en, fr, de).',
    },
    {
      key: 'hcaptchaToken',
      type: 'text',
      label: 'hCaptcha Token',
      defaultValue: '',
      description: 'Anonymous mode only. Fresh hCaptcha token from elevenlabs.io. Not needed when an API key is set; expires quickly.',
    },
  ],

  getVoices: function (options) {
    const settings = (options && options.pluginSettings) || {};
    if (settings.apiKey) {
      try {
        const resp = fetch('https://api.elevenlabs.io/v1/voices?show_legacy=true', {
          headers: {
            'accept': 'application/json',
            'xi-api-key': settings.apiKey,
          },
        });
        if (!resp.ok) {
          throw new Error('HTTP ' + resp.status);
        }
        const data = resp.json();
        const voices = [];
        const voicesArr = data.voices || [];
        for (let i = 0; i < voicesArr.length; i++) {
          const v = voicesArr[i];
          const voiceId = v.voice_id || '';
          if (!voiceId) {
            continue;
          }
          const labels = v.labels || {};
          let gender = (labels.gender || 'neutral').toLowerCase();
          if (gender !== 'male' && gender !== 'female' && gender !== 'neutral') {
            gender = 'neutral';
          }
          const language = (labels.language || 'en').toLowerCase();
          voices.push({
            id: voiceId,
            name: v.name || voiceId,
            languages: [language],
            gender: gender,
            description: v.description || '',
          });
        }
        if (voices.length > 0) {
          return voices;
        }
      } catch (e) {
        console.log('ElevenLabs voice fetch failed, using hardcoded list: ' + (e.message || e));
      }
    }
    return HARDCODED_VOICES;
  },

  synthesize: function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const voiceId = (options && options.voiceId) || HARDCODED_VOICES[0].id;
    const speed = (options && options.speed) || 1.0;

    console.log('ElevenLabs synthesize START textLen=' + text.length + ' voice=' + voiceId + ' speed=' + speed);

    const audio = synthesizeWithRetry(text, voiceId, settings, speed, 2);

    console.log('ElevenLabs synthesize SUCCESS bytes=' + audio.length);

    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 44100,
    };
  },
};
