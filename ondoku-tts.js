// Ondoku TTS Plugin for LNReader
// Zero-authentication multilingual speech synthesis via Ondoku3

var PLUGIN_ID = 'ondoku-tts';
var PLUGIN_NAME = 'Ondoku TTS';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "en-US-AIGenerate1Neural",
    "name": "AIGenerate1",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-AIGenerate2Neural",
    "name": "AIGenerate2",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-GB-AbbiNeural",
    "name": "Abbi",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-NG-AbeoNeural",
    "name": "Abeo",
    "lang": "en-NG",
    "gender": "Female"
  },
  {
    "id": "es-ES-AbrilNeural",
    "name": "Abril",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "th-TH-AcharaNeural",
    "name": "Achara",
    "lang": "th-TH",
    "gender": "Female"
  },
  {
    "id": "en-GB-AdaMultilingualNeural",
    "name": "Ada(en)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-US-AdamMultilingualNeural",
    "name": "Adam(en)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "en-IN-Aditi",
    "name": "Aditi",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "hi-IN-Aditi",
    "name": "Aditi",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "af-ZA-AdriNeural",
    "name": "Adri",
    "lang": "af-ZA",
    "gender": "Female"
  },
  {
    "id": "pl-PL-AgnieszkaNeural",
    "name": "Agnieszka",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "tr-TR-AhmetNeural",
    "name": "Ahmet",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "eu-ES-AinhoaNeural",
    "name": "Ainhoa",
    "lang": "eu-ES",
    "gender": "Female"
  },
  {
    "id": "fr-FR-AlainNeural",
    "name": "Alain",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "ca-ES-AlbaNeural",
    "name": "Alba",
    "lang": "ca-ES",
    "gender": "Female"
  },
  {
    "id": "cy-GB-AledNeural",
    "name": "Aled",
    "lang": "cy-GB",
    "gender": "Female"
  },
  {
    "id": "it-IT-AlessioMultilingualNeural",
    "name": "Alessio(it)",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-PE-AlexNeural",
    "name": "Alex",
    "lang": "es-PE",
    "gender": "Female"
  },
  {
    "id": "en-GB-AlfieNeural",
    "name": "Alfie",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "ro-RO-AlinaNeural",
    "name": "Alina",
    "lang": "ro-RO",
    "gender": "Female"
  },
  {
    "id": "es-US-AlonsoNeural",
    "name": "Alonso",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "es-ES-AlvaroNeural",
    "name": "Alvaro",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "de-DE-AmalaNeural",
    "name": "Amala",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "en-US-AmandaMultilingualNeural",
    "name": "Amanda(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-AmberNeural",
    "name": "Amber",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-GB-Amy",
    "name": "Amy",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-US-AnaNeural",
    "name": "Ana",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "eu-ES-AnderNeural",
    "name": "Ander",
    "lang": "eu-ES",
    "gender": "Female"
  },
  {
    "id": "es-EC-AndreaNeural",
    "name": "Andrea",
    "lang": "es-EC",
    "gender": "Female"
  },
  {
    "id": "en-US-AndrewMultilingualNeural",
    "name": "Andrew(en)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "es-GT-AndresNeural",
    "name": "Andrés",
    "lang": "es-GT",
    "gender": "Female"
  },
  {
    "id": "fil-PH-AngeloNeural",
    "name": "Angelo",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "sq-AL-AnilaNeural",
    "name": "Anila",
    "lang": "sq-AL",
    "gender": "Female"
  },
  {
    "id": "en-AU-AnnetteNeural",
    "name": "Annette",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "fr-CA-AntoineNeural",
    "name": "Antoine",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "cs-CZ-AntoninNeural",
    "name": "Antonin",
    "lang": "cs-CZ",
    "gender": "Female"
  },
  {
    "id": "pt-BR-AntonioNeural",
    "name": "Antonio",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "et-EE-AnuNeural",
    "name": "Anu",
    "lang": "et-EE",
    "gender": "Female"
  },
  {
    "id": "es-ES-ArabellaMultilingualNeural",
    "name": "Arabella(es)",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "id-ID-ArdiNeural",
    "name": "Ardi",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "en-US-AriaNeural",
    "name": "Aria",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "fr-CH-ArianeNeural",
    "name": "Ariane",
    "lang": "fr-CH",
    "gender": "Female"
  },
  {
    "id": "es-ES-ArnauNeural",
    "name": "Arnau",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "nl-BE-ArnaudNeural",
    "name": "Arnaud",
    "lang": "nl-BE",
    "gender": "Female"
  },
  {
    "id": "en-US-AshleyNeural",
    "name": "Ashley",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-KE-AsiliaNeural",
    "name": "Asilia",
    "lang": "en-KE",
    "gender": "Female"
  },
  {
    "id": "sv-SE-Astrid",
    "name": "Astrid",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "el-GR-AthinaNeural",
    "name": "Athina",
    "lang": "el-GR",
    "gender": "Female"
  },
  {
    "id": "en-US-AvaMultilingualNeural",
    "name": "Ava(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "he-IL-AvriNeural",
    "name": "Avri",
    "lang": "he-IL",
    "gender": "Female"
  },
  {
    "id": "az-AZ-BabekNeural",
    "name": "Babək",
    "lang": "az-AZ",
    "gender": "Female"
  },
  {
    "id": "az-AZ-BanuNeural",
    "name": "Banu",
    "lang": "az-AZ",
    "gender": "Female"
  },
  {
    "id": "es-MX-BeatrizNeural",
    "name": "Beatriz",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "es-CU-BelkysNeural",
    "name": "Belkys",
    "lang": "es-CU",
    "gender": "Female"
  },
  {
    "id": "en-GB-BellaNeural",
    "name": "Bella",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "it-IT-BenignoNeural",
    "name": "Benigno",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "de-DE-BerndNeural",
    "name": "Bernd",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "it-IT-Bianca",
    "name": "Bianca",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "fil-PH-BlessicaNeural",
    "name": "Blessica",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "en-US-BlueNeural",
    "name": "Blue",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "bg-BG-BorislavNeural",
    "name": "Borislav",
    "lang": "bg-BG",
    "gender": "Female"
  },
  {
    "id": "en-US-BrandonNeural",
    "name": "Brandon",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "en-US-BrandonMultilingualNeural",
    "name": "Brandon(en)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "pt-BR-BrendaNeural",
    "name": "Brenda",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "en-GB-Brian",
    "name": "Brian",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "en-US-BrianMultilingualNeural",
    "name": "Brian(en)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "fr-FR-BrigitteNeural",
    "name": "Brigitte",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "it-IT-CalimeroNeural",
    "name": "Calimero",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-PE-CamilaNeural",
    "name": "Camila",
    "lang": "es-PE",
    "gender": "Female"
  },
  {
    "id": "pt-BR-Camila",
    "name": "Camila",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "es-MX-CandelaNeural",
    "name": "Candela",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "it-IT-Carla",
    "name": "Carla",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-HN-CarlosNeural",
    "name": "Carlos",
    "lang": "es-HN",
    "gender": "Female"
  },
  {
    "id": "es-MX-CarlotaNeural",
    "name": "Carlota",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "en-AU-CarlyNeural",
    "name": "Carly",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "ro-RO-Carmen",
    "name": "Carmen",
    "lang": "ro-RO",
    "gender": "Female"
  },
  {
    "id": "it-IT-CataldoNeural",
    "name": "Cataldo",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-CL-CatalinaNeural",
    "name": "Catalina",
    "lang": "es-CL",
    "gender": "Female"
  },
  {
    "id": "es-MX-CecilioNeural",
    "name": "Cecilio",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "fr-FR-CelesteNeural",
    "name": "Celeste",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Celine",
    "name": "Celine",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-CA-Chantal",
    "name": "Chantal",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "fr-BE-CharlineNeural",
    "name": "Charline",
    "lang": "fr-BE",
    "gender": "Female"
  },
  {
    "id": "en-KE-ChilembaNeural",
    "name": "Chilemba",
    "lang": "en-KE",
    "gender": "Female"
  },
  {
    "id": "da-DK-ChristelNeural",
    "name": "Christel",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "de-DE-ChristophNeural",
    "name": "Christoph",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "en-US-ChristopherNeural",
    "name": "Christopher",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-ChristopherMultilingualNeural",
    "name": "Christopher(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-CA-ClaraNeural",
    "name": "Clara",
    "lang": "en-CA",
    "gender": "Female"
  },
  {
    "id": "fr-FR-ClaudeNeural",
    "name": "Claude",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "nl-NL-ColetteNeural",
    "name": "Colette",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "ga-IE-ColmNeural",
    "name": "Colm",
    "lang": "ga-IE",
    "gender": "Female"
  },
  {
    "id": "es-ES-Conchita",
    "name": "Conchita",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-IE-ConnorNeural",
    "name": "Connor",
    "lang": "en-IE",
    "gender": "Female"
  },
  {
    "id": "de-DE-ConradNeural",
    "name": "Conrad",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "en-US-CoraNeural",
    "name": "Cora",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-CoraMultilingualNeural",
    "name": "Cora(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "fr-FR-CoralieNeural",
    "name": "Coralie",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "pt-PT-Cristiano",
    "name": "Cristiano",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "es-MX-DaliaNeural",
    "name": "Dalia",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "es-ES-DarioNeural",
    "name": "Dario",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "ru-RU-DariyaNeural",
    "name": "Dariya",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "en-AU-DarrenNeural",
    "name": "Darren",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "sw-TZ-DaudiNeural",
    "name": "Daudi",
    "lang": "sw-TZ",
    "gender": "Female"
  },
  {
    "id": "en-US-DavisNeural",
    "name": "Davis",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "en-US-DavisMultilingualNeural",
    "name": "Davis(en)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "nl-BE-DenaNeural",
    "name": "Dena",
    "lang": "nl-BE",
    "gender": "Female"
  },
  {
    "id": "fr-FR-DeniseNeural",
    "name": "Denise",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "en-US-DerekMultilingualNeural",
    "name": "Derek(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "it-IT-DiegoNeural",
    "name": "Diego",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "jv-ID-DimasNeural",
    "name": "Dimas",
    "lang": "jv-ID",
    "gender": "Female"
  },
  {
    "id": "ru-RU-DmitryNeural",
    "name": "Dmitry",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "pt-BR-DonatoNeural",
    "name": "Donato",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "is-IS-Dora",
    "name": "Dora",
    "lang": "is-IS",
    "gender": "Female"
  },
  {
    "id": "pt-PT-DuarteNeural",
    "name": "Duarte",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "en-AU-DuncanNeural",
    "name": "Duncan",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-US-DustinMultilingualNeural",
    "name": "Dustin(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "es-AR-ElenaNeural",
    "name": "Elena",
    "lang": "es-AR",
    "gender": "Female"
  },
  {
    "id": "es-ES-EliasNeural",
    "name": "Elias",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-TZ-ElimuNeural",
    "name": "Elimu",
    "lang": "en-TZ",
    "gender": "Female"
  },
  {
    "id": "en-US-ElizabethNeural",
    "name": "Elizabeth",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "de-DE-ElkeNeural",
    "name": "Elke",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "en-GB-ElliotNeural",
    "name": "Elliot",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "fr-FR-EloiseNeural",
    "name": "Eloise",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "it-IT-ElsaNeural",
    "name": "Elsa",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "en-AU-ElsieNeural",
    "name": "Elsie",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "es-ES-ElviraNeural",
    "name": "Elvira",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "pt-BR-ElzaNeural",
    "name": "Elza",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "tr-TR-EmelNeural",
    "name": "Emel",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "ro-RO-EmilNeural",
    "name": "Emil",
    "lang": "ro-RO",
    "gender": "Female"
  },
  {
    "id": "es-DO-EmilioNeural",
    "name": "Emilio",
    "lang": "es-DO",
    "gender": "Female"
  },
  {
    "id": "en-IE-EmilyNeural",
    "name": "Emily",
    "lang": "en-IE",
    "gender": "Female"
  },
  {
    "id": "en-GB-Emma",
    "name": "Emma",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-US-EmmaMultilingualNeural",
    "name": "Emma(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ca-ES-EnricNeural",
    "name": "Enric",
    "lang": "ca-ES",
    "gender": "Female"
  },
  {
    "id": "es-ES-Enrique",
    "name": "Enrique",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-US-EricNeural",
    "name": "Eric",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "es-ES-EstrellaNeural",
    "name": "Estrella",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-GB-EthanNeural",
    "name": "Ethan",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-US-EvelynMultilingualNeural",
    "name": "Evelyn(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "lv-LV-EveritaNeural",
    "name": "Everita",
    "lang": "lv-LV",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Ewa",
    "name": "Ewa",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "en-NG-EzinneNeural",
    "name": "Ezinne",
    "lang": "en-NG",
    "gender": "Female"
  },
  {
    "id": "pt-BR-FabioNeural",
    "name": "Fabio",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "it-IT-FabiolaNeural",
    "name": "Fabiola",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "fr-CH-FabriceNeural",
    "name": "Fabrice",
    "lang": "fr-CH",
    "gender": "Female"
  },
  {
    "id": "es-NI-FedericoNeural",
    "name": "Federico",
    "lang": "es-NI",
    "gender": "Male"
  },
  {
    "id": "nl-NL-FennaNeural",
    "name": "Fenna",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "pt-PT-FernandaNeural",
    "name": "Fernanda",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "it-IT-FiammaNeural",
    "name": "Fiamma",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "tr-TR-Filiz",
    "name": "Filiz",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "nb-NO-FinnNeural",
    "name": "Finn",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "de-DE-FlorianMultilingualNeural",
    "name": "Florian(de)",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "pt-BR-FranciscaNeural",
    "name": "Francisca",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "en-AU-FreyaNeural",
    "name": "Freya",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "hr-HR-GabrijelaNeural",
    "name": "Gabrijela",
    "lang": "hr-HR",
    "gender": "Female"
  },
  {
    "id": "id-ID-GadisNeural",
    "name": "Gadis",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "en-GB-Geraint",
    "name": "Geraint",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "fr-BE-GerardNeural",
    "name": "Gerard",
    "lang": "fr-BE",
    "gender": "Female"
  },
  {
    "id": "es-MX-GerardoNeural",
    "name": "Gerardo",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "it-IT-GianniNeural",
    "name": "Gianni",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "it-IT-Giorgio",
    "name": "Giorgio",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "pt-BR-GiovannaNeural",
    "name": "Giovanna",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "de-DE-GiselaNeural",
    "name": "Gisela",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "it-IT-GiuseppeMultilingualNeural",
    "name": "Giuseppe(it)",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-CO-GonzaloNeural",
    "name": "Gonzalo",
    "lang": "es-CO",
    "gender": "Female"
  },
  {
    "id": "bs-BA-GoranNeural",
    "name": "Goran",
    "lang": "bs-BA",
    "gender": "Female"
  },
  {
    "id": "mt-MT-GraceNeural",
    "name": "Grace",
    "lang": "mt-MT",
    "gender": "Female"
  },
  {
    "id": "is-IS-GunnarNeural",
    "name": "Gunnar",
    "lang": "is-IS",
    "gender": "Female"
  },
  {
    "id": "en-US-GuyNeural",
    "name": "Guy",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "is-IS-GudrunNeural",
    "name": "Guðrún",
    "lang": "is-IS",
    "gender": "Female"
  },
  {
    "id": "cy-GB-Gwyneth",
    "name": "Gwyneth",
    "lang": "cy-GB",
    "gender": "Female"
  },
  {
    "id": "ar-SA-HamedNeural",
    "name": "Hamed",
    "lang": "ar-SA",
    "gender": "Female"
  },
  {
    "id": "de-DE-Hans",
    "name": "Hans",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "fi-FI-HarriNeural",
    "name": "Harri",
    "lang": "fi-FI",
    "gender": "Female"
  },
  {
    "id": "ne-NP-HemkalaNeural",
    "name": "Hemkala",
    "lang": "ne-NP",
    "gender": "Female"
  },
  {
    "id": "fr-FR-HenriNeural",
    "name": "Henri",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "he-IL-HilaNeural",
    "name": "Hila",
    "lang": "he-IL",
    "gender": "Female"
  },
  {
    "id": "sv-SE-HilleviNeural",
    "name": "Hillevi",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "zh-HK-HiuGaaiNeural",
    "name": "HiuGaai",
    "lang": "zh-HK",
    "gender": "Female"
  },
  {
    "id": "zh-HK-HiuMaanNeural",
    "name": "HiuMaan",
    "lang": "zh-HK",
    "gender": "Female"
  },
  {
    "id": "vi-VN-HoaiMyNeural",
    "name": "HoaiMy",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "en-GB-HollieNeural",
    "name": "Hollie",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "zh-TW-HsiaoChenNeural",
    "name": "HsiaoChen",
    "lang": "zh-TW",
    "gender": "Female"
  },
  {
    "id": "zh-TW-HsiaoYuNeural",
    "name": "HsiaoYu",
    "lang": "zh-TW",
    "gender": "Female"
  },
  {
    "id": "pt-BR-HumbertoNeural",
    "name": "Humberto",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-HyunsuMultilingualNeural",
    "name": "Hyunsu(ko)",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "sq-AL-IlirNeural",
    "name": "Ilir",
    "lang": "sq-AL",
    "gender": "Female"
  },
  {
    "id": "en-TZ-ImaniNeural",
    "name": "Imani",
    "lang": "en-TZ",
    "gender": "Female"
  },
  {
    "id": "it-IT-ImeldaNeural",
    "name": "Imelda",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "ko-KR-InJoonNeural",
    "name": "InJoon",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "pt-PT-Ines",
    "name": "Ines",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "de-AT-IngridNeural",
    "name": "Ingrid",
    "lang": "de-AT",
    "gender": "Female"
  },
  {
    "id": "es-ES-IreneNeural",
    "name": "Irene",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "it-IT-IrmaNeural",
    "name": "Irma",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "it-IT-IsabellaNeural",
    "name": "Isabella",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "it-IT-IsabellaMultilingualNeural",
    "name": "Isabella(it)",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "nb-NO-IselinNeural",
    "name": "Iselin",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "es-ES-IsidoraMultilingualNeural",
    "name": "Isidora(es)",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-US-Ivy",
    "name": "Ivy",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Jacek",
    "name": "Jacek",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "en-US-JacobNeural",
    "name": "Jacob",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "fr-FR-JacquelineNeural",
    "name": "Jacqueline",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "su-ID-JajangNeural",
    "name": "Jajang",
    "lang": "su-ID",
    "gender": "Female"
  },
  {
    "id": "en-PH-JamesNeural",
    "name": "James",
    "lang": "en-PH",
    "gender": "Female"
  },
  {
    "id": "de-CH-JanNeural",
    "name": "Jan",
    "lang": "de-CH",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Jan",
    "name": "Jan",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "en-US-JaneNeural",
    "name": "Jane",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-JasonNeural",
    "name": "Jason",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "es-GQ-JavierNeural",
    "name": "Javier",
    "lang": "es-GQ",
    "gender": "Female"
  },
  {
    "id": "fr-CA-JeanNeural",
    "name": "Jean",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "en-US-JennyNeural",
    "name": "Jenny",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-JennyMultilingualV2Neural",
    "name": "Jenny v2(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-JennyMultilingualNeural",
    "name": "Jenny(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "da-DK-JeppeNeural",
    "name": "Jeppe",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "fr-FR-JeromeNeural",
    "name": "Jerome",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "ca-ES-JoanaNeural",
    "name": "Joana",
    "lang": "ca-ES",
    "gender": "Female"
  },
  {
    "id": "en-US-Joanna",
    "name": "Joanna",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-AU-JoanneNeural",
    "name": "Joanne",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-US-Joey",
    "name": "Joey",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "de-AT-JonasNeural",
    "name": "Jonas",
    "lang": "de-AT",
    "gender": "Female"
  },
  {
    "id": "es-MX-JorgeNeural",
    "name": "Jorge",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "mt-MT-JosephNeural",
    "name": "Joseph",
    "lang": "mt-MT",
    "gender": "Female"
  },
  {
    "id": "fr-FR-JosephineNeural",
    "name": "Josephine",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "es-CR-JuanNeural",
    "name": "Juan",
    "lang": "es-CR",
    "gender": "Female"
  },
  {
    "id": "pt-BR-JulioNeural",
    "name": "Julio",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "en-US-Justin",
    "name": "Justin",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "bg-BG-KalinaNeural",
    "name": "Kalina",
    "lang": "bg-BG",
    "gender": "Female"
  },
  {
    "id": "es-PR-KarinaNeural",
    "name": "Karina",
    "lang": "es-PR",
    "gender": "Female"
  },
  {
    "id": "is-IS-Karl",
    "name": "Karl",
    "lang": "is-IS",
    "gender": "Female"
  },
  {
    "id": "es-HN-KarlaNeural",
    "name": "Karla",
    "lang": "es-HN",
    "gender": "Female"
  },
  {
    "id": "de-DE-KasperNeural",
    "name": "Kasper",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-KatjaNeural",
    "name": "Katja",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "en-AU-KenNeural",
    "name": "Ken",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-US-Kendra",
    "name": "Kendra",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "et-EE-KertNeural",
    "name": "Kert",
    "lang": "et-EE",
    "gender": "Female"
  },
  {
    "id": "en-US-Kevin",
    "name": "Kevin",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "de-DE-KillianNeural",
    "name": "Killian",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "en-AU-KimNeural",
    "name": "Kim",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-US-Kimberly",
    "name": "Kimberly",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "de-DE-KlarissaNeural",
    "name": "Klarissa",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-KlausNeural",
    "name": "Klaus",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "es-ES-LaiaNeural",
    "name": "Laia",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-MX-LarissaNeural",
    "name": "Larissa",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "en-ZA-LeahNeural",
    "name": "Leah",
    "lang": "en-ZA",
    "gender": "Female"
  },
  {
    "id": "pt-BR-LeilaNeural",
    "name": "Leila",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "de-CH-LeniNeural",
    "name": "Leni",
    "lang": "de-CH",
    "gender": "Female"
  },
  {
    "id": "lt-LT-LeonasNeural",
    "name": "Leonas",
    "lang": "lt-LT",
    "gender": "Female"
  },
  {
    "id": "pt-BR-LeticiaNeural",
    "name": "Leticia",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "en-US-LewisMultilingualNeural",
    "name": "Lewis(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "es-ES-LiaNeural",
    "name": "Lia",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-CA-LiamNeural",
    "name": "Liam",
    "lang": "en-CA",
    "gender": "Female"
  },
  {
    "id": "en-GB-LibbyNeural",
    "name": "Libby",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "es-MX-LibertoNeural",
    "name": "Liberto",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "it-IT-LisandroNeural",
    "name": "Lisandro",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "nb-NO-Liv",
    "name": "Liv",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "en-US-LolaMultilingualNeural",
    "name": "Lola(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "es-SV-LorenaNeural",
    "name": "Lorena",
    "lang": "es-SV",
    "gender": "Female"
  },
  {
    "id": "es-CL-LorenzoNeural",
    "name": "Lorenzo",
    "lang": "es-CL",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Lotte",
    "name": "Lotte",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "de-DE-LouisaNeural",
    "name": "Louisa",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "es-ES-Lucia",
    "name": "Lucia",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-MX-LucianoNeural",
    "name": "Luciano",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "fr-FR-LucienMultilingualNeural",
    "name": "Lucien(fr)",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "es-EC-LuisNeural",
    "name": "Luis",
    "lang": "es-EC",
    "gender": "Female"
  },
  {
    "id": "sk-SK-LukasNeural",
    "name": "Lukas",
    "lang": "sk-SK",
    "gender": "Female"
  },
  {
    "id": "en-ZA-LukeNeural",
    "name": "Luke",
    "lang": "en-ZA",
    "gender": "Female"
  },
  {
    "id": "en-SG-LunaNeural",
    "name": "Luna",
    "lang": "en-SG",
    "gender": "Female"
  },
  {
    "id": "es-US-Lupe",
    "name": "Lupe",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Lea",
    "name": "Léa",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "nl-NL-MaartenNeural",
    "name": "Maarten",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "pt-BR-MacerioMultilingualNeural",
    "name": "Macerio(pt)",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "hi-IN-MadhurNeural",
    "name": "Madhur",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "uz-UZ-MadinaNeural",
    "name": "Madina",
    "lang": "uz-UZ",
    "gender": "Female"
  },
  {
    "id": "da-DK-Mads",
    "name": "Mads",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "en-GB-MaisieNeural",
    "name": "Maisie",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "de-DE-MajaNeural",
    "name": "Maja",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Maja",
    "name": "Maja",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "es-CU-ManuelNeural",
    "name": "Manuel",
    "lang": "es-CU",
    "gender": "Female"
  },
  {
    "id": "pt-BR-ManuelaNeural",
    "name": "Manuela",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "it-IT-MarcelloMultilingualNeural",
    "name": "Marcello(it)",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-BO-MarceloNeural",
    "name": "Marcelo",
    "lang": "es-BO",
    "gender": "Female"
  },
  {
    "id": "pl-PL-MarekNeural",
    "name": "Marek",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "es-PA-MargaritaNeural",
    "name": "Margarita",
    "lang": "es-PA",
    "gender": "Female"
  },
  {
    "id": "es-MX-MarinaNeural",
    "name": "Marina",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "es-PY-MarioNeural",
    "name": "Mario",
    "lang": "es-PY",
    "gender": "Female"
  },
  {
    "id": "de-DE-Marlene",
    "name": "Marlene",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "es-GT-MartaNeural",
    "name": "Marta",
    "lang": "es-GT",
    "gender": "Female"
  },
  {
    "id": "es-CR-MariaNeural",
    "name": "María",
    "lang": "es-CR",
    "gender": "Female"
  },
  {
    "id": "ja-JP-MasaruMultilingualNeural",
    "name": "Masaru(ja)",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "es-UY-MateoNeural",
    "name": "Mateo",
    "lang": "es-UY",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Mathieu",
    "name": "Mathieu",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "en-US-Matthew",
    "name": "Matthew",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "sv-SE-MattiasNeural",
    "name": "Mattias",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "fr-FR-MauriceNeural",
    "name": "Maurice",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Maxim",
    "name": "Maxim",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "en-GB-MiaNeural",
    "name": "Mia",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "es-MX-Mia",
    "name": "Mia",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "en-US-MichelleNeural",
    "name": "Michelle",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "es-US-Miguel",
    "name": "Miguel",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "en-NZ-MitchellNeural",
    "name": "Mitchell",
    "lang": "en-NZ",
    "gender": "Female"
  },
  {
    "id": "te-IN-MohanNeural",
    "name": "Mohan",
    "lang": "te-IN",
    "gender": "Female"
  },
  {
    "id": "en-NZ-MollyNeural",
    "name": "Molly",
    "lang": "en-NZ",
    "gender": "Female"
  },
  {
    "id": "en-US-MonicaNeural",
    "name": "Monica",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "so-SO-MuuseNeural",
    "name": "Muuse",
    "lang": "so-SO",
    "gender": "Female"
  },
  {
    "id": "da-DK-Naja",
    "name": "Naja",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "vi-VN-NamMinhNeural",
    "name": "NamMinh",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "en-US-NancyNeural",
    "name": "Nancy",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-NancyMultilingualNeural",
    "name": "Nancy(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-AU-NatashaNeural",
    "name": "Natasha",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-IN-NeerjaNeural",
    "name": "Neerja",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "en-AU-NeilNeural",
    "name": "Neil",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "el-GR-NestorasNeural",
    "name": "Nestoras",
    "lang": "el-GR",
    "gender": "Female"
  },
  {
    "id": "cy-GB-NiaNeural",
    "name": "Nia",
    "lang": "cy-GB",
    "gender": "Female"
  },
  {
    "id": "sr-Latn-RS-NicholasNeural",
    "name": "Nicholas",
    "lang": "sr-Latn",
    "gender": "Female"
  },
  {
    "id": "pt-BR-NicolauNeural",
    "name": "Nicolau",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "en-AU-Nicole",
    "name": "Nicole",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "es-ES-NilNeural",
    "name": "Nil",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "my-MM-NilarNeural",
    "name": "Nilar",
    "lang": "my-MM",
    "gender": "Female"
  },
  {
    "id": "lv-LV-NilsNeural",
    "name": "Nils",
    "lang": "lv-LV",
    "gender": "Female"
  },
  {
    "id": "th-TH-NiwatNeural",
    "name": "Niwat",
    "lang": "th-TH",
    "gender": "Female"
  },
  {
    "id": "en-GB-NoahNeural",
    "name": "Noah",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "hu-HU-NoemiNeural",
    "name": "Noemi",
    "lang": "hu-HU",
    "gender": "Female"
  },
  {
    "id": "fi-FI-NooraNeural",
    "name": "Noora",
    "lang": "fi-FI",
    "gender": "Female"
  },
  {
    "id": "es-MX-NuriaNeural",
    "name": "Nuria",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "en-GB-OliverNeural",
    "name": "Oliver",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-AU-Olivia",
    "name": "Olivia",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-GB-OliviaNeural",
    "name": "Olivia",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-GB-OllieMultilingualNeural",
    "name": "Ollie(en)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "lt-LT-OnaNeural",
    "name": "Ona",
    "lang": "lt-LT",
    "gender": "Female"
  },
  {
    "id": "ga-IE-OrlaNeural",
    "name": "Orla",
    "lang": "ga-IE",
    "gender": "Female"
  },
  {
    "id": "ms-MY-OsmanNeural",
    "name": "Osman",
    "lang": "ms-MY",
    "gender": "Female"
  },
  {
    "id": "ta-IN-PallaviNeural",
    "name": "Pallavi",
    "lang": "ta-IN",
    "gender": "Female"
  },
  {
    "id": "it-IT-PalmiraNeural",
    "name": "Palmira",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-US-PalomaNeural",
    "name": "Paloma",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "es-VE-PaolaNeural",
    "name": "Paola",
    "lang": "es-VE",
    "gender": "Female"
  },
  {
    "id": "es-MX-PelayoNeural",
    "name": "Pelayo",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "es-US-Penelope",
    "name": "Penelope",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "nb-NO-PernilleNeural",
    "name": "Pernille",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "sl-SI-PetraNeural",
    "name": "Petra",
    "lang": "sl-SI",
    "gender": "Female"
  },
  {
    "id": "en-US-PhoebeMultilingualNeural",
    "name": "Phoebe(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "it-IT-PierinaNeural",
    "name": "Pierina",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "en-IN-PrabhatNeural",
    "name": "Prabhat",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "th-TH-PremwadeeNeural",
    "name": "Premwadee",
    "lang": "th-TH",
    "gender": "Female"
  },
  {
    "id": "sw-KE-RafikiNeural",
    "name": "Rafiki",
    "lang": "sw-KE",
    "gender": "Female"
  },
  {
    "id": "de-DE-RalfNeural",
    "name": "Ralf",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "es-DO-RamonaNeural",
    "name": "Ramona",
    "lang": "es-DO",
    "gender": "Female"
  },
  {
    "id": "pt-PT-RaquelNeural",
    "name": "Raquel",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "en-IN-Raveena",
    "name": "Raveena",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "sw-TZ-RehemaNeural",
    "name": "Rehema",
    "lang": "sw-TZ",
    "gender": "Female"
  },
  {
    "id": "fr-FR-RemyMultilingualNeural",
    "name": "Remy(fr)",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "es-MX-RenataNeural",
    "name": "Renata",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "pt-BR-Ricardo",
    "name": "Ricardo",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "it-IT-RinaldoNeural",
    "name": "Rinaldo",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-PA-RobertoNeural",
    "name": "Roberto",
    "lang": "es-PA",
    "gender": "Female"
  },
  {
    "id": "es-SV-RodrigoNeural",
    "name": "Rodrigo",
    "lang": "es-SV",
    "gender": "Female"
  },
  {
    "id": "en-US-RogerNeural",
    "name": "Roger",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "gl-ES-RoiNeural",
    "name": "Roi",
    "lang": "gl-ES",
    "gender": "Female"
  },
  {
    "id": "sl-SI-RokNeural",
    "name": "Rok",
    "lang": "sl-SI",
    "gender": "Female"
  },
  {
    "id": "en-PH-RosaNeural",
    "name": "Rosa",
    "lang": "en-PH",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Ruben",
    "name": "Ruben",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "en-AU-Russell",
    "name": "Russell",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-GB-RyanNeural",
    "name": "Ryan",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-US-RyanMultilingualNeural",
    "name": "Ryan Multilingual",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "gl-ES-SabelaNeural",
    "name": "Sabela",
    "lang": "gl-ES",
    "gender": "Female"
  },
  {
    "id": "ne-NP-SagarNeural",
    "name": "Sagar",
    "lang": "ne-NP",
    "gender": "Female"
  },
  {
    "id": "en-US-Salli",
    "name": "Salli",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ar-EG-SalmaNeural",
    "name": "Salma",
    "lang": "ar-EG",
    "gender": "Female"
  },
  {
    "id": "es-CO-SalomeNeural",
    "name": "Salome",
    "lang": "es-CO",
    "gender": "Female"
  },
  {
    "id": "en-HK-SamNeural",
    "name": "Sam",
    "lang": "en-HK",
    "gender": "Female"
  },
  {
    "id": "en-US-SamuelMultilingualNeural",
    "name": "Samuel(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-SaraNeural",
    "name": "Sara",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "uz-UZ-SardorNeural",
    "name": "Sardor",
    "lang": "uz-UZ",
    "gender": "Female"
  },
  {
    "id": "es-ES-SaulNeural",
    "name": "Saul",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-VE-SebastianNeural",
    "name": "Sebastián",
    "lang": "es-VE",
    "gender": "Female"
  },
  {
    "id": "fi-FI-SelmaNeural",
    "name": "Selma",
    "lang": "fi-FI",
    "gender": "Female"
  },
  {
    "id": "ko-KR-Seoyeon",
    "name": "Seoyeon",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "en-US-SerenaMultilingualNeural",
    "name": "Serena(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ar-EG-ShakirNeural",
    "name": "Shakira",
    "lang": "ar-EG",
    "gender": "Female"
  },
  {
    "id": "te-IN-ShrutiNeural",
    "name": "Shruti",
    "lang": "te-IN",
    "gender": "Female"
  },
  {
    "id": "jv-ID-SitiNeural",
    "name": "Siti",
    "lang": "jv-ID",
    "gender": "Female"
  },
  {
    "id": "es-BO-SofiaNeural",
    "name": "Sofia",
    "lang": "es-BO",
    "gender": "Female"
  },
  {
    "id": "sv-SE-SofieNeural",
    "name": "Sofie",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "en-GB-SoniaNeural",
    "name": "Sonia",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "sr-Latn-RS-SophieNeural",
    "name": "Sophie",
    "lang": "sr-Latn",
    "gender": "Female"
  },
  {
    "id": "hr-HR-SreckoNeural",
    "name": "Srecko",
    "lang": "hr-HR",
    "gender": "Female"
  },
  {
    "id": "en-US-SteffanNeural",
    "name": "Steffan",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-SteffanMultilingualNeural",
    "name": "Steffan(en)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ko-KR-SunHiNeural",
    "name": "SunHi",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ru-RU-SvetlanaNeural",
    "name": "Svetlana",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "hi-IN-SwaraNeural",
    "name": "Swara",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "fr-CA-SylvieNeural",
    "name": "Sylvie",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "hu-HU-TamasNeural",
    "name": "Tamas",
    "lang": "hu-HU",
    "gender": "Female"
  },
  {
    "id": "es-PY-TaniaNeural",
    "name": "Tania",
    "lang": "es-PY",
    "gender": "Female"
  },
  {
    "id": "de-DE-TanjaNeural",
    "name": "Tanja",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Tatyana",
    "name": "Tatyana",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "es-ES-TeoNeural",
    "name": "Teo",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-GQ-TeresaNeural",
    "name": "Teresa",
    "lang": "es-GQ",
    "gender": "Female"
  },
  {
    "id": "pt-BR-ThalitaMultilingualNeural",
    "name": "Thalita(pt)",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "zu-ZA-ThandoNeural",
    "name": "Thando",
    "lang": "zu-ZA",
    "gender": "Female"
  },
  {
    "id": "zu-ZA-ThembaNeural",
    "name": "Themba",
    "lang": "zu-ZA",
    "gender": "Female"
  },
  {
    "id": "my-MM-ThihaNeural",
    "name": "Thiha",
    "lang": "my-MM",
    "gender": "Female"
  },
  {
    "id": "en-GB-ThomasNeural",
    "name": "Thomas",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-AU-TimNeural",
    "name": "Tim",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-AU-TinaNeural",
    "name": "Tina",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "es-AR-TomasNeural",
    "name": "Tomas",
    "lang": "es-AR",
    "gender": "Female"
  },
  {
    "id": "en-US-TonyNeural",
    "name": "Tony",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "es-ES-TrianaNeural",
    "name": "Triana",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-ES-TristanMultilingualNeural",
    "name": "Tristan(es)",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "su-ID-TutiNeural",
    "name": "Tuti",
    "lang": "su-ID",
    "gender": "Female"
  },
  {
    "id": "so-SO-UbaxNeural",
    "name": "Ubax",
    "lang": "so-SO",
    "gender": "Female"
  },
  {
    "id": "es-UY-ValentinaNeural",
    "name": "Valentina",
    "lang": "es-UY",
    "gender": "Female"
  },
  {
    "id": "pt-BR-ValerioNeural",
    "name": "Valerio",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "ta-IN-ValluvarNeural",
    "name": "Valluvar",
    "lang": "ta-IN",
    "gender": "Female"
  },
  {
    "id": "es-ES-VeraNeural",
    "name": "Vera",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "bs-BA-VesnaNeural",
    "name": "Vesna",
    "lang": "bs-BA",
    "gender": "Female"
  },
  {
    "id": "de-DE-Vicki",
    "name": "Vicki",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "sk-SK-ViktoriaNeural",
    "name": "Viktoria",
    "lang": "sk-SK",
    "gender": "Female"
  },
  {
    "id": "pt-BR-Vitoria",
    "name": "Vitoria",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-VivienneMultilingualNeural",
    "name": "Vivienne(fr)",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "cs-CZ-VlastaNeural",
    "name": "Vlasta",
    "lang": "cs-CZ",
    "gender": "Female"
  },
  {
    "id": "es-PR-VictorNeural",
    "name": "Víctor",
    "lang": "es-PR",
    "gender": "Female"
  },
  {
    "id": "zh-HK-WanLungNeural",
    "name": "WanLung",
    "lang": "zh-HK",
    "gender": "Female"
  },
  {
    "id": "en-SG-WayneNeural",
    "name": "Wayne",
    "lang": "en-SG",
    "gender": "Female"
  },
  {
    "id": "af-ZA-WillemNeural",
    "name": "Willem",
    "lang": "af-ZA",
    "gender": "Female"
  },
  {
    "id": "en-AU-WilliamNeural",
    "name": "William",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaochenMultilingualNeural",
    "name": "Xiaochen(zh)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoxiaoNeural",
    "name": "Xiaoxiao",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoxiaoMultilingualNeural",
    "name": "Xiaoxiao(zh)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoyouNeural",
    "name": "Xiaoyou",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoyuMultilingualNeural",
    "name": "Xiaoyu(zh)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "es-ES-XimenaMultilingualNeural",
    "name": "Ximena(es)",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-MX-YagoNeural",
    "name": "Yago",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "en-HK-YanNeural",
    "name": "Yan",
    "lang": "en-HK",
    "gender": "Female"
  },
  {
    "id": "pt-BR-YaraNeural",
    "name": "Yara",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "ms-MY-YasminNeural",
    "name": "Yasmin",
    "lang": "ms-MY",
    "gender": "Female"
  },
  {
    "id": "es-NI-YolandaNeural",
    "name": "Yolanda",
    "lang": "es-NI",
    "gender": "Female"
  },
  {
    "id": "zh-TW-YunJheNeural",
    "name": "YunJhe",
    "lang": "zh-TW",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunfanMultilingualNeural",
    "name": "Yunfan(zh)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunxiaoMultilingualNeural",
    "name": "Yunxiao(zh)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunyangNeural",
    "name": "Yunyang",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunyeNeural",
    "name": "Yunye",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunyiMultilingualNeural",
    "name": "Yunyi(zh)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "fr-FR-YvesNeural",
    "name": "Yves",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-YvetteNeural",
    "name": "Yvette",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "ar-SA-ZariyahNeural",
    "name": "Zariyah",
    "lang": "ar-SA",
    "gender": "Female"
  },
  {
    "id": "ar-XA-Zeina",
    "name": "Zeina",
    "lang": "ar-XA",
    "gender": "Female"
  },
  {
    "id": "cmn-CN-Zhiyu",
    "name": "Zhiyu",
    "lang": "cmn-CN",
    "gender": "Female"
  },
  {
    "id": "pl-PL-ZofiaNeural",
    "name": "Zofia",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "sw-KE-ZuriNeural",
    "name": "Zuri",
    "lang": "sw-KE",
    "gender": "Female"
  },
  {
    "id": "ar-XA-Wavenet-A",
    "name": "ar-XA-A",
    "lang": "ar-XA",
    "gender": "Female"
  },
  {
    "id": "ar-XA-Wavenet-B",
    "name": "ar-XA-B",
    "lang": "ar-XA",
    "gender": "Female"
  },
  {
    "id": "ar-XA-Wavenet-C",
    "name": "ar-XA-C",
    "lang": "ar-XA",
    "gender": "Female"
  },
  {
    "id": "bn-IN-Wavenet-A",
    "name": "bn-IN-A",
    "lang": "bn-IN",
    "gender": "Female"
  },
  {
    "id": "bn-IN-Wavenet-B",
    "name": "bn-IN-B",
    "lang": "bn-IN",
    "gender": "Female"
  },
  {
    "id": "cmn-CN-Wavenet-A",
    "name": "cmn-CN-A",
    "lang": "cmn-CN",
    "gender": "Female"
  },
  {
    "id": "cmn-CN-Wavenet-B",
    "name": "cmn-CN-B",
    "lang": "cmn-CN",
    "gender": "Female"
  },
  {
    "id": "cmn-CN-Wavenet-C",
    "name": "cmn-CN-C",
    "lang": "cmn-CN",
    "gender": "Female"
  },
  {
    "id": "cmn-CN-Wavenet-D",
    "name": "cmn-CN-D",
    "lang": "cmn-CN",
    "gender": "Female"
  },
  {
    "id": "cmn-TW-Wavenet-A",
    "name": "cmn-TW-A",
    "lang": "cmn-TW",
    "gender": "Female"
  },
  {
    "id": "cmn-TW-Wavenet-B",
    "name": "cmn-TW-B",
    "lang": "cmn-TW",
    "gender": "Female"
  },
  {
    "id": "cmn-TW-Wavenet-C",
    "name": "cmn-TW-C",
    "lang": "cmn-TW",
    "gender": "Female"
  },
  {
    "id": "cs-CZ-Wavenet-A",
    "name": "cs-CZ-A",
    "lang": "cs-CZ",
    "gender": "Female"
  },
  {
    "id": "da-DK-Wavenet-A",
    "name": "da-DK-A",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "da-DK-Wavenet-C",
    "name": "da-DK-C",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "da-DK-Neural2-D",
    "name": "da-DK-D",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "da-DK-Wavenet-E",
    "name": "da-DK-E",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "de-DE-Neural2-A",
    "name": "de-DE-A",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-Neural2-B",
    "name": "de-DE-B",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-Neural2-C",
    "name": "de-DE-C",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-Neural2-D",
    "name": "de-DE-D",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-Wavenet-E",
    "name": "de-DE-E",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "de-DE-Neural2-F",
    "name": "de-DE-F",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "el-GR-Wavenet-A",
    "name": "el-GR-A",
    "lang": "el-GR",
    "gender": "Female"
  },
  {
    "id": "en-AU-Neural2-A",
    "name": "en-AU-A2",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-AU-Neural2-B",
    "name": "en-AU-B",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-AU-Neural2-C",
    "name": "en-AU-C2",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-GB-Neural2-A",
    "name": "en-GB-A2",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-GB-Neural2-B",
    "name": "en-GB-B",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-GB-Neural2-C",
    "name": "en-GB-C2",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-GB-Neural2-D",
    "name": "en-GB-D",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-GB-Neural2-F",
    "name": "en-GB-F",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "en-IN-Neural2-A",
    "name": "en-IN-A",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "en-IN-Neural2-B",
    "name": "en-IN-B",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "en-IN-Neural2-C",
    "name": "en-IN-C",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "en-IN-Neural2-D",
    "name": "en-IN-D",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "en-US-Neural2-A",
    "name": "en-US-A2",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-Wavenet-B",
    "name": "en-US-B",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-Neural2-C",
    "name": "en-US-C",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-Neural2-D",
    "name": "en-US-D",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-Neural2-E",
    "name": "en-US-E",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-Neural2-F",
    "name": "en-US-F",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "es-ES-Standard-A",
    "name": "es-ES-A",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "es-US-Neural2-A",
    "name": "es-US-A2",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "es-US-Neural2-B",
    "name": "es-US-B",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "es-US-Neural2-C",
    "name": "es-US-C2",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "fi-FI-Wavenet-A",
    "name": "fi-FI-A",
    "lang": "fi-FI",
    "gender": "Female"
  },
  {
    "id": "fil-PH-Wavenet-A",
    "name": "fil-PH-A",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "fil-PH-Wavenet-B",
    "name": "fil-PH-B",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "fil-PH-Wavenet-C",
    "name": "fil-PH-C",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "fil-PH-Wavenet-D",
    "name": "fil-PH-D",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "fr-CA-Neural2-A",
    "name": "fr-CA-A",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "fr-CA-Neural2-B",
    "name": "fr-CA-B",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "fr-CA-Neural2-C",
    "name": "fr-CA-C",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "fr-CA-Neural2-D",
    "name": "fr-CA-D",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Neural2-A",
    "name": "fr-FR-A",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Neural2-B",
    "name": "fr-FR-B",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Neural2-C",
    "name": "fr-FR-C",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Neural2-D",
    "name": "fr-FR-D",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "fr-FR-Neural2-E",
    "name": "fr-FR-E",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "hi-IN-Neural2-A",
    "name": "hi-IN-A",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "hi-IN-Neural2-B",
    "name": "hi-IN-B",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "hi-IN-Neural2-C",
    "name": "hi-IN-C",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "hi-IN-Neural2-D",
    "name": "hi-IN-D",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "hu-HU-Wavenet-A",
    "name": "hu-HU-A",
    "lang": "hu-HU",
    "gender": "Female"
  },
  {
    "id": "id-ID-Wavenet-A",
    "name": "id-ID-A",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "id-ID-Wavenet-B",
    "name": "id-ID-B",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "id-ID-Wavenet-C",
    "name": "id-ID-C",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "id-ID-Wavenet-D",
    "name": "id-ID-D",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "it-IT-Neural2-A",
    "name": "it-IT-A",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "it-IT-Wavenet-B",
    "name": "it-IT-B",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "it-IT-Neural2-C",
    "name": "it-IT-C",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "it-IT-Wavenet-D",
    "name": "it-IT-D",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "ko-KR-Neural2-A",
    "name": "ko-KR-A",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-Neural2-B",
    "name": "ko-KR-B",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-Neural2-C",
    "name": "ko-KR-C",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-Wavenet-D",
    "name": "ko-KR-D",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "nb-NO-Wavenet-A",
    "name": "nb-NO-A",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "nb-NO-Wavenet-B",
    "name": "nb-NO-B",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "nb-NO-Wavenet-C",
    "name": "nb-NO-C",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "nb-NO-Wavenet-D",
    "name": "nb-NO-D",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "nb-NO-Wavenet-E",
    "name": "nb-NO-E",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Wavenet-A",
    "name": "nl-NL-A",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Wavenet-B",
    "name": "nl-NL-B",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Wavenet-C",
    "name": "nl-NL-C",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Wavenet-D",
    "name": "nl-NL-D",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "nl-NL-Wavenet-E",
    "name": "nl-NL-E",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Wavenet-A",
    "name": "pl-PL-A",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Wavenet-B",
    "name": "pl-PL-B",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Wavenet-C",
    "name": "pl-PL-C",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Wavenet-D",
    "name": "pl-PL-D",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "pl-PL-Wavenet-E",
    "name": "pl-PL-E",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "pt-BR-Neural2-A",
    "name": "pt-BR-A",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "pt-PT-Wavenet-A",
    "name": "pt-PT-A",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "pt-PT-Wavenet-B",
    "name": "pt-PT-B",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "pt-PT-Wavenet-C",
    "name": "pt-PT-C",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "pt-PT-Wavenet-D",
    "name": "pt-PT-D",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Wavenet-A",
    "name": "ru-RU-A",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Wavenet-B",
    "name": "ru-RU-B",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Wavenet-C",
    "name": "ru-RU-C",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Wavenet-D",
    "name": "ru-RU-D",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "ru-RU-Wavenet-E",
    "name": "ru-RU-E",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "sk-SK-Wavenet-A",
    "name": "sk-SK-A",
    "lang": "sk-SK",
    "gender": "Female"
  },
  {
    "id": "sv-SE-Wavenet-A",
    "name": "sv-SE-A",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "te-IN-Standard-A",
    "name": "te-IN-Standard-A",
    "lang": "te-IN",
    "gender": "Female"
  },
  {
    "id": "te-IN-Standard-B",
    "name": "te-IN-Standard-B",
    "lang": "te-IN",
    "gender": "Female"
  },
  {
    "id": "th-TH-Standard-A",
    "name": "th-TH-A",
    "lang": "th-TH",
    "gender": "Female"
  },
  {
    "id": "tr-TR-Wavenet-A",
    "name": "tr-TR-A",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "tr-TR-Wavenet-B",
    "name": "tr-TR-B",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "tr-TR-Wavenet-C",
    "name": "tr-TR-C",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "tr-TR-Wavenet-D",
    "name": "tr-TR-D",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "tr-TR-Wavenet-E",
    "name": "tr-TR-E",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "uk-UA-Wavenet-A",
    "name": "uk-UA-A",
    "lang": "uk-UA",
    "gender": "Female"
  },
  {
    "id": "vi-VN-Neural2-A",
    "name": "vi-VN-A",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "vi-VN-Wavenet-B",
    "name": "vi-VN-B",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "vi-VN-Wavenet-C",
    "name": "vi-VN-C",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "vi-VN-Neural2-D",
    "name": "vi-VN-D",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "kk-KZ-AigulNeural",
    "name": "Айгүл",
    "lang": "kk-KZ",
    "gender": "Female"
  },
  {
    "id": "mk-MK-AleksandarNeural",
    "name": "Александар",
    "lang": "mk-MK",
    "gender": "Female"
  },
  {
    "id": "mn-MN-BataaNeural",
    "name": "Батаа",
    "lang": "mn-MN",
    "gender": "Female"
  },
  {
    "id": "kk-KZ-DauletNeural",
    "name": "Дәулет",
    "lang": "kk-KZ",
    "gender": "Female"
  },
  {
    "id": "mn-MN-YesuiNeural",
    "name": "Есүй",
    "lang": "mn-MN",
    "gender": "Female"
  },
  {
    "id": "mk-MK-MarijaNeural",
    "name": "Марија",
    "lang": "mk-MK",
    "gender": "Female"
  },
  {
    "id": "sr-RS-NicholasNeural",
    "name": "Никола",
    "lang": "sr-RS",
    "gender": "Female"
  },
  {
    "id": "uk-UA-OstapNeural",
    "name": "Остап",
    "lang": "uk-UA",
    "gender": "Female"
  },
  {
    "id": "uk-UA-PolinaNeural",
    "name": "Поліна",
    "lang": "uk-UA",
    "gender": "Female"
  },
  {
    "id": "sr-RS-SophieNeural",
    "name": "Софија",
    "lang": "sr-RS",
    "gender": "Female"
  },
  {
    "id": "hy-AM-AnahitNeural",
    "name": "Անահիտ",
    "lang": "hy-AM",
    "gender": "Female"
  },
  {
    "id": "hy-AM-HaykNeural",
    "name": "Հայկ",
    "lang": "hy-AM",
    "gender": "Female"
  },
  {
    "id": "ar-LY-OmarNeural",
    "name": "أحمد",
    "lang": "ar-LY",
    "gender": "Female"
  },
  {
    "id": "ar-SY-AmanyNeural",
    "name": "أماني",
    "lang": "ar-SY",
    "gender": "Female"
  },
  {
    "id": "ar-QA-AmalNeural",
    "name": "أمل",
    "lang": "ar-QA",
    "gender": "Female"
  },
  {
    "id": "ar-DZ-AminaNeural",
    "name": "أمينة",
    "lang": "ar-DZ",
    "gender": "Female"
  },
  {
    "id": "ar-DZ-IsmaelNeural",
    "name": "إسماعيل",
    "lang": "ar-DZ",
    "gender": "Female"
  },
  {
    "id": "ar-LY-ImanNeural",
    "name": "إيمان",
    "lang": "ar-LY",
    "gender": "Female"
  },
  {
    "id": "ur-PK-AsadNeural",
    "name": "اسد",
    "lang": "ur-PK",
    "gender": "Female"
  },
  {
    "id": "ar-IQ-BasselNeural",
    "name": "باسل",
    "lang": "ar-IQ",
    "gender": "Female"
  },
  {
    "id": "ar-JO-TaimNeural",
    "name": "تيم",
    "lang": "ar-JO",
    "gender": "Female"
  },
  {
    "id": "ar-MA-JamalNeural",
    "name": "جمال",
    "lang": "ar-MA",
    "gender": "Female"
  },
  {
    "id": "ar-AE-HamdanNeural",
    "name": "حمدان",
    "lang": "ar-AE",
    "gender": "Female"
  },
  {
    "id": "fa-IR-DilaraNeural",
    "name": "دلارا",
    "lang": "fa-IR",
    "gender": "Female"
  },
  {
    "id": "ar-LB-RamiNeural",
    "name": "رامي",
    "lang": "ar-LB",
    "gender": "Female"
  },
  {
    "id": "ar-IQ-RanaNeural",
    "name": "رنا",
    "lang": "ar-IQ",
    "gender": "Female"
  },
  {
    "id": "ar-TN-ReemNeural",
    "name": "ريم",
    "lang": "ar-TN",
    "gender": "Female"
  },
  {
    "id": "ur-IN-SalmanNeural",
    "name": "سلمان",
    "lang": "ur-IN",
    "gender": "Female"
  },
  {
    "id": "ar-JO-SanaNeural",
    "name": "سناء",
    "lang": "ar-JO",
    "gender": "Female"
  },
  {
    "id": "ar-YE-SalehNeural",
    "name": "صالح",
    "lang": "ar-YE",
    "gender": "Female"
  },
  {
    "id": "ar-OM-AyshaNeural",
    "name": "عائشة",
    "lang": "ar-OM",
    "gender": "Female"
  },
  {
    "id": "ar-OM-AbdullahNeural",
    "name": "عبدالله",
    "lang": "ar-OM",
    "gender": "Female"
  },
  {
    "id": "ur-PK-UzmaNeural",
    "name": "عظمیٰ",
    "lang": "ur-PK",
    "gender": "Female"
  },
  {
    "id": "ar-BH-AliNeural",
    "name": "علي",
    "lang": "ar-BH",
    "gender": "Female"
  },
  {
    "id": "ar-AE-FatimaNeural",
    "name": "فاطمة",
    "lang": "ar-AE",
    "gender": "Female"
  },
  {
    "id": "fa-IR-FaridNeural",
    "name": "فرید",
    "lang": "fa-IR",
    "gender": "Female"
  },
  {
    "id": "ar-KW-FahedNeural",
    "name": "فهد",
    "lang": "ar-KW",
    "gender": "Female"
  },
  {
    "id": "ps-AF-LatifaNeural",
    "name": "لطيفه",
    "lang": "ps-AF",
    "gender": "Female"
  },
  {
    "id": "ar-SY-LaithNeural",
    "name": "ليث",
    "lang": "ar-SY",
    "gender": "Female"
  },
  {
    "id": "ar-BH-LailaNeural",
    "name": "ليلى",
    "lang": "ar-BH",
    "gender": "Female"
  },
  {
    "id": "ar-LB-LaylaNeural",
    "name": "ليلى",
    "lang": "ar-LB",
    "gender": "Female"
  },
  {
    "id": "ar-YE-MaryamNeural",
    "name": "مريم",
    "lang": "ar-YE",
    "gender": "Female"
  },
  {
    "id": "ar-QA-MoazNeural",
    "name": "معاذ",
    "lang": "ar-QA",
    "gender": "Female"
  },
  {
    "id": "ar-MA-MounaNeural",
    "name": "منى",
    "lang": "ar-MA",
    "gender": "Female"
  },
  {
    "id": "ar-KW-NouraNeural",
    "name": "نورا",
    "lang": "ar-KW",
    "gender": "Female"
  },
  {
    "id": "ar-TN-HediNeural",
    "name": "هادي",
    "lang": "ar-TN",
    "gender": "Female"
  },
  {
    "id": "ps-AF-GulNawazNeural",
    "name": "ګل نواز",
    "lang": "ps-AF",
    "gender": "Female"
  },
  {
    "id": "ur-IN-GulNeural",
    "name": "گل",
    "lang": "ur-IN",
    "gender": "Female"
  },
  {
    "id": "mr-IN-AarohiNeural",
    "name": "आरोही",
    "lang": "mr-IN",
    "gender": "Female"
  },
  {
    "id": "mr-IN-ManoharNeural",
    "name": "मनोहर",
    "lang": "mr-IN",
    "gender": "Female"
  },
  {
    "id": "bn-IN-TanishaaNeural",
    "name": "তানিশা",
    "lang": "bn-IN",
    "gender": "Female"
  },
  {
    "id": "bn-BD-NabanitaNeural",
    "name": "নবনীতা",
    "lang": "bn-BD",
    "gender": "Female"
  },
  {
    "id": "bn-BD-PradeepNeural",
    "name": "প্রদ্বীপ",
    "lang": "bn-BD",
    "gender": "Female"
  },
  {
    "id": "bn-IN-BashkarNeural",
    "name": "ভাস্কর",
    "lang": "bn-IN",
    "gender": "Female"
  },
  {
    "id": "gu-IN-DhwaniNeural",
    "name": "ધ્વની",
    "lang": "gu-IN",
    "gender": "Female"
  },
  {
    "id": "gu-IN-NiranjanNeural",
    "name": "નિરંજન",
    "lang": "gu-IN",
    "gender": "Female"
  },
  {
    "id": "ta-SG-AnbuNeural",
    "name": "அன்பு",
    "lang": "ta-SG",
    "gender": "Female"
  },
  {
    "id": "ta-MY-KaniNeural",
    "name": "கனி",
    "lang": "ta-MY",
    "gender": "Female"
  },
  {
    "id": "ta-LK-KumarNeural",
    "name": "குமார்",
    "lang": "ta-LK",
    "gender": "Female"
  },
  {
    "id": "ta-LK-SaranyaNeural",
    "name": "சரண்யா",
    "lang": "ta-LK",
    "gender": "Female"
  },
  {
    "id": "ta-MY-SuryaNeural",
    "name": "சூர்யா",
    "lang": "ta-MY",
    "gender": "Female"
  },
  {
    "id": "ta-SG-VenbaNeural",
    "name": "வெண்பா",
    "lang": "ta-SG",
    "gender": "Female"
  },
  {
    "id": "kn-IN-GaganNeural",
    "name": "ಗಗನ್",
    "lang": "kn-IN",
    "gender": "Female"
  },
  {
    "id": "kn-IN-SapnaNeural",
    "name": "ಸಪ್ನಾ",
    "lang": "kn-IN",
    "gender": "Female"
  },
  {
    "id": "ml-IN-MidhunNeural",
    "name": "മിഥുൻ",
    "lang": "ml-IN",
    "gender": "Female"
  },
  {
    "id": "ml-IN-SobhanaNeural",
    "name": "ശോഭന",
    "lang": "ml-IN",
    "gender": "Female"
  },
  {
    "id": "si-LK-ThiliniNeural",
    "name": "තිළිණි",
    "lang": "si-LK",
    "gender": "Female"
  },
  {
    "id": "si-LK-SameeraNeural",
    "name": "සමීර",
    "lang": "si-LK",
    "gender": "Female"
  },
  {
    "id": "lo-LA-ChanthavongNeural",
    "name": "ຈັນທະວົງ",
    "lang": "lo-LA",
    "gender": "Female"
  },
  {
    "id": "lo-LA-KeomanyNeural",
    "name": "ແກ້ວມະນີ",
    "lang": "lo-LA",
    "gender": "Female"
  },
  {
    "id": "ka-GE-GiorgiNeural",
    "name": "გიორგი",
    "lang": "ka-GE",
    "gender": "Female"
  },
  {
    "id": "ka-GE-EkaNeural",
    "name": "ეკა",
    "lang": "ka-GE",
    "gender": "Female"
  },
  {
    "id": "am-ET-MekdesNeural",
    "name": "መቅደስ",
    "lang": "am-ET",
    "gender": "Female"
  },
  {
    "id": "am-ET-AmehaNeural",
    "name": "አምሀ",
    "lang": "am-ET",
    "gender": "Female"
  },
  {
    "id": "km-KH-PisethNeural",
    "name": "ពិសិដ្ឋ",
    "lang": "km-KH",
    "gender": "Female"
  },
  {
    "id": "km-KH-SreymomNeural",
    "name": "ស្រីមុំ",
    "lang": "km-KH",
    "gender": "Female"
  },
  {
    "id": "ja-JP-AoiNeural",
    "name": "あおい",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Kazuha-NTTS",
    "name": "かずは(高低なし)",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-KeitaNeural",
    "name": "けいた",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-ShioriNeural",
    "name": "しおり",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Takumi",
    "name": "たくみ",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Takumi-NTTS",
    "name": "たくみ(高低なし)",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-DaichiNeural",
    "name": "だいち",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-NaokiNeural",
    "name": "なおき",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-NanamiNeural",
    "name": "ななみ",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-NanamiNeural_cs",
    "name": "ななみ(案内)",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-MayuNeural",
    "name": "まゆ",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Mizuki",
    "name": "みずき",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Wavenet-C",
    "name": "アナウンサー（A）",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Wavenet-D",
    "name": "アナウンサー（B）",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Standard-A",
    "name": "ロボット",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunjianNeural",
    "name": "云健",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "wuu-CN-YunzheNeural",
    "name": "云哲 (吴语)",
    "lang": "wuu-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunxiaNeural",
    "name": "云夏",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunxiNeural",
    "name": "云希",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-sichuan-YunxiNeural",
    "name": "云希 (四川方言)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "yue-CN-YunSongNeural",
    "name": "云松 (粤语)",
    "lang": "yue-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunfengNeural",
    "name": "云枫",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunzeNeural",
    "name": "云泽",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-henan-YundengNeural",
    "name": "云登 (河南方言)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-YunhaoNeural",
    "name": "云皓",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-shandong-YunxiangNeural",
    "name": "云翔 (山东方言)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoyiNeural",
    "name": "晓伊",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-liaoning-XiaobeiNeural",
    "name": "晓北 (辽宁方言)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoshuangNeural",
    "name": "晓双",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaomoNeural",
    "name": "晓墨",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-shaanxi-XiaoniNeural",
    "name": "晓妮 (陕西方言)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "wuu-CN-XiaotongNeural",
    "name": "晓彤 (吴语)",
    "lang": "wuu-CN",
    "gender": "Female"
  },
  {
    "id": "yue-CN-XiaoMinNeural",
    "name": "晓敏 (粤语)",
    "lang": "yue-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaomengNeural",
    "name": "晓梦",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaohanNeural",
    "name": "晓涵",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaozhenNeural",
    "name": "晓甄",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoruiNeural",
    "name": "晓睿",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoqiuNeural",
    "name": "晓秋",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoxuanNeural",
    "name": "晓萱",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaochenNeural",
    "name": "晓辰",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoyanNeural",
    "name": "晓颜",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "ja-JP-Neural2-B",
    "name": "音声アシスタント",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "ko-KR-GookMinNeural",
    "name": "국민",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-BongJinNeural",
    "name": "봉진",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-SeoHyeonNeural",
    "name": "서현",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-SoonBokNeural",
    "name": "순복",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-YuJinNeural",
    "name": "유진",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ko-KR-JiMinNeural",
    "name": "지민",
    "lang": "ko-KR",
    "gender": "Female"
  }
];

