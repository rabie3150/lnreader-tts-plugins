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

Plugins run in LNReader's QuickJS runtime with a synchronous host API:

- `fetch(url, options)` — blocking HTTP request. `options.body` supports
  strings and `ArrayBuffer`/`Uint8Array`.
- `new WebSocket(url)` — blocking WebSocket. Returns an object with:
  - `ws.send(data)` — send text or binary
  - `ws.receive()` — block until the next message arrives
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
