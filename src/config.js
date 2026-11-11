// Central place for asset URLs and site configuration.
// All images are served from the existing static CDN (branding: DiamondX).

export const CDN = 'https://images.staticcontents.net';

export const ASSETS = {
  logo: `${CDN}/rde/uimg/brand_logo.svg`,
  apkIcon: `${CDN}/casino/img/apkicon.webp`,
  sportsSprite: `${CDN}/casino/banner/images/sports-icons.png`,
  coin: `${CDN}/rde/uimg/coin.svg`,
  pin: `${CDN}/rde/uimg/a-pin-mobile.svg`,
  aviatorIcon: `${CDN}/casino/banner/images/aviator-icon.svg`,
  chickenIcon: `${CDN}/casino/banner/images/inout-icon.svg`,
  chickenIconSide: `${CDN}/casino/banner/images/inout-icon-b.svg`,
  tv: `${CDN}/rde/uimg/tv.svg`,
  bm: `${CDN}/rde/uimg/bm-icon1.svg`,
  fancy: `${CDN}/rde/uimg/fancy-icon1.svg`,
  navHome: `${CDN}/rde/uimg/home.svg`,
  navInplay: `${CDN}/rde/uimg/inplay.svg`,
  navMiniGames: `${CDN}/rde/uimg/mini_games.gif`,
  navMenu: `${CDN}/rde/uimg/menu.svg`,
  // Logged-in home banner carousel
  sportsBanners: [16, 1, 2, 3, 4, 5, 6, 12, 13, 14, 15].map((n) => ({
    d: `${CDN}/banners/desktop_banner_${n}.jpg`,
    m: `${CDN}/banners/mobile_banner_${n}.jpg`,
  })),
  apkBanner: `${CDN}/rde/login/pg-banner.webp`,
  gifBanners: [`${CDN}/rde/login/RDGIF-1.gif`, `${CDN}/rde/login/RDGIF-2.gif`],
  heroDesktop: [0, 1, 2, 3, 4, 5].map((i) => `${CDN}/rde/login/main-banner${i}.webp`),
  heroMobile: [0, 1, 2, 3, 4, 5].map((i) => `${CDN}/rde/login/main-banner-mobile${i}.webp`),
  promos: [
    { img: `${CDN}/rde/login/bonus-1.webp`, to: '/game/4' },
    { img: `${CDN}/rde/login/bonus-2.webp`, to: '/rvgames' },
    { img: `${CDN}/rde/login/bonus-3.webp`, to: '/game/2' },
  ],
  topGames: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (i) => `${CDN}/casino/without-login/topgame/topgame${i}.webp`,
  ),
  providers: [
    { name: 'Evolution', img: `${CDN}/casino/banner/loginimages/evolution.png`, m: `${CDN}/casino/banner/loginimages/mobile/evolution.svg` },
    { name: 'Ezugi', img: `${CDN}/casino/banner/loginimages/ezugi.png`, m: `${CDN}/casino/banner/loginimages/mobile/ezugi.svg` },
    { name: 'Pragmatic Live', img: `${CDN}/casino/banner/loginimages/pragmatic-live.png`, m: `${CDN}/casino/banner/loginimages/mobile/pragmatic.svg` },
    { name: 'Betgames', img: `${CDN}/casino/banner/loginimages/betgames.png`, m: `${CDN}/casino/banner/loginimages/mobile/betgames.svg` },
    { name: 'Super Spade', img: `${CDN}/casino/banner/loginimages/ssg.png`, m: `${CDN}/casino/banner/loginimages/mobile/superspade.svg` },
    { name: 'Betsoft', img: `${CDN}/casino/banner/loginimages/betsoft.png`, m: `${CDN}/casino/banner/loginimages/mobile/betsoft.svg` },
    { name: 'Spribe', img: `${CDN}/casino/banner/loginimages/spribe.png`, m: `${CDN}/casino/banner/loginimages/mobile/spribe.svg` },
    { name: 'Evoplay', img: `${CDN}/casino/banner/loginimages/Evoplay.png`, m: `${CDN}/casino/banner/loginimages/mobile/evoplay.svg` },
  ],
  plus18: `${CDN}/casino/banner/loginimages/logo-18plus.svg`,
  accountMenu: {
    statement: `${CDN}/casino/banner/images/Account-Statement.svg`,
    pl: `${CDN}/casino/banner/images/profit-loss-report.svg`,
    history: `${CDN}/casino/banner/images/bet-history.svg`,
    unsettled: `${CDN}/casino/banner/images/unsettle-bet.svg`,
    stake: `${CDN}/casino/banner/images/set-button-value.svg`,
    rules: `${CDN}/casino/banner/images/rules.svg`,
    password: `${CDN}/casino/banner/images/change-password.svg`,
    logout: `${CDN}/casino/banner/images/log-out.svg`,
  },
};

