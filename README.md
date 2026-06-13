# LNReader TTS Plugins

Example plugin repository for LNReader's dynamic TTS system.

## Plugins

### Inworld AI TTS

Free cloud TTS that works out of the box.

- **File:** `inworld-tts.js`
- **Max chars:** 900 per request
- **Speed control:** No
- **Audio format:** WAV, 24 kHz

### Edge TTS (local proxy)

Microsoft Edge TTS through a local proxy. Requires running a proxy because the
QuickJS runtime inside LNReader does not expose WebSocket, which Edge TTS uses
natively.

- **File:** `edge-tts.js`
- **Max chars:** 4000 per request
- **Speed control:** Yes
- **Audio format:** MP3, 24 kHz

#### Running the proxy

```bash
docker run -d -p 5050:5050 travisvn/openai-edge-tts:latest
```

Then in LNReader make sure the Edge TTS plugin setting **Proxy URL** is:

```text
http://localhost:5050/v1/audio/speech
```

If the proxy is on another machine, use that machine's IP instead of
`localhost`.

## Adding this repo to LNReader

1. Go to **Settings → TTS → Plugin Sources**.
2. Tap **+**.
3. Paste the raw manifest URL:
   ```text
   https://raw.githubusercontent.com/rabie3150/lnreader-tts-plugins/main/tts-plugins.json
   ```
4. Save and pull to refresh.

## Making your own plugin

See the example files for the required interface:

- `id`, `name`, `version`, `description`
- `maxCharsPerRequest`
- `supportsSpeedControl`
- `estimatedCharsPerSecond`
- `configSchema` (optional)
- `async getVoices(options)`
- `async synthesize(text, options)` returning `{ audioContent, format, sampleRate }`
