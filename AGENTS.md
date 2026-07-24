# LNReader TTS Plugins — Agent Guide

## Project overview

This is the official plugin repository for **LNReader's dynamic TTS (text-to-speech) system**. It contains standalone JavaScript plugins that LNReader (a React Native novel-reader app) downloads and executes inside its embedded JavaScript runtime to synthesize speech from text.

There is **no application code, no build system, and no dependency manifest** (no `package.json`, `pyproject.toml`, etc.). The repository is just:

- `tts-plugins.json` — the plugin manifest. This is the entry point LNReader fetches (via `raw.githubusercontent.com/rabie3150/lnreader-tts-plugins/main/tts-plugins.json`) to discover available plugins.
- One self-contained `.js` file per plugin, referenced by the manifest's `url` field.
- `README.md` — user-facing documentation of each plugin and how to add the repo to LNReader.
- `.validate/` — an empty directory (no validation tooling currently present).

### Plugins (as declared in `tts-plugins.json`; versions verified against each `.js` file)

| File | ID | Version | Notes |
|------|----|---------|-------|
| `inworld-tts.js` | `inworld-tts` | 1.1.3 | Free Inworld AI TTS, WAV 24 kHz, 900 chars/request |
| `inworld-tts-experimental.js` | `inworld-tts-experimental` | 1.2.0-exp.1 | Fork with per-feature `inworld-tts-2` steering-tag toggles |
| `edge-tts.js` | `edge-tts` | 1.0.4 | Microsoft Edge TTS over direct WebSocket, MP3 24 kHz, speed control |
| `cartesia-free-tts.js` | `cartesia-free-tts` | 1.0.4 | Cartesia Sonic via public playground tokens, WAV 44.1 kHz |
| `elevenlabs-tts.js` | `elevenlabs-tts` | 1.0.1 | ElevenLabs, API-key or hCaptcha anonymous mode, MP3 44.1 kHz |
| `kokoro-deepinfra-tts.js` | `kokoro-deepinfra-tts` | 1.0.2 | Kokoro via DeepInfra, requires API key, voice blending |
| `murf-tts.js` | `murf-tts` | 1.0.2 | Free anonymous Murf.ai, MP3 44.1 kHz |
| `kyutai-tts.js` | `kyutai-tts` | 1.0.4 | Free Kyutai via WebSocket streaming, 200+ voices, WAV 24 kHz |

## Runtime architecture

Plugins run inside LNReader's embedded JS runtime on the JS thread. The native TTS engine handles chunking (splitting text to `maxCharsPerRequest`) and dispatches chunks in parallel; the plugin itself only has to synthesize one chunk per call.

**Important:** the "Quick reference of the runtime API" section in `README.md` describes an older *synchronous QuickJS* contract (blocking `fetch`, blocking `WebSocket` without `new`, no `atob`/`btoa`). The actual code has since been migrated to an **async runtime contract** (see commit "convert all remaining plugins to async JS runtime contract"). Trust the code over the README:

- `fetch` is used with `await` and returns a standard response (`resp.ok`, `resp.status`, `resp.text()`, `resp.json()`).
- `WebSocket` is used as a standard constructor with promise wrappers for open/receive with timeouts. Two styles exist in the codebase:
  - `edge-tts.js`: `new WebSocket(url, undefined, { headers })` with `addEventListener('open'|'error')` — see `openWebSocket`/`wsReceive` helpers.
  - `kyutai-tts.js`: plain `new WebSocket(url)` **without** the headers options argument, using `ws.onopen`/`ws.onerror` handlers — the inline comment explains that some React Native builds reject the options object, so the constructor is kept simple. Match this style when touching Kyutai's transport.
- Both styles set `ws.binaryType = 'arraybuffer'`.
- `atob` is available and used for base64 decoding; `Buffer` is not.
- Plugins are loaded as modules: the plugin object is exported via `module.exports.default`.

## Plugin interface

Every plugin exports a single object via `module.exports.default` with:

- Metadata: `id`, `name`, `version`, `description` — **must match the manifest entry in `tts-plugins.json` exactly** (`id` and `version` especially).
- `maxCharsPerRequest`, `supportsSpeedControl`, `estimatedCharsPerSecond` — also duplicated in the manifest; keep both in sync.
- `configSchema` (optional) — array of UI fields. Observed field types:
  - `{ key, type: 'text', label, defaultValue }` (also used for API keys, e.g. `key: 'apiKey'`)
  - `{ key, type: 'select', label, defaultValue, options: [{ label, value }] }`
  - `{ key, type: 'switch', label, defaultValue, description }`
  - `{ key, type: 'group', label, children: [...] }` — nested groups of the above
