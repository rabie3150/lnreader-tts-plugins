// Moe TTS (Anime & Genshin) Plugin for LNReader
// Zero-authentication VITS speech synthesis via Hugging Face Space

var PLUGIN_ID = 'moe-tts';
var PLUGIN_NAME = 'Moe TTS (Anime & Genshin)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "tts_fn_15:Admire Vega",
    "name": "Admire Vega (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Admire Vega"
  },
  {
    "id": "tts_fn_15:Agnes Digital",
    "name": "Agnes Digital (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Agnes Digital"
  },
  {
    "id": "tts_fn_15:Agnes Tachyon",
    "name": "Agnes Tachyon (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Agnes Tachyon"
  },
  {
    "id": "tts_fn_15:Air Groove",
    "name": "Air Groove (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Air Groove"
  },
  {
    "id": "tts_fn_15:Air Shakur",
    "name": "Air Shakur (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Air Shakur"
  },
  {
    "id": "tts_fn_15:Aston Machan",
    "name": "Aston Machan (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Aston Machan"
  },
  {
    "id": "tts_fn_15:Bamboo Memory",
    "name": "Bamboo Memory (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Bamboo Memory"
  },
  {
    "id": "tts_fn_15:Biko Pegasus",
    "name": "Biko Pegasus (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Biko Pegasus"
  },
  {
    "id": "tts_fn_15:Biwa Hayahide",
    "name": "Biwa Hayahide (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Biwa Hayahide"
  },
  {
    "id": "tts_fn_15:Curren Chan",
    "name": "Curren Chan (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Curren Chan"
  },
  {
    "id": "tts_fn_15:Daiichi Ruby",
    "name": "Daiichi Ruby (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Daiichi Ruby"
  },
  {
    "id": "tts_fn_15:Daitaku Helios",
    "name": "Daitaku Helios (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Daitaku Helios"
  },
  {
    "id": "tts_fn_15:Daiwa Scarlet",
    "name": "Daiwa Scarlet (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Daiwa Scarlet"
  },
  {
    "id": "tts_fn_15:Eishin Flash",
    "name": "Eishin Flash (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Eishin Flash"
  },
  {
    "id": "tts_fn_15:El Condor Pasa",
    "name": "El Condor Pasa (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "El Condor Pasa"
  },
  {
    "id": "tts_fn_15:Fine Motion",
    "name": "Fine Motion (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Fine Motion"
  },
  {
    "id": "tts_fn_15:Fuji Kiseki",
    "name": "Fuji Kiseki (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Fuji Kiseki"
  },
  {
    "id": "tts_fn_15:Gold City",
    "name": "Gold City (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Gold City"
  },
  {
    "id": "tts_fn_15:Gold Ship",
    "name": "Gold Ship (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Gold Ship"
  },
  {
    "id": "tts_fn_15:Grass Wonder",
    "name": "Grass Wonder (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Grass Wonder"
  },
  {
    "id": "tts_fn_15:Haru Urara",
    "name": "Haru Urara (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Haru Urara"
  },
  {
    "id": "tts_fn_15:Hayakawa Tazuna",
    "name": "Hayakawa Tazuna (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Hayakawa Tazuna"
  },
  {
    "id": "tts_fn_15:Hishi Akebono",
    "name": "Hishi Akebono (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Hishi Akebono"
  },
  {
    "id": "tts_fn_15:Hishi Amazon",
    "name": "Hishi Amazon (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Hishi Amazon"
  },
  {
    "id": "tts_fn_15:Hoko Tarumae",
    "name": "Hoko Tarumae (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Hoko Tarumae"
  },
  {
    "id": "tts_fn_15:Ikuno Dictus",
    "name": "Ikuno Dictus (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Ikuno Dictus"
  },
  {
    "id": "tts_fn_15:Inari One",
    "name": "Inari One (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Inari One"
  },
  {
    "id": "tts_fn_15:Ines Fujin",
    "name": "Ines Fujin (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Ines Fujin"
  },
  {
    "id": "tts_fn_15:KS Miracle",
    "name": "KS Miracle (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "KS Miracle"
  },
  {
    "id": "tts_fn_15:Kawakami Princess",
    "name": "Kawakami Princess (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Kawakami Princess"
  },
  {
    "id": "tts_fn_15:King Halo",
    "name": "King Halo (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "King Halo"
  },
  {
    "id": "tts_fn_15:Kitasan Black",
    "name": "Kitasan Black (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Kitasan Black"
  },
  {
    "id": "tts_fn_15:Kopano Rickey",
    "name": "Kopano Rickey (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Kopano Rickey"
  },
  {
    "id": "tts_fn_15:Manhattan Cafe",
    "name": "Manhattan Cafe (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Manhattan Cafe"
  },
  {
    "id": "tts_fn_15:Maruzensky",
    "name": "Maruzensky (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Maruzensky"
  },
  {
    "id": "tts_fn_15:Marvelous Sunday",
    "name": "Marvelous Sunday (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Marvelous Sunday"
  },
  {
    "id": "tts_fn_15:Matikane Fukukitaru",
    "name": "Matikane Fukukitaru (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Matikane Fukukitaru"
  },
  {
    "id": "tts_fn_15:Matikane Tannhauser",
    "name": "Matikane Tannhauser (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Matikane Tannhauser"
  },
  {
    "id": "tts_fn_15:Mayano Topgun",
    "name": "Mayano Topgun (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mayano Topgun"
  },
  {
    "id": "tts_fn_15:Meisho Doto",
    "name": "Meisho Doto (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Meisho Doto"
  },
  {
    "id": "tts_fn_15:Mejiro Ardan",
    "name": "Mejiro Ardan (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mejiro Ardan"
  },
  {
    "id": "tts_fn_15:Mejiro Bright",
    "name": "Mejiro Bright (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mejiro Bright"
  },
  {
    "id": "tts_fn_15:Mejiro Dober",
    "name": "Mejiro Dober (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mejiro Dober"
  },
  {
    "id": "tts_fn_15:Mejiro Mcqueen",
    "name": "Mejiro Mcqueen (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mejiro Mcqueen"
  },
  {
    "id": "tts_fn_15:Mejiro Palmer",
    "name": "Mejiro Palmer (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mejiro Palmer"
  },
  {
    "id": "tts_fn_15:Mejiro Ryan",
    "name": "Mejiro Ryan (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mejiro Ryan"
  },
  {
    "id": "tts_fn_15:Mihono Bourbon",
    "name": "Mihono Bourbon (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mihono Bourbon"
  },
  {
    "id": "tts_fn_15:Mr. C.B.",
    "name": "Mr. C.B. (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Mr. C.B."
  },
  {
    "id": "tts_fn_15:Nakayama Festa",
    "name": "Nakayama Festa (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Nakayama Festa"
  },
  {
    "id": "tts_fn_15:Narita Brian",
    "name": "Narita Brian (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Narita Brian"
  },
  {
    "id": "tts_fn_15:Narita Taishin",
    "name": "Narita Taishin (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Narita Taishin"
  },
  {
    "id": "tts_fn_15:Narita Top Road",
    "name": "Narita Top Road (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Narita Top Road"
  },
  {
    "id": "tts_fn_15:Nice Nature",
    "name": "Nice Nature (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Nice Nature"
  },
  {
    "id": "tts_fn_15:Nishino Flower",
    "name": "Nishino Flower (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Nishino Flower"
  },
  {
    "id": "tts_fn_15:Oguri Cap",
    "name": "Oguri Cap (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Oguri Cap"
  },
  {
    "id": "tts_fn_15:President Akikawa",
    "name": "President Akikawa (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "President Akikawa"
  },
  {
    "id": "tts_fn_15:Rice Shower",
    "name": "Rice Shower (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Rice Shower"
  },
  {
    "id": "tts_fn_15:Sakura Bakushin O",
    "name": "Sakura Bakushin O (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Sakura Bakushin O"
  },
  {
    "id": "tts_fn_15:Sakura Chiyono O",
    "name": "Sakura Chiyono O (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Sakura Chiyono O"
  },
  {
    "id": "tts_fn_15:Sakura Laurel",
    "name": "Sakura Laurel (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Sakura Laurel"
  },
  {
    "id": "tts_fn_15:Satono Diamond",
    "name": "Satono Diamond (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Satono Diamond"
  },
  {
    "id": "tts_fn_15:Seeking the Pearl",
    "name": "Seeking the Pearl (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Seeking the Pearl"
  },
  {
    "id": "tts_fn_15:Seiun Sky",
    "name": "Seiun Sky (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Seiun Sky"
  },
  {
    "id": "tts_fn_15:Shinko Windy",
    "name": "Shinko Windy (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Shinko Windy"
  },
  {
    "id": "tts_fn_15:Silence Suzuka",
    "name": "Silence Suzuka (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Silence Suzuka"
  },
  {
    "id": "tts_fn_15:Sirius Symboli",
    "name": "Sirius Symboli (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Sirius Symboli"
  },
  {
    "id": "tts_fn_15:Smart Falcon",
    "name": "Smart Falcon (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Smart Falcon"
  },
  {
    "id": "tts_fn_15:Special Week",
    "name": "Special Week (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Special Week"
  },
  {
    "id": "tts_fn_15:Super Creek",
    "name": "Super Creek (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Super Creek"
  },
  {
    "id": "tts_fn_15:Sweep Tosho",
    "name": "Sweep Tosho (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Sweep Tosho"
  },
  {
    "id": "tts_fn_15:Symboli Kris S",
    "name": "Symboli Kris S (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Symboli Kris S"
  },
  {
    "id": "tts_fn_15:Symboli Rudolf",
    "name": "Symboli Rudolf (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Symboli Rudolf"
  },
  {
    "id": "tts_fn_15:T.M. Opera O",
    "name": "T.M. Opera O (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "T.M. Opera O"
  },
  {
    "id": "tts_fn_15:Taiki Shuttle",
    "name": "Taiki Shuttle (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Taiki Shuttle"
  },
  {
    "id": "tts_fn_15:Tamamo Cross",
    "name": "Tamamo Cross (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Tamamo Cross"
  },
  {
    "id": "tts_fn_15:Tanino Gimlet",
    "name": "Tanino Gimlet (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Tanino Gimlet"
  },
  {
    "id": "tts_fn_15:Tokai Teio",
    "name": "Tokai Teio (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Tokai Teio"
  },
  {
    "id": "tts_fn_15:Tosen Jordan",
    "name": "Tosen Jordan (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Tosen Jordan"
  },
  {
    "id": "tts_fn_15:Tsurumaru Tsuyoshi",
    "name": "Tsurumaru Tsuyoshi (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Tsurumaru Tsuyoshi"
  },
  {
    "id": "tts_fn_15:Twin Turbo",
    "name": "Twin Turbo (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Twin Turbo"
  },
  {
    "id": "tts_fn_15:Vodka",
    "name": "Vodka (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Vodka"
  },
  {
    "id": "tts_fn_15:Winning Ticket",
    "name": "Winning Ticket (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Winning Ticket"
  },
  {
    "id": "tts_fn_15:Wonder Acute",
    "name": "Wonder Acute (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Wonder Acute"
  },
  {
    "id": "tts_fn_15:Yaeno Muteki",
    "name": "Yaeno Muteki (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Yaeno Muteki"
  },
  {
    "id": "tts_fn_15:Yamanin Zephyr",
    "name": "Yamanin Zephyr (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Yamanin Zephyr"
  },
  {
    "id": "tts_fn_15:Yukino Bijin",
    "name": "Yukino Bijin (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Yukino Bijin"
  },
  {
    "id": "tts_fn_15:Zenno Rob Roy",
    "name": "Zenno Rob Roy (Honkai Series)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_15",
    "speaker": "Zenno Rob Roy"
  },
  {
    "id": "tts_fn:ムラサメ",
    "name": "ムラサメ (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "ムラサメ"
  },
  {
    "id": "tts_fn_16:七七香",
    "name": "七七香 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "七七香"
  },
  {
    "id": "tts_fn_16:七七香（夏日）",
    "name": "七七香（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "七七香（夏日）"
  },
  {
    "id": "tts_fn_16:亚里莎",
    "name": "亚里莎 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "亚里莎"
  },
  {
    "id": "tts_fn_16:伊绪",
    "name": "伊绪 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "伊绪"
  },
  {
    "id": "tts_fn_16:伊绪（夏日）",
    "name": "伊绪（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "伊绪（夏日）"
  },
  {
    "id": "tts_fn_16:伊莉亚",
    "name": "伊莉亚 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "伊莉亚"
  },
  {
    "id": "tts_fn_16:伊莉亚（圣诞节）",
    "name": "伊莉亚（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "伊莉亚（圣诞节）"
  },
  {
    "id": "tts_fn_16:优妮",
    "name": "优妮 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "优妮"
  },
  {
    "id": "tts_fn_16:优衣",
    "name": "优衣 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "优衣"
  },
  {
    "id": "tts_fn_16:优衣（公主）",
    "name": "优衣（公主） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "优衣（公主）"
  },
  {
    "id": "tts_fn_16:优衣（新年）",
    "name": "优衣（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "优衣（新年）"
  },
  {
    "id": "tts_fn_16:优衣（礼服）",
    "name": "优衣（礼服） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "优衣（礼服）"
  },
  {
    "id": "tts_fn_16:似似花",
    "name": "似似花 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "似似花"
  },
  {
    "id": "tts_fn_16:似似花（新年）",
    "name": "似似花（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "似似花（新年）"
  },
  {
    "id": "tts_fn_16:佩可莉姆",
    "name": "佩可莉姆 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "佩可莉姆"
  },
  {
    "id": "tts_fn_16:佩可莉姆（公主）",
    "name": "佩可莉姆（公主） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "佩可莉姆（公主）"
  },
  {
    "id": "tts_fn_16:佩可莉姆（夏日）",
    "name": "佩可莉姆（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "佩可莉姆（夏日）"
  },
  {
    "id": "tts_fn_16:佩可莉姆（新年）",
    "name": "佩可莉姆（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "佩可莉姆（新年）"
  },
  {
    "id": "tts_fn_16:依里",
    "name": "依里 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "依里"
  },
  {
    "id": "tts_fn_16:依里（天使）",
    "name": "依里（天使） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "依里（天使）"
  },
  {
    "id": "tts_fn_16:克罗依",
    "name": "克罗依 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "克罗依"
  },
  {
    "id": "tts_fn_16:克罗依（圣学祭）",
    "name": "克罗依（圣学祭） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "克罗依（圣学祭）"
  },
  {
    "id": "tts_fn_16:克莉丝提娜",
    "name": "克莉丝提娜 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "克莉丝提娜"
  },
  {
    "id": "tts_fn_16:克莉丝提娜（圣诞节）",
    "name": "克莉丝提娜（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "克莉丝提娜（圣诞节）"
  },
  {
    "id": "tts_fn_16:凛（偶像大师）",
    "name": "凛（偶像大师） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "凛（偶像大师）"
  },
  {
    "id": "tts_fn_16:凯露",
    "name": "凯露 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "凯露"
  },
  {
    "id": "tts_fn_16:凯露（公主）",
    "name": "凯露（公主） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "凯露（公主）"
  },
  {
    "id": "tts_fn_16:凯露（夏日）",
    "name": "凯露（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "凯露（夏日）"
  },
  {
    "id": "tts_fn_16:凯露（新年）",
    "name": "凯露（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "凯露（新年）"
  },
  {
    "id": "tts_fn_16:初音",
    "name": "初音 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "初音"
  },
  {
    "id": "tts_fn_16:初音（夏日）",
    "name": "初音（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "初音（夏日）"
  },
  {
    "id": "tts_fn_16:千歌",
    "name": "千歌 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "千歌"
  },
  {
    "id": "tts_fn_16:千歌（圣诞节）",
    "name": "千歌（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "千歌（圣诞节）"
  },
  {
    "id": "tts_fn_16:千歌（夏日）",
    "name": "千歌（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "千歌（夏日）"
  },
  {
    "id": "tts_fn_16:千爱瑠",
    "name": "千爱瑠 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "千爱瑠"
  },
  {
    "id": "tts_fn_16:千爱瑠（圣学祭）",
    "name": "千爱瑠（圣学祭） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "千爱瑠（圣学祭）"
  },
  {
    "id": "tts_fn_16:卯月（偶像大师）",
    "name": "卯月（偶像大师） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "卯月（偶像大师）"
  },
  {
    "id": "tts_fn_16:古蕾雅",
    "name": "古蕾雅 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "古蕾雅"
  },
  {
    "id": "tts_fn_16:可可萝",
    "name": "可可萝 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "可可萝"
  },
  {
    "id": "tts_fn_16:可可萝（公主）",
    "name": "可可萝（公主） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "可可萝（公主）"
  },
  {
    "id": "tts_fn_16:可可萝（夏日）",
    "name": "可可萝（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "可可萝（夏日）"
  },
  {
    "id": "tts_fn_16:可可萝（新年）",
    "name": "可可萝（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "可可萝（新年）"
  },
  {
    "id": "tts_fn_16:可可萝（礼服）",
    "name": "可可萝（礼服） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "可可萝（礼服）"
  },
  {
    "id": "tts_fn_1:和泉妃愛",
    "name": "和泉妃愛 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "和泉妃愛"
  },
  {
    "id": "tts_fn_1:和泉里",
    "name": "和泉里 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "和泉里"
  },
  {
    "id": "tts_fn_16:咲恋",
    "name": "咲恋 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "咲恋"
  },
  {
    "id": "tts_fn_16:咲恋（圣诞节）",
    "name": "咲恋（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "咲恋（圣诞节）"
  },
  {
    "id": "tts_fn_16:咲恋（夏日）",
    "name": "咲恋（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "咲恋（夏日）"
  },
  {
    "id": "tts_fn_16:嘉夜",
    "name": "嘉夜 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "嘉夜"
  },
  {
    "id": "tts_fn:因幡めぐる",
    "name": "因幡めぐる (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "因幡めぐる"
  },
  {
    "id": "tts_fn:在原七海",
    "name": "在原七海 (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "在原七海"
  },
  {
    "id": "tts_fn_16:妮侬",
    "name": "妮侬 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "妮侬"
  },
  {
    "id": "tts_fn_16:妮侬（大江户）",
    "name": "妮侬（大江户） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "妮侬（大江户）"
  },
  {
    "id": "tts_fn_16:姬塔",
    "name": "姬塔 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "姬塔"
  },
  {
    "id": "tts_fn_16:安",
    "name": "安 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "安"
  },
  {
    "id": "tts_fn_16:宫子",
    "name": "宫子 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "宫子"
  },
  {
    "id": "tts_fn_16:宫子（万圣节）",
    "name": "宫子（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "宫子（万圣节）"
  },
  {
    "id": "tts_fn_1:常盤華乃",
    "name": "常盤華乃 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "常盤華乃"
  },
  {
    "id": "tts_fn:常陸茉子",
    "name": "常陸茉子 (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "常陸茉子"
  },
  {
    "id": "tts_fn_16:忍",
    "name": "忍 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "忍"
  },
  {
    "id": "tts_fn_16:忍（万圣节）",
    "name": "忍（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "忍（万圣节）"
  },
  {
    "id": "tts_fn_16:怜",
    "name": "怜 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "怜"
  },
  {
    "id": "tts_fn_16:怜（万圣节）",
    "name": "怜（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "怜（万圣节）"
  },
  {
    "id": "tts_fn_16:怜（公主）",
    "name": "怜（公主） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "怜（公主）"
  },
  {
    "id": "tts_fn_16:怜（新年）",
    "name": "怜（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "怜（新年）"
  },
  {
    "id": "tts_fn_16:惠理子",
    "name": "惠理子 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "惠理子"
  },
  {
    "id": "tts_fn_16:惠理子（夏日）",
    "name": "惠理子（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "惠理子（夏日）"
  },
  {
    "id": "tts_fn_16:惠理子（情人节）",
    "name": "惠理子（情人节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "惠理子（情人节）"
  },
  {
    "id": "tts_fn_16:拉姆",
    "name": "拉姆 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "拉姆"
  },
  {
    "id": "tts_fn_1:新川広夢",
    "name": "新川広夢 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "新川広夢"
  },
  {
    "id": "tts_fn_16:日和莉",
    "name": "日和莉 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "日和莉"
  },
  {
    "id": "tts_fn_16:日和莉（公主）",
    "name": "日和莉（公主） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "日和莉（公主）"
  },
  {
    "id": "tts_fn_16:日和莉（新年）",
    "name": "日和莉（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "日和莉（新年）"
  },
  {
    "id": "tts_fn_16:智",
    "name": "智 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "智"
  },
  {
    "id": "tts_fn_16:智（魔法少女）",
    "name": "智（魔法少女） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "智（魔法少女）"
  },
  {
    "id": "tts_fn_16:望",
    "name": "望 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "望"
  },
  {
    "id": "tts_fn_16:望（圣诞节）",
    "name": "望（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "望（圣诞节）"
  },
  {
    "id": "tts_fn_16:望（夏日）",
    "name": "望（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "望（夏日）"
  },
  {
    "id": "tts_fn:朝武芳乃",
    "name": "朝武芳乃 (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "朝武芳乃"
  },
  {
    "id": "tts_fn_16:未央（偶像大师）",
    "name": "未央（偶像大师） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "未央（偶像大师）"
  },
  {
    "id": "tts_fn_16:未奏希",
    "name": "未奏希 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "未奏希"
  },
  {
    "id": "tts_fn_16:未奏希、美美、镜华",
    "name": "未奏希、美美、镜华 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "未奏希、美美、镜华"
  },
  {
    "id": "tts_fn_16:未奏希（万圣节）",
    "name": "未奏希（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "未奏希（万圣节）"
  },
  {
    "id": "tts_fn_16:杏奈",
    "name": "杏奈 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "杏奈"
  },
  {
    "id": "tts_fn_16:杏奈（夏日）",
    "name": "杏奈（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "杏奈（夏日）"
  },
  {
    "id": "tts_fn_16:栞",
    "name": "栞 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "栞"
  },
  {
    "id": "tts_fn_16:栞（魔法少女）",
    "name": "栞（魔法少女） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "栞（魔法少女）"
  },
  {
    "id": "tts_fn_16:步美",
    "name": "步美 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "步美"
  },
  {
    "id": "tts_fn_16:步美（仙境）",
    "name": "步美（仙境） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "步美（仙境）"
  },
  {
    "id": "tts_fn_16:流夏",
    "name": "流夏 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "流夏"
  },
  {
    "id": "tts_fn_16:流夏（夏日）",
    "name": "流夏（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "流夏（夏日）"
  },
  {
    "id": "tts_fn_16:深月",
    "name": "深月 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "深月"
  },
  {
    "id": "tts_fn_16:爱蜜莉雅",
    "name": "爱蜜莉雅 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "爱蜜莉雅"
  },
  {
    "id": "tts_fn_16:环奈",
    "name": "环奈 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "环奈"
  },
  {
    "id": "tts_fn_16:环奈（振袖）",
    "name": "环奈（振袖） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "环奈（振袖）"
  },
  {
    "id": "tts_fn_16:珠希",
    "name": "珠希 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "珠希"
  },
  {
    "id": "tts_fn_16:珠希（夏日）",
    "name": "珠希（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "珠希（夏日）"
  },
  {
    "id": "tts_fn_16:璃乃",
    "name": "璃乃 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "璃乃"
  },
  {
    "id": "tts_fn_16:璃乃（仙境）",
    "name": "璃乃（仙境） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "璃乃（仙境）"
  },
  {
    "id": "tts_fn_16:由加莉",
    "name": "由加莉 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "由加莉"
  },
  {
    "id": "tts_fn_16:由加莉（圣诞节）",
    "name": "由加莉（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "由加莉（圣诞节）"
  },
  {
    "id": "tts_fn_16:真步",
    "name": "真步 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真步"
  },
  {
    "id": "tts_fn_16:真步（夏日）",
    "name": "真步（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真步（夏日）"
  },
  {
    "id": "tts_fn_16:真步（灰姑娘）",
    "name": "真步（灰姑娘） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真步（灰姑娘）"
  },
  {
    "id": "tts_fn_16:真琴",
    "name": "真琴 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真琴"
  },
  {
    "id": "tts_fn_16:真琴（夏日）",
    "name": "真琴（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真琴（夏日）"
  },
  {
    "id": "tts_fn_16:真琴（灰姑娘）",
    "name": "真琴（灰姑娘） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真琴（灰姑娘）"
  },
  {
    "id": "tts_fn_16:真阳",
    "name": "真阳 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真阳"
  },
  {
    "id": "tts_fn_16:真阳（游骑兵）",
    "name": "真阳（游骑兵） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "真阳（游骑兵）"
  },
  {
    "id": "tts_fn_16:矛依未",
    "name": "矛依未 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "矛依未"
  },
  {
    "id": "tts_fn_16:矛依未（新年）",
    "name": "矛依未（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "矛依未（新年）"
  },
  {
    "id": "tts_fn_16:碧",
    "name": "碧 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "碧"
  },
  {
    "id": "tts_fn_16:碧（工作服）",
    "name": "碧（工作服） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "碧（工作服）"
  },
  {
    "id": "tts_fn_16:碧（插班生）",
    "name": "碧（插班生） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "碧（插班生）"
  },
  {
    "id": "tts_fn_16:祈梨",
    "name": "祈梨 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "祈梨"
  },
  {
    "id": "tts_fn_16:祈梨（时间旅行）",
    "name": "祈梨（时间旅行） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "祈梨（时间旅行）"
  },
  {
    "id": "tts_fn_16:秋乃",
    "name": "秋乃 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "秋乃"
  },
  {
    "id": "tts_fn_16:秋乃（圣诞节）",
    "name": "秋乃（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "秋乃（圣诞节）"
  },
  {
    "id": "tts_fn_16:空花",
    "name": "空花 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "空花"
  },
  {
    "id": "tts_fn_16:空花（大江户）",
    "name": "空花（大江户） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "空花（大江户）"
  },
  {
    "id": "tts_fn_1:竜閑天梨",
    "name": "竜閑天梨 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "竜閑天梨"
  },
  {
    "id": "tts_fn:綾地寧々",
    "name": "綾地寧々 (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "綾地寧々"
  },
  {
    "id": "tts_fn_16:纯",
    "name": "纯 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "纯"
  },
  {
    "id": "tts_fn_16:纯（夏日）",
    "name": "纯（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "纯（夏日）"
  },
  {
    "id": "tts_fn_16:纺希",
    "name": "纺希 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "纺希"
  },
  {
    "id": "tts_fn_16:纺希（万圣节）",
    "name": "纺希（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "纺希（万圣节）"
  },
  {
    "id": "tts_fn_16:绫音",
    "name": "绫音 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "绫音"
  },
  {
    "id": "tts_fn_16:绫音（圣诞节）",
    "name": "绫音（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "绫音（圣诞节）"
  },
  {
    "id": "tts_fn_16:美冬",
    "name": "美冬 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美冬"
  },
  {
    "id": "tts_fn_16:美冬（夏日）",
    "name": "美冬（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美冬（夏日）"
  },
  {
    "id": "tts_fn_16:美冬（工作服）",
    "name": "美冬（工作服） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美冬（工作服）"
  },
  {
    "id": "tts_fn_16:美咲",
    "name": "美咲 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美咲"
  },
  {
    "id": "tts_fn_16:美咲（万圣节）",
    "name": "美咲（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美咲（万圣节）"
  },
  {
    "id": "tts_fn_16:美美",
    "name": "美美 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美美"
  },
  {
    "id": "tts_fn_16:美美（万圣节）",
    "name": "美美（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美美（万圣节）"
  },
  {
    "id": "tts_fn_16:美里",
    "name": "美里 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美里"
  },
  {
    "id": "tts_fn_16:美里（夏日）",
    "name": "美里（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "美里（夏日）"
  },
  {
    "id": "tts_fn_1:聖莉々子",
    "name": "聖莉々子 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "聖莉々子"
  },
  {
    "id": "tts_fn_16:胡桃",
    "name": "胡桃 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "胡桃"
  },
  {
    "id": "tts_fn_16:胡桃（圣诞节）",
    "name": "胡桃（圣诞节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "胡桃（圣诞节）"
  },
  {
    "id": "tts_fn_16:茉莉",
    "name": "茉莉 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "茉莉"
  },
  {
    "id": "tts_fn_16:茉莉（万圣节）",
    "name": "茉莉（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "茉莉（万圣节）"
  },
  {
    "id": "tts_fn_16:茜里",
    "name": "茜里 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "茜里"
  },
  {
    "id": "tts_fn_16:茜里（天使）",
    "name": "茜里（天使） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "茜里（天使）"
  },
  {
    "id": "tts_fn_16:莉玛",
    "name": "莉玛 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "莉玛"
  },
  {
    "id": "tts_fn_16:莉玛（灰姑娘）",
    "name": "莉玛（灰姑娘） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "莉玛（灰姑娘）"
  },
  {
    "id": "tts_fn_16:莫妮卡",
    "name": "莫妮卡 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "莫妮卡"
  },
  {
    "id": "tts_fn_16:莫妮卡（魔法少女）",
    "name": "莫妮卡（魔法少女） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "莫妮卡（魔法少女）"
  },
  {
    "id": "tts_fn_16:菈比莉斯塔",
    "name": "菈比莉斯塔 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "菈比莉斯塔"
  },
  {
    "id": "tts_fn_16:菈比莉斯塔（Overload）",
    "name": "菈比莉斯塔（Overload） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "菈比莉斯塔（Overload）"
  },
  {
    "id": "tts_fn_1:錦あすみ",
    "name": "錦あすみ (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "錦あすみ"
  },
  {
    "id": "tts_fn_1:鎌倉詩桜",
    "name": "鎌倉詩桜 (Japanese Anime Cast)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn_1",
    "speaker": "鎌倉詩桜"
  },
  {
    "id": "tts_fn_16:铃",
    "name": "铃 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃"
  },
  {
    "id": "tts_fn_16:铃奈",
    "name": "铃奈 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃奈"
  },
  {
    "id": "tts_fn_16:铃奈（夏日）",
    "name": "铃奈（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃奈（夏日）"
  },
  {
    "id": "tts_fn_16:铃莓",
    "name": "铃莓 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃莓"
  },
  {
    "id": "tts_fn_16:铃莓（夏日）",
    "name": "铃莓（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃莓（夏日）"
  },
  {
    "id": "tts_fn_16:铃莓（新年）",
    "name": "铃莓（新年） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃莓（新年）"
  },
  {
    "id": "tts_fn_16:铃（游骑兵）",
    "name": "铃（游骑兵） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "铃（游骑兵）"
  },
  {
    "id": "tts_fn_16:镜华",
    "name": "镜华 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "镜华"
  },
  {
    "id": "tts_fn_16:镜华（万圣节）",
    "name": "镜华（万圣节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "镜华（万圣节）"
  },
  {
    "id": "tts_fn_16:雪",
    "name": "雪 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "雪"
  },
  {
    "id": "tts_fn_16:雪菲",
    "name": "雪菲 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "雪菲"
  },
  {
    "id": "tts_fn_16:雷姆",
    "name": "雷姆 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "雷姆"
  },
  {
    "id": "tts_fn_16:露",
    "name": "露 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "露"
  },
  {
    "id": "tts_fn_16:露娜",
    "name": "露娜 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "露娜"
  },
  {
    "id": "tts_fn_16:静流",
    "name": "静流 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "静流"
  },
  {
    "id": "tts_fn_16:静流（夏日）",
    "name": "静流（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "静流（夏日）"
  },
  {
    "id": "tts_fn_16:静流（情人节）",
    "name": "静流（情人节） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "静流（情人节）"
  },
  {
    "id": "tts_fn:鞍馬小春",
    "name": "鞍馬小春 (Classic Anime)",
    "lang": "ja-JP",
    "gender": "Female",
    "api_name": "tts_fn",
    "speaker": "鞍馬小春"
  },
  {
    "id": "tts_fn_16:香澄",
    "name": "香澄 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "香澄"
  },
  {
    "id": "tts_fn_16:香澄（夏日）",
    "name": "香澄（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "香澄（夏日）"
  },
  {
    "id": "tts_fn_16:香澄（魔法少女）",
    "name": "香澄（魔法少女） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "香澄（魔法少女）"
  },
  {
    "id": "tts_fn_16:香织",
    "name": "香织 (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "香织"
  },
  {
    "id": "tts_fn_16:香织（夏日）",
    "name": "香织（夏日） (Genshin Impact)",
    "lang": "zh-CN",
    "gender": "Female",
    "api_name": "tts_fn_16",
    "speaker": "香织（夏日）"
  }
];

