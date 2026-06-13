// Microsoft Edge TTS plugin using direct WebSocket.
// No local proxy or Docker needed.

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_TTS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';
const WIN_EPOCH = 11644473600;
const CHROMIUM_VERSION = '130.0.2849.68';

// Minimal SHA-256 implementation for Sec-MS-GEC token generation.
function sha256(message) {
  function rotateRight(n, x) {
    return (x >>> n) | (x << (32 - n));
  }
  function choice(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function majority(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  const utf8 = [];
  for (let i = 0; i < message.length; i++) {
    let c = message.charCodeAt(i);
    if (c < 0x80) {
      utf8.push(c);
    } else if (c < 0x800) {
      utf8.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c < 0xd800 || c >= 0xe000) {
      utf8.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else {
      i++;
      c = 0x10000 + (((c & 0x3ff) << 10) | (message.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (c >> 18),
        0x80 | ((c >> 12) & 0x3f),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f),
      );
    }
  }

  const bitLen = utf8.length * 8;
  utf8.push(0x80);
  while ((utf8.length % 64) !== 56) utf8.push(0);
  for (let i = 56; i >= 0; i -= 8) utf8.push((bitLen >>> i) & 0xff);

  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  for (let offset = 0; offset < utf8.length; offset += 64) {
    const w = new Uint32Array(64);
    for (let i = 0; i < 16; i++) {
      w[i] =
        (utf8[offset + i * 4] << 24) |
        (utf8[offset + i * 4 + 1] << 16) |
        (utf8[offset + i * 4 + 2] << 8) |
        utf8[offset + i * 4 + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotateRight(7, w[i - 15]) ^ rotateRight(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotateRight(17, w[i - 2]) ^ rotateRight(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = H;

    for (let i = 0; i < 64; i++) {
      const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
      const ch = choice(e, f, g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
      const maj = majority(a, b, c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  let out = '';
  for (const v of H) {
    out += (v >>> 0).toString(16).padStart(8, '0');
  }
  return out.toUpperCase();
}

function generateSecMsGec() {
  let ticks = Math.floor(Date.now() / 1000) + WIN_EPOCH;
  ticks -= ticks % 300;
  ticks = Math.floor(ticks * 1e7);
  return sha256(`${ticks}${TRUSTED_CLIENT_TOKEN}`);
}

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

  getVoices: function () {
    return DEFAULT_VOICES;
  },

  synthesize: function (text, options) {
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
    const secMsGec = generateSecMsGec();
    const url =
      `${EDGE_TTS_URL}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
      `&ConnectionId=${connectionId}` +
      `&Sec-MS-GEC=${secMsGec}` +
      `&Sec-MS-GEC-Version=1-${CHROMIUM_VERSION}`;

    const ws = new WebSocket(url, {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        `(KHTML, like Gecko) Chrome/${CHROMIUM_VERSION.split('.')[0]}.0.0.0 Safari/537.36 ` +
        `Edg/${CHROMIUM_VERSION.split('.')[0]}.0.0.0`,
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
    });

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
