# LNReader TTS Plugins

Official plugin repository for LNReader's dynamic TTS system.

## Plugins

### Inworld AI TTS

Free cloud TTS that works out of the box.

- **File:** `inworld-tts.js`
- **Max chars:** 900 per request
- **Speed control:** No
- **Audio format:** MP3, 48 kHz

The plugin runs inside LNReader's QuickJS runtime. The native TTS engine
dispatches chunks in parallel (up to 3 concurrent requests), so performance
remains doze-resistant even though each request is synchronous inside the
plugin.

### Inworld AI TTS (Experimental Steering)

Experimental fork of Inworld AI TTS focused on `inworld-tts-2` steering tags for novel narration.

- **File:** `inworld-tts-experimental.js`
- **Max chars:** 900 per request
- **Speed control:** No
- **Audio format:** MP3, 48 kHz

Each steering feature has its own toggle so you can test what works best for your source:

| Toggle | Effect |
|--------|--------|
| Enable steering preprocessing | Master on/off switch (only affects `inworld-tts-2`). |
| Preserve existing `[steering tags]` | Leaves real steering tags alone; wraps other bracketed text as announcements. |
| Convert `*sigh*` / `*laugh*` to tags | Turns inline sound cues into Inworld non-verbal tags. |
| Steer italics / asterisks | `*text*` → hushed thought; `**text**` → forceful emphasis. |
| Steer ALL CAPS shouting | Wraps consecutive all-caps words with force/volume tags. |
| Steer by punctuation | Adds emotion tags for `!?`, `...`, or `!!!` on the first sentence of a chunk. |
| Steer quoted dialogue | Infers tone from text inside `"quotes"` (disabled by default; can be aggressive). |
| Reset tone at chunk end | Appends `[in narration tone]` so style does not carry into the next chunk. |

> **Note:** Steering tags consume characters from the 900-char budget. Keep only the toggles you actually need for cleaner output and fewer chunk splits.

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

### Fish Audio TTS

Fish Audio TTS using the official API. Fast, high-quality voices with support for emotion/steering tags.

- **File:** `fish-audio-tts.js`
- **Max chars:** 3000 per request
- **Speed control:** Yes
- **Audio format:** MP3, 44.1 kHz
- **Auth:** Requires a Fish Audio API key

### AIVocal TTS (Free)

Free anonymous AIVocal.io TTS using the web-playground endpoint. 30 Kokoro voices (US/GB English, French, Hindi, Italian) with emotion control (calm, happy, sad, angry, fearful, disgusted, surprised).

- **File:** `aivocal-tts.js`
- **Max chars:** 3000 per request
- **Speed control:** Yes
- **Audio format:** WAV, 24 kHz
- **Auth:** None

The free quota is keyed on an `anonymous_user_id` cookie (not your IP), so the plugin generates a fresh anonymous ID per chunk — usage is effectively unlimited.

### TTSMP3 (Amazon Polly)

Free Amazon Polly TTS via `ttsmp3.com` featuring 60+ natural voices across 20+ languages. No API key or sign-up required.

- **File:** `ttsmp3-tts.js`
- **Max chars:** 1000 per request
- **Speed control:** No
- **Audio format:** MP3, 24 kHz
- **Auth:** None

Provides instant access to popular Amazon Polly voices (Matthew, Joanna, Brian, Amy, Hans, Celine, Ricardo, etc.).

### TikTok TTS (Free)

Free TikTok viral TTS via `lazypy.ro` featuring 110+ character, narrator, and multilingual voices. No API key required.

- **File:** `tiktok-tts.js`
- **Max chars:** 300 per request
- **Speed control:** No
- **Audio format:** MP3, 24 kHz
- **Auth:** None

Includes iconic TikTok voices such as Story Teller, Professor, Jessie, Ghostface, C-3PO, Rocket Raccoon, and singing voices.

### Sound of Text (Google)

Free Google Translate TTS via `api.soundoftext.com` covering 60+ language accents. No API key required.

- **File:** `soundoftext-tts.js`
- **Max chars:** 100 per request
- **Speed control:** No
- **Audio format:** MP3, 24 kHz
- **Auth:** None

### ResponsiveVoice TTS

Free multilingual speech synthesis via `code.responsivevoice.org` covering 75+ natural voices in 40+ languages. Zero sign-up, no login or custom API key needed.

- **File:** `responsivevoice-tts.js`
- **Max chars:** 1000 per request
- **Speed control:** Yes (configurable pitch and rate multipliers)
- **Audio format:** MP3, 24 kHz
- **Auth:** None

Provides instant access to global voice models across English, Spanish, French, German, Japanese, Chinese, Arabic, Russian, and more.

### Readloud TTS

Free Amazon Polly / Ivona TTS via `readloud.net` featuring 40 natural voices across 18 languages. No API key or account required.

- **File:** `readloud-tts.js`
- **Max chars:** 2000 per request
- **Speed control:** Yes (speed & pitch range adjustments)
- **Audio format:** MP3, 24 kHz
- **Auth:** None

