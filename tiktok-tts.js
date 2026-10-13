// TikTok Free TTS plugin for LNReader React Native JS runtime.
// Uses lazypy.ro's public endpoint to access 110+ TikTok character and multilingual voices.
// No API key required. Returns MP3 audio at 24 kHz.
// Runs on the JS thread; the app handles parallel chunk synthesis.

const ENDPOINT = 'https://lazypy.ro/tts/request_tts.php';
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const VOICES = [
  {
    "id": "en_uk_001",
    "name": "Narrator (Chris) (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_uk_003",
    "name": "UK Male 2 (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_emotional",
    "name": "Peaceful (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_au_001",
    "name": "Metro (Eddie) (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_au_002",
    "name": "Smooth (Alex) (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_us_002",
    "name": "Jessie (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_us_006",
    "name": "Joey (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_us_007",
    "name": "Professor (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_us_009",
    "name": "Scientist (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_us_010",
    "name": "Confidence (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_samc",
    "name": "Empathetic (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_cody",
    "name": "Serious (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_narration",
    "name": "Story Teller (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_funny",
    "name": "Wacky (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_jarvis",
    "name": "Alfred (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_ashmagic",
    "name": "Ash Magic (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_santa_narration",
    "name": "Author (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_betty",
    "name": "Bae (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_makeup",
    "name": "Beauty Guru (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_richgirl",
    "name": "Bestie (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_amie",
    "name": "Billy (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_jason",
    "name": "Captain (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_chris",
    "name": "Chris (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_miki",
    "name": "Comedian (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_cupid",
    "name": "Cupid (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_female_shenna",
    "name": "Debutante (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_whitney",
    "name": "Designer (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_doll",
    "name": "Doll (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_adam_elf",
    "name": "Elf (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_adrian",
    "name": "Foodie (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_jomboy",
    "name": "Game On (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_ghost",
    "name": "Ghost (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_ghosthost",
    "name": "Ghost Host (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_david_gingerman",
    "name": "GingerChime (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_grandma",
    "name": "Grandma (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_ukneighbor",
    "name": "Lord Cringe (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_wizard",
    "name": "Magician (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_trevor",
    "name": "Marty (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_deadpool",
    "name": "Mr. GoodGuy (Deadpool) (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_ukbutler",
    "name": "Mr. Meticulous (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_olantekkers",
    "name": "Olantekkers (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_petercullen",
    "name": "Optimus Prime (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_pirate",
    "name": "Pirate (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_santa",
    "name": "Santa (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_santa_effect",
    "name": "Santa (w/ effect) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_corey_santa",
    "name": "Santa (Corey) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_maxwell",
    "name": "Stylist (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_pansino",
    "name": "Varsity (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_erika",
    "name": "Victory (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_werewolf",
    "name": "Werewolf (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_female_witch",
    "name": "Witch (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_female_zombie",
    "name": "Zombie (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_grinch",
    "name": "Trickster (Grinch) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_us_ghostface",
    "name": "Ghostface (Scream) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_us_chewbacca",
    "name": "Chewbacca (Star Wars) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_us_c3po",
    "name": "C-3PO (Star Wars) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_us_stormtrooper",
    "name": "Stormtrooper (Star Wars) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_us_stitch",
    "name": "Stitch (Lilo & Stitch) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_us_rocket",
    "name": "Rocket (Guardians of the Galaxy) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_female_madam_leota",
    "name": "Madame Leota (Haunted Mansion) (English)",
    "languages": [
      "en"
    ],
    "gender": "other"
  },
  {
    "id": "en_male_sing_deep_jingle",
    "name": "Song: Caroler (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_m03_classical",
    "name": "Song: Classic Electric (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_f08_salut_damour",
    "name": "Song: Cottagecore (Salut d'Amour) (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_m2_xhxs_m03_christmas",
    "name": "Song: Cozy (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_f08_warmy_breeze",
    "name": "Song: Open Mic (Warmy Breeze) (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_ht_f08_halloween",
    "name": "Song: Opera (Halloween) (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_ht_f08_glorious",
    "name": "Song: Euphoric (Glorious) (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_sing_funny_it_goes_up",
    "name": "Song: Hypetrain (It Goes Up) (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_m03_lobby",
    "name": "Song: Jingle (Lobby) (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_ht_f08_wonderful_world",
    "name": "Song: Melodrama (Wonderful World) (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_female_ht_f08_newyear",
    "name": "Song: NYE 2023 (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_sing_funny_thanksgiving",
    "name": "Song: Thanksgiving (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_male_m03_sunshine_soon",
    "name": "Song: Toon Beat (Sunshine Soon) (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "en_female_f08_twinkle",
    "name": "Song: Pop Lullaby (English)",
    "languages": [
      "en"
    ],
    "gender": "female"
  },
  {
    "id": "en_male_m2_xhxs_m03_silly",
    "name": "Song: Quirky Time (English)",
    "languages": [
      "en"
    ],
    "gender": "male"
  },
  {
    "id": "fr_001",
    "name": "French Male 1 (French)",
    "languages": [
      "fr"
    ],
    "gender": "male"
  },
  {
    "id": "fr_002",
    "name": "French Male 2 (French)",
    "languages": [
      "fr"
    ],
    "gender": "male"
  },
  {
    "id": "de_001",
    "name": "German Female (German)",
    "languages": [
      "de"
    ],
    "gender": "female"
  },
  {
    "id": "de_002",
    "name": "German Male (German)",
    "languages": [
      "de"
    ],
    "gender": "male"
  },
  {
    "id": "id_male_darma",
    "name": "Darma (Indonesian)",
    "languages": [
      "id"
    ],
    "gender": "male"
  },
  {
    "id": "id_female_icha",
    "name": "Icha (Indonesian)",
    "languages": [
      "id"
    ],
    "gender": "female"
  },
  {
    "id": "id_female_noor",
    "name": "Noor (Indonesian)",
    "languages": [
      "id"
    ],
    "gender": "female"
  },
  {
    "id": "id_male_putra",
    "name": "Putra (Indonesian)",
    "languages": [
      "id"
    ],
    "gender": "male"
  },
  {
    "id": "it_male_m18",
    "name": "Italian Male (Italian)",
    "languages": [
      "it"
    ],
    "gender": "male"
  },
  {
    "id": "jp_001",
    "name": "Miho (\u7f8e\u7a42) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "female"
  },
  {
    "id": "jp_003",
    "name": "Keiko (\u6075\u5b50) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "female"
  },
  {
    "id": "jp_005",
    "name": "Sakura (\u3055\u304f\u3089) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "female"
  },
  {
    "id": "jp_006",
    "name": "Naoki (\u76f4\u6a39) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "male"
  },
  {
    "id": "jp_male_osada",
    "name": "\u30e2\u30ea\u30b9\u30b1 (Morisuke) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "male"
  },
  {
    "id": "jp_male_matsuo",
    "name": "\u30e2\u30b8\u30e3\u30aa (Matsuo) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "male"
  },
  {
    "id": "jp_female_machikoriiita",
    "name": "\u307e\u3061\u3053\u308a\u30fc\u305f (Machikoriiita) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "female"
  },
  {
    "id": "jp_male_matsudake",
    "name": "\u30de\u30c4\u30c0\u5bb6\u306e\u65e5\u5e38 (Matsudake) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "male"
  },
  {
    "id": "jp_male_shuichiro",
    "name": "\u4fee\u4e00\u6717 (Shuichiro) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "male"
  },
  {
    "id": "jp_female_rei",
    "name": "\u4e38\u5c71\u793c (Maruyama Rei) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "female"
  },
  {
    "id": "jp_male_hikakin",
    "name": "\u30d2\u30ab\u30ad\u30f3 (Hikakin) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "male"
  },
  {
    "id": "jp_female_yagishaki",
    "name": "\u516b\u6728\u6c99\u5b63 (Yagi Saki) (Japanese)",
    "languages": [
      "ja"
    ],
    "gender": "female"
  },
  {
    "id": "kr_002",
    "name": "Korean Male 1 (Korean)",
    "languages": [
      "ko"
    ],
    "gender": "male"
  },
  {
    "id": "kr_004",
    "name": "Korean Male 2 (Korean)",
    "languages": [
      "ko"
    ],
    "gender": "male"
  },
  {
    "id": "kr_003",
    "name": "Korean Female (Korean)",
    "languages": [
      "ko"
    ],
    "gender": "female"
  },
  {
    "id": "br_003",
    "name": "J\u00falia (Portuguese)",
    "languages": [
      "pt"
    ],
    "gender": "female"
  },
  {
    "id": "br_004",
    "name": "Ana (Portuguese)",
    "languages": [
      "pt"
    ],
    "gender": "female"
  },
  {
    "id": "br_005",
    "name": "Lucas (Portuguese)",
    "languages": [
      "pt"
    ],
    "gender": "male"
  },
  {
    "id": "pt_female_lhays",
    "name": "Lhays Macedo (Portuguese)",
    "languages": [
      "pt"
    ],
    "gender": "female"
  },
  {
    "id": "pt_female_laizza",
    "name": "Laizza (Portuguese)",
    "languages": [
      "pt"
    ],
    "gender": "female"
  },
  {
    "id": "pt_male_transformer",
    "name": "Optimus Prime (Portuguese) (Portuguese)",
    "languages": [
      "pt"
    ],
    "gender": "other"
  },
  {
    "id": "es_002",
    "name": "Spanish Male (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "male"
  },
  {
    "id": "es_male_m3",
    "name": "Julio (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "male"
  },
  {
    "id": "es_female_f6",
    "name": "Alejandra (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "female"
  },
  {
    "id": "es_female_fp1",
    "name": "Mariana (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "female"
  },
  {
    "id": "es_mx_002",
    "name": "\u00c1lex (Warm) (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "male"
  },
  {
    "id": "es_mx_male_transformer",
    "name": "Optimus Prime (Mexican) (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "other"
  },
  {
    "id": "es_mx_female_supermom",
    "name": "Super Mam\u00e1 (Spanish)",
    "languages": [
      "es"
    ],
    "gender": "other"
  }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildHeaders() {
  return {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': BROWSER_USER_AGENT,
    'Origin': 'https://lazypy.ro',
    'Referer': 'https://lazypy.ro/tts/',
  };
}

async function downloadAudio(audioUrl) {
  const resp = await fetch(audioUrl, {
    method: 'GET',
    headers: { 'User-Agent': BROWSER_USER_AGENT },
  });
  if (!resp.ok) {
    throw new Error(`[TikTokTTS] Audio download HTTP ${resp.status}`);
  }
  return new Uint8Array(await resp.arrayBuffer());
}

async function synthesizeSingleRequest(text, voice) {
  const body =
    'service=TikTok&voice=' + encodeURIComponent(voice) + '&text=' + encodeURIComponent(text);

  console.log(`[TikTokTTS] POST ${ENDPOINT} voice=${voice} textLen=${text.length}`);

  const resp = await fetch(ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(),
    body: body,
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`[TikTokTTS] HTTP ${resp.status}: ${errText.slice(0, 120)}`);
  }

  const data = await resp.json();
  if (!data || !data.success || !data.audio_url) {
    const msg = (data && (data.error_msg || data.info)) || 'Unknown TikTok API error';
    throw new Error(`[TikTokTTS] API Error: ${msg}`);
  }

  console.log(`[TikTokTTS] Audio generated: ${data.audio_url}`);
  return await downloadAudio(data.audio_url);
}

async function synthesizeWithRetry(text, voice, maxRetries) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await synthesizeSingleRequest(text, voice);
    } catch (err) {
      lastErr = err;
      console.log(`[TikTokTTS] Attempt ${attempt + 1}/${maxRetries + 1} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  throw lastErr;
}

module.exports.default = {
  id: 'tiktok-tts',
  name: 'TikTok TTS (Free)',
  version: '1.0.0',
  description:
    'Free TikTok TTS with 110+ character, narrator, and multilingual voices. No API key required. Returns MP3 audio.',
  author: 'LNReader',
  url: 'tiktok-tts.js',

  maxCharsPerRequest: 300,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 22,

  configSchema: [],

  getVoices: async function () {
    return VOICES.map(v => ({
      id: v.id,
      name: v.name,
      languages: v.languages,
      gender: v.gender,
    }));
  },

  synthesize: async function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      console.log('[TikTokTTS] SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const voice = (options && options.voiceId) || 'en_us_001';
    console.log(`[TikTokTTS] synthesize START textLen=${text.length} voice=${voice}`);

    const audio = await synthesizeWithRetry(text, voice, 2);
    console.log(`[TikTokTTS] FINAL audio=${audio.length} bytes`);

    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 24000,
    };
  },
};