- `getVoices: async function (options)` — returns `[{ id, name, languages: [lowercase codes], gender?, description? }]`. May fetch from the provider or return a static list; should catch errors and return `[]` rather than throw.
- `synthesize: async function (text, options)` — returns `{ audioContent, format, sampleRate }` where `audioContent` is an `ArrayBuffer` (e.g. `uint8.buffer`), `format` is `'mp3'` / `'wav'` / etc., and `sampleRate` is a number.
  - `options` shape: `{ voiceId, speed, pluginSettings }`. `pluginSettings` holds the user's `configSchema` values keyed by field `key`.

## Code conventions

- **Self-contained files, no imports.** Each plugin is one file with zero external dependencies. Shared helpers (`uuidv4`, `base64ToBytes`, retry-with-backoff, WAV header parsing/combining, WebSocket promise wrappers) are deliberately duplicated per file — do not try to factor them into a shared module.
- Plain ES5-ish style plus `async`/`await`, arrow functions, template literals. No TypeScript, no transpilation. String quotes are mixed across files (`inworld-tts.js` uses single quotes, `cartesia-free-tts.js` uses double) — match the file you're editing.
- Diagnostics via `console.log` with a plugin-specific prefix (e.g. `[EdgeTTS]`, `Inworld ...`) at key points: synthesize start, response status, chunk counts, errors.
- `synthesize` throws `new Error('No speakable text')` for empty text (checked with `/\p{L}|\p{N}/u`), and throws on provider errors after retries — the host engine handles retries/skip.
- Network calls use a retry wrapper with linear backoff (`synthesizeWithRetry(..., retries)` pattern, typically 2 retries).
- Providers returning multiple WAV chunks per response are merged with a `combineWavChunks` helper that validates RIFF headers and matching fmt params (see `inworld-tts.js`).
- When bumping a plugin, update `version` in **both** the `.js` file and `tts-plugins.json`, and update the README section if behavior changed.

## Build, test, and deployment

- **No build step** — plugin files are served as-is.
- **No automated tests or CI** in this repo. Validation is manual: load the plugin in LNReader (Settings → TTS → Plugin Sources) and run synthesis. Use `console.log` output for debugging.
- A basic syntax sanity check works with Node (`node --check <file>.js`; all 8 plugins currently pass), but plugins cannot be executed standalone in Node — they depend on the host runtime's `fetch`/`WebSocket` behavior.
- **Deployment = git push to `main`.** LNReader fetches `tts-plugins.json` and plugin files from `raw.githubusercontent.com`, so merging to the default branch publishes changes (subject to GitHub's raw-file caching). LNReader auto-adds this repo on first launch.
- Commit messages follow Conventional Commits with a plugin or manifest scope, e.g. `fix(inworld): only apply tone-tag preprocessing for TTS-2 model`, `fix(manifest): add maxCharsPerRequest, ...`.

## Known documentation drift (README.md)

The README is user-facing and partially stale — do not treat it as the source of truth:

- Its "Quick reference of the runtime API" describes the old synchronous QuickJS contract (see Runtime architecture above).
- Its Cartesia section says "Speed control: Yes", but the code and manifest set `supportsSpeedControl: false` — native speed control was disabled and the app applies local speed instead (commit `fix(cartesia): disable native speed control; app applies local speed`).

When changing plugin behavior, fix the corresponding README section rather than propagating the stale parts.

## Adding a new plugin

1. Create `<id>.js` at the repo root implementing the interface above (copy an existing plugin with a similar transport — HTTP like `inworld-tts.js` or WebSocket like `edge-tts.js`/`kyutai-tts.js` — as a starting point).
2. Add a matching entry to `tts-plugins.json` (`id`, `name`, `version`, `description`, `author: 'LNReader'`, `url: '<id>.js'`, and the three capability fields).
3. Document it in `README.md` with max chars, speed control, audio format, and auth requirements.

## Security considerations

- User secrets (e.g. DeepInfra/ElevenLabs API keys) are entered through `configSchema` `apiKey` text fields and arrive via `options.pluginSettings` — never hardcode them.
- Several plugins intentionally use **public/anonymous credentials** hardcoded in source: Edge TTS's `TRUSTED_CLIENT_TOKEN`, Inworld's random `inworld_uid` cookie, Cartesia's playground tokens, Murf/Kyutai anonymous endpoints. These are public-by-design client tokens, not private keys, but be aware they live in plain text and providers may rotate/revoke them.
- Plugins spoof browser `Origin`/`Referer`/`User-Agent` headers where providers require them; keep these consistent when updating provider request code.
