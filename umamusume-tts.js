// Umamusume VITS Plugin for LNReader
// Zero-authentication VITS speech synthesis via Hugging Face Space (Plachta/VITS-Umamusume-voice-synthesizer)
// Features 147 anime & game character voices. Supports Japanese, English, Chinese.

var PLUGIN_ID = 'umamusume-tts';
var PLUGIN_NAME = 'Umamusume VITS (Anime & Game)';
var PLUGIN_VERSION = '1.0.0';

var VOICES = [
  {
    "id": "特别周 Special Week (Umamusume Pretty Derby)",
    "name": "特别周 Special Week (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "特别周 Special Week (Umamusume Pretty Derby)"
  },
  {
    "id": "无声铃鹿 Silence Suzuka (Umamusume Pretty Derby)",
    "name": "无声铃鹿 Silence Suzuka (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "无声铃鹿 Silence Suzuka (Umamusume Pretty Derby)"
  },
  {
    "id": "东海帝王 Tokai Teio (Umamusume Pretty Derby)",
    "name": "东海帝王 Tokai Teio (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "东海帝王 Tokai Teio (Umamusume Pretty Derby)"
  },
  {
    "id": "丸善斯基 Maruzensky (Umamusume Pretty Derby)",
    "name": "丸善斯基 Maruzensky (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "丸善斯基 Maruzensky (Umamusume Pretty Derby)"
  },
  {
    "id": "富士奇迹 Fuji Kiseki (Umamusume Pretty Derby)",
    "name": "富士奇迹 Fuji Kiseki (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "富士奇迹 Fuji Kiseki (Umamusume Pretty Derby)"
  },
  {
    "id": "小栗帽 Oguri Cap (Umamusume Pretty Derby)",
    "name": "小栗帽 Oguri Cap (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "小栗帽 Oguri Cap (Umamusume Pretty Derby)"
  },
  {
    "id": "黄金船 Gold Ship (Umamusume Pretty Derby)",
    "name": "黄金船 Gold Ship (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "黄金船 Gold Ship (Umamusume Pretty Derby)"
  },
  {
    "id": "伏特加 Vodka (Umamusume Pretty Derby)",
    "name": "伏特加 Vodka (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "伏特加 Vodka (Umamusume Pretty Derby)"
  },
  {
    "id": "大和赤骥 Daiwa Scarlet (Umamusume Pretty Derby)",
    "name": "大和赤骥 Daiwa Scarlet (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "大和赤骥 Daiwa Scarlet (Umamusume Pretty Derby)"
  },
  {
    "id": "大树快车 Taiki Shuttle (Umamusume Pretty Derby)",
    "name": "大树快车 Taiki Shuttle (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "大树快车 Taiki Shuttle (Umamusume Pretty Derby)"
  },
  {
    "id": "草上飞 Grass Wonder (Umamusume Pretty Derby)",
    "name": "草上飞 Grass Wonder (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "草上飞 Grass Wonder (Umamusume Pretty Derby)"
  },
  {
    "id": "菱亚马逊 Hishi Amazon (Umamusume Pretty Derby)",
    "name": "菱亚马逊 Hishi Amazon (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "菱亚马逊 Hishi Amazon (Umamusume Pretty Derby)"
  },
  {
    "id": "目白麦昆 Mejiro Mcqueen (Umamusume Pretty Derby)",
    "name": "目白麦昆 Mejiro Mcqueen (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "目白麦昆 Mejiro Mcqueen (Umamusume Pretty Derby)"
  },
  {
    "id": "神鹰 El Condor Pasa (Umamusume Pretty Derby)",
    "name": "神鹰 El Condor Pasa (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "神鹰 El Condor Pasa (Umamusume Pretty Derby)"
  },
  {
    "id": "好歌剧 T.M. Opera O (Umamusume Pretty Derby)",
    "name": "好歌剧 T.M. Opera O (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "好歌剧 T.M. Opera O (Umamusume Pretty Derby)"
  },
  {
    "id": "成田白仁 Narita Brian (Umamusume Pretty Derby)",
    "name": "成田白仁 Narita Brian (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "成田白仁 Narita Brian (Umamusume Pretty Derby)"
  },
  {
    "id": "鲁道夫象征 Symboli Rudolf (Umamusume Pretty Derby)",
    "name": "鲁道夫象征 Symboli Rudolf (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "鲁道夫象征 Symboli Rudolf (Umamusume Pretty Derby)"
  },
  {
    "id": "气槽 Air Groove (Umamusume Pretty Derby)",
    "name": "气槽 Air Groove (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "气槽 Air Groove (Umamusume Pretty Derby)"
  },
  {
    "id": "爱丽数码 Agnes Digital (Umamusume Pretty Derby)",
    "name": "爱丽数码 Agnes Digital (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "爱丽数码 Agnes Digital (Umamusume Pretty Derby)"
  },
  {
    "id": "青云天空 Seiun Sky (Umamusume Pretty Derby)",
    "name": "青云天空 Seiun Sky (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "青云天空 Seiun Sky (Umamusume Pretty Derby)"
  },
  {
    "id": "玉藻十字 Tamamo Cross (Umamusume Pretty Derby)",
    "name": "玉藻十字 Tamamo Cross (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "玉藻十字 Tamamo Cross (Umamusume Pretty Derby)"
  },
  {
    "id": "美妙姿势 Fine Motion (Umamusume Pretty Derby)",
    "name": "美妙姿势 Fine Motion (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "美妙姿势 Fine Motion (Umamusume Pretty Derby)"
  },
  {
    "id": "琵琶晨光 Biwa Hayahide (Umamusume Pretty Derby)",
    "name": "琵琶晨光 Biwa Hayahide (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "琵琶晨光 Biwa Hayahide (Umamusume Pretty Derby)"
  },
  {
    "id": "重炮 Mayano Topgun (Umamusume Pretty Derby)",
    "name": "重炮 Mayano Topgun (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "重炮 Mayano Topgun (Umamusume Pretty Derby)"
  },
  {
    "id": "曼城茶座 Manhattan Cafe (Umamusume Pretty Derby)",
    "name": "曼城茶座 Manhattan Cafe (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "曼城茶座 Manhattan Cafe (Umamusume Pretty Derby)"
  },
  {
    "id": "美普波旁 Mihono Bourbon (Umamusume Pretty Derby)",
    "name": "美普波旁 Mihono Bourbon (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "美普波旁 Mihono Bourbon (Umamusume Pretty Derby)"
  },
  {
    "id": "目白雷恩 Mejiro Ryan (Umamusume Pretty Derby)",
    "name": "目白雷恩 Mejiro Ryan (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "目白雷恩 Mejiro Ryan (Umamusume Pretty Derby)"
  },
  {
    "id": "雪之美人 Yukino Bijin (Umamusume Pretty Derby)",
    "name": "雪之美人 Yukino Bijin (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "雪之美人 Yukino Bijin (Umamusume Pretty Derby)"
  },
  {
    "id": "米浴 Rice Shower (Umamusume Pretty Derby)",
    "name": "米浴 Rice Shower (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "米浴 Rice Shower (Umamusume Pretty Derby)"
  },
  {
    "id": "艾尼斯风神 Ines Fujin (Umamusume Pretty Derby)",
    "name": "艾尼斯风神 Ines Fujin (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "艾尼斯风神 Ines Fujin (Umamusume Pretty Derby)"
  },
  {
    "id": "爱丽速子 Agnes Tachyon (Umamusume Pretty Derby)",
    "name": "爱丽速子 Agnes Tachyon (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "爱丽速子 Agnes Tachyon (Umamusume Pretty Derby)"
  },
  {
    "id": "爱慕织姬 Admire Vega (Umamusume Pretty Derby)",
    "name": "爱慕织姬 Admire Vega (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "爱慕织姬 Admire Vega (Umamusume Pretty Derby)"
  },
  {
    "id": "稻荷一 Inari One (Umamusume Pretty Derby)",
    "name": "稻荷一 Inari One (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "稻荷一 Inari One (Umamusume Pretty Derby)"
  },
  {
    "id": "胜利奖券 Winning Ticket (Umamusume Pretty Derby)",
    "name": "胜利奖券 Winning Ticket (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "胜利奖券 Winning Ticket (Umamusume Pretty Derby)"
  },
  {
    "id": "空中神宫 Air Shakur (Umamusume Pretty Derby)",
    "name": "空中神宫 Air Shakur (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "空中神宫 Air Shakur (Umamusume Pretty Derby)"
  },
  {
    "id": "荣进闪耀 Eishin Flash (Umamusume Pretty Derby)",
    "name": "荣进闪耀 Eishin Flash (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "荣进闪耀 Eishin Flash (Umamusume Pretty Derby)"
  },
  {
    "id": "真机伶 Curren Chan (Umamusume Pretty Derby)",
    "name": "真机伶 Curren Chan (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "真机伶 Curren Chan (Umamusume Pretty Derby)"
  },
  {
    "id": "川上公主 Kawakami Princess (Umamusume Pretty Derby)",
    "name": "川上公主 Kawakami Princess (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "川上公主 Kawakami Princess (Umamusume Pretty Derby)"
  },
  {
    "id": "黄金城市 Gold City (Umamusume Pretty Derby)",
    "name": "黄金城市 Gold City (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "黄金城市 Gold City (Umamusume Pretty Derby)"
  },
  {
    "id": "樱花进王 Sakura Bakushin O (Umamusume Pretty Derby)",
    "name": "樱花进王 Sakura Bakushin O (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "樱花进王 Sakura Bakushin O (Umamusume Pretty Derby)"
  },
  {
    "id": "采珠 Seeking the Pearl (Umamusume Pretty Derby)",
    "name": "采珠 Seeking the Pearl (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "采珠 Seeking the Pearl (Umamusume Pretty Derby)"
  },
  {
    "id": "新光风 Shinko Windy (Umamusume Pretty Derby)",
    "name": "新光风 Shinko Windy (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "新光风 Shinko Windy (Umamusume Pretty Derby)"
  },
  {
    "id": "东商变革 Sweep Tosho (Umamusume Pretty Derby)",
    "name": "东商变革 Sweep Tosho (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "东商变革 Sweep Tosho (Umamusume Pretty Derby)"
  },
  {
    "id": "超级小溪 Super Creek (Umamusume Pretty Derby)",
    "name": "超级小溪 Super Creek (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "超级小溪 Super Creek (Umamusume Pretty Derby)"
  },
  {
    "id": "醒目飞鹰 Smart Falcon (Umamusume Pretty Derby)",
    "name": "醒目飞鹰 Smart Falcon (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "醒目飞鹰 Smart Falcon (Umamusume Pretty Derby)"
  },
  {
    "id": "荒漠英雄 Zenno Rob Roy (Umamusume Pretty Derby)",
    "name": "荒漠英雄 Zenno Rob Roy (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "荒漠英雄 Zenno Rob Roy (Umamusume Pretty Derby)"
  },
  {
    "id": "东瀛佐敦 Tosen Jordan (Umamusume Pretty Derby)",
    "name": "东瀛佐敦 Tosen Jordan (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "东瀛佐敦 Tosen Jordan (Umamusume Pretty Derby)"
  },
  {
    "id": "中山庆典 Nakayama Festa (Umamusume Pretty Derby)",
    "name": "中山庆典 Nakayama Festa (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "中山庆典 Nakayama Festa (Umamusume Pretty Derby)"
  },
  {
    "id": "成田大进 Narita Taishin (Umamusume Pretty Derby)",
    "name": "成田大进 Narita Taishin (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "成田大进 Narita Taishin (Umamusume Pretty Derby)"
  },
  {
    "id": "西野花 Nishino Flower (Umamusume Pretty Derby)",
    "name": "西野花 Nishino Flower (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "西野花 Nishino Flower (Umamusume Pretty Derby)"
  },
  {
    "id": "春乌拉拉 Haru Urara (Umamusume Pretty Derby)",
    "name": "春乌拉拉 Haru Urara (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "春乌拉拉 Haru Urara (Umamusume Pretty Derby)"
  },
  {
    "id": "青竹回忆 Bamboo Memory (Umamusume Pretty Derby)",
    "name": "青竹回忆 Bamboo Memory (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "青竹回忆 Bamboo Memory (Umamusume Pretty Derby)"
  },
  {
    "id": "待兼福来 Matikane Fukukitaru (Umamusume Pretty Derby)",
    "name": "待兼福来 Matikane Fukukitaru (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "待兼福来 Matikane Fukukitaru (Umamusume Pretty Derby)"
  },
  {
    "id": "名将怒涛 Meisho Doto (Umamusume Pretty Derby)",
    "name": "名将怒涛 Meisho Doto (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "名将怒涛 Meisho Doto (Umamusume Pretty Derby)"
  },
  {
    "id": "目白多伯 Mejiro Dober (Umamusume Pretty Derby)",
    "name": "目白多伯 Mejiro Dober (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "目白多伯 Mejiro Dober (Umamusume Pretty Derby)"
  },
  {
    "id": "优秀素质 Nice Nature (Umamusume Pretty Derby)",
    "name": "优秀素质 Nice Nature (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "优秀素质 Nice Nature (Umamusume Pretty Derby)"
  },
  {
    "id": "帝王光环 King Halo (Umamusume Pretty Derby)",
    "name": "帝王光环 King Halo (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "帝王光环 King Halo (Umamusume Pretty Derby)"
  },
  {
    "id": "待兼诗歌剧 Matikane Tannhauser (Umamusume Pretty Derby)",
    "name": "待兼诗歌剧 Matikane Tannhauser (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "待兼诗歌剧 Matikane Tannhauser (Umamusume Pretty Derby)"
  },
  {
    "id": "生野狄杜斯 Ikuno Dictus (Umamusume Pretty Derby)",
    "name": "生野狄杜斯 Ikuno Dictus (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "生野狄杜斯 Ikuno Dictus (Umamusume Pretty Derby)"
  },
  {
    "id": "目白善信 Mejiro Palmer (Umamusume Pretty Derby)",
    "name": "目白善信 Mejiro Palmer (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "目白善信 Mejiro Palmer (Umamusume Pretty Derby)"
  },
  {
    "id": "大拓太阳神 Daitaku Helios (Umamusume Pretty Derby)",
    "name": "大拓太阳神 Daitaku Helios (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "大拓太阳神 Daitaku Helios (Umamusume Pretty Derby)"
  },
  {
    "id": "双涡轮 Twin Turbo (Umamusume Pretty Derby)",
    "name": "双涡轮 Twin Turbo (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "双涡轮 Twin Turbo (Umamusume Pretty Derby)"
  },
  {
    "id": "里见光钻 Satono Diamond (Umamusume Pretty Derby)",
    "name": "里见光钻 Satono Diamond (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "里见光钻 Satono Diamond (Umamusume Pretty Derby)"
  },
  {
    "id": "北部玄驹 Kitasan Black (Umamusume Pretty Derby)",
    "name": "北部玄驹 Kitasan Black (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "北部玄驹 Kitasan Black (Umamusume Pretty Derby)"
  },
  {
    "id": "樱花千代王 Sakura Chiyono O (Umamusume Pretty Derby)",
    "name": "樱花千代王 Sakura Chiyono O (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "樱花千代王 Sakura Chiyono O (Umamusume Pretty Derby)"
  },
  {
    "id": "天狼星象征 Sirius Symboli (Umamusume Pretty Derby)",
    "name": "天狼星象征 Sirius Symboli (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "天狼星象征 Sirius Symboli (Umamusume Pretty Derby)"
  },
  {
    "id": "目白阿尔丹 Mejiro Ardan (Umamusume Pretty Derby)",
    "name": "目白阿尔丹 Mejiro Ardan (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "目白阿尔丹 Mejiro Ardan (Umamusume Pretty Derby)"
  },
  {
    "id": "八重无敌 Yaeno Muteki (Umamusume Pretty Derby)",
    "name": "八重无敌 Yaeno Muteki (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "八重无敌 Yaeno Muteki (Umamusume Pretty Derby)"
  },
  {
    "id": "鹤丸刚志 Tsurumaru Tsuyoshi (Umamusume Pretty Derby)",
    "name": "鹤丸刚志 Tsurumaru Tsuyoshi (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "鹤丸刚志 Tsurumaru Tsuyoshi (Umamusume Pretty Derby)"
  },
  {
    "id": "目白光明 Mejiro Bright (Umamusume Pretty Derby)",
    "name": "目白光明 Mejiro Bright (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "目白光明 Mejiro Bright (Umamusume Pretty Derby)"
  },
  {
    "id": "樱花桂冠 Sakura Laurel (Umamusume Pretty Derby)",
    "name": "樱花桂冠 Sakura Laurel (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "樱花桂冠 Sakura Laurel (Umamusume Pretty Derby)"
  },
  {
    "id": "成田路 Narita Top Road (Umamusume Pretty Derby)",
    "name": "成田路 Narita Top Road (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "成田路 Narita Top Road (Umamusume Pretty Derby)"
  },
  {
    "id": "也文摄辉 Yamanin Zephyr (Umamusume Pretty Derby)",
    "name": "也文摄辉 Yamanin Zephyr (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "也文摄辉 Yamanin Zephyr (Umamusume Pretty Derby)"
  },
  {
    "id": "真弓快车 Aston Machan (Umamusume Pretty Derby)",
    "name": "真弓快车 Aston Machan (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "真弓快车 Aston Machan (Umamusume Pretty Derby)"
  },
  {
    "id": "骏川手纲 Hayakawa Tazuna (Umamusume Pretty Derby)",
    "name": "骏川手纲 Hayakawa Tazuna (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "骏川手纲 Hayakawa Tazuna (Umamusume Pretty Derby)"
  },
  {
    "id": "小林历奇 Kopano Rickey (Umamusume Pretty Derby)",
    "name": "小林历奇 Kopano Rickey (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "小林历奇 Kopano Rickey (Umamusume Pretty Derby)"
  },
  {
    "id": "奇锐骏 Wonder Acute (Umamusume Pretty Derby)",
    "name": "奇锐骏 Wonder Acute (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "奇锐骏 Wonder Acute (Umamusume Pretty Derby)"
  },
  {
    "id": "秋川理事长 President Akikawa (Umamusume Pretty Derby)",
    "name": "秋川理事长 President Akikawa (Umamusume Pretty Derby)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "秋川理事长 President Akikawa (Umamusume Pretty Derby)"
  },
  {
    "id": "綾地 寧々 Ayachi Nene (Sanoba Witch)",
    "name": "綾地 寧々 Ayachi Nene (Sanoba Witch)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "綾地 寧々 Ayachi Nene (Sanoba Witch)"
  },
  {
    "id": "因幡 めぐる Inaba Meguru (Sanoba Witch)",
    "name": "因幡 めぐる Inaba Meguru (Sanoba Witch)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "因幡 めぐる Inaba Meguru (Sanoba Witch)"
  },
  {
    "id": "椎葉 紬 Shiiba Tsumugi (Sanoba Witch)",
    "name": "椎葉 紬 Shiiba Tsumugi (Sanoba Witch)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "椎葉 紬 Shiiba Tsumugi (Sanoba Witch)"
  },
  {
    "id": "仮屋 和奏 Kariya Wakama (Sanoba Witch)",
    "name": "仮屋 和奏 Kariya Wakama (Sanoba Witch)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "仮屋 和奏 Kariya Wakama (Sanoba Witch)"
  },
  {
    "id": "戸隠 憧子 Togakushi Touko (Sanoba Witch)",
    "name": "戸隠 憧子 Togakushi Touko (Sanoba Witch)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "戸隠 憧子 Togakushi Touko (Sanoba Witch)"
  },
  {
    "id": "九条裟罗 Kujou Sara (Genshin Impact)",
    "name": "九条裟罗 Kujou Sara (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "九条裟罗 Kujou Sara (Genshin Impact)"
  },
  {
    "id": "芭芭拉 Barbara (Genshin Impact)",
    "name": "芭芭拉 Barbara (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "芭芭拉 Barbara (Genshin Impact)"
  },
  {
    "id": "派蒙 Paimon (Genshin Impact)",
    "name": "派蒙 Paimon (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "派蒙 Paimon (Genshin Impact)"
  },
  {
    "id": "荒泷一斗 Arataki Itto (Genshin Impact)",
    "name": "荒泷一斗 Arataki Itto (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "荒泷一斗 Arataki Itto (Genshin Impact)"
  },
  {
    "id": "早柚 Sayu (Genshin Impact)",
    "name": "早柚 Sayu (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "早柚 Sayu (Genshin Impact)"
  },
  {
    "id": "香菱 Xiangling (Genshin Impact)",
    "name": "香菱 Xiangling (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "香菱 Xiangling (Genshin Impact)"
  },
  {
    "id": "神里绫华 Kamisato Ayaka (Genshin Impact)",
    "name": "神里绫华 Kamisato Ayaka (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "神里绫华 Kamisato Ayaka (Genshin Impact)"
  },
  {
    "id": "重云 Chongyun (Genshin Impact)",
    "name": "重云 Chongyun (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "重云 Chongyun (Genshin Impact)"
  },
  {
    "id": "流浪者 Wanderer (Genshin Impact)",
    "name": "流浪者 Wanderer (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "流浪者 Wanderer (Genshin Impact)"
  },
  {
    "id": "优菈 Eula (Genshin Impact)",
    "name": "优菈 Eula (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "优菈 Eula (Genshin Impact)"
  },
  {
    "id": "凝光 Ningguang (Genshin Impact)",
    "name": "凝光 Ningguang (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "凝光 Ningguang (Genshin Impact)"
  },
  {
    "id": "钟离 Zhongli (Genshin Impact)",
    "name": "钟离 Zhongli (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "钟离 Zhongli (Genshin Impact)"
  },
  {
    "id": "雷电将军 Raiden Shogun (Genshin Impact)",
    "name": "雷电将军 Raiden Shogun (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "雷电将军 Raiden Shogun (Genshin Impact)"
  },
  {
    "id": "枫原万叶 Kaedehara Kazuha (Genshin Impact)",
    "name": "枫原万叶 Kaedehara Kazuha (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "枫原万叶 Kaedehara Kazuha (Genshin Impact)"
  },
  {
    "id": "赛诺 Cyno (Genshin Impact)",
    "name": "赛诺 Cyno (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "赛诺 Cyno (Genshin Impact)"
  },
  {
    "id": "诺艾尔 Noelle (Genshin Impact)",
    "name": "诺艾尔 Noelle (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "诺艾尔 Noelle (Genshin Impact)"
  },
  {
    "id": "八重神子 Yae Miko (Genshin Impact)",
    "name": "八重神子 Yae Miko (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "八重神子 Yae Miko (Genshin Impact)"
  },
  {
    "id": "凯亚 Kaeya (Genshin Impact)",
    "name": "凯亚 Kaeya (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "凯亚 Kaeya (Genshin Impact)"
  },
  {
    "id": "魈 Xiao (Genshin Impact)",
    "name": "魈 Xiao (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "魈 Xiao (Genshin Impact)"
  },
  {
    "id": "托马 Thoma (Genshin Impact)",
    "name": "托马 Thoma (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "托马 Thoma (Genshin Impact)"
  },
  {
    "id": "可莉 Klee (Genshin Impact)",
    "name": "可莉 Klee (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "可莉 Klee (Genshin Impact)"
  },
  {
    "id": "迪卢克 Diluc (Genshin Impact)",
    "name": "迪卢克 Diluc (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "迪卢克 Diluc (Genshin Impact)"
  },
  {
    "id": "夜兰 Yelan (Genshin Impact)",
    "name": "夜兰 Yelan (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "夜兰 Yelan (Genshin Impact)"
  },
  {
    "id": "鹿野院平藏 Shikanoin Heizou (Genshin Impact)",
    "name": "鹿野院平藏 Shikanoin Heizou (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "鹿野院平藏 Shikanoin Heizou (Genshin Impact)"
  },
  {
    "id": "辛焱 Xinyan (Genshin Impact)",
    "name": "辛焱 Xinyan (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "辛焱 Xinyan (Genshin Impact)"
  },
  {
    "id": "丽莎 Lisa (Genshin Impact)",
    "name": "丽莎 Lisa (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "丽莎 Lisa (Genshin Impact)"
  },
  {
    "id": "云堇 Yun Jin (Genshin Impact)",
    "name": "云堇 Yun Jin (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "云堇 Yun Jin (Genshin Impact)"
  },
  {
    "id": "坎蒂丝 Candace (Genshin Impact)",
    "name": "坎蒂丝 Candace (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "坎蒂丝 Candace (Genshin Impact)"
  },
  {
    "id": "罗莎莉亚 Rosaria (Genshin Impact)",
    "name": "罗莎莉亚 Rosaria (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "罗莎莉亚 Rosaria (Genshin Impact)"
  },
  {
    "id": "北斗 Beidou (Genshin Impact)",
    "name": "北斗 Beidou (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "北斗 Beidou (Genshin Impact)"
  },
  {
    "id": "珊瑚宫心海 Sangonomiya Kokomi (Genshin Impact)",
    "name": "珊瑚宫心海 Sangonomiya Kokomi (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "珊瑚宫心海 Sangonomiya Kokomi (Genshin Impact)"
  },
  {
    "id": "烟绯 Yanfei (Genshin Impact)",
    "name": "烟绯 Yanfei (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "烟绯 Yanfei (Genshin Impact)"
  },
  {
    "id": "久岐忍 Kuki Shinobu (Genshin Impact)",
    "name": "久岐忍 Kuki Shinobu (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "久岐忍 Kuki Shinobu (Genshin Impact)"
  },
  {
    "id": "宵宫 Yoimiya (Genshin Impact)",
    "name": "宵宫 Yoimiya (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "宵宫 Yoimiya (Genshin Impact)"
  },
  {
    "id": "安柏 Amber (Genshin Impact)",
    "name": "安柏 Amber (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "安柏 Amber (Genshin Impact)"
  },
  {
    "id": "迪奥娜 Diona (Genshin Impact)",
    "name": "迪奥娜 Diona (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "迪奥娜 Diona (Genshin Impact)"
  },
  {
    "id": "班尼特 Bennett (Genshin Impact)",
    "name": "班尼特 Bennett (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "班尼特 Bennett (Genshin Impact)"
  },
  {
    "id": "雷泽 Razor (Genshin Impact)",
    "name": "雷泽 Razor (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "雷泽 Razor (Genshin Impact)"
  },
  {
    "id": "阿贝多 Albedo (Genshin Impact)",
    "name": "阿贝多 Albedo (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "阿贝多 Albedo (Genshin Impact)"
  },
  {
    "id": "温迪 Venti (Genshin Impact)",
    "name": "温迪 Venti (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "温迪 Venti (Genshin Impact)"
  },
  {
    "id": "空 Player Male (Genshin Impact)",
    "name": "空 Player Male (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "空 Player Male (Genshin Impact)"
  },
  {
    "id": "神里绫人 Kamisato Ayato (Genshin Impact)",
    "name": "神里绫人 Kamisato Ayato (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "神里绫人 Kamisato Ayato (Genshin Impact)"
  },
  {
    "id": "琴 Jean (Genshin Impact)",
    "name": "琴 Jean (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "琴 Jean (Genshin Impact)"
  },
  {
    "id": "艾尔海森 Alhaitham (Genshin Impact)",
    "name": "艾尔海森 Alhaitham (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "艾尔海森 Alhaitham (Genshin Impact)"
  },
  {
    "id": "莫娜 Mona (Genshin Impact)",
    "name": "莫娜 Mona (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "莫娜 Mona (Genshin Impact)"
  },
  {
    "id": "妮露 Nilou (Genshin Impact)",
    "name": "妮露 Nilou (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "妮露 Nilou (Genshin Impact)"
  },
  {
    "id": "胡桃 Hu Tao (Genshin Impact)",
    "name": "胡桃 Hu Tao (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "胡桃 Hu Tao (Genshin Impact)"
  },
  {
    "id": "甘雨 Ganyu (Genshin Impact)",
    "name": "甘雨 Ganyu (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "甘雨 Ganyu (Genshin Impact)"
  },
  {
    "id": "纳西妲 Nahida (Genshin Impact)",
    "name": "纳西妲 Nahida (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "纳西妲 Nahida (Genshin Impact)"
  },
  {
    "id": "刻晴 Keqing (Genshin Impact)",
    "name": "刻晴 Keqing (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "刻晴 Keqing (Genshin Impact)"
  },
  {
    "id": "荧 Player Female (Genshin Impact)",
    "name": "荧 Player Female (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "荧 Player Female (Genshin Impact)"
  },
  {
    "id": "埃洛伊 Aloy (Genshin Impact)",
    "name": "埃洛伊 Aloy (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "埃洛伊 Aloy (Genshin Impact)"
  },
  {
    "id": "柯莱 Collei (Genshin Impact)",
    "name": "柯莱 Collei (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "柯莱 Collei (Genshin Impact)"
  },
  {
    "id": "多莉 Dori (Genshin Impact)",
    "name": "多莉 Dori (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "多莉 Dori (Genshin Impact)"
  },
  {
    "id": "提纳里 Tighnari (Genshin Impact)",
    "name": "提纳里 Tighnari (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "提纳里 Tighnari (Genshin Impact)"
  },
  {
    "id": "砂糖 Sucrose (Genshin Impact)",
    "name": "砂糖 Sucrose (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "砂糖 Sucrose (Genshin Impact)"
  },
  {
    "id": "行秋 Xingqiu (Genshin Impact)",
    "name": "行秋 Xingqiu (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "行秋 Xingqiu (Genshin Impact)"
  },
  {
    "id": "奥兹 Oz (Genshin Impact)",
    "name": "奥兹 Oz (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "奥兹 Oz (Genshin Impact)"
  },
  {
    "id": "五郎 Gorou (Genshin Impact)",
    "name": "五郎 Gorou (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "五郎 Gorou (Genshin Impact)"
  },
  {
    "id": "达达利亚 Tartalia (Genshin Impact)",
    "name": "达达利亚 Tartalia (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "达达利亚 Tartalia (Genshin Impact)"
  },
  {
    "id": "七七 Qiqi (Genshin Impact)",
    "name": "七七 Qiqi (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "七七 Qiqi (Genshin Impact)"
  },
  {
    "id": "申鹤 Shenhe (Genshin Impact)",
    "name": "申鹤 Shenhe (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "申鹤 Shenhe (Genshin Impact)"
  },
  {
    "id": "莱依拉 Layla (Genshin Impact)",
    "name": "莱依拉 Layla (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "莱依拉 Layla (Genshin Impact)"
  },
  {
    "id": "菲谢尔 Fishl (Genshin Impact)",
    "name": "菲谢尔 Fishl (Genshin Impact)",
    "lang": "ja-JP",
    "gender": "Female",
    "character": "菲谢尔 Fishl (Genshin Impact)"
  }
];

