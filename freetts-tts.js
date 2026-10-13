// FreeTTS (Neural) Plugin for LNReader
// Zero-authentication Microsoft Edge neural voice synthesis engine

var PLUGIN_ID = 'freetts-tts';
var PLUGIN_NAME = 'FreeTTS (Neural)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "mr-IN-AarohiNeural",
    "name": "Aarohi (mr-IN)",
    "lang": "mr-IN",
    "gender": "Female"
  },
  {
    "id": "ar-OM-AbdullahNeural",
    "name": "Abdullah (ar-OM)",
    "lang": "ar-OM",
    "gender": "Male"
  },
  {
    "id": "en-NG-AbeoNeural",
    "name": "Abeo (en-NG)",
    "lang": "en-NG",
    "gender": "Male"
  },
  {
    "id": "af-ZA-AdriNeural",
    "name": "Adri (af-ZA)",
    "lang": "af-ZA",
    "gender": "Female"
  },
  {
    "id": "tr-TR-AhmetNeural",
    "name": "Ahmet (tr-TR)",
    "lang": "tr-TR",
    "gender": "Male"
  },
  {
    "id": "kk-KZ-AigulNeural",
    "name": "Aigul (kk-KZ)",
    "lang": "kk-KZ",
    "gender": "Female"
  },
  {
    "id": "cy-GB-AledNeural",
    "name": "Aled (cy-GB)",
    "lang": "cy-GB",
    "gender": "Male"
  },
  {
    "id": "mk-MK-AleksandarNeural",
    "name": "Aleksandar (mk-MK)",
    "lang": "mk-MK",
    "gender": "Male"
  },
  {
    "id": "es-PE-AlexNeural",
    "name": "Alex (es-PE)",
    "lang": "es-PE",
    "gender": "Male"
  },
  {
    "id": "ar-BH-AliNeural",
    "name": "Ali (ar-BH)",
    "lang": "ar-BH",
    "gender": "Male"
  },
  {
    "id": "ro-RO-AlinaNeural",
    "name": "Alina (ro-RO)",
    "lang": "ro-RO",
    "gender": "Female"
  },
  {
    "id": "es-US-AlonsoNeural",
    "name": "Alonso (es-US)",
    "lang": "es-US",
    "gender": "Male"
  },
  {
    "id": "es-ES-AlvaroNeural",
    "name": "Alvaro (es-ES)",
    "lang": "es-ES",
    "gender": "Male"
  },
  {
    "id": "ar-QA-AmalNeural",
    "name": "Amal (ar-QA)",
    "lang": "ar-QA",
    "gender": "Female"
  },
  {
    "id": "de-DE-AmalaNeural",
    "name": "Amala (de-DE)",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "ar-SY-AmanyNeural",
    "name": "Amany (ar-SY)",
    "lang": "ar-SY",
    "gender": "Female"
  },
  {
    "id": "am-ET-AmehaNeural",
    "name": "Ameha (am-ET)",
    "lang": "am-ET",
    "gender": "Male"
  },
  {
    "id": "ar-DZ-AminaNeural",
    "name": "Amina (ar-DZ)",
    "lang": "ar-DZ",
    "gender": "Female"
  },
  {
    "id": "en-US-AnaNeural",
    "name": "Ana (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ta-SG-AnbuNeural",
    "name": "Anbu (ta-SG)",
    "lang": "ta-SG",
    "gender": "Male"
  },
  {
    "id": "es-EC-AndreaNeural",
    "name": "Andrea (es-EC)",
    "lang": "es-EC",
    "gender": "Female"
  },
  {
    "id": "es-GT-AndresNeural",
    "name": "Andres (es-GT)",
    "lang": "es-GT",
    "gender": "Male"
  },
  {
    "id": "en-US-AndrewMultilingualNeural",
    "name": "Andrew (Multilingual) (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "en-US-AndrewNeural",
    "name": "Andrew (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "fil-PH-AngeloNeural",
    "name": "Angelo (fil-PH)",
    "lang": "fil-PH",
    "gender": "Male"
  },
  {
    "id": "sq-AL-AnilaNeural",
    "name": "Anila (sq-AL)",
    "lang": "sq-AL",
    "gender": "Female"
  },
  {
    "id": "fr-CA-AntoineNeural",
    "name": "Antoine (fr-CA)",
    "lang": "fr-CA",
    "gender": "Male"
  },
  {
    "id": "cs-CZ-AntoninNeural",
    "name": "Antonin (cs-CZ)",
    "lang": "cs-CZ",
    "gender": "Male"
  },
  {
    "id": "pt-BR-AntonioNeural",
    "name": "Antonio (pt-BR)",
    "lang": "pt-BR",
    "gender": "Male"
  },
  {
    "id": "et-EE-AnuNeural",
    "name": "Anu (et-EE)",
    "lang": "et-EE",
    "gender": "Female"
  },
  {
    "id": "id-ID-ArdiNeural",
    "name": "Ardi (id-ID)",
    "lang": "id-ID",
    "gender": "Male"
  },
  {
    "id": "en-US-AriaNeural",
    "name": "Aria (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "fr-CH-ArianeNeural",
    "name": "Ariane (fr-CH)",
    "lang": "fr-CH",
    "gender": "Female"
  },
  {
    "id": "nl-BE-ArnaudNeural",
    "name": "Arnaud (nl-BE)",
    "lang": "nl-BE",
    "gender": "Male"
  },
  {
    "id": "ur-PK-AsadNeural",
    "name": "Asad (ur-PK)",
    "lang": "ur-PK",
    "gender": "Male"
  },
  {
    "id": "en-KE-AsiliaNeural",
    "name": "Asilia (en-KE)",
    "lang": "en-KE",
    "gender": "Female"
  },
  {
    "id": "el-GR-AthinaNeural",
    "name": "Athina (el-GR)",
    "lang": "el-GR",
    "gender": "Female"
  },
  {
    "id": "en-US-AvaMultilingualNeural",
    "name": "Ava (Multilingual) (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-AvaNeural",
    "name": "Ava (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "he-IL-AvriNeural",
    "name": "Avri (he-IL)",
    "lang": "he-IL",
    "gender": "Male"
  },
  {
    "id": "ar-OM-AyshaNeural",
    "name": "Aysha (ar-OM)",
    "lang": "ar-OM",
    "gender": "Female"
  },
  {
    "id": "az-AZ-BabekNeural",
    "name": "Babek (az-AZ)",
    "lang": "az-AZ",
    "gender": "Male"
  },
  {
    "id": "az-AZ-BanuNeural",
    "name": "Banu (az-AZ)",
    "lang": "az-AZ",
    "gender": "Female"
  },
  {
    "id": "bn-IN-BashkarNeural",
    "name": "Bashkar (bn-IN)",
    "lang": "bn-IN",
    "gender": "Male"
  },
  {
    "id": "ar-IQ-BasselNeural",
    "name": "Bassel (ar-IQ)",
    "lang": "ar-IQ",
    "gender": "Male"
  },
  {
    "id": "mn-MN-BataaNeural",
    "name": "Bataa (mn-MN)",
    "lang": "mn-MN",
    "gender": "Male"
  },
  {
    "id": "es-CU-BelkysNeural",
    "name": "Belkys (es-CU)",
    "lang": "es-CU",
    "gender": "Female"
  },
  {
    "id": "fil-PH-BlessicaNeural",
    "name": "Blessica (fil-PH)",
    "lang": "fil-PH",
    "gender": "Female"
  },
  {
    "id": "bg-BG-BorislavNeural",
    "name": "Borislav (bg-BG)",
    "lang": "bg-BG",
    "gender": "Male"
  },
  {
    "id": "en-US-BrianMultilingualNeural",
    "name": "Brian (Multilingual) (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "en-US-BrianNeural",
    "name": "Brian (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "es-PE-CamilaNeural",
    "name": "Camila (es-PE)",
    "lang": "es-PE",
    "gender": "Female"
  },
  {
    "id": "es-HN-CarlosNeural",
    "name": "Carlos (es-HN)",
    "lang": "es-HN",
    "gender": "Male"
  },
  {
    "id": "es-CL-CatalinaNeural",
    "name": "Catalina (es-CL)",
    "lang": "es-CL",
    "gender": "Female"
  },
  {
    "id": "lo-LA-ChanthavongNeural",
    "name": "Chanthavong (lo-LA)",
    "lang": "lo-LA",
    "gender": "Male"
  },
  {
    "id": "fr-BE-CharlineNeural",
    "name": "Charline (fr-BE)",
    "lang": "fr-BE",
    "gender": "Female"
  },
  {
    "id": "en-KE-ChilembaNeural",
    "name": "Chilemba (en-KE)",
    "lang": "en-KE",
    "gender": "Male"
  },
  {
    "id": "da-DK-ChristelNeural",
    "name": "Christel (da-DK)",
    "lang": "da-DK",
    "gender": "Female"
  },
  {
    "id": "en-US-ChristopherNeural",
    "name": "Christopher (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "en-CA-ClaraNeural",
    "name": "Clara (en-CA)",
    "lang": "en-CA",
    "gender": "Female"
  },
  {
    "id": "nl-NL-ColetteNeural",
    "name": "Colette (nl-NL)",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "ga-IE-ColmNeural",
    "name": "Colm (ga-IE)",
    "lang": "ga-IE",
    "gender": "Male"
  },
  {
    "id": "en-IE-ConnorNeural",
    "name": "Connor (en-IE)",
    "lang": "en-IE",
    "gender": "Male"
  },
  {
    "id": "de-DE-ConradNeural",
    "name": "Conrad (de-DE)",
    "lang": "de-DE",
    "gender": "Male"
  },
  {
    "id": "es-MX-DaliaNeural",
    "name": "Dalia (es-MX)",
    "lang": "es-MX",
    "gender": "Female"
  },
  {
    "id": "sw-TZ-DaudiNeural",
    "name": "Daudi (sw-TZ)",
    "lang": "sw-TZ",
    "gender": "Male"
  },
  {
    "id": "kk-KZ-DauletNeural",
    "name": "Daulet (kk-KZ)",
    "lang": "kk-KZ",
    "gender": "Male"
  },
  {
    "id": "nl-BE-DenaNeural",
    "name": "Dena (nl-BE)",
    "lang": "nl-BE",
    "gender": "Female"
  },
  {
    "id": "fr-FR-DeniseNeural",
    "name": "Denise (fr-FR)",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "gu-IN-DhwaniNeural",
    "name": "Dhwani (gu-IN)",
    "lang": "gu-IN",
    "gender": "Female"
  },
  {
    "id": "it-IT-DiegoNeural",
    "name": "Diego (it-IT)",
    "lang": "it-IT",
    "gender": "Male"
  },
  {
    "id": "fa-IR-DilaraNeural",
    "name": "Dilara (fa-IR)",
    "lang": "fa-IR",
    "gender": "Female"
  },
  {
    "id": "jv-ID-DimasNeural",
    "name": "Dimas (jv-ID)",
    "lang": "jv-ID",
    "gender": "Male"
  },
  {
    "id": "ru-RU-DmitryNeural",
    "name": "Dmitry (ru-RU)",
    "lang": "ru-RU",
    "gender": "Male"
  },
  {
    "id": "pt-PT-DuarteNeural",
    "name": "Duarte (pt-PT)",
    "lang": "pt-PT",
    "gender": "Male"
  },
  {
    "id": "ka-GE-EkaNeural",
    "name": "Eka (ka-GE)",
    "lang": "ka-GE",
    "gender": "Female"
  },
  {
    "id": "es-AR-ElenaNeural",
    "name": "Elena (es-AR)",
    "lang": "es-AR",
    "gender": "Female"
  },
  {
    "id": "en-TZ-ElimuNeural",
    "name": "Elimu (en-TZ)",
    "lang": "en-TZ",
    "gender": "Male"
  },
  {
    "id": "fr-FR-EloiseNeural",
    "name": "Eloise (fr-FR)",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "it-IT-ElsaNeural",
    "name": "Elsa (it-IT)",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "es-ES-ElviraNeural",
    "name": "Elvira (es-ES)",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "tr-TR-EmelNeural",
    "name": "Emel (tr-TR)",
    "lang": "tr-TR",
    "gender": "Female"
  },
  {
    "id": "ro-RO-EmilNeural",
    "name": "Emil (ro-RO)",
    "lang": "ro-RO",
    "gender": "Male"
  },
  {
    "id": "es-DO-EmilioNeural",
    "name": "Emilio (es-DO)",
    "lang": "es-DO",
    "gender": "Male"
  },
  {
    "id": "en-IE-EmilyNeural",
    "name": "Emily (en-IE)",
    "lang": "en-IE",
    "gender": "Female"
  },
  {
    "id": "en-US-EmmaMultilingualNeural",
    "name": "Emma (Multilingual) (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "en-US-EmmaNeural",
    "name": "Emma (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ca-ES-EnricNeural",
    "name": "Enric (ca-ES)",
    "lang": "ca-ES",
    "gender": "Male"
  },
  {
    "id": "en-US-EricNeural",
    "name": "Eric (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "lv-LV-EveritaNeural",
    "name": "Everita (lv-LV)",
    "lang": "lv-LV",
    "gender": "Female"
  },
  {
    "id": "en-NG-EzinneNeural",
    "name": "Ezinne (en-NG)",
    "lang": "en-NG",
    "gender": "Female"
  },
  {
    "id": "fr-CH-FabriceNeural",
    "name": "Fabrice (fr-CH)",
    "lang": "fr-CH",
    "gender": "Male"
  },
  {
    "id": "ar-KW-FahedNeural",
    "name": "Fahed (ar-KW)",
    "lang": "ar-KW",
    "gender": "Male"
  },
  {
    "id": "fa-IR-FaridNeural",
    "name": "Farid (fa-IR)",
    "lang": "fa-IR",
    "gender": "Male"
  },
  {
    "id": "ar-AE-FatimaNeural",
    "name": "Fatima (ar-AE)",
    "lang": "ar-AE",
    "gender": "Female"
  },
  {
    "id": "es-NI-FedericoNeural",
    "name": "Federico (es-NI)",
    "lang": "es-NI",
    "gender": "Male"
  },
  {
    "id": "nl-NL-FennaNeural",
    "name": "Fenna (nl-NL)",
    "lang": "nl-NL",
    "gender": "Female"
  },
  {
    "id": "nb-NO-FinnNeural",
    "name": "Finn (nb-NO)",
    "lang": "nb-NO",
    "gender": "Male"
  },
  {
    "id": "de-DE-FlorianMultilingualNeural",
    "name": "Florian (de-DE)",
    "lang": "de-DE",
    "gender": "Male"
  },
  {
    "id": "pt-BR-FranciscaNeural",
    "name": "Francisca (pt-BR)",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "hr-HR-GabrijelaNeural",
    "name": "Gabrijela (hr-HR)",
    "lang": "hr-HR",
    "gender": "Female"
  },
  {
    "id": "id-ID-GadisNeural",
    "name": "Gadis (id-ID)",
    "lang": "id-ID",
    "gender": "Female"
  },
  {
    "id": "kn-IN-GaganNeural",
    "name": "Gagan (kn-IN)",
    "lang": "kn-IN",
    "gender": "Male"
  },
  {
    "id": "fr-BE-GerardNeural",
    "name": "Gerard (fr-BE)",
    "lang": "fr-BE",
    "gender": "Male"
  },
  {
    "id": "ka-GE-GiorgiNeural",
    "name": "Giorgi (ka-GE)",
    "lang": "ka-GE",
    "gender": "Male"
  },
  {
    "id": "it-IT-GiuseppeMultilingualNeural",
    "name": "Giuseppe (it-IT)",
    "lang": "it-IT",
    "gender": "Male"
  },
  {
    "id": "es-CO-GonzaloNeural",
    "name": "Gonzalo (es-CO)",
    "lang": "es-CO",
    "gender": "Male"
  },
  {
    "id": "bs-BA-GoranNeural",
    "name": "Goran (bs-BA)",
    "lang": "bs-BA",
    "gender": "Male"
  },
  {
    "id": "mt-MT-GraceNeural",
    "name": "Grace (mt-MT)",
    "lang": "mt-MT",
    "gender": "Female"
  },
  {
    "id": "is-IS-GudrunNeural",
    "name": "Gudrun (is-IS)",
    "lang": "is-IS",
    "gender": "Female"
  },
  {
    "id": "ur-IN-GulNeural",
    "name": "Gul (ur-IN)",
    "lang": "ur-IN",
    "gender": "Female"
  },
  {
    "id": "ps-AF-GulNawazNeural",
    "name": "GulNawaz (ps-AF)",
    "lang": "ps-AF",
    "gender": "Male"
  },
  {
    "id": "is-IS-GunnarNeural",
    "name": "Gunnar (is-IS)",
    "lang": "is-IS",
    "gender": "Male"
  },
  {
    "id": "en-US-GuyNeural",
    "name": "Guy (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "ar-AE-HamdanNeural",
    "name": "Hamdan (ar-AE)",
    "lang": "ar-AE",
    "gender": "Male"
  },
  {
    "id": "ar-SA-HamedNeural",
    "name": "Hamed (ar-SA)",
    "lang": "ar-SA",
    "gender": "Male"
  },
  {
    "id": "fi-FI-HarriNeural",
    "name": "Harri (fi-FI)",
    "lang": "fi-FI",
    "gender": "Male"
  },
  {
    "id": "ar-TN-HediNeural",
    "name": "Hedi (ar-TN)",
    "lang": "ar-TN",
    "gender": "Male"
  },
  {
    "id": "ne-NP-HemkalaNeural",
    "name": "Hemkala (ne-NP)",
    "lang": "ne-NP",
    "gender": "Female"
  },
  {
    "id": "fr-FR-HenriNeural",
    "name": "Henri (fr-FR)",
    "lang": "fr-FR",
    "gender": "Male"
  },
  {
    "id": "he-IL-HilaNeural",
    "name": "Hila (he-IL)",
    "lang": "he-IL",
    "gender": "Female"
  },
  {
    "id": "zh-HK-HiuGaaiNeural",
    "name": "HiuGaai (zh-HK)",
    "lang": "zh-HK",
    "gender": "Female"
  },
  {
    "id": "zh-HK-HiuMaanNeural",
    "name": "HiuMaan (zh-HK)",
    "lang": "zh-HK",
    "gender": "Female"
  },
  {
    "id": "vi-VN-HoaiMyNeural",
    "name": "HoaiMy (vi-VN)",
    "lang": "vi-VN",
    "gender": "Female"
  },
  {
    "id": "zh-TW-HsiaoChenNeural",
    "name": "HsiaoChen (zh-TW)",
    "lang": "zh-TW",
    "gender": "Female"
  },
  {
    "id": "zh-TW-HsiaoYuNeural",
    "name": "HsiaoYu (zh-TW)",
    "lang": "zh-TW",
    "gender": "Female"
  },
  {
    "id": "ko-KR-HyunsuMultilingualNeural",
    "name": "Hyunsu (ko-KR)",
    "lang": "ko-KR",
    "gender": "Male"
  },
  {
    "id": "sq-AL-IlirNeural",
    "name": "Ilir (sq-AL)",
    "lang": "sq-AL",
    "gender": "Male"
  },
  {
    "id": "ar-LY-ImanNeural",
    "name": "Iman (ar-LY)",
    "lang": "ar-LY",
    "gender": "Female"
  },
  {
    "id": "en-TZ-ImaniNeural",
    "name": "Imani (en-TZ)",
    "lang": "en-TZ",
    "gender": "Female"
  },
  {
    "id": "ko-KR-InJoonNeural",
    "name": "InJoon (ko-KR)",
    "lang": "ko-KR",
    "gender": "Male"
  },
  {
    "id": "de-AT-IngridNeural",
    "name": "Ingrid (de-AT)",
    "lang": "de-AT",
    "gender": "Female"
  },
  {
    "id": "it-IT-IsabellaNeural",
    "name": "Isabella (it-IT)",
    "lang": "it-IT",
    "gender": "Female"
  },
  {
    "id": "ar-DZ-IsmaelNeural",
    "name": "Ismael (ar-DZ)",
    "lang": "ar-DZ",
    "gender": "Male"
  },
  {
    "id": "su-ID-JajangNeural",
    "name": "Jajang (su-ID)",
    "lang": "su-ID",
    "gender": "Male"
  },
  {
    "id": "ar-MA-JamalNeural",
    "name": "Jamal (ar-MA)",
    "lang": "ar-MA",
    "gender": "Male"
  },
  {
    "id": "en-PH-JamesNeural",
    "name": "James (en-PH)",
    "lang": "en-PH",
    "gender": "Male"
  },
  {
    "id": "de-CH-JanNeural",
    "name": "Jan (de-CH)",
    "lang": "de-CH",
    "gender": "Male"
  },
  {
    "id": "es-GQ-JavierNeural",
    "name": "Javier (es-GQ)",
    "lang": "es-GQ",
    "gender": "Male"
  },
  {
    "id": "fr-CA-JeanNeural",
    "name": "Jean (fr-CA)",
    "lang": "fr-CA",
    "gender": "Male"
  },
  {
    "id": "en-US-JennyNeural",
    "name": "Jenny (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "da-DK-JeppeNeural",
    "name": "Jeppe (da-DK)",
    "lang": "da-DK",
    "gender": "Male"
  },
  {
    "id": "ca-ES-JoanaNeural",
    "name": "Joana (ca-ES)",
    "lang": "ca-ES",
    "gender": "Female"
  },
  {
    "id": "de-AT-JonasNeural",
    "name": "Jonas (de-AT)",
    "lang": "de-AT",
    "gender": "Male"
  },
  {
    "id": "es-MX-JorgeNeural",
    "name": "Jorge (es-MX)",
    "lang": "es-MX",
    "gender": "Male"
  },
  {
    "id": "mt-MT-JosephNeural",
    "name": "Joseph (mt-MT)",
    "lang": "mt-MT",
    "gender": "Male"
  },
  {
    "id": "es-CR-JuanNeural",
    "name": "Juan (es-CR)",
    "lang": "es-CR",
    "gender": "Male"
  },
  {
    "id": "bg-BG-KalinaNeural",
    "name": "Kalina (bg-BG)",
    "lang": "bg-BG",
    "gender": "Female"
  },
  {
    "id": "ta-MY-KaniNeural",
    "name": "Kani (ta-MY)",
    "lang": "ta-MY",
    "gender": "Female"
  },
  {
    "id": "es-PR-KarinaNeural",
    "name": "Karina (es-PR)",
    "lang": "es-PR",
    "gender": "Female"
  },
  {
    "id": "es-HN-KarlaNeural",
    "name": "Karla (es-HN)",
    "lang": "es-HN",
    "gender": "Female"
  },
  {
    "id": "de-DE-KatjaNeural",
    "name": "Katja (de-DE)",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "ja-JP-KeitaNeural",
    "name": "Keita (ja-JP)",
    "lang": "ja-JP",
    "gender": "Male"
  },
  {
    "id": "lo-LA-KeomanyNeural",
    "name": "Keomany (lo-LA)",
    "lang": "lo-LA",
    "gender": "Female"
  },
  {
    "id": "et-EE-KertNeural",
    "name": "Kert (et-EE)",
    "lang": "et-EE",
    "gender": "Male"
  },
  {
    "id": "de-DE-KillianNeural",
    "name": "Killian (de-DE)",
    "lang": "de-DE",
    "gender": "Male"
  },
  {
    "id": "ta-LK-KumarNeural",
    "name": "Kumar (ta-LK)",
    "lang": "ta-LK",
    "gender": "Male"
  },
  {
    "id": "ar-BH-LailaNeural",
    "name": "Laila (ar-BH)",
    "lang": "ar-BH",
    "gender": "Female"
  },
  {
    "id": "ar-SY-LaithNeural",
    "name": "Laith (ar-SY)",
    "lang": "ar-SY",
    "gender": "Male"
  },
  {
    "id": "ps-AF-LatifaNeural",
    "name": "Latifa (ps-AF)",
    "lang": "ps-AF",
    "gender": "Female"
  },
  {
    "id": "ar-LB-LaylaNeural",
    "name": "Layla (ar-LB)",
    "lang": "ar-LB",
    "gender": "Female"
  },
  {
    "id": "en-ZA-LeahNeural",
    "name": "Leah (en-ZA)",
    "lang": "en-ZA",
    "gender": "Female"
  },
  {
    "id": "de-CH-LeniNeural",
    "name": "Leni (de-CH)",
    "lang": "de-CH",
    "gender": "Female"
  },
  {
    "id": "lt-LT-LeonasNeural",
    "name": "Leonas (lt-LT)",
    "lang": "lt-LT",
    "gender": "Male"
  },
  {
    "id": "en-CA-LiamNeural",
    "name": "Liam (en-CA)",
    "lang": "en-CA",
    "gender": "Male"
  },
  {
    "id": "en-GB-LibbyNeural",
    "name": "Libby (en-GB)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "es-SV-LorenaNeural",
    "name": "Lorena (es-SV)",
    "lang": "es-SV",
    "gender": "Female"
  },
  {
    "id": "es-CL-LorenzoNeural",
    "name": "Lorenzo (es-CL)",
    "lang": "es-CL",
    "gender": "Male"
  },
  {
    "id": "es-EC-LuisNeural",
    "name": "Luis (es-EC)",
    "lang": "es-EC",
    "gender": "Male"
  },
  {
    "id": "sk-SK-LukasNeural",
    "name": "Lukas (sk-SK)",
    "lang": "sk-SK",
    "gender": "Male"
  },
  {
    "id": "en-ZA-LukeNeural",
    "name": "Luke (en-ZA)",
    "lang": "en-ZA",
    "gender": "Male"
  },
  {
    "id": "en-SG-LunaNeural",
    "name": "Luna (en-SG)",
    "lang": "en-SG",
    "gender": "Female"
  },
  {
    "id": "nl-NL-MaartenNeural",
    "name": "Maarten (nl-NL)",
    "lang": "nl-NL",
    "gender": "Male"
  },
  {
    "id": "hi-IN-MadhurNeural",
    "name": "Madhur (hi-IN)",
    "lang": "hi-IN",
    "gender": "Male"
  },
  {
    "id": "uz-UZ-MadinaNeural",
    "name": "Madina (uz-UZ)",
    "lang": "uz-UZ",
    "gender": "Female"
  },
  {
    "id": "en-GB-MaisieNeural",
    "name": "Maisie (en-GB)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "mr-IN-ManoharNeural",
    "name": "Manohar (mr-IN)",
    "lang": "mr-IN",
    "gender": "Male"
  },
  {
    "id": "es-CU-ManuelNeural",
    "name": "Manuel (es-CU)",
    "lang": "es-CU",
    "gender": "Male"
  },
  {
    "id": "es-BO-MarceloNeural",
    "name": "Marcelo (es-BO)",
    "lang": "es-BO",
    "gender": "Male"
  },
  {
    "id": "pl-PL-MarekNeural",
    "name": "Marek (pl-PL)",
    "lang": "pl-PL",
    "gender": "Male"
  },
  {
    "id": "es-PA-MargaritaNeural",
    "name": "Margarita (es-PA)",
    "lang": "es-PA",
    "gender": "Female"
  },
  {
    "id": "es-CR-MariaNeural",
    "name": "Maria (es-CR)",
    "lang": "es-CR",
    "gender": "Female"
  },
  {
    "id": "mk-MK-MarijaNeural",
    "name": "Marija (mk-MK)",
    "lang": "mk-MK",
    "gender": "Female"
  },
  {
    "id": "es-PY-MarioNeural",
    "name": "Mario (es-PY)",
    "lang": "es-PY",
    "gender": "Male"
  },
  {
    "id": "es-GT-MartaNeural",
    "name": "Marta (es-GT)",
    "lang": "es-GT",
    "gender": "Female"
  },
  {
    "id": "ar-YE-MaryamNeural",
    "name": "Maryam (ar-YE)",
    "lang": "ar-YE",
    "gender": "Female"
  },
  {
    "id": "es-UY-MateoNeural",
    "name": "Mateo (es-UY)",
    "lang": "es-UY",
    "gender": "Male"
  },
  {
    "id": "sv-SE-MattiasNeural",
    "name": "Mattias (sv-SE)",
    "lang": "sv-SE",
    "gender": "Male"
  },
  {
    "id": "am-ET-MekdesNeural",
    "name": "Mekdes (am-ET)",
    "lang": "am-ET",
    "gender": "Female"
  },
  {
    "id": "en-US-MichelleNeural",
    "name": "Michelle (en-US)",
    "lang": "en-US",
    "gender": "Female"
  },
  {
    "id": "ml-IN-MidhunNeural",
    "name": "Midhun (ml-IN)",
    "lang": "ml-IN",
    "gender": "Male"
  },
  {
    "id": "en-NZ-MitchellNeural",
    "name": "Mitchell (en-NZ)",
    "lang": "en-NZ",
    "gender": "Male"
  },
  {
    "id": "ar-QA-MoazNeural",
    "name": "Moaz (ar-QA)",
    "lang": "ar-QA",
    "gender": "Male"
  },
  {
    "id": "te-IN-MohanNeural",
    "name": "Mohan (te-IN)",
    "lang": "te-IN",
    "gender": "Male"
  },
  {
    "id": "en-NZ-MollyNeural",
    "name": "Molly (en-NZ)",
    "lang": "en-NZ",
    "gender": "Female"
  },
  {
    "id": "ar-MA-MounaNeural",
    "name": "Mouna (ar-MA)",
    "lang": "ar-MA",
    "gender": "Female"
  },
  {
    "id": "so-SO-MuuseNeural",
    "name": "Muuse (so-SO)",
    "lang": "so-SO",
    "gender": "Male"
  },
  {
    "id": "bn-BD-NabanitaNeural",
    "name": "Nabanita (bn-BD)",
    "lang": "bn-BD",
    "gender": "Female"
  },
  {
    "id": "vi-VN-NamMinhNeural",
    "name": "NamMinh (vi-VN)",
    "lang": "vi-VN",
    "gender": "Male"
  },
  {
    "id": "ja-JP-NanamiNeural",
    "name": "Nanami (ja-JP)",
    "lang": "ja-JP",
    "gender": "Female"
  },
  {
    "id": "en-AU-NatashaNeural",
    "name": "Natasha (en-AU)",
    "lang": "en-AU",
    "gender": "Female"
  },
  {
    "id": "en-IN-NeerjaNeural",
    "name": "Neerja (en-IN)",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "en-IN-NeerjaExpressiveNeural",
    "name": "NeerjaExpressive (en-IN)",
    "lang": "en-IN",
    "gender": "Female"
  },
  {
    "id": "el-GR-NestorasNeural",
    "name": "Nestoras (el-GR)",
    "lang": "el-GR",
    "gender": "Male"
  },
  {
    "id": "cy-GB-NiaNeural",
    "name": "Nia (cy-GB)",
    "lang": "cy-GB",
    "gender": "Female"
  },
  {
    "id": "sr-RS-NicholasNeural",
    "name": "Nicholas (sr-RS)",
    "lang": "sr-RS",
    "gender": "Male"
  },
  {
    "id": "my-MM-NilarNeural",
    "name": "Nilar (my-MM)",
    "lang": "my-MM",
    "gender": "Female"
  },
  {
    "id": "lv-LV-NilsNeural",
    "name": "Nils (lv-LV)",
    "lang": "lv-LV",
    "gender": "Male"
  },
  {
    "id": "gu-IN-NiranjanNeural",
    "name": "Niranjan (gu-IN)",
    "lang": "gu-IN",
    "gender": "Male"
  },
  {
    "id": "th-TH-NiwatNeural",
    "name": "Niwat (th-TH)",
    "lang": "th-TH",
    "gender": "Male"
  },
  {
    "id": "hu-HU-NoemiNeural",
    "name": "Noemi (hu-HU)",
    "lang": "hu-HU",
    "gender": "Female"
  },
  {
    "id": "fi-FI-NooraNeural",
    "name": "Noora (fi-FI)",
    "lang": "fi-FI",
    "gender": "Female"
  },
  {
    "id": "ar-KW-NouraNeural",
    "name": "Noura (ar-KW)",
    "lang": "ar-KW",
    "gender": "Female"
  },
  {
    "id": "ar-LY-OmarNeural",
    "name": "Omar (ar-LY)",
    "lang": "ar-LY",
    "gender": "Male"
  },
  {
    "id": "lt-LT-OnaNeural",
    "name": "Ona (lt-LT)",
    "lang": "lt-LT",
    "gender": "Female"
  },
  {
    "id": "ga-IE-OrlaNeural",
    "name": "Orla (ga-IE)",
    "lang": "ga-IE",
    "gender": "Female"
  },
  {
    "id": "ms-MY-OsmanNeural",
    "name": "Osman (ms-MY)",
    "lang": "ms-MY",
    "gender": "Male"
  },
  {
    "id": "uk-UA-OstapNeural",
    "name": "Ostap (uk-UA)",
    "lang": "uk-UA",
    "gender": "Male"
  },
  {
    "id": "ta-IN-PallaviNeural",
    "name": "Pallavi (ta-IN)",
    "lang": "ta-IN",
    "gender": "Female"
  },
  {
    "id": "es-US-PalomaNeural",
    "name": "Paloma (es-US)",
    "lang": "es-US",
    "gender": "Female"
  },
  {
    "id": "es-VE-PaolaNeural",
    "name": "Paola (es-VE)",
    "lang": "es-VE",
    "gender": "Female"
  },
  {
    "id": "nb-NO-PernilleNeural",
    "name": "Pernille (nb-NO)",
    "lang": "nb-NO",
    "gender": "Female"
  },
  {
    "id": "sl-SI-PetraNeural",
    "name": "Petra (sl-SI)",
    "lang": "sl-SI",
    "gender": "Female"
  },
  {
    "id": "km-KH-PisethNeural",
    "name": "Piseth (km-KH)",
    "lang": "km-KH",
    "gender": "Male"
  },
  {
    "id": "uk-UA-PolinaNeural",
    "name": "Polina (uk-UA)",
    "lang": "uk-UA",
    "gender": "Female"
  },
  {
    "id": "en-IN-PrabhatNeural",
    "name": "Prabhat (en-IN)",
    "lang": "en-IN",
    "gender": "Male"
  },
  {
    "id": "bn-BD-PradeepNeural",
    "name": "Pradeep (bn-BD)",
    "lang": "bn-BD",
    "gender": "Male"
  },
  {
    "id": "th-TH-PremwadeeNeural",
    "name": "Premwadee (th-TH)",
    "lang": "th-TH",
    "gender": "Female"
  },
  {
    "id": "sw-KE-RafikiNeural",
    "name": "Rafiki (sw-KE)",
    "lang": "sw-KE",
    "gender": "Male"
  },
  {
    "id": "ar-LB-RamiNeural",
    "name": "Rami (ar-LB)",
    "lang": "ar-LB",
    "gender": "Male"
  },
  {
    "id": "es-DO-RamonaNeural",
    "name": "Ramona (es-DO)",
    "lang": "es-DO",
    "gender": "Female"
  },
  {
    "id": "ar-IQ-RanaNeural",
    "name": "Rana (ar-IQ)",
    "lang": "ar-IQ",
    "gender": "Female"
  },
  {
    "id": "pt-PT-RaquelNeural",
    "name": "Raquel (pt-PT)",
    "lang": "pt-PT",
    "gender": "Female"
  },
  {
    "id": "ar-TN-ReemNeural",
    "name": "Reem (ar-TN)",
    "lang": "ar-TN",
    "gender": "Female"
  },
  {
    "id": "sw-TZ-RehemaNeural",
    "name": "Rehema (sw-TZ)",
    "lang": "sw-TZ",
    "gender": "Female"
  },
  {
    "id": "fr-FR-RemyMultilingualNeural",
    "name": "Remy (fr-FR)",
    "lang": "fr-FR",
    "gender": "Male"
  },
  {
    "id": "es-PA-RobertoNeural",
    "name": "Roberto (es-PA)",
    "lang": "es-PA",
    "gender": "Male"
  },
  {
    "id": "es-SV-RodrigoNeural",
    "name": "Rodrigo (es-SV)",
    "lang": "es-SV",
    "gender": "Male"
  },
  {
    "id": "en-US-RogerNeural",
    "name": "Roger (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "gl-ES-RoiNeural",
    "name": "Roi (gl-ES)",
    "lang": "gl-ES",
    "gender": "Male"
  },
  {
    "id": "sl-SI-RokNeural",
    "name": "Rok (sl-SI)",
    "lang": "sl-SI",
    "gender": "Male"
  },
  {
    "id": "en-PH-RosaNeural",
    "name": "Rosa (en-PH)",
    "lang": "en-PH",
    "gender": "Female"
  },
  {
    "id": "en-GB-RyanNeural",
    "name": "Ryan (en-GB)",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "gl-ES-SabelaNeural",
    "name": "Sabela (gl-ES)",
    "lang": "gl-ES",
    "gender": "Female"
  },
  {
    "id": "ne-NP-SagarNeural",
    "name": "Sagar (ne-NP)",
    "lang": "ne-NP",
    "gender": "Male"
  },
  {
    "id": "ar-YE-SalehNeural",
    "name": "Saleh (ar-YE)",
    "lang": "ar-YE",
    "gender": "Male"
  },
  {
    "id": "ar-EG-SalmaNeural",
    "name": "Salma (ar-EG)",
    "lang": "ar-EG",
    "gender": "Female"
  },
  {
    "id": "ur-IN-SalmanNeural",
    "name": "Salman (ur-IN)",
    "lang": "ur-IN",
    "gender": "Male"
  },
  {
    "id": "es-CO-SalomeNeural",
    "name": "Salome (es-CO)",
    "lang": "es-CO",
    "gender": "Female"
  },
  {
    "id": "en-HK-SamNeural",
    "name": "Sam (en-HK)",
    "lang": "en-HK",
    "gender": "Male"
  },
  {
    "id": "si-LK-SameeraNeural",
    "name": "Sameera (si-LK)",
    "lang": "si-LK",
    "gender": "Male"
  },
  {
    "id": "ar-JO-SanaNeural",
    "name": "Sana (ar-JO)",
    "lang": "ar-JO",
    "gender": "Female"
  },
  {
    "id": "kn-IN-SapnaNeural",
    "name": "Sapna (kn-IN)",
    "lang": "kn-IN",
    "gender": "Female"
  },
  {
    "id": "ta-LK-SaranyaNeural",
    "name": "Saranya (ta-LK)",
    "lang": "ta-LK",
    "gender": "Female"
  },
  {
    "id": "uz-UZ-SardorNeural",
    "name": "Sardor (uz-UZ)",
    "lang": "uz-UZ",
    "gender": "Male"
  },
  {
    "id": "es-VE-SebastianNeural",
    "name": "Sebastian (es-VE)",
    "lang": "es-VE",
    "gender": "Male"
  },
  {
    "id": "de-DE-SeraphinaMultilingualNeural",
    "name": "Seraphina (de-DE)",
    "lang": "de-DE",
    "gender": "Female"
  },
  {
    "id": "ar-EG-ShakirNeural",
    "name": "Shakir (ar-EG)",
    "lang": "ar-EG",
    "gender": "Male"
  },
  {
    "id": "te-IN-ShrutiNeural",
    "name": "Shruti (te-IN)",
    "lang": "te-IN",
    "gender": "Female"
  },
  {
    "id": "iu-Cans-CA-SiqiniqNeural",
    "name": "Siqiniq (iu-Cans-CA)",
    "lang": "iu-Cans-CA",
    "gender": "Female"
  },
  {
    "id": "iu-Latn-CA-SiqiniqNeural",
    "name": "Siqiniq (iu-Latn-CA)",
    "lang": "iu-Latn-CA",
    "gender": "Female"
  },
  {
    "id": "jv-ID-SitiNeural",
    "name": "Siti (jv-ID)",
    "lang": "jv-ID",
    "gender": "Female"
  },
  {
    "id": "ml-IN-SobhanaNeural",
    "name": "Sobhana (ml-IN)",
    "lang": "ml-IN",
    "gender": "Female"
  },
  {
    "id": "es-BO-SofiaNeural",
    "name": "Sofia (es-BO)",
    "lang": "es-BO",
    "gender": "Female"
  },
  {
    "id": "sv-SE-SofieNeural",
    "name": "Sofie (sv-SE)",
    "lang": "sv-SE",
    "gender": "Female"
  },
  {
    "id": "en-GB-SoniaNeural",
    "name": "Sonia (en-GB)",
    "lang": "en-GB",
    "gender": "Female"
  },
  {
    "id": "sr-RS-SophieNeural",
    "name": "Sophie (sr-RS)",
    "lang": "sr-RS",
    "gender": "Female"
  },
  {
    "id": "hr-HR-SreckoNeural",
    "name": "Srecko (hr-HR)",
    "lang": "hr-HR",
    "gender": "Male"
  },
  {
    "id": "km-KH-SreymomNeural",
    "name": "Sreymom (km-KH)",
    "lang": "km-KH",
    "gender": "Female"
  },
  {
    "id": "en-US-SteffanNeural",
    "name": "Steffan (en-US)",
    "lang": "en-US",
    "gender": "Male"
  },
  {
    "id": "ko-KR-SunHiNeural",
    "name": "SunHi (ko-KR)",
    "lang": "ko-KR",
    "gender": "Female"
  },
  {
    "id": "ta-MY-SuryaNeural",
    "name": "Surya (ta-MY)",
    "lang": "ta-MY",
    "gender": "Male"
  },
  {
    "id": "ru-RU-SvetlanaNeural",
    "name": "Svetlana (ru-RU)",
    "lang": "ru-RU",
    "gender": "Female"
  },
  {
    "id": "hi-IN-SwaraNeural",
    "name": "Swara (hi-IN)",
    "lang": "hi-IN",
    "gender": "Female"
  },
  {
    "id": "fr-CA-SylvieNeural",
    "name": "Sylvie (fr-CA)",
    "lang": "fr-CA",
    "gender": "Female"
  },
  {
    "id": "ar-JO-TaimNeural",
    "name": "Taim (ar-JO)",
    "lang": "ar-JO",
    "gender": "Male"
  },
  {
    "id": "hu-HU-TamasNeural",
    "name": "Tamas (hu-HU)",
    "lang": "hu-HU",
    "gender": "Male"
  },
  {
    "id": "es-PY-TaniaNeural",
    "name": "Tania (es-PY)",
    "lang": "es-PY",
    "gender": "Female"
  },
  {
    "id": "bn-IN-TanishaaNeural",
    "name": "Tanishaa (bn-IN)",
    "lang": "bn-IN",
    "gender": "Female"
  },
  {
    "id": "iu-Cans-CA-TaqqiqNeural",
    "name": "Taqqiq (iu-Cans-CA)",
    "lang": "iu-Cans-CA",
    "gender": "Male"
  },
  {
    "id": "iu-Latn-CA-TaqqiqNeural",
    "name": "Taqqiq (iu-Latn-CA)",
    "lang": "iu-Latn-CA",
    "gender": "Male"
  },
  {
    "id": "es-GQ-TeresaNeural",
    "name": "Teresa (es-GQ)",
    "lang": "es-GQ",
    "gender": "Female"
  },
  {
    "id": "pt-BR-ThalitaMultilingualNeural",
    "name": "Thalita (pt-BR)",
    "lang": "pt-BR",
    "gender": "Female"
  },
  {
    "id": "zu-ZA-ThandoNeural",
    "name": "Thando (zu-ZA)",
    "lang": "zu-ZA",
    "gender": "Female"
  },
  {
    "id": "zu-ZA-ThembaNeural",
    "name": "Themba (zu-ZA)",
    "lang": "zu-ZA",
    "gender": "Male"
  },
  {
    "id": "fr-CA-ThierryNeural",
    "name": "Thierry (fr-CA)",
    "lang": "fr-CA",
    "gender": "Male"
  },
  {
    "id": "my-MM-ThihaNeural",
    "name": "Thiha (my-MM)",
    "lang": "my-MM",
    "gender": "Male"
  },
  {
    "id": "si-LK-ThiliniNeural",
    "name": "Thilini (si-LK)",
    "lang": "si-LK",
    "gender": "Female"
  },
  {
    "id": "en-GB-ThomasNeural",
    "name": "Thomas (en-GB)",
    "lang": "en-GB",
    "gender": "Male"
  },
  {
    "id": "es-AR-TomasNeural",
    "name": "Tomas (es-AR)",
    "lang": "es-AR",
    "gender": "Male"
  },
  {
    "id": "su-ID-TutiNeural",
    "name": "Tuti (su-ID)",
    "lang": "su-ID",
    "gender": "Female"
  },
  {
    "id": "so-SO-UbaxNeural",
    "name": "Ubax (so-SO)",
    "lang": "so-SO",
    "gender": "Female"
  },
  {
    "id": "ur-PK-UzmaNeural",
    "name": "Uzma (ur-PK)",
    "lang": "ur-PK",
    "gender": "Female"
  },
  {
    "id": "es-UY-ValentinaNeural",
    "name": "Valentina (es-UY)",
    "lang": "es-UY",
    "gender": "Female"
  },
  {
    "id": "ta-IN-ValluvarNeural",
    "name": "Valluvar (ta-IN)",
    "lang": "ta-IN",
    "gender": "Male"
  },
  {
    "id": "ta-SG-VenbaNeural",
    "name": "Venba (ta-SG)",
    "lang": "ta-SG",
    "gender": "Female"
  },
  {
    "id": "bs-BA-VesnaNeural",
    "name": "Vesna (bs-BA)",
    "lang": "bs-BA",
    "gender": "Female"
  },
  {
    "id": "es-PR-VictorNeural",
    "name": "Victor (es-PR)",
    "lang": "es-PR",
    "gender": "Male"
  },
  {
    "id": "sk-SK-ViktoriaNeural",
    "name": "Viktoria (sk-SK)",
    "lang": "sk-SK",
    "gender": "Female"
  },
  {
    "id": "fr-FR-VivienneMultilingualNeural",
    "name": "Vivienne (fr-FR)",
    "lang": "fr-FR",
    "gender": "Female"
  },
  {
    "id": "cs-CZ-VlastaNeural",
    "name": "Vlasta (cs-CZ)",
    "lang": "cs-CZ",
    "gender": "Female"
  },
  {
    "id": "zh-HK-WanLungNeural",
    "name": "WanLung (zh-HK)",
    "lang": "zh-HK",
    "gender": "Male"
  },
  {
    "id": "en-SG-WayneNeural",
    "name": "Wayne (en-SG)",
    "lang": "en-SG",
    "gender": "Male"
  },
  {
    "id": "af-ZA-WillemNeural",
    "name": "Willem (af-ZA)",
    "lang": "af-ZA",
    "gender": "Male"
  },
  {
    "id": "en-AU-WilliamMultilingualNeural",
    "name": "William (en-AU)",
    "lang": "en-AU",
    "gender": "Male"
  },
  {
    "id": "zh-CN-liaoning-XiaobeiNeural",
    "name": "Xiaobei (zh-CN-liaoning)",
    "lang": "zh-CN-liaoning",
    "gender": "Female"
  },
  {
    "id": "zh-CN-shaanxi-XiaoniNeural",
    "name": "Xiaoni (zh-CN-shaanxi)",
    "lang": "zh-CN-shaanxi",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoxiaoNeural",
    "name": "Xiaoxiao (zh-CN)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "zh-CN-XiaoyiNeural",
    "name": "Xiaoyi (zh-CN)",
    "lang": "zh-CN",
    "gender": "Female"
  },
  {
    "id": "es-ES-XimenaNeural",
    "name": "Ximena (es-ES)",
    "lang": "es-ES",
    "gender": "Female"
  },
  {
    "id": "en-HK-YanNeural",
    "name": "Yan (en-HK)",
    "lang": "en-HK",
    "gender": "Female"
  },
  {
    "id": "ms-MY-YasminNeural",
    "name": "Yasmin (ms-MY)",
    "lang": "ms-MY",
    "gender": "Female"
  },
  {
    "id": "mn-MN-YesuiNeural",
    "name": "Yesui (mn-MN)",
    "lang": "mn-MN",
    "gender": "Female"
  },
  {
    "id": "es-NI-YolandaNeural",
    "name": "Yolanda (es-NI)",
    "lang": "es-NI",
    "gender": "Female"
  },
  {
    "id": "zh-TW-YunJheNeural",
    "name": "YunJhe (zh-TW)",
    "lang": "zh-TW",
    "gender": "Male"
  },
  {
    "id": "zh-CN-YunjianNeural",
    "name": "Yunjian (zh-CN)",
    "lang": "zh-CN",
    "gender": "Male"
  },
  {
    "id": "zh-CN-YunxiNeural",
    "name": "Yunxi (zh-CN)",
    "lang": "zh-CN",
    "gender": "Male"
  },
  {
    "id": "zh-CN-YunxiaNeural",
    "name": "Yunxia (zh-CN)",
    "lang": "zh-CN",
    "gender": "Male"
  },
  {
    "id": "zh-CN-YunyangNeural",
    "name": "Yunyang (zh-CN)",
    "lang": "zh-CN",
    "gender": "Male"
  },
  {
    "id": "ar-SA-ZariyahNeural",
    "name": "Zariyah (ar-SA)",
    "lang": "ar-SA",
    "gender": "Female"
  },
  {
    "id": "pl-PL-ZofiaNeural",
    "name": "Zofia (pl-PL)",
    "lang": "pl-PL",
    "gender": "Female"
  },
  {
    "id": "sw-KE-ZuriNeural",
    "name": "Zuri (sw-KE)",
    "lang": "sw-KE",
    "gender": "Female"
  }
];

