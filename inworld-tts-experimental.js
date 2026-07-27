// Inworld AI TTS plugin (experimental steering build) for LNReader.
// Clone of inworld-tts.js with per-feature toggles for testing inworld-tts-2
// steering tags on novel text.

const API_URL = 'https://inworld.ai/api/create-speech';
const LIST_VOICES_URL = 'https://inworld.ai/api/list-voices';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidWavHeader(bytes) {
  return (
    bytes.length >= 44 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  );
}

function getWavFmtParams(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  return {
    audioFormat: view.getUint16(20, true),
    numChannels: view.getUint16(22, true),
    sampleRate: view.getUint32(24, true),
    bitsPerSample: view.getUint16(34, true),
  };
}

function combineWavChunks(chunks) {
  const validChunks = chunks.filter(isValidWavHeader);
  if (validChunks.length === 0) {
    throw new Error('No valid WAV chunks to combine');
  }
  if (validChunks.length === 1) {
    return validChunks[0];
  }

  const refFmt = getWavFmtParams(validChunks[0]);
  for (let i = 1; i < validChunks.length; i++) {
    const fmt = getWavFmtParams(validChunks[i]);
    if (
      fmt.audioFormat !== refFmt.audioFormat ||
      fmt.numChannels !== refFmt.numChannels ||
      fmt.sampleRate !== refFmt.sampleRate ||
      fmt.bitsPerSample !== refFmt.bitsPerSample
    ) {
      throw new Error(`WAV chunk ${i} fmt mismatch`);
    }
  }

  const header = new Uint8Array(validChunks[0].slice(0, 44));
  let pcmLength = 0;
  for (const chunk of validChunks) {
    pcmLength += chunk.length - 44;
  }

  const view = new DataView(header.buffer, header.byteOffset);
  view.setUint32(4, 36 + pcmLength, true);
  view.setUint32(40, pcmLength, true);

  const result = new Uint8Array(44 + pcmLength);
  result.set(header, 0);
  let offset = 44;
  for (const chunk of validChunks) {
    result.set(chunk.slice(44), offset);
    offset += chunk.length - 44;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Steering preprocessor (experimental)
// ---------------------------------------------------------------------------

// Heuristic: does this bracketed text already look like a steering instruction?
const STEERING_LIKE = /^(say|sound|speak|whisper|laugh|sigh|breathe|yawn|cough|clear throat|articulate|very|quietly|loudly|fast|slow|low|high|playfully|sadly|excitedly|concerned|terrified)/i;

const NONVERBAL_PATTERNS = [
  { pattern: /\*laughs?\*/gi, tag: '[laugh]' },
  { pattern: /\*sighs?\*/gi, tag: '[sigh]' },
  { pattern: /\*coughs?\*/gi, tag: '[cough]' },
  { pattern: /\*clears? throat\*/gi, tag: '[clear throat]' },
  { pattern: /\*yawns?\*/gi, tag: '[yawn]' },
  { pattern: /\*breathes?\*/gi, tag: '[breathe]' },
];

function inferDialogueTone(quote) {
  if (/!!!/.test(quote)) return '[say excitedly with force]';
  if (/\?\!/.test(quote) || /\!\?/.test(quote)) return '[say with surprised intensity]';
  if (/\?$/.test(quote)) return '[say with a rising pitch]';
  if (/[A-Z]{3,}/.test(quote)) return '[say with force and very loud]';
  if (/love|sorry|thank|please/i.test(quote)) return '[say warmly]';
  return '[say naturally]';
}

function applyPunctuationSteering(sentence) {
  if (/!!!/.test(sentence)) return `[say excitedly with force] ${sentence}`;
  if (/\?\!/.test(sentence) || /\!\?/.test(sentence)) {
    return `[say with surprised intensity] ${sentence}`;
  }
  if (/\?$/.test(sentence.trim())) return `[say with a rising pitch] ${sentence}`;
  if (/\.\.\.$/.test(sentence.trim())) {
    return `[say slowly with deliberate pauses] ${sentence}`;
  }
  return sentence;
}

function preprocessInworldText(text, model, settings) {
  const s = settings || {};

  // For non-TTS-2 models, strip any steering-like tags so they are not read verbatim.
  if (model !== 'inworld-tts-2') {
    return text.replace(/\[([^\[\]]+)\]/g, (match, content) => {
      const trimmed = content.trim();
      return STEERING_LIKE.test(trimmed) ? '' : content;
    });
  }

  // Master steering toggle. When off, send raw text even on tts-2.
  if (s.steeringEnabled === false) {
    return text;
  }

  let out = text;

  // 1. Preserve existing steering tags; wrap bracketed non-steering text
  //    (e.g. system messages, chapter titles) with an announcement tone.
  if (s.steeringPreserveTags !== false) {
    out = out.replace(/\[([^\[\]]+)\]/g, (match, content) => {
      const trimmed = content.trim();
      if (!trimmed) return match;
      if (STEERING_LIKE.test(trimmed)) return match;
      return `[in a clear announcement tone] ${trimmed} [in narration tone]`;
    });
  }

  // 2. Convert inline sound cues like *sigh* / *laugh* to non-verbal tags.
  if (s.steeringNonVerbals) {
    for (const { pattern, tag } of NONVERBAL_PATTERNS) {
      out = out.replace(pattern, tag);
    }
  }

  // 3. Italics / asterisks: usually internal monologue, emphasis, or whispered lines.
  if (s.steeringItalics) {
    // Double asterisks / caps-inside-italics => forceful emphasis.
    out = out.replace(/\*\*([^\*]+)\*\*/g, '[say with force and very loud] $1 [in narration tone]');
    // Single asterisks or underscores => hushed / thoughtful.
    out = out.replace(/\*([^\*]+)\*/g, '[quietly with a hushed thoughtful tone] $1 [in narration tone]');
    out = out.replace(/_([^_]+)_/g, '[quietly with a hushed thoughtful tone] $1 [in narration tone]');
  }

  // 4. ALL CAPS shouting (single word like "STOP!" or multi-word like "NO WAY").
  if (s.steeringShouting) {
    out = out.replace(/\b([A-Z]{2,}(?:\s+[A-Z]{2,})*)\b/g, '[say with force and very loud] $1 [in narration tone]');
  }

  // 5. Punctuation-based first-sentence emotion.
  //    Skip if the first sentence already contains steering tags (avoids double-tagging).
  if (s.steeringPunctuation) {
    const firstSentenceMatch = out.match(/^[^.!?]+[.!?]+/);
    if (firstSentenceMatch && !firstSentenceMatch[0].includes('[')) {
      const firstSentence = firstSentenceMatch[0];
      const steered = applyPunctuationSteering(firstSentence);
      if (steered !== firstSentence) {
        out = steered + out.slice(firstSentence.length);
      }
    }
  }

  // 6. Quoted dialogue: infer tone from the quote itself.
  if (s.steeringDialogue) {
    out = out.replace(/"([^"]{3,500})"/g, (match, quote) => {
      const tag = inferDialogueTone(quote);
      return `"${tag} ${quote} [in narration tone]"`;
    });
  }

  // 7. Always reset to narration tone at the end of the chunk so style does not bleed
  //    into the next chunk.
  if (s.steeringResetTone !== false) {
    out = out + ' [in narration tone]';
  }

  return out;
}

