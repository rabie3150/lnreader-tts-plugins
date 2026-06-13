// Microsoft Edge TTS plugin (via an OpenAI-compatible local proxy).
//
// Edge TTS itself uses a WebSocket protocol that the current QuickJS runtime
// does not expose, so this plugin talks to a local HTTP proxy instead.
//
// Easiest way to run the proxy:
//   docker run -d -p 5050:5050 travisvn/openai-edge-tts:latest
//
// Then in the plugin settings make sure Proxy URL is:
//   http://localhost:5050/v1/audio/speech

function log(msg) {
  try {
    const { NativeModules } = require('react-native');
    NativeModules.TtsStreamingModule.log('EdgeTTS', msg);
  } catch {}
}

function base64ToBytes(base64) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function splitText(text, maxChars) {
  if (text.length <= maxChars) return [text];

  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+|\n+/);

  let current = '';
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (trimmed.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      const words = trimmed.split(' ');
      for (const word of words) {
        if (word.length > maxChars) {
          if (current) {
            chunks.push(current);
            current = '';
          }
          for (let i = 0; i < word.length; i += maxChars) {
            chunks.push(word.substring(i, i + maxChars));
          }
        } else if ((current + ' ' + word).length > maxChars) {
          if (current) chunks.push(current);
          current = word;
        } else {
          current = current ? current + ' ' + word : word;
        }
      }
    } else if ((current + ' ' + trimmed).length > maxChars) {
      if (current) chunks.push(current);
      current = trimmed;
    } else {
      current = current ? current + ' ' + trimmed : trimmed;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

const DEFAULT_VOICES = [
  { id: 'en-US-AvaNeural', name: 'Ava (US English)', languages: ['en-us'], gender: 'Female' },
  { id: 'en-US-AndrewNeural', name: 'Andrew (US English)', languages: ['en-us'], gender: 'Male' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK English)', languages: ['en-gb'], gender: 'Female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK English)', languages: ['en-gb'], gender: 'Male' },
  { id: 'ja-JP-NanamiNeural', name: 'Nanami (Japanese)', languages: ['ja-jp'], gender: 'Female' },
  { id: 'ja-JP-KeitaNeural', name: 'Keita (Japanese)', languages: ['ja-jp'], gender: 'Male' },
  { id: 'ko-KR-SunHiNeural', name: 'Sun-Hi (Korean)', languages: ['ko-kr'], gender: 'Female' },
  { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao (Chinese)', languages: ['zh-cn'], gender: 'Female' },
  { id: 'es-ES-ElviraNeural', name: 'Elvira (Spanish)', languages: ['es-es'], gender: 'Female' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise (French)', languages: ['fr-fr'], gender: 'Female' },
  { id: 'de-DE-KatjaNeural', name: 'Katja (German)', languages: ['de-de'], gender: 'Female' },
];

module.exports.default = {
  id: 'edge-tts',
  name: 'Edge TTS (local proxy)',
  version: '1.0.0',
  description:
    'Microsoft Edge TTS through a local OpenAI-compatible proxy. ' +
    'Run: docker run -d -p 5050:5050 travisvn/openai-edge-tts:latest',
  maxCharsPerRequest: 4000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 25,

  configSchema: [
    {
      key: 'proxyUrl',
      type: 'text',
      label: 'Proxy URL',
      defaultValue: 'http://localhost:5050/v1/audio/speech',
    },
    {
      key: 'voice',
      type: 'text',
      label: 'Voice',
      defaultValue: 'en-US-AvaNeural',
    },
    {
      key: 'apiKey',
      type: 'text',
      label: 'API Key (optional)',
      defaultValue: '',
    },
  ],

  async getVoices(options) {
    const settings = options.pluginSettings || {};
    const proxyUrl = settings.proxyUrl || 'http://localhost:5050/v1/audio/speech';
    const baseUrl = proxyUrl.replace('/audio/speech', '').replace('/v1/audio/speech', '');
    const voicesUrl = `${baseUrl}/v1/audio/voices`;

    try {
      const resp = await fetch(voicesUrl);
      if (!resp.ok) {
        log(`voices endpoint not available: ${resp.status}`);
        return DEFAULT_VOICES;
      }
      const data = await resp.json();
      return (data.voices || []).map(v => ({
        id: v.id,
        name: v.name || v.id,
        languages: v.languages || ['en'],
        gender: v.gender || '',
        description: v.description || '',
      }));
    } catch (e) {
      log(`getVoices fallback: ${e.message || e}`);
      return DEFAULT_VOICES;
    }
  },

  async synthesize(text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      throw new Error('No speakable text');
    }

    const settings = options.pluginSettings || {};
    const proxyUrl = settings.proxyUrl || 'http://localhost:5050/v1/audio/speech';
    const voice = settings.voice || 'en-US-AvaNeural';
    const apiKey = settings.apiKey || '';
    const speed = options.speed || 1.0;

    log(`synthesize START textLen=${text.length} voice=${voice} speed=${speed}`);

    const textChunks = splitText(text, 4000);
    const results = [];

    for (const chunk of textChunks) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const resp = await fetch(proxyUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            input: chunk,
            voice,
            response_format: 'mp3',
            speed,
          }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const errText = await resp.text();
          log(`HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
          throw new Error(`Edge TTS proxy HTTP ${resp.status}`);
        }

        const arrayBuffer = await resp.arrayBuffer();
        results.push(new Uint8Array(arrayBuffer));
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (results.length === 0) {
      throw new Error('No audio received from Edge TTS proxy');
    }

    const audio = results[0];

    log(`FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 24000,
    };
  },
};