Supports standard Amazon Polly and Ivona narrators (Eric, Brian, Ivy, Joey, Sally, Justin, Jennifer, etc.) with long-text capacity.

### FreeTTS (Neural)

Free neural TTS via `freetts.ai` powered by Microsoft Edge / Azure neural voices. Includes 320+ voices across 70+ languages. Zero sign-up, no API key required.

- **File:** `freetts-tts.js`
- **Max chars:** 1000 per request
- **Speed control:** Yes (configurable speed multipliers from 0.5x to 2.0x)
- **Audio format:** MP3, 24 kHz
- **Auth:** None

Direct JSON REST endpoint returning audio binary without WebSocket complexity.

### Ondoku TTS

Free multilingual speech synthesis via `ondoku3.com` featuring 690+ neural voices across 70+ languages. Zero sign-up, no login required for up to 1,000 characters per conversion.

- **File:** `ondoku-tts.js`
- **Max chars:** 1000 per request
- **Speed control:** Yes (speed & pitch adjustments)
- **Audio format:** MP3, 24 kHz
- **Auth:** None

Accesses global Azure and GCP neural voices with automatic session token handling and Google Cloud Storage audio streaming.

### Moe TTS (Anime & Genshin)

Free anime character speech synthesis powered by VITS via the `skytnt/moe-tts` Hugging Face Space. Features 260+ gaming and anime characters including Genshin Impact and Honkai series. No API key or sign-up required.

- **File:** `moe-tts.js`
- **Max chars:** 300 per request
- **Speed control:** Yes (configurable speed multipliers from 0.5x to 2.0x)
- **Audio format:** WAV, 24 kHz
- **Auth:** None

Direct Gradio 4 SSE protocol client with automatic server-side URL normalization.

### Kokoro TTS (Free 82M)

Free open-weight neural TTS powered by Hexgrad's Kokoro-82M model running on a dedicated CPU Hugging Face Space (`RobinsAIWorld/Kokoro-TTS-cpu`). Delivers human-like prosody with 28 American and British voices without requiring API keys, login, or ZeroGPU session limits.

- **File:** `kokoro-free-tts.js`
- **Max chars:** 500 per request
- **Speed control:** Yes (configurable speed multipliers from 0.5x to 2.0x)
- **Audio format:** WAV, 24 kHz
- **Auth:** None

### Umamusume VITS (Anime & Game)

Free anime character speech synthesis powered by VITS via the `Plachta/VITS-Umamusume-voice-synthesizer` Hugging Face Space running on CPU. Features 147 expressive voices from Umamusume Pretty Derby supporting English, Japanese, and Chinese narration modes.

- **File:** `umamusume-tts.js`
- **Max chars:** 300 per request
- **Speed control:** Yes (configurable speed multipliers from 0.5x to 2.0x)
- **Audio format:** WAV, 22.05 kHz
- **Auth:** None

### Coqui VITS (Multilingual)

Free open-source multilingual neural speech synthesis powered by Coqui VITS via `mbarnig/lb_de_fr_en_pt_COQUI_VITS_TTS` running on CPU. Features 8 distinct voices supporting English, German, French, Portuguese, and Luxembourgish.

- **File:** `coqui-vits-tts.js`
- **Max chars:** 500 per request
- **Speed control:** No
- **Audio format:** WAV, 22.05 kHz
- **Auth:** None

### StyleTTS 2 (Free)

Free open-weight neural TTS using StyleTTS 2 via the `Pendrokar/style-tts-2` Hugging Face Space running on CPU. Employs style diffusion and adversarial training with large speech language models for human-level prosody and expressive pacing.

- **File:** `styletts2-tts.js`
- **Max chars:** 500 per request
- **Speed control:** No (Diffusion steps configurable)
- **Audio format:** WAV, 24 kHz
- **Voices:** 8 expressive US voices (`f-us-1`..`4`, `m-us-1`..`4`) across 19 languages
- **Auth:** None

### ChatTTS (Free Conversational)

Free conversational speech model powered by 2Noise ChatTTS via `rainnee/ChatTTS` on CPU. Renowned on AI TTS leaderboards for unmatched conversational prosody, natural laughter, subtle breaths, and realistic storytelling cadence.

- **File:** `chattts-tts.js`
- **Max chars:** 400 per request
- **Speed control:** No (Temperature control supported)
- **Audio format:** WAV, 24 kHz
- **Voices:** 8 curated speaker seeds (Conversational, Storyteller, Friendly, Casual, Narrative)
- **Auth:** None

### VoxWorker TTS (Free)

Multi-engine speech synthesis aggregator featuring open-source RHVoice and Yandex SpeechKit Pro neural models via VoxWorker. High reliability, zero sign-up, and clean studio audio.

- **File:** `voxworker-tts.js`
- **Max chars:** 1000 per request
- **Speed control:** Yes (0.8x to 1.5x)
- **Pitch control:** Yes (-0.5 to +0.5)
- **Audio format:** MP3, 24 kHz
- **Voices:** 17 voices across English, Russian, and Ukrainian
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