// ---------------------------------------------------------------------------
// Network / audio helpers
// ---------------------------------------------------------------------------

async function synthesizeSingleRequest(text, voice, model, speed) {
  const uid = uuidv4();

  const payload = {
    text,
    voiceId: voice,
    modelId: model,
    deliveryMode: 'CREATIVE',
    temperature: 1.0,
    applyTextNormalization: 'ON',
    timestampType: 'TIMESTAMP_TYPE_UNSPECIFIED',
    audioConfig: {
      audioEncoding: 'LINEAR16',
      sampleRateHertz: 24000,
      speakingRate: speed,
    },
  };

  console.log(`InworldExp synthesize textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `inworld_uid=${uid}`,
      'Origin': 'https://inworld.ai',
      'Referer': 'https://inworld.ai/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(payload),
  });

  console.log(`InworldExp response status=${resp.status}`);

  if (!resp.ok) {
    const errText = await resp.text();
    console.log(`InworldExp HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
    throw new Error(`Inworld TTS HTTP ${resp.status}`);
  }

  const bodyText = await resp.text();
  const lines = bodyText.split('\n').filter(l => l.trim());
  console.log(`InworldExp NDJSON lines=${lines.length}`);

  const audioChunks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const data = JSON.parse(line);
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      const base64Audio = data.result?.audioContent;
      if (base64Audio) {
        audioChunks.push(base64ToBytes(base64Audio));
      }
    } catch (e) {
      console.log(`InworldExp LINE${i} PARSE ERROR: ${e.message || e}`);
    }
  }

  if (audioChunks.length === 0) {
    throw new Error('Inworld TTS response missing audioContent');
  }

  console.log(`InworldExp SUCCESS chunks=${audioChunks.length}`);

  if (audioChunks.length === 1) {
    return audioChunks[0];
  }
  return combineWavChunks(audioChunks);
}

