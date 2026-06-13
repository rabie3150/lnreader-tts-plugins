const CARTESIA_VERSION = "2026-03-01";
const PUBLIC_TOKEN_URL = "https://backend.cartesia.ai/access-token/public";
const API_URL = "https://api.cartesia.ai/tts/bytes";

/**
 * Cartesia returns a "streaming" WAV where the RIFF and data chunk sizes
 * are set to 0xFFFFFFFF. Android MediaPlayer (NuPlayer) rejects this as
 * malformed and throws `Prepare failed.: status=0x1`. Rewrite the sizes
 * to the actual file/data lengths so standard players accept it.
 */
function fixWavHeader(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 12) return buffer;
  if (
    bytes[0] !== 0x52 || // R
    bytes[1] !== 0x49 || // I
    bytes[2] !== 0x46 || // F
    bytes[3] !== 0x46    // F
  ) {
    return buffer;
  }

  const view = new DataView(buffer);
  const fileLen = buffer.byteLength;

  // RIFF chunk size = file size - 8 (bytes 4-7, little-endian)
  view.setUint32(4, fileLen - 8, true);

  // Walk chunks to find the 'data' chunk
  let offset = 12;
  while (offset < fileLen - 8) {
    const chunkId = String.fromCharCode(
      bytes[offset],
      bytes[offset + 1],
      bytes[offset + 2],
      bytes[offset + 3],
    );
    const chunkSize = view.getUint32(offset + 4, true);

    if (chunkId === 'data') {
      view.setUint32(offset + 4, fileLen - offset - 8, true);
      break;
    }

    const chunkTotal = chunkSize + 8;
    offset += chunkTotal + (chunkTotal & 1);
  }

  return buffer;
}

function fetchToken() {
  const resp = fetch(PUBLIC_TOKEN_URL, {
    method: "GET",
    headers: {
      "Accept": "*/*",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch Cartesia public token: HTTP " + resp.status);
  }

  const data = resp.json();
  if (!data.token) {
    throw new Error("No token found in Cartesia response");
  }

  return data.token;
}

module.exports.default = {
  id: "cartesia-free-tts",
  name: "Cartesia Sonic (Free)",
  version: "1.0.2",
  description: "Free Cartesia Sonic TTS using public playground tokens. Extremely fast and high quality.",
  maxCharsPerRequest: 3000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 18,

  configSchema: [
    {
      key: "voice",
      type: "select",
      label: "Voice",
      defaultValue: "694f9389-aac1-45b6-b726-9d9369183238",
      options: [
        { label: "American English", value: "694f9389-aac1-45b6-b726-9d9369183238" },
        { label: "British English", value: "a0e99841-438c-4a64-b679-ae501e7d6091" },
        { label: "Friendly Woman", value: "f786b574-daa5-4673-aa0c-cbe3e8534c02" },
        { label: "Helpful Woman", value: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc" },
        { label: "Customer Support (TL/PH)", value: "25d7abcb-4d6d-4aca-adce-8a1c85620c8b" },
        { label: "Sonic Default", value: "e07c00bc-4134-4eae-9ea4-1a55fb45746b" },
        { label: "Generation Voice", value: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4" }
      ]
    },
    {
      key: "model",
      type: "select",
      label: "Model",
      defaultValue: "sonic-3",
      options: [
        { label: "Sonic 3 (High Quality, Low Latency)", value: "sonic-3" },
        { label: "Sonic 3.5 (Highest Quality)", value: "sonic-3.5" },
        { label: "Sonic Turbo (Maximum Speed)", value: "sonic-turbo" }
      ]
    },
    {
      key: "emotion",
      type: "select",
      label: "Emotion",
      defaultValue: "none",
      options: [
        { label: "None", value: "none" },
        { label: "High Positivity", value: "positivity:high" },
        { label: "Medium Surprise", value: "surprise:medium" },
        { label: "High Anger", value: "anger:high" },
        { label: "High Sadness", value: "sadness:high" },
        { label: "High Curiosity", value: "curiosity:high" }
      ]
    }
  ],

  getVoices: function () {
    // The /voices endpoint is blocked for public tokens, so we use the curated list.
    return [
      { id: "694f9389-aac1-45b6-b726-9d9369183238", name: "American English", languages: ["en"], gender: "female" },
      { id: "a0e99841-438c-4a64-b679-ae501e7d6091", name: "British English", languages: ["en"], gender: "male" },
      { id: "f786b574-daa5-4673-aa0c-cbe3e8534c02", name: "Friendly Woman", languages: ["en"], gender: "female" },
      { id: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc", name: "Helpful Woman", languages: ["en"], gender: "female" },
      { id: "25d7abcb-4d6d-4aca-adce-8a1c85620c8b", name: "Customer Support (TL/PH)", languages: ["tl"], gender: "female" },
      { id: "e07c00bc-4134-4eae-9ea4-1a55fb45746b", name: "Sonic Default", languages: ["en"], gender: "female" },
      { id: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4", name: "Generation Voice", languages: ["en"], gender: "female" }
    ];
  },

  synthesize: function (text, options) {
    if (!text || text.trim() === "") {
      throw new Error("Text cannot be empty");
    }

    const settings = options.pluginSettings || {};
    const model = settings.model || "sonic-3";
    const voiceId = options.voiceId || settings.voice || "694f9389-aac1-45b6-b726-9d9369183238";
    const speed = options.speed || 1.0;

    // We must fetch a fresh token for every request because they expire in 60s
    // and we have no global state to cache them across plugin invocations easily.
    const token = fetchToken();

    const payload = {
      transcript: text,
      model_id: model,
      voice: { mode: "id", id: voiceId },
      output_format: {
        container: "wav",
        encoding: "pcm_s16le",
        sample_rate: 44100
      },
      speed: speed
    };

    if (settings.emotion && settings.emotion !== "none") {
      payload.emotion = [settings.emotion];
    }

    const resp = fetch(API_URL, {
      method: "POST",
      headers: {
        "Cartesia-Version": CARTESIA_VERSION,
        "X-API-Key": token,
        "Content-Type": "application/json",
        "Accept": "*/*"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      throw new Error("Cartesia API Error: HTTP " + resp.status + " " + resp.text());
    }

    return {
      audioContent: fixWavHeader(resp.arrayBuffer()),
      format: "wav",
      sampleRate: 44100
    };
  }
};