var configSchema = [
  {
    key: 'defaultVoice',
    label: 'Default Character',
    type: 'select',
    defaultValue: '特别周 Special Week (Umamusume Pretty Derby)',
    options: VOICES.map(function(v) {
      return { label: v.name, value: v.id };
    })
  },
  {
    key: 'language',
    label: 'Synthesis Language Mode',
    type: 'select',
    defaultValue: 'English',
    options: [
      { label: 'English', value: 'English' },
      { label: '日本語 (Japanese)', value: '日本語' },
      { label: '简体中文 (Chinese)', value: '简体中文' },
      { label: 'Mix (Multilingual)', value: 'Mix' }
    ]
  },
  {
    key: 'speed',
    label: 'Speech Speed (0.5 - 2.0)',
    type: 'select',
    defaultValue: '1.0',
    options: [
      { label: '0.75x', value: '0.75' },
      { label: '0.9x', value: '0.9' },
      { label: '1.0x (Normal)', value: '1.0' },
      { label: '1.1x', value: '1.1' },
      { label: '1.25x', value: '1.25' },
      { label: '1.5x', value: '1.5' }
    ]
  }
];

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

function sanitizeText(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim();
}

async function doSynthesize(text, options) {
  options = options || {};
  var character = options.voice || '特别周 Special Week (Umamusume Pretty Derby)';
  var lang = options.language || 'English';
  var speedVal = 1.0;
  if (options.speed !== undefined && options.speed !== null) {
    var parsed = parseFloat(options.speed);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
      speedVal = parsed;
    }
  }

  var cleanText = sanitizeText(text);
  if (!cleanText) {
    throw new Error('No speakable text');
  }

  if (cleanText.length > 300) {
    cleanText = cleanText.substring(0, 300);
  }

  var spaceBase = 'https://plachta-vits-umamusume-voice-synthesizer.hf.space';

  // 1. Submit prediction job via Gradio 5 SSE endpoint
  var callUrl = spaceBase + '/gradio_api/call/tts_fn';
  var payload = {
    data: [
      cleanText,
      character,
      lang,
      speedVal,
      false
    ]
  };

  var callResp = await fetch(callUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    },
    body: JSON.stringify(payload)
  });

  if (!callResp.ok) {
    throw new Error('Umamusume VITS submission failed: HTTP ' + callResp.status);
  }

  var callData = await callResp.json();
  var eventId = callData.event_id;
  if (!eventId) {
    throw new Error('Umamusume VITS returned no event_id: ' + JSON.stringify(callData));
  }

  // 2. Stream SSE until complete event
  var sseUrl = spaceBase + '/gradio_api/call/tts_fn/' + eventId;
  var sseResp = await fetch(sseUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!sseResp.ok) {
    throw new Error('Umamusume VITS SSE stream failed: HTTP ' + sseResp.status);
  }

  var sseText = await sseResp.text();
  var audioUrl = null;
  var lines = sseText.split('\n');

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf('data:') === 0) {
      try {
        var parsed = JSON.parse(line.substring(5).trim());
        if (Array.isArray(parsed) && parsed.length > 1 && parsed[1]) {
          var audioObj = parsed[1];
          if (audioObj.url) {
            audioUrl = audioObj.url;
          } else if (audioObj.path) {
            audioUrl = spaceBase + '/gradio_api/file=' + audioObj.path;
          }
          break;
        }
      } catch (e) {}
    }
  }

  if (!audioUrl) {
    throw new Error('Could not parse audio URL from Umamusume SSE: ' + sseText.slice(0, 300));
  }

  // 3. Download WAV audio content
  var audioResp = await fetch(audioUrl, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
    }
  });

  if (!audioResp.ok) {
    throw new Error('Umamusume audio download failed: HTTP ' + audioResp.status);
  }

  var arrayBuffer = await audioResp.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Umamusume returned empty audio buffer');
  }

  return {
    audioContent: arrayBuffer,
    format: 'wav',
    sampleRate: 22050
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

  throw lastError || new Error('Umamusume VITS synthesis failed after ' + maxRetries + ' attempts');
}

module.exports.default = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  description: 'Free anime & game character TTS (Umamusume Pretty Derby VITS) via Hugging Face Space. Features 147 expressive voices supporting English, Japanese, and Chinese. Returns WAV audio.',
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
