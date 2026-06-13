# LNReader TTS Plugins

Official plugin repository for LNReader's dynamic TTS system.

## Plugins

### Inworld AI TTS

Free cloud TTS that works out of the box.

- **File:** `inworld-tts.js`
- **Max chars:** 900 per request
- **Speed control:** No
- **Audio format:** WAV, 24 kHz

The plugin runs inside LNReader's QuickJS runtime. The native TTS engine
dispatches chunks in parallel (up to 3 concurrent requests), so performance
remains doze-resistant even though each request is synchronous inside the
plugin.

### Edge TTS

Microsoft Edge TTS using a direct WebSocket connection to Microsoft's speech
service. No local proxy, no Docker, no extra setup.

- **File:** `edge-tts.js`
- **Max chars:** 4000 per request
- **Speed control:** Yes
- **Audio format:** MP3, 24 kHz

### Cartesia Sonic (Free)

Free Cartesia Sonic TTS using public playground tokens. Extremely fast and high quality.

- **File:** `cartesia-free-tts.js`
- **Max chars:** 3000 per request
- **Speed control:** Yes
- **Audio format:** WAV, 44.1 kHz

### ElevenLabs TTS

Premium ElevenLabs TTS with API-key authenticated mode or hCaptcha anonymous mode.

- **File:** `elevenlabs-tts.js`
- **Max chars:** 5000 per request
- **Speed control:** Yes
- **Audio format:** MP3, 44.1 kHz
- **Auth:** Requires an ElevenLabs API key, or a fresh hCaptcha token from elevenlabs.io for anonymous mode.

### Kokoro TTS (DeepInfra)

Kokoro TTS via DeepInfra. State-of-the-art open-source TTS with multi-language voices, voice blending, and speed control.

- **File:** `kokoro-deepinfra-tts.js`
- **Max chars:** 2000 per request
- **Speed control:** Yes
- **Audio format:** MP3/WAV/Opus/FLAC, 24 kHz (depends on selected output format)
- **Auth:** Requires a DeepInfra API key

Voice IDs follow the Kokoro naming convention (`af_bella`, `am_michael`, `bf_emma`, etc.). Multiple voices can be blended by entering comma-separated IDs in the Default Voice field.

### Murf TTS

Free Murf.ai anonymous TTS with high-fidelity studio voices.

- **File:** `murf-tts.js`
- **Max chars:** 2000 per request
- **Speed control:** No
- **Audio format:** MP3, 44.1 kHz
- **Auth:** None

### Kyutai TTS

Free Kyutai TTS via WebSocket streaming. Features 200+ voices across expressive, studio, community, and research categories with no API key required.

- **File:** `kyutai-tts.js`
- **Max chars:** 5000 per request
- **Speed control:** No
- **Audio format:** WAV, 24 kHz
- **Auth:** None

## Adding this repo to LNReader

1. Go to **Settings → TTS → Plugin Sources**.
2. Tap **+**.
3. Paste the raw manifest URL:
   ```text
   https://raw.githubusercontent.com/rabie3150/lnreader-tts-plugins/main/tts-plugins.json
   ```
4. Save and pull to refresh.

LNReader also automatically adds this repository on first launch so the plugins
are available without manual configuration.

## Making your own plugin

See the full author guide in the LNReader repo:

👉 [`docs/tts-plugin-author-guide.md`](https://github.com/rabie3150/lnreader/blob/main/docs/tts-plugin-author-guide.md)

The guide covers:

- Required plugin interface (`id`, `name`, `version`, `synthesize`, etc.)
- The synchronous QuickJS runtime API (`fetch`, `WebSocket`, `base64ToArrayBuffer`, etc.)
- Parameter schema (`configSchema`) with all supported UI types
- Conditional visibility, validation, and defaults
- Packaging, manifest format, and publishing on GitHub

Quick reference of the runtime API:

- `fetch(url, options)` — blocking HTTP request. `options.body` supports
  strings and `ArrayBuffer`/`Uint8Array`.
- `WebSocket(url, headers?)` — blocking WebSocket. **Do not use `new`.** Returns an object with:
  - `ws.send(data)` — send text or binary
  - `ws.receive(timeoutMs?)` — block until the next message arrives. If `timeoutMs` is provided and no message arrives within that time, returns `{ type: 'timeout' }` so the plugin can close the socket cleanly instead of hanging.
  - `ws.close(code?, reason?)`
- `console.log(...)`
- `base64ToArrayBuffer(base64)`

Required plugin interface:

- `id`, `name`, `version`, `description`
- `maxCharsPerRequest`
- `supportsSpeedControl`
- `estimatedCharsPerSecond`
- `configSchema` (optional)
- `getVoices(options)`
- `synthesize(text, options)` returning `{ audioContent, format, sampleRate }`

`audioContent` can be an `ArrayBuffer` or `Uint8Array`.

Do not use `Buffer`, `atob`, or `btoa` — the QuickJS runtime does not provide
them. Decode base64 with the host-provided `base64ToArrayBuffer` instead.