var DEFAULT_VOICE = 'en-US-JennyNeural';

var configSchema = {
  voice: {
    title: 'Voice',
    description: 'Select neural synthesis voice',
    type: 'string',
    enum: VOICES.map(function(v) { return v.id; }),
    default: DEFAULT_VOICE
  },
  speed: {
    title: 'Speed (0.5 - 2.0)',
    description: 'Speech speed multiplier (default: 1.0)',
    type: 'number',
    default: 1.0
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

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function doSynthesize(text, options) {
  if (!text || !hasSpeakableText(text)) {
    throw new Error('No speakable text');
  }

  var voiceId = (options && options.voice) || DEFAULT_VOICE;
  var speedVal = options && typeof options.speed === 'number' ? options.speed : 1.0;
  speedVal = Math.min(Math.max(speedVal, 0.5), 2.0);

  var payload = {
    text: text.trim(),
    voice: voiceId,
    referrer: 'direct',
    environment: 'production',
    session_id: generateUUID()
  };

  if (speedVal !== 1.0) {
    payload.speed = speedVal.toFixed(1);
  }

  var headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Origin': 'https://freetts.ai',
    'Referer': 'https://freetts.ai/'
  };

  var response = await fetch('https://freetts.ai/api/generate', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    var errText = await response.text().catch(function() { return ''; });
    throw new Error('FreeTTS synthesis failed: HTTP ' + response.status + ' ' + response.statusText + ' ' + errText);
  }

  var arrayBuffer = await response.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('FreeTTS returned empty audio buffer');
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
      if (err && err.message === 'No speakable text') {
        throw err;
      }
      console.warn('[' + PLUGIN_ID + '] Synthesis attempt ' + attempt + ' failed: ' + (err ? err.message : String(err)));
      if (attempt < maxRetries) {
        await sleep(attempt * 1000);
      }
    }
  }

  throw lastError || new Error('FreeTTS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free neural TTS via freetts.ai featuring 320+ Microsoft Edge neural voices across 70+ languages. No API key required. Returns MP3 audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 1000,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 22,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