export const MARQUEE_TEXT = 'Enjoy Unmatched Betting Excitement and Access 500+ Casino and Online Games';

export const SOCIAL = [
  { icon: 'fab fa-instagram', href: 'https://www.instagram.com/rdreamfair_official/' },
  { icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/rdreamfair' },
  { icon: 'fab fa-twitter', href: 'https://twitter.com/rDreamFair' },
  { icon: 'fab fa-telegram-plane', href: 'https://t.me/rDreamFair_official' },
];

// Sprite offsets (sidebar 28px variant) taken from the original stylesheet.
export const SPRITE = {
  inplay: -1527,
  home: -1619,
  multimarket: 0,
  cricket: -326,
  soccer: -1026,
  tennis: -1096,
  indianpoker: -1742,
  casino: -863,
  evo: -1706,
  iplwinner: -1775,
};

export const SPORTS = [
  { key: 'cricket', name: 'Cricket', id: 4, banner: `${CDN}/casino/banner/Cricket-banner.jpg` },
  { key: 'soccer', name: 'Soccer', id: 1, banner: `${CDN}/casino/banner/Soccer-banner.jpg` },
  { key: 'tennis', name: 'Tennis', id: 2, banner: `${CDN}/casino/banner/Tennis-banner.jpg` },
];

// Casino lobbies, keyed by route.
export const CASINOS = {
  wbbl: { title: 'WBBL 2026', sprite: 'iplwinner' },
  royalcasino: { title: 'Indian Poker', sprite: 'indianpoker', provider: 'Indian Poker', prefix: 'royal' },
  indianpoker: { title: 'Indian Poker II', sprite: 'indianpoker', provider: 'Indian Poker II', prefix: 'indianpoker' },
  rvgames: { title: 'RV Games', sprite: 'casino', provider: 'RV Games', prefix: 'rvgames' },
  spribe: { title: 'Aviator', icon: 'aviator', provider: 'Spribe', prefix: 'spribe' },
  inout: { title: 'Chicken Road', icon: 'chicken', provider: 'InOut', prefix: 'inout' },
  ezugi: { title: 'Live Casino', sprite: 'casino', provider: 'Ezugi', prefix: 'ezugi' },
  evolution: { title: 'Evolution', sprite: 'casino', provider: 'Evolution', prefix: 'evolution' },
  vivo: { title: 'Vivo', sprite: 'casino', provider: 'Vivo', prefix: 'vivo' },
  betgames: { title: 'Betgames', sprite: 'casino', provider: 'Betgames', prefix: 'betgames' },
  casino3: { title: 'Casino III', sprite: 'casino', provider: 'Casino III', prefix: 'casino3' },
};

export const STAKE_PRESETS = [100, 500, 1000, 5000, 10000, 50000];
// Button captions exactly as served by the original's /manage/profile/buttons (note "500l").
export const stakeLabel = (v) => (v === 500 ? '500l' : String(v));

// Logged-in lobby behaviour measured on the original.
export const LOBBY_HEAD_LOGGED_IN = { casino3: 'Casino', royalcasino: 'Casino', indianpoker: 'Casino', spribe: 'Spribe' };
export const LOBBY_POPUP = ['evolution', 'vivo', 'betgames', 'casino3', 'spribe', 'inout'];
export const CASINO_POPUP_IMG = 'https://images.staticcontents.net/casino/banner/images/casinopoint100.webp';

// Logged-in marquee (served by /marketprovider/marquee on the original).
export const LOGGED_IN_MARQUEE = ' 1️⃣Welcome To Our Exchange .....✨✨ 2️⃣WBBL 2026  ..Winner Cup Bets Started In Our Exchange.......✨✨';