async function synthesizeWithRetry(text, voice, model, speed, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice, model, speed);
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
  id: 'inworld-tts-experimental',
  name: 'Inworld AI TTS (Experimental Steering)',
  version: '1.2.0-exp.3',
  description:
    'Experimental Inworld AI TTS build with per-feature toggles for inworld-tts-2 steering tags. Test italics, shouting, punctuation, dialogue, and non-verbal cues.',
  maxCharsPerRequest: 900,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 13,

  configSchema: [
    {
      key: 'model',
      type: 'select',
      label: 'Model',
      defaultValue: 'inworld-tts-1.5-mini',
      options: [
        { label: '1.5 mini (fastest streaming)', value: 'inworld-tts-1.5-mini' },
        { label: '1.5 max (best quality)', value: 'inworld-tts-1.5-max' },
        { label: 'Inworld TTS 1', value: 'inworld-tts-1' },
        { label: 'Inworld TTS 2', value: 'inworld-tts-2' },
      ],
    },
    {
      key: 'steeringGroup',
      type: 'group',
      label: 'TTS-2 Steering (experimental)',
      children: [
        {
          key: 'steeringEnabled',
          type: 'switch',
          label: 'Enable steering preprocessing',
          defaultValue: true,
          description: 'Master toggle. Only affects inworld-tts-2.',
        },
        {
          key: 'steeringPreserveTags',
          type: 'switch',
          label: 'Preserve existing [steering tags]',
          defaultValue: true,
          description: 'Leave real steering tags alone; wrap other bracketed text as announcements.',
        },
        {
          key: 'steeringNonVerbals',
          type: 'switch',
          label: 'Convert *sigh* / *laugh* to tags',
          defaultValue: true,
        },
        {
          key: 'steeringItalics',
          type: 'switch',
          label: 'Steer italics / asterisks',
          defaultValue: true,
          description: '*text* → hushed thought; **text** → forceful emphasis.',
        },
        {
          key: 'steeringShouting',
          type: 'switch',
          label: 'Steer ALL CAPS shouting',
          defaultValue: true,
        },
        {
          key: 'steeringPunctuation',
          type: 'switch',
          label: 'Steer by punctuation',
          defaultValue: true,
          description: '!? / ... / !!! on the first sentence of each chunk.',
        },
        {
          key: 'steeringDialogue',
          type: 'switch',
          label: 'Steer quoted dialogue',
          defaultValue: false,
          description: 'Infer tone from text inside "quotes". Can be aggressive; test first.',
        },
        {
          key: 'steeringResetTone',
          type: 'switch',
          label: 'Reset tone at chunk end',
          defaultValue: true,
          description: 'Append [in narration tone] so style does not carry into the next chunk.',
        },
      ],
    },
  ],

  getVoices: async function () {
    try {
      const uid = uuidv4();
      const resp = await fetch(LIST_VOICES_URL, {
        headers: {
          'Cookie': `inworld_uid=${uid}`,
          'Origin': 'https://inworld.ai',
          'Referer': 'https://inworld.ai/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      });
      const data = await resp.json();
      return (data.voices || []).map(v => ({
        id: v.voiceId,
        name: v.displayName || v.voiceId,
        languages: (v.languages || ['en']).map(l => l.toLowerCase()),
        description: v.description || '',
      }));
    } catch (e) {
      console.log('InworldExp getVoices error:', e?.message || e);
      return [];
    }
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      console.log('InworldExp SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const voice = options.voiceId || settings.voice || 'Elliot';
    const model = settings.model || 'inworld-tts-1.5-mini';
    const speed = options.speed || 1.0;

    console.log(`InworldExp synthesize START textLen=${text.length} voice=${voice} model=${model} speed=${speed}`);

    const processedText = preprocessInworldText(text, model, settings);
    const audio = await synthesizeWithRetry(processedText, voice, model, speed, 2);

    console.log(`InworldExp FINAL audio=${audio.length} bytes`);
    return {
      audioContent: audio.buffer,
      format: 'wav',
      sampleRate: 24000,
    };
  },
};
