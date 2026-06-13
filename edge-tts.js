// Microsoft Edge TTS plugin using direct WebSocket.
// No local proxy or Docker needed.

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_TTS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';

function log(msg) {
  try {
    const { NativeModules } = require('react-native');
    NativeModules.TtsStreamingModule.log('EdgeTTS', msg);
  } catch {}
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
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

function getTimestamp() {
  return new Date().toISOString();
}

function buildConfigMessage(outputFormat) {
  return (
    `X-Timestamp: ${getTimestamp()}\r\n` +
    `Content-Type: application/json; charset=utf-8\r\n` +
    `Path: speech.config\r\n\r\n` +
    JSON.stringify({
      context: {
        synthesis: {
          audio: {
            outputFormat: outputFormat,
          },
        },
      },
    })
  );
}

function buildSsmlMessage(text, voice, rate, pitch) {
  const ssml =
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>` +
    `<voice name='${voice}'>` +
    `<prosody rate='${rate}' pitch='${pitch}'>${text}</prosody>` +
    `</voice></speak>`;

  return (
    `X-Timestamp: ${getTimestamp()}\r\n` +
    `Content-Type: application/ssml+xml\r\n` +
    `Path: ssml\r\n\r\n` +
    ssml
  );
}

function parseMessage(raw) {
  const separator = raw.indexOf('\r\n\r\n');
  if (separator < 0) {
    return { headers: {}, body: raw };
  }
  const headerPart = raw.substring(0, separator);
  const body = raw.substring(separator + 4);
  const headers = {};
  headerPart.split('\r\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      headers[line.substring(0, idx).trim().toLowerCase()] = line.substring(idx + 1).trim();
    }
  });
  return { headers, body };
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
  name: 'Edge TTS',
  version: '1.0.0',
  description:
    'Microsoft Edge TTS using direct WebSocket. No proxy or Docker needed.',
  maxCharsPerRequest: 4000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 25,

  configSchema: [
    {
      key: 'voice',
      type: 'text',
      label: 'Voice',
      defaultValue: 'en-US-AvaNeural',
    },
    {
      key: 'outputFormat',
      type: 'text',
      label: 'Audio format',
      defaultValue: 'audio-24khz-48kbitrate-mono-mp3',
    },
  ],

  async getVoices() {
    return DEFAULT_VOICES;
  },

  async synthesize(text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      throw new Error('No speakable text');
    }

    const settings = options.pluginSettings || {};
    const voice = settings.voice || 'en-US-AvaNeural';
    const outputFormat = settings.outputFormat || 'audio-24khz-48kbitrate-mono-mp3';
    const speed = options.speed || 1.0;

    // Map speed 0.5..3.0 to Edge TTS rate string (-50%..+200%)
    const ratePercent = Math.round((speed - 1.0) * 100);
    const rate = `${ratePercent >= 0 ? '+' : ''}${ratePercent}%`;
    const pitch = '+0%';

    log(`synthesize START textLen=${text.length} voice=${voice} speed=${speed}`);

    const connectionId = uuidv4().replace(/-/g, '');
    const url = `${EDGE_TTS_URL}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&ConnectionId=${connectionId}`;

    const ws = new WebSocket(url);

    // Wait for open
    const openMsg = ws.receive();
    if (openMsg.type !== 'open') {
      throw new Error(`Edge TTS connection failed: ${openMsg.type} ${openMsg.data || ''}`);
    }

    // Send config
    ws.send(buildConfigMessage(outputFormat));

    // Send SSML
    ws.send(buildSsmlMessage(text, voice, rate, pitch));

    const audioChunks = [];

    while (true) {
      const msg = ws.receive();

      if (msg.type === 'binary') {
        let bytes = base64ToBytes(msg.data);
        // Edge TTS binary frames: [2-byte big-endian header length][header]\r\n[audio]
        if (bytes.length >= 2) {
          const headerLen = (bytes[0] << 8) | bytes[1];
          if (headerLen > 0 && headerLen + 2 <= bytes.length) {
            const headerEnd = 2 + headerLen;
            // Drop trailing \r\n between header and audio if present.
            let audioStart = headerEnd;
            if (
              bytes.length > audioStart + 1 &&
              bytes[audioStart] === 0x0d &&
              bytes[audioStart + 1] === 0x0a
            ) {
              audioStart += 2;
            }
            bytes = bytes.slice(audioStart);
          }
        }
        if (bytes.length > 0) {
          audioChunks.push(bytes);
        }
      } else if (msg.type === 'text') {
        const parsed = parseMessage(msg.data);
        const path = parsed.headers['path'] || '';
        if (path === 'turn.end') {
          break;
        }
        if (path === 'response') {
          try {
            const resp = JSON.parse(parsed.body);
            if (resp?.headers?.['X-RequestId'] && resp?.headers?.['X-StreamId']) {
              // ignore response metadata
            }
          } catch {}
        }
      } else if (msg.type === 'close' || msg.type === 'error') {
        throw new Error(`Edge TTS error: ${msg.data || msg.reason || 'unknown'}`);
      }
    }

    ws.close();

    if (audioChunks.length === 0) {
      throw new Error('No audio received from Edge TTS');
    }

    // Combine audio chunks. MP3 frames can be concatenated directly.
    let totalLength = 0;
    for (const chunk of audioChunks) {
      totalLength += chunk.length;
    }
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    log(`FINAL audio=${combined.length} bytes`);
    return {
      audioContent: combined.buffer,
      format: 'mp3',
      sampleRate: 24000,
    };
  },
};
