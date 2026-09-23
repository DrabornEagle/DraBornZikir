export type ZikirCategory = 'Tesbih' | 'Dua' | 'Kur’an';
export type Zikir = {
  id: string;
  title: string;
  category: ZikirCategory;
  arabic: string;
  pronunciation: string;
  meaning: string;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
  audioUrl?: string;
  reciter?: string;
  tint: string;
  icon: string;
  suggestedCount: number;
};

const dkdTesbihatSource = 'https://kurul.diyanet.gov.tr/tr/fetva/namazlardan-sonra-tesbihat-nasil-yapilir/0193c42d-56d7-7df9-8636-ceba3a7927e6';
const dkdHadisSource = 'https://hadislerleislam.diyanet.gov.tr/sayfa.php?CILT=1&SAYFA=191';
const dkdTevhidSource = 'https://hadislerleislam.diyanet.gov.tr/sayfa.php?CILT=1&SAYFA=505';
const dkdReciter = 'Abdullah Avvad el-Cüheynî';
const dkdSurahAudio = 'https://download.quranicaudio.com/quran/abdullaah_3awwaad_al-juhaynee/';

export const zikirs: Zikir[] = [
  {
    id: 'subhanallah', title: 'Sübhânallah', category: 'Tesbih',
    arabic: 'سُبْحَانَ اللّٰهِ', pronunciation: 'Sübhânallah',
    meaning: 'Allah’ı her türlü eksiklikten tenzih ederim.',
    note: 'Namaz sonrası tesbihatta 33 kez tavsiye edilir.',
    sourceLabel: 'Diyanet Din İşleri Yüksek Kurulu', sourceUrl: dkdTesbihatSource,
    tint: '#5CDCC7', icon: '✦', suggestedCount: 33
  },
  {
    id: 'elhamdulillah', title: 'Elhamdülillah', category: 'Tesbih',
    arabic: 'الْحَمْدُ لِلّٰهِ', pronunciation: 'Elhamdülillah',
    meaning: 'Hamd ve övgü Allah’a mahsustur.',
    note: 'Namaz sonrası tesbihatta 33 kez tavsiye edilir.',
    sourceLabel: 'Diyanet Din İşleri Yüksek Kurulu', sourceUrl: dkdTesbihatSource,
    tint: '#F5C583', icon: '☀', suggestedCount: 33
  },
  {
    id: 'allahu-ekber', title: 'Allahu ekber', category: 'Tesbih',
    arabic: 'اللّٰهُ أَكْبَرُ', pronunciation: 'Allahu ekber',
    meaning: 'Allah en büyüktür.',
    note: 'Namaz sonrası tesbihatta 33 kez tavsiye edilir.',
    sourceLabel: 'Diyanet Din İşleri Yüksek Kurulu', sourceUrl: dkdTesbihatSource,
    tint: '#B59DFF', icon: '✧', suggestedCount: 33
  },
  {
    id: 'subhanallahi-bihamdihi', title: 'Sübhânallahi ve bihamdihî', category: 'Tesbih',
    arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ', pronunciation: 'Sübhânallahi ve bihamdihî',
    meaning: 'Allah’ı överek O’nu eksikliklerden tenzih ederim.',
    note: 'Hadislerde geçen bir zikir. Tekrar hedefini kendin belirleyebilirsin.',
    sourceLabel: 'Diyanet • Hadislerle İslâm', sourceUrl: dkdHadisSource,
    tint: '#81CEFF', icon: '◈', suggestedCount: 100
  },
  {
    id: 'la-ilahe-illallah', title: 'Lâ ilâhe illallah', category: 'Tesbih',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', pronunciation: 'Lâ ilâhe illallah',
    meaning: 'Allah’tan başka ilâh yoktur.',
    note: 'Kelime-i tevhid; dilediğin kadar okuyabilirsin.',
    sourceLabel: 'Diyanet • Hadislerle İslâm', sourceUrl: dkdTevhidSource,
    tint: '#F7A9B8', icon: '✷', suggestedCount: 33
  },
  {
    id: 'estagfirullah', title: 'Estağfirullah', category: 'Dua',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ', pronunciation: 'Estağfirullah',
    meaning: 'Allah’tan bağışlanma dilerim.',
    note: 'Namazdan sonra üç defa istiğfar edildiği aktarılır.',
    sourceLabel: 'Diyanet Din İşleri Yüksek Kurulu', sourceUrl: dkdTesbihatSource,
    tint: '#F7BE97', icon: '☾', suggestedCount: 3
  },
  {
    id: 'allahumme-selam', title: 'Allahümme ente’s-selâm', category: 'Dua',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    pronunciation: 'Allahümme ente’s-selâmü ve minke’s-selâm, tebârekte yâ ze’l-celâli ve’l-ikrâm.',
    meaning: 'Allah’ım, esenlik sensin; esenlik sendendir. Ey yücelik ve ikram sahibi, sen mübareksin.',
    note: 'Namaz sonrası okunan dua.',
    sourceLabel: 'Diyanet Din İşleri Yüksek Kurulu', sourceUrl: dkdTesbihatSource,
    tint: '#94D4BF', icon: '❀', suggestedCount: 1
  },
  {
    id: 'hasbunallah', title: 'Hasbünallah', category: 'Dua',
    arabic: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ', pronunciation: 'Hasbünallahü ve ni’me’l-vekîl.',
    meaning: 'Allah bize yeter; O ne güzel vekildir.',
    note: 'Âl-i İmrân sûresinin 173. âyetinde yer alır.',
    sourceLabel: 'Diyanet • Kur’an Yolu', sourceUrl: 'https://kuran.diyanet.gov.tr/tefsir/%C3%82l-i%20%C4%B0mr%C3%A2n-suresi/466/173-ayet-tefsiri',
    tint: '#A9B5FF', icon: '✧', suggestedCount: 1
  },
  {
    id: 'rabbena-atina', title: 'Rabbena âtinâ', category: 'Dua',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    pronunciation: 'Rabbenâ âtinâ fi’d-dünyâ haseneten ve fi’l-âhireti haseneten ve kınâ azâbe’n-nâr.',
    meaning: 'Rabbimiz, bize dünyada ve ahirette iyilik ver; bizi ateşin azabından koru.',
    note: 'Bakara sûresi 201. âyette yer alan dua.',
    sourceLabel: 'Diyanet • Kur’an Yolu', sourceUrl: 'https://kuran.diyanet.gov.tr/tefsir/Bakara-suresi/207/200-202-ayet-tefsiri',
    tint: '#F0CA8C', icon: '☼', suggestedCount: 1
  },
  {
    id: 'rabbizidni-ilma', title: 'Rabbim, ilmimi artır', category: 'Dua',
    arabic: 'رَبِّ زِدْنِي عِلْمًا', pronunciation: 'Rabbi zidnî ilmâ.',
    meaning: 'Rabbim, ilmimi artır.',
    note: 'Tâhâ sûresi 114. âyette yer alan dua.',
    sourceLabel: 'Diyanet • Kur’an Yolu', sourceUrl: 'https://kuran.diyanet.gov.tr/tefsir/T%C3%A2h%C3%A2-suresi/2461/113-114-ayet-tefsiri',
    tint: '#70CDE1', icon: '✦', suggestedCount: 1
  },
  {
    id: 'ihlas', title: 'İhlâs Sûresi', category: 'Kur’an',
    arabic: 'قُلْ هُوَ اللّٰهُ أَحَدٌ ۞ اللّٰهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    pronunciation: 'Kul hüvallâhü ehad. Allâhü’s-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.',
    meaning: 'Allah’ın birliğini, hiçbir şeye muhtaç olmadığını anlatır.',
    note: 'Kâri tilaveti: sureyi baştan sona dinleyebilirsin. İnternet gerekir.',
    sourceLabel: 'Diyanet • İhlâs Sûresi', sourceUrl: 'https://kuran.diyanet.gov.tr/tefsir/sure/112-ihlas-suresi',
    audioUrl: dkdSurahAudio + '112.mp3', reciter: dkdReciter,
    tint: '#9BDDD2', icon: '☾', suggestedCount: 1
  },
  {
    id: 'felak', title: 'Felak Sûresi', category: 'Kur’an',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    pronunciation: 'Kul eûzü birabbi’l-felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerri’n-neffâsâti fi’l-ukad. Ve min şerri hâsidin izâ hased.',
    meaning: 'Yaratılmışların kötülüğünden sabahın Rabbine sığınmayı anlatır.',
    note: 'Kâri tilaveti: sureyi baştan sona dinleyebilirsin. İnternet gerekir.',
    sourceLabel: 'Diyanet • Felak Sûresi', sourceUrl: 'https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/felak-suresi-113/ayet-1/kuran-yolu-meali-5',
    audioUrl: dkdSurahAudio + '113.mp3', reciter: dkdReciter,
    tint: '#C6B8FF', icon: '✷', suggestedCount: 1
  },
  {
    id: 'nas', title: 'Nâs Sûresi', category: 'Kur’an',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلٰهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ',
    pronunciation: 'Kul eûzü birabbi’n-nâs. Meliki’n-nâs. İlâhi’n-nâs. Min şerri’l-vesvâsi’l-hannâs. Ellezî yüvesvisü fî sudûri’n-nâs. Mine’l-cinneti ve’n-nâs.',
    meaning: 'İnsanların Rabbine sığınmayı anlatır.',
    note: 'Kâri tilaveti: sureyi baştan sona dinleyebilirsin. İnternet gerekir.',
    sourceLabel: 'Diyanet • Nâs Sûresi', sourceUrl: 'https://kuran.diyanet.gov.tr/tefsir/N%C3%A2s-suresi/6231/1-6-ayet-tefsiri',
    audioUrl: dkdSurahAudio + '114.mp3', reciter: dkdReciter,
    tint: '#F9C19A', icon: '✦', suggestedCount: 1
  }
];

export const stations = [
  {
    id: 'diyanet', name: 'Diyanet Radyo', subtitle: 'Sohbetler, kültür ve maneviyat',
    url: 'https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3c1171d7d2a.smil/playlist.m3u8',
    website: 'https://diyanetradyo.com/canli-dinle', tint: '#29C8BC', icon: '✦'
  },
  {
    id: 'kuran', name: 'Diyanet Kur’an Radyo', subtitle: 'Canlı Kur’an-ı Kerim tilavetleri',
    url: 'https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3c14192aa92.smil/playlist.m3u8',
    website: 'https://diyanetkuranradyo.com/canli-dinle', tint: '#A68CF6', icon: '☾'
  },
  {
    id: 'risalet', name: 'Diyanet Risalet Radyo', subtitle: 'Dinî yayınlar ve söyleşiler',
    url: 'https://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3c1520b2626.smil/playlist.m3u8',
    website: 'https://risaletradyo.com/canli-dinle', tint: '#E4B475', icon: '✧'
  }
] as const;

export type Station = (typeof stations)[number];
