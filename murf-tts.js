// Murf.ai Anonymous TTS plugin for LNReader QuickJS runtime.
// Uses Murf's free anonymous endpoint. No API key required.

const ENDPOINT = 'https://murf.ai/Prod/anonymous-tts/audio';
const REFERER = 'https://murf.ai/';

// Browser-like headers to avoid blocking.
function getHeaders() {
  return {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Priority': 'i',
    'Referer': REFERER,
    'Sec-CH-UA': '"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand)";v="24"',
    'Sec-CH-UA-Mobile': '?0',
    'Sec-CH-UA-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'audio',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
  };
}

function log(msg) {
  try {
    const { NativeModules } = require('react-native');
    NativeModules.TtsStreamingModule.log('MurfTTS', msg);
  } catch {}
}

function encodeQueryParam(obj) {
  const parts = [];
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
    }
  }
  return parts.join('&');
}

function isValidMp3(bytes) {
  if (bytes.length < 4) return false;
  // MP3 can start with ID3 tag or MPEG frame sync (0xFFE)
  return (
    (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || // ID3
    (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0) // MPEG frame
  );
}

function base64ToBytes(base64) {
  const buffer = base64ToArrayBuffer(base64);
  return new Uint8Array(buffer);
}

function synthesizeSingleRequest(text, voiceId, style, pitch) {
  const params = {
    text: text,
    voiceId: voiceId,
    style: style,
  };
  if (pitch !== 0) {
    params.pitch = pitch;
  }

  const url = ENDPOINT + '?' + encodeQueryParam(params);
  log(`GET ${url.slice(0, 120)}...`);

  const resp = fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  log(`RESPONSE status=${resp.status}`);

  if (!resp.ok) {
    const errText = resp.text();
    log(`HTTP ERROR ${resp.status}: ${errText.slice(0, 200)}`);
    throw new Error(`Murf TTS HTTP ${resp.status}`);
  }

  // Murf usually returns binary MP3, but the Python agent had a data:audio fallback.
  const contentType = (resp.headers && resp.headers['Content-Type']) || '';
  let audio;

  if (typeof contentType === 'string' && contentType.indexOf('application/json') >= 0) {
    const bodyText = resp.text();
    if (bodyText.indexOf('data:audio') === 0) {
      const b64 = bodyText.split(',')[1];
      if (!b64) {
        throw new Error('Murf TTS returned empty base64 data URI');
      }
      audio = base64ToBytes(b64);
    } else {
      throw new Error('Murf TTS returned unexpected JSON: ' + bodyText.slice(0, 200));
    }
  } else {
    audio = new Uint8Array(resp.arrayBuffer());
  }

  if (!audio || audio.length === 0) {
    throw new Error('Murf TTS returned empty audio');
  }

  if (!isValidMp3(audio)) {
    log(`WARNING response does not look like MP3 (first bytes: ${audio[0]} ${audio[1]} ${audio[2]} ${audio[3]})`);
  }

  log(`SUCCESS audio=${audio.length} bytes`);
  return audio;
}

function synthesizeWithRetry(text, voiceId, style, pitch, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return synthesizeSingleRequest(text, voiceId, style, pitch);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        const until = Date.now() + 1000 * (attempt + 1);
        while (Date.now() < until) {}
      }
    }
  }
  throw lastErr;
}

// Curated subset of popular voices used as config defaults.
const DEFAULT_VOICES = [
  { id: 'VM016412139213026OE', name: 'Marcus (US English)', languages: ['en-us'], gender: 'male' },
  { id: 'VM016412139213028DI', name: 'Ken (US English)', languages: ['en-us'], gender: 'male' },
  { id: 'VM016479560867433QN', name: 'Naomi (US English)', languages: ['en-us'], gender: 'female' },
  { id: 'VM016513221706518AZ', name: 'Samantha (US English)', languages: ['en-us'], gender: 'female' },
  { id: 'VM016633502152664KR', name: 'Peter (UK English)', languages: ['en-gb'], gender: 'male' },
  { id: 'VM016633502152686LL', name: 'Aiden (UK English)', languages: ['en-gb'], gender: 'male' },
  { id: 'VM016633502152832WE', name: 'Grace (US English)', languages: ['en-us'], gender: 'female' },
  { id: 'V016019901870313ZN', name: 'Renée (French)', languages: ['fr-fr'], gender: 'female' },
  { id: 'V016019901870254OO', name: 'Adele (German)', languages: ['de-de'], gender: 'female' },
  { id: 'V016019901870296LW', name: 'Lola (Spanish)', languages: ['es-mx'], gender: 'female' },
];