// Lookup map for fast voice metadata access
var VOICE_MAP = {};
for (var i = 0; i < VOICES.length; i++) {
  VOICE_MAP[VOICES[i].id] = VOICES[i];
}

var DEFAULT_VOICE = 'tts_fn_15:Admire Vega';

var configSchema = {
  voice: {
    title: 'Character Voice',
    description: 'Select anime / gaming character voice (260+ models)',
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

async function doSynthesize(text, options) {
  if (!text || !hasSpeakableText(text)) {
    throw new Error('No speakable text');
  }

  var voiceId = (options && options.voice) || DEFAULT_VOICE;
  var voiceMeta = VOICE_MAP[voiceId] || VOICES[0];
  
  var apiName = voiceMeta.api_name || 'tts_fn';
  var speaker = voiceMeta.speaker || voiceMeta.name;
  
  var speedVal = options && typeof options.speed === 'number' ? options.speed : 1.0;
  speedVal = Math.min(Math.max(speedVal, 0.5), 2.0);

  var callPayload = {
    data: [
      text.trim(),
      speaker,
      speedVal,
      false
    ]
  };

  var headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Origin': 'https://skytnt-moe-tts.hf.space'
  };

  // 1. Submit prediction job via Gradio 4 call protocol
  var callResp = await fetch('https://skytnt-moe-tts.hf.space/call/' + apiName, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(callPayload)
  });

  if (!callResp.ok) {
    var errText = await callResp.text().catch(function() { return ''; });
    throw new Error('Moe TTS call request failed: HTTP ' + callResp.status + ' ' + errText);
  }

  var callJson = await callResp.json();
  var eventId = callJson && callJson.event_id;
  if (!eventId) {
    throw new Error('Moe TTS did not return an event_id');
  }

  // 2. Fetch completed prediction result via SSE endpoint
  var sseUrl = 'https://skytnt-moe-tts.hf.space/call/' + apiName + '/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('Moe TTS SSE result fetch failed: HTTP ' + sseResp.status);
  }

  var sseText = await sseResp.text();
  
  // Parse data JSON line from SSE
  var audioUrl = null;
  var lines = sseText.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf('data:') === 0) {
      try {
        var parsed = JSON.parse(line.substring(5).trim());
        if (Array.isArray(parsed) && parsed.length >= 2 && parsed[1]) {
          if (parsed[1].url) {
            audioUrl = parsed[1].url;
          } else if (parsed[1].path) {
            audioUrl = 'https://skytnt-moe-tts.hf.space/file=' + parsed[1].path;
          }
          break;
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not find generated audio URL in Moe TTS SSE output: ' + sseText.slice(0, 300));
  }

  // Fix Gradio 4 relative path typo where /call/ results in /cal/file=
  if (audioUrl.indexOf('/cal/file=') !== -1) {
    audioUrl = audioUrl.replace('/cal/file=', '/file=');
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Failed to download audio file from Moe TTS: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Moe TTS returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'wav',
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

  throw lastError || new Error('Moe TTS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free anime & gaming character TTS via Moe-TTS Hugging Face space. Features 260+ voices (Genshin Impact, Honkai, Anime). Returns WAV audio.',
  author: 'LNReader',
  icon: 'volume-high',
  maxCharsPerRequest: 300,
  supportsSpeedControl: true,
  estimatedCharsPerSecond: 15,
  configSchema: configSchema,
  getVoices: async function() {
    return VOICES;
  },
  synthesize: async function(text, options) {
    return await synthesizeWithRetry(text, options, 3);
  }
};