var DEFAULT_VOICE = 'en-US-JennyNeural';

var configSchema = {
  voice: {
    title: 'Voice',
    description: 'Select synthesis voice (690+ models)',
    type: 'string',
    enum: VOICES.map(function(v) { return v.id; }),
    default: DEFAULT_VOICE
  },
  speed: {
    title: 'Speed (0.5 - 2.0)',
    description: 'Voice speech rate (default: 1.0)',
    type: 'number',
    default: 1.0
  },
  pitch: {
    title: 'Pitch (-20 to 20)',
    description: 'Voice pitch shift (default: 0)',
    type: 'number',
    default: 0
  }
};

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

function hasSpeakableText(text) {
  return /[\p{L}\p{N}]/u.test(text);
}

var sessionState = {
  csrfToken: null,
  cookies: null,
  timestamp: 0
};

async function ensureSession() {
  var now = Date.now();
  if (sessionState.csrfToken && (now - sessionState.timestamp < 15 * 60 * 1000)) {
    return sessionState;
  }

  var homeResp = await fetch('https://ondoku3.com/en/', {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!homeResp.ok) {
    throw new Error('Failed to load Ondoku session page: HTTP ' + homeResp.status);
  }

  var html = await homeResp.text();
  var match = html.match(/name=['"]csrfmiddlewaretoken['"]\s+value=['"]([^'"]+)['"]/i);
  var csrf = match && match[1] ? match[1] : '';

  // Extract set-cookie for runtimes where cookies are not automatically retained
  var cookieStr = '';
  var rawCookie = homeResp.headers.get('set-cookie');
  if (rawCookie) {
    var parts = rawCookie.split(',');
    var cleanParts = [];
    for (var i = 0; i < parts.length; i++) {
      var c = parts[i].split(';')[0].trim();
      if (c) cleanParts.push(c);
      if (c.indexOf('csrftoken=') === 0 && !csrf) {
        csrf = c.split('csrftoken=')[1];
      }
    }
    cookieStr = cleanParts.join('; ');
  }

  if (!cookieStr && csrf) {
    cookieStr = 'csrftoken=' + csrf;
  }

  sessionState.csrfToken = csrf;
  sessionState.cookies = cookieStr;
  sessionState.timestamp = now;
  return sessionState;
}

async function doSynthesize(text, options) {
  if (!text || !hasSpeakableText(text)) {
    throw new Error('No speakable text');
  }

  var session = await ensureSession();
  var voiceId = (options && options.voice) || DEFAULT_VOICE;
  var speedVal = options && typeof options.speed === 'number' ? options.speed : 1.0;
  var pitchVal = options && typeof options.pitch === 'number' ? Math.round(options.pitch) : 0;

  speedVal = Math.min(Math.max(speedVal, 0.5), 2.0);
  pitchVal = Math.min(Math.max(pitchVal, -20), 20);

  var bodyParams = new URLSearchParams({
    csrfmiddlewaretoken: session.csrfToken,
    text: text.trim(),
    voice: voiceId,
    speed: speedVal.toString(),
    pitch: pitchVal.toString()
  });

  var postHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-CSRFToken': session.csrfToken,
    'X-Requested-With': 'XMLHttpRequest',
    'Origin': 'https://ondoku3.com',
    'Referer': 'https://ondoku3.com/en/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  };

  if (session.cookies) {
    postHeaders['Cookie'] = session.cookies;
  }

  var response = await fetch('https://ondoku3.com/en/text_to_speech/', {
    method: 'POST',
    headers: postHeaders,
    body: bodyParams.toString()
  });

  if (!response.ok) {
    var errText = await response.text().catch(function() { return ''; });
    sessionState.csrfToken = null; // force fresh token on next attempt
    throw new Error('Ondoku synthesis failed: HTTP ' + response.status + ' ' + response.statusText + ' ' + errText);
  }

  var data = await response.json();
  if (!data || !data.url) {
    if (data && data.code === 'quota_exceeded') {
      throw new Error('Ondoku monthly free quota exceeded');
    }
    throw new Error('Ondoku returned invalid response: ' + JSON.stringify(data));
  }

  var audioResp = await fetch(data.url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Failed to download audio from Ondoku storage: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Ondoku returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'mp3',
    sampleRate: 24000
  };
}

async function synthesizeWithRetry(text, options, maxRetries) {
  if (maxRetries === undefined) maxRetries = 3;
  var lastError = null;

  for (var attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await doSynthesize(text, options);
    } catch (err) {
      lastError = err;
      if (err && (err.message === 'No speakable text' || err.message.includes('quota exceeded'))) {
        throw err;
      }
      console.warn('[' + PLUGIN_ID + '] Synthesis attempt ' + attempt + ' failed: ' + (err ? err.message : String(err)));
      if (attempt < maxRetries) {
        await sleep(attempt * 1000);
      }
    }
  }

  throw lastError || new Error('Ondoku synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free multilingual text-to-speech using Ondoku without login. Supports 690+ voices across 70+ languages. Returns MP3 audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 1000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 18,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