module.exports.default = {
  id: 'murf-tts',
  name: 'Murf TTS',
  version: '1.0.0',
  description: 'Free Murf.ai anonymous TTS. High-fidelity studio voices with no API key required.',
  maxCharsPerRequest: 2000,
  supportsSpeedControl: false,
  estimatedCharsPerSecond: 18,

  configSchema: [
    {
      key: 'voice',
      type: 'text',
      label: 'Voice',
      defaultValue: 'VM016412139213026OE',
      description: 'Murf voice ID (e.g. VM016412139213026OE). Use the voice picker to browse all voices.',
    },
    {
      key: 'style',
      type: 'text',
      label: 'Style',
      defaultValue: 'Narration',
      description: 'Voice style (e.g. Narration, Promo, Conversational, Sad, Angry). Availability depends on the voice.',
    },
    {
      key: 'pitch',
      type: 'slider',
      label: 'Pitch',
      defaultValue: 0,
      min: -50,
      max: 50,
      step: 1,
      description: 'Pitch adjustment from -50 to +50.',
    },
  ],

  getVoices: function () {
    // Full voice catalog scraped from Murf.ai. Kept inline because there is no public API list endpoint.
    return [
      { id: 'V016093953653282U4', name: 'Hannah', languages: ['en-us'], gender: 'female' },
      { id: 'V0160939536532849N', name: 'Oliver', languages: ['en-us'], gender: 'male' },
      { id: 'V016267556772832WE', name: 'Grace', languages: ['en-us'], gender: 'female' },
      { id: 'VM016372341539042UZ', name: 'Natalie', languages: ['en-us'], gender: 'female' },
      { id: 'VM016412139213026OE', name: 'Marcus', languages: ['en-us'], gender: 'male' },
      { id: 'VM016412139213028DI', name: 'Ken', languages: ['en-us'], gender: 'male' },
      { id: 'VM0164121392130292Q', name: 'Terrell', languages: ['en-us'], gender: 'male' },
      { id: 'VM016479560867433QN', name: 'Naomi', languages: ['en-us'], gender: 'female' },
      { id: 'VM016513221706518AZ', name: 'Samantha', languages: ['en-us'], gender: 'female' },
      { id: 'VM016513221706519CL', name: 'Michelle', languages: ['en-us'], gender: 'female' },
      { id: 'VM016513221706541SB', name: 'Ryan', languages: ['en-us'], gender: 'male' },
      { id: 'VM016583951539015ME', name: 'Claire', languages: ['en-us'], gender: 'female' },
      { id: 'VM0165993640062036P', name: 'Wayne', languages: ['en-us'], gender: 'male' },
      { id: 'VM0165993640063143B', name: 'Miles', languages: ['en-us'], gender: 'male' },
      { id: 'VM016611490359661UN', name: 'Edmund', languages: ['en-us'], gender: 'male' },
      { id: 'VM0166114903597322X', name: 'Iris', languages: ['en-us'], gender: 'female' },
      { id: 'VM016633502152675XV', name: 'Ronnie', languages: ['en-us'], gender: 'male' },
      { id: 'VM016633502152718BE', name: 'Daisy', languages: ['en-us'], gender: 'female' },
      { id: 'VM0166652095471128U', name: 'Lucas', languages: ['en-us'], gender: 'male' },
      { id: 'VM016665209547168I2', name: 'Cooper', languages: ['en-us'], gender: 'male' },
      { id: 'VM016683248292856LS', name: 'Charles', languages: ['en-us'], gender: 'male' },
      { id: 'VM016712854975736CN', name: 'Alicia', languages: ['en-us'], gender: 'female' },
      { id: 'VM016735424502756EM', name: 'Charlotte', languages: ['en-us'], gender: 'female' },
      { id: 'VM016735424502757EA', name: 'Dylan', languages: ['en-us'], gender: 'male' },
      { id: 'VM016745374828763DT', name: 'Julia', languages: ['en-us'], gender: 'female' },
      { id: 'VM016763774152981CV', name: 'Carter', languages: ['en-us'], gender: 'male' },
      { id: 'VM016771228055541Q1', name: 'Daniel', languages: ['en-us'], gender: 'male' },
      { id: 'VM016825198444922QF', name: 'June', languages: ['en-us'], gender: 'female' },
      { id: 'VM016857199654721TQ', name: 'Alina', languages: ['en-us'], gender: 'female' },
      { id: 'VM01687171931574104', name: 'Amara', languages: ['en-us'], gender: 'female' },
      { id: 'VM016902010890898ZD', name: 'River', languages: ['en-us'], gender: 'neutral' },
      { id: 'VM016902010890942UW', name: 'Evander', languages: ['en-us'], gender: 'male' },
      { id: 'VM016928805078066AA', name: 'Caleb', languages: ['en-us'], gender: 'male' },
      { id: 'VM016938127319281WK', name: 'Molly', languages: ['en-us'], gender: 'female' },
      { id: 'VM016938127319332EJ', name: 'Josie', languages: ['en-us'], gender: 'female' },
      { id: 'VM016944248926717PA', name: 'Delilah', languages: ['en-us'], gender: 'female' },
      { id: 'VM0169807201733692Q', name: 'Imani', languages: ['en-us'], gender: 'female' },
      { id: 'VM016989906305352GR', name: 'Jayden', languages: ['en-us'], gender: 'male' },
      { id: 'VM017052943651294NB', name: 'Angela', languages: ['en-us'], gender: 'female' },
      { id: 'VM017052943651667EJ', name: 'Denzel', languages: ['en-us'], gender: 'male' },
      { id: 'VM017055735693864IZ', name: 'Phoebe', languages: ['en-us'], gender: 'female' },
      { id: 'VM017102415062305DQ', name: 'Riley', languages: ['en-us'], gender: 'female' },
      { id: 'VM017102415062336VP', name: 'Abigail', languages: ['en-us'], gender: 'female' },
      { id: 'VM017134401860776C9', name: 'Zion', languages: ['en-us'], gender: 'male' },
      { id: 'VM017176065492822QA', name: 'Ariana', languages: ['en-us'], gender: 'female' },
      { id: 'VM0173203417734490D', name: 'Paul', languages: ['en-us'], gender: 'male' },
      { id: 'VM017394160575947JQ', name: 'Maverick', languages: ['en-us'], gender: 'male' },
      { id: 'VM016633502152473Y0', name: 'Hazel', languages: ['en-gb'], gender: 'female' },
      { id: 'VM016633502152664KR', name: 'Peter', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016633502152686LL', name: 'Aiden', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016633502152751N2', name: 'Theo', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016683248292834O9', name: 'Ruby', languages: ['en-gb'], gender: 'female' },
      { id: 'VM016712854975714UV', name: 'Katie', languages: ['en-gb'], gender: 'female' },
      { id: 'VM016763774153005A7', name: 'Gabriel', languages: ['en-gb'], gender: 'male' },
      { id: 'VM0167689352997715F', name: 'Jaxon', languages: ['en-gb'], gender: 'male' },
      { id: 'VM0168251984449337O', name: 'Finley', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016843935213871UI', name: 'Heidi', languages: ['en-gb'], gender: 'female' },
      { id: 'VM016862906942403MA', name: 'Freddie', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016862906942795X9', name: 'Hugo', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016909749340275Q4', name: 'Amber', languages: ['en-gb'], gender: 'female' },
      { id: 'VM0169097493403369J', name: 'Juliet', languages: ['en-gb'], gender: 'female' },
      { id: 'VM016922560137864CI', name: 'Reggie', languages: ['en-gb'], gender: 'male' },
      { id: 'VM016980720172937OK', name: 'Harrison', languages: ['en-gb'], gender: 'male' },
      { id: 'VM017201999029001KT', name: 'Mason', languages: ['en-gb'], gender: 'male' },
      { id: 'VM0172909392995085O', name: 'Pearl', languages: ['en-gb'], gender: 'female' },
      { id: 'VM016665209547153OB', name: 'Harper', languages: ['en-au'], gender: 'male' },
      { id: 'VM016665209547154D4', name: 'Joyce', languages: ['en-au'], gender: 'female' },
      { id: 'VM016665209547156OA', name: 'Jimm', languages: ['en-au'], gender: 'male' },
      { id: 'VM016665209547157VE', name: 'Shane', languages: ['en-au'], gender: 'male' },
      { id: 'VM016665209547179OF', name: 'Kylie', languages: ['en-au'], gender: 'female' },
      { id: 'VM016745374873834VB', name: 'Ashton', languages: ['en-au'], gender: 'male' },
      { id: 'VM016763774152994OP', name: 'Mitch', languages: ['en-au'], gender: 'male' },
      { id: 'VM016825198444944HV', name: 'Evelyn', languages: ['en-au'], gender: 'female' },
      { id: 'VM016843935213933OU', name: 'Leyton', languages: ['en-au'], gender: 'male' },
      { id: 'VM016843935213944AM', name: 'Ivy', languages: ['en-au'], gender: 'female' },
      { id: 'VM0173625567220512A', name: 'Sophia', languages: ['en-au'], gender: 'female' },
      { id: 'VM0167354245027539Z', name: 'Arohi', languages: ['en-in'], gender: 'female' },
      { id: 'VM016763774153006AN', name: 'Priya', languages: ['en-in'], gender: 'female' },
      { id: 'VM016902010890943DZ', name: 'Isha', languages: ['en-in'], gender: 'female' },
      { id: 'VM016944248927101HE', name: 'Rohan', languages: ['en-in'], gender: 'male' },
      { id: 'VM016999642506773QU', name: 'Aarav', languages: ['en-in'], gender: 'male' },
      { id: 'VM017074560027383WJ', name: 'Eashwar', languages: ['en-in'], gender: 'male' },
      { id: 'VM01710241506219166', name: 'Alia', languages: ['en-in'], gender: 'female' },
      { id: 'VM0166335021526974W', name: 'Rory', languages: ['en-sct'], gender: 'male' },
      { id: 'VM016712854975725XN', name: 'Emily', languages: ['en-sct'], gender: 'female' },
      { id: 'V016019901870313ZN', name: 'Renée', languages: ['fr-fr'], gender: 'female' },
      { id: 'V016019901870314IG', name: 'Victor', languages: ['fr-fr'], gender: 'male' },
      { id: 'V016267556772923E9', name: 'Arthur', languages: ['fr-fr'], gender: 'male' },
      { id: 'VM016902010890931K7', name: 'Louis', languages: ['fr-fr'], gender: 'male' },
      { id: 'VM016922560137773RJ', name: 'Louise', languages: ['fr-fr'], gender: 'female' },
      { id: 'VM01692256013822766', name: 'Maxime', languages: ['fr-fr'], gender: 'male' },
      { id: 'VM016928805078045TZ', name: 'Adélie', languages: ['fr-fr'], gender: 'female' },
      { id: 'VM016980720172904LU', name: 'Axel', languages: ['fr-fr'], gender: 'male' },
      { id: 'VM016999642507015GE', name: 'Justine', languages: ['fr-fr'], gender: 'female' },
      { id: 'VM017581983608249HO', name: 'Guillaume', languages: ['fr-fr'], gender: 'male' },
      { id: 'V016019901870299S8', name: 'Raphael', languages: ['fr-ca'], gender: 'male' },
      { id: 'V016019901870311RK', name: 'Esme', languages: ['fr-ca'], gender: 'female' },
      { id: 'V016153707319342MT', name: 'Albert', languages: ['fr-ca'], gender: 'male' },
      { id: 'V016267556858478XF', name: 'Delphine', languages: ['fr-ca'], gender: 'female' },
      { id: 'VM017581983608248KP', name: 'Clément', languages: ['fr-ca'], gender: 'male' },
      { id: 'VM0175819836092572I', name: 'Alexis', languages: ['fr-ca'], gender: 'male' },
      { id: 'V016019901870254OO', name: 'Adele', languages: ['de-de'], gender: 'female' },
      { id: 'V016019901870256CH', name: 'Max', languages: ['de-de'], gender: 'male' },
      { id: 'V016019901870257YT', name: 'Lena', languages: ['de-de'], gender: 'female' },
      { id: 'VM016938127319663P4', name: 'Björn', languages: ['de-de'], gender: 'male' },
      { id: 'VM0169899063052611X', name: 'Josephine', languages: ['de-de'], gender: 'female' },
      { id: 'VM016989906306046TP', name: 'Lia', languages: ['de-de'], gender: 'female' },
      { id: 'VM01698990630618719', name: 'Matthias', languages: ['de-de'], gender: 'male' },
      { id: 'VM017022826866126SV', name: 'Erna', languages: ['de-de'], gender: 'female' },
      { id: 'VM017134401860409IV', name: 'Lara', languages: ['de-de'], gender: 'female' },
      { id: 'VM017207492833592OA', name: 'Ralf', languages: ['de-de'], gender: 'male' },
      { id: 'V016019901870294CM', name: 'Felipe', languages: ['es-es'], gender: 'male' },
      { id: 'VM016989906305189FR', name: 'Carmen', languages: ['es-es'], gender: 'female' },
      { id: 'VM0170140941037743D', name: 'Enrique', languages: ['es-es'], gender: 'male' },
      { id: 'VM017022826866397QK', name: 'Elvira', languages: ['es-es'], gender: 'female' },
      { id: 'VM017071193653464L8', name: 'Javier', languages: ['es-es'], gender: 'male' },
      { id: 'VM017176065492721MA', name: 'Carla', languages: ['es-es'], gender: 'female' },
      { id: 'V016019901870296LW', name: 'Lola', languages: ['es-mx'], gender: 'female' },
      { id: 'V016019901870297ZA', name: 'Antonio', languages: ['es-mx'], gender: 'male' },
      { id: 'VM016980720173138X3', name: 'Luisa', languages: ['es-mx'], gender: 'female' },
      { id: 'VM0169899063056443C', name: 'Carlos', languages: ['es-mx'], gender: 'male' },
      { id: 'VM016999642507207V8', name: 'Valeria', languages: ['es-mx'], gender: 'female' },
      { id: 'VM017014094103763OO', name: 'Alejandro', languages: ['es-mx'], gender: 'male' },
      { id: 'V016019901870341NR', name: 'Giovanni', languages: ['it-it'], gender: 'male' },
      { id: 'V0160199018703421U', name: 'Adriana', languages: ['it-it'], gender: 'female' },
      { id: 'VM0170529436518385A', name: 'Greta', languages: ['it-it'], gender: 'female' },
      { id: 'VM017071193653525CP', name: 'Vera', languages: ['it-it'], gender: 'female' },
      { id: 'VM017102415062079SM', name: 'Lorenzo', languages: ['it-it'], gender: 'male' },
      { id: 'VM0171344018607752H', name: 'Giorgio', languages: ['it-it'], gender: 'male' },
      { id: 'VM017201999028859MF', name: 'Vincenzo', languages: ['it-it'], gender: 'male' },
      { id: 'VM017582208709511TC', name: 'Giulia', languages: ['it-it'], gender: 'female' },
      { id: 'VM017582208712712QE', name: 'Angelo', languages: ['it-it'], gender: 'male' },
      { id: 'V016019901870383A9', name: 'Pedro', languages: ['pt-br'], gender: 'male' },
      { id: 'V0160199018703841W', name: 'Marcia', languages: ['pt-br'], gender: 'female' },
      { id: 'VM017052943651849OW', name: 'Gustavo', languages: ['pt-br'], gender: 'male' },
      { id: 'VM017071193653696VH', name: 'Eloa', languages: ['pt-br'], gender: 'female' },
      { id: 'VM017102415061736ZR', name: 'Heitor', languages: ['pt-br'], gender: 'male' },
      { id: 'VM017102415062058QR', name: 'Isadora', languages: ['pt-br'], gender: 'female' },
      { id: 'VM017110792529283DY', name: 'Benício', languages: ['pt-br'], gender: 'male' },
      { id: 'VM0172019990286783F', name: 'Silvio', languages: ['pt-br'], gender: 'male' },
      { id: 'VM0172074928335512K', name: 'Yago', languages: ['pt-br'], gender: 'male' },
      { id: 'V0160199018703857Z', name: 'Maria', languages: ['pt-pt'], gender: 'female' },
      { id: 'V016075222659125V2', name: 'Miguel', languages: ['pt-pt'], gender: 'male' },
      { id: 'V0160752226591262G', name: 'Beatriz', languages: ['pt-pt'], gender: 'female' },
      { id: 'V016019901792996JU', name: 'Nadira', languages: ['ar'], gender: 'female' },
      { id: 'V016019901792997NL', name: 'Faisal', languages: ['ar'], gender: 'male' },
      { id: 'V016019901792998WY', name: 'Khalid', languages: ['ar'], gender: 'male' },
      { id: 'V016019901870207IF', name: 'Aliyah', languages: ['ar'], gender: 'female' },
      { id: 'V016019901870208NW', name: 'Samirah', languages: ['ar'], gender: 'female' },
      { id: 'V0160752226591944N', name: 'Tai', languages: ['zh-hk'], gender: 'female' },
      { id: 'V016075222659196P3', name: 'Choy', languages: ['zh-hk'], gender: 'male' },
      { id: 'V016019901793454MB', name: 'Ivan', languages: ['ru-ru'], gender: 'male' },
      { id: 'V016019901870387GR', name: 'Irina', languages: ['ru-ru'], gender: 'female' },
      { id: 'V016075222659138JK', name: 'Sofia', languages: ['ru-ru'], gender: 'female' },
      { id: 'V0160752226591396F', name: 'Vladimir', languages: ['ru-ru'], gender: 'male' },
      { id: 'V016019901870371JY', name: 'Lisa', languages: ['nl-nl'], gender: 'female' },
      { id: 'V016075222659111K9', name: 'Mila', languages: ['nl-nl'], gender: 'female' },
      { id: 'V0160752226591225R', name: 'Daan', languages: ['nl-nl'], gender: 'male' },
      { id: 'VM01721940536261616', name: 'Dirk', languages: ['nl-nl'], gender: 'male' },
      { id: 'VM017234688527213NU', name: 'Merel', languages: ['nl-nl'], gender: 'female' },
      { id: 'VM0172554275728861X', name: 'Famke', languages: ['nl-nl'], gender: 'female' },
      { id: 'V016019901793292GR', name: 'Kei', languages: ['ja-jp'], gender: 'female' },
      { id: 'V016019901793303QT', name: 'Itsuki', languages: ['ja-jp'], gender: 'male' },
      { id: 'V016019901829068OD', name: 'Hana', languages: ['ja-jp'], gender: 'female' },
      { id: 'V016019901870354NU', name: 'Reo', languages: ['ja-jp'], gender: 'male' },
      { id: 'V0160199018703556Z', name: 'Sakura', languages: ['ja-jp'], gender: 'female' },
      { id: 'VM017394160576277JJ', name: 'Kenji', languages: ['ja-jp'], gender: 'male' },
      { id: 'VM017394160576452VC', name: 'Kimi', languages: ['ja-jp'], gender: 'female' },
      { id: 'VM017394160576626PQ', name: 'Denki', languages: ['ja-jp'], gender: 'male' },
      { id: 'VM01700560060615753', name: 'Shaan', languages: ['hi-in'], gender: 'male' },
      { id: 'VM017031361020602VR', name: 'Rahul', languages: ['hi-in'], gender: 'male' },
      { id: 'VM017110792529051K5', name: 'Shweta', languages: ['hi-in'], gender: 'female' },
      { id: 'VM017110792529092EF', name: 'Ayushi', languages: ['hi-in'], gender: 'female' },
      { id: 'VM017176065493134SK', name: 'Amit', languages: ['hi-in'], gender: 'male' },
      { id: 'VM017176065493246OA', name: 'Kabir', languages: ['hi-in'], gender: 'male' },
      { id: 'V0160199017932639R', name: 'Aulia', languages: ['id-id'], gender: 'female' },
      { id: 'V016019901793264G4', name: 'Agung', languages: ['id-id'], gender: 'male' },
      { id: 'V016019901870329SZ', name: 'Adhiarja', languages: ['id-id'], gender: 'male' },
      { id: 'V016075222659083CG', name: 'Indah', languages: ['id-id'], gender: 'female' },
      { id: 'VM017290939299102SN', name: 'Minseo', languages: ['ko-kr'], gender: 'female' },
      { id: 'VM017290939299496XD', name: 'Gyeong', languages: ['ko-kr'], gender: 'female' },
      { id: 'VM0172909392995098L', name: 'Jangmi', languages: ['ko-kr'], gender: 'female' },
      { id: 'VM0172909392995921F', name: 'Hwan', languages: ['ko-kr'], gender: 'male' },
      { id: 'VM0172909392998788G', name: 'Seok', languages: ['ko-kr'], gender: 'male' },
      { id: 'VM01729093929990204', name: 'Jong-su', languages: ['ko-kr'], gender: 'male' },
      { id: 'VM0172909392999875R', name: 'SangHoon', languages: ['ko-kr'], gender: 'male' },
      { id: 'V016019901870386UI', name: 'Cristina', languages: ['ro-ro'], gender: 'female' },
      { id: 'V016075222659137AE', name: 'Adrian', languages: ['ro-ro'], gender: 'male' },
      { id: 'V016075222659098EA', name: 'Anita', languages: ['nb-no'], gender: 'female' },
      { id: 'V016075222659099KQ', name: 'Espen', languages: ['nb-no'], gender: 'male' },
      { id: 'V016019901870426RA', name: 'Azra', languages: ['tr-tr'], gender: 'female' },
      { id: 'V016075222659166UM', name: 'Hamza', languages: ['tr-tr'], gender: 'male' },
      { id: 'V0160199018702439Y', name: 'Ella', languages: ['da-dk'], gender: 'female' },
      { id: 'V016075222659659007TQ', name: 'Noah', languages: ['da-dk'], gender: 'male' },
      { id: 'VM017290939299901WU', name: 'Iniya', languages: ['ta-in'], gender: 'female' },
      { id: 'VM017290939299913QM', name: 'Suresh', languages: ['ta-in'], gender: 'male' },
      { id: 'VM0173075258579891P', name: 'Sarvesh', languages: ['ta-in'], gender: 'male' },
      { id: 'VM017307525858051DC', name: 'Abirami', languages: ['ta-in'], gender: 'female' },
      { id: 'V016019901870298S6', name: 'Heta', languages: ['fi-fi'], gender: 'female' },
      { id: 'V016075222659045IO', name: 'Ada', languages: ['fi-fi'], gender: 'female' },
      { id: 'V01607522265904601', name: 'Fidan', languages: ['fi-fi'], gender: 'male' },
      { id: 'VM0171344018606738X', name: 'Tao', languages: ['zh-cn'], gender: 'male' },
      { id: 'VM0171911060437670M', name: 'Jiao', languages: ['zh-cn'], gender: 'female' },
      { id: 'VM017290939299866H7', name: 'Yuxan', languages: ['zh-cn'], gender: 'male' },
      { id: 'VM017298106147606EM', name: 'Baolin', languages: ['zh-cn'], gender: 'female' },
      { id: 'VM017298106148452XK', name: 'Wei', languages: ['zh-cn'], gender: 'female' },
      { id: 'VM017298106148583OA', name: 'Zhang', languages: ['zh-cn'], gender: 'male' },
      { id: 'VM017213351586605MQ', name: 'Anwesha', languages: ['bn-in'], gender: 'female' },
      { id: 'VM017230562791058FV', name: 'Abhik', languages: ['bn-in'], gender: 'male' },
      { id: 'VM017290939299889RR', name: 'Ishani', languages: ['bn-in'], gender: 'female' },
      { id: 'VM017394160575649TN', name: 'Arnab', languages: ['bn-in'], gender: 'male' },
      { id: 'VM017071193653453PC', name: 'Jacek', languages: ['pl-pl'], gender: 'male' },
      { id: 'VM017144622880968VO', name: 'Blazej', languages: ['pl-pl'], gender: 'male' },
      { id: 'VM017144622881212ZR', name: 'Kasia', languages: ['pl-pl'], gender: 'female' },
      { id: 'VM0173941605757245C', name: 'Tibor', languages: ['sk-sk'], gender: 'male' },
      { id: 'VM017394160576185VO', name: 'Nina', languages: ['sk-sk'], gender: 'female' },
      { id: 'VM0175819836083776Q', name: 'Eraño', languages: ['tl-ph'], gender: 'male' },
      { id: 'VM017394160576348KX', name: 'Marija', languages: ['hr-hr'], gender: 'female' },
      { id: 'VM017394160576451DY', name: 'Stavros', languages: ['el-gr'], gender: 'male' },
    ];
  },

  synthesize: function (text, options) {
    if (!text || !/\p{L}|\p{N}/u.test(text)) {
      log('SKIP empty/non-speakable text');
      throw new Error('No speakable text');
    }

    const settings = (options && options.pluginSettings) || {};
    const voiceId = options.voiceId || settings.voice || 'VM016412139213026OE';
    const style = settings.style || 'Narration';
    const pitch = settings.pitch !== undefined ? settings.pitch : 0;

    log(`synthesize START textLen=${text.length} voice=${voiceId} style=${style} pitch=${pitch}`);

    const audio = synthesizeWithRetry(text, voiceId, style, pitch, 2);

    return {
      audioContent: audio.buffer,
      format: 'mp3',
      sampleRate: 44100,
    };
  },
};
