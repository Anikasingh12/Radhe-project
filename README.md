# Radhe-project

R777 React frontend replica.

React rebuild of the R777 frontend (Vite + React 19 + React Router).
Images are loaded from the existing static CDN (`images.staticcontents.net`).

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
```

When you deploy, configure the host for SPA fallback, so every route serves `index.html`.

## Features

- Top marquee with live clock, header, nav with LIVE counters, and the mobile icon strip
- Hero carousel with separate desktop and mobile images (autoplay, dots, swipe), promo tiles, Top Games slider
- Cricket, Soccer and Tennis odds tables (1 / x / 2, back and lay). Odds tick live and flash on change. Suspended markets show as suspended.
- In-Play page (filters: Watch Live, All Games, per sport), sport pages (`/cricket`, `/soccer`, `/tennis`, `/wbbl`)
- Event page (`/event/:id`): Match Odds with 3-level depth, Bookmaker, Fancy, and running position per runner
- Inline bet slip (odds and stake steppers, quick-stake buttons, mobile keypad) and the Matched Bet panel
- Login modal: math captcha, show/hide password, Remember me, Demo ID
- Account drawer: Exposure / P&L, Account Statement, Profit Loss, Bet History, Unsettled Bets, Set Stake, Rules, Change Password, Logout (demo accounts: Rules + Logout only)
- Casino lobbies: `/ezugi`, `/evolution`, `/vivo`, `/betgames`, `/casino3`, `/royalcasino`, `/indianpoker`, `/rvgames`, `/spribe`, `/inout`
- Mobile: app download strip, hamburger sidebar drawer, fixed bottom nav

## Logged-out vs logged-in (same as the original)

| | Logged out (`/auth`) | Logged in (`/home`) |
|---|---|---|
| Top | Marquee + clock bar | Red "Demo Account" tab (demo only) + balance / Exp pills |
| Home | Hero carousel, promos, Top Games, 3-row tables, footer | Sidebar, sports banner carousel, 5-row tables with pin column |
| Marquee | Top bar | Fixed bottom bar (desktop), under header (mobile) |
| Account | Login modal | Right drawer: Exposure / P&L tiles, Rules, Logout (+ reports for real users) |
| Event page | | Inline bet slip under the market (mobile: keypad + Market / Open Bets tabs) |

Pinned events (pin button) show under **Multi Markets** (`/multimarket`).

## Structure

```
src/
  api/index.js        <- all data access (currently mocked)
  config.js           <- asset URLs, menus, casino providers, stake presets
  data/               <- seed events + casino game lists
  context/            <- AuthContext (session, modals, toast), SportsContext (odds feed, slip, bets)
  components/         <- Header, TopBar, NavMenu, Sidebar, OddsTable, BetSlip, LoginModal, ...
  pages/              <- Home, InPlay, Sport, Event, Casino, Reports
```

## Connecting the real backend

All data goes through `src/api/index.js`. Each function documents the request and response shape it expects.
Replace the mock bodies with `fetch` calls to your API, for example `login`, `getEvents`, `placeBet` and `getCasinoGames`.
`SportsContext` polls `tickOdds()` every 2.5s. Swap that for your websocket or odds feed.

Mock behaviour: any user ID with a password of 4+ characters logs in (balance 0). **Demo ID** gives a 2,000 balance so you can place test bets.
