// API layer. Everything goes through these functions so the mock
// implementation can be swapped for the real backend in one place.
//
// To connect a real backend, set VITE_API_BASE in `.env` and replace the
// bodies below with fetch() calls (shapes are documented per function).

import { LOGGED_IN_MARQUEE } from '../config';
import { EVENTS, FANCY_TEMPLATES } from '../data/events';
import casinoGames from '../data/casinoGames.json';

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const round2 = (n) => Math.round(n * 100) / 100;

// Simulated server state ------------------------------------------------------
let events = structuredClone(EVENTS);

/** Nudge prices slightly so the UI shows live-ticking odds. */
export function tickOdds() {
  events = events.map((e) => {
    if (e.suspended || Math.random() > 0.35) return e;
    const odds = e.odds.map((pair) => {
      if (!pair || !pair[0] || !pair[1]) return pair; // leave empty / outright (0) prices alone
      const back = Math.max(1.01, round2(pair[0] + (Math.random() - 0.5) * 0.06 * pair[0]));
      const spread = Math.max(0.01, round2(pair[1] - pair[0]));
      return [back, round2(back + spread)];
    });
    return { ...e, odds };
  });
  return events;
}

// Auth --------------------------------------------------------------------------

/**
 * POST /login { userId, password } -> { token, user: { userId, balance, exposure } }
 * The mock accepts any userId with a password of 4+ characters.
 */
export async function login({ userId, password }) {
  await delay(500);
  if (!userId?.trim()) throw new Error('Please enter User ID');
  if (!password || password.length < 4) throw new Error('Invalid username or password');
  return {
    token: `mock-${Date.now()}`,
    user: { userId: userId.trim(), name: userId.trim(), balance: 0, exposure: 0, pnl: 0, demo: false },
  };
}

/** POST /demologin -> demo account with fun balance. */
export async function demoLogin() {
  await delay(400);
  return {
    token: `demo-${Date.now()}`,
    user: { userId: 'democlient', name: 'Demo', balance: 2000, exposure: 0, pnl: 0, demo: true },
  };
}

export async function changePassword({ oldPassword, newPassword, confirm }) {
  await delay(400);
  if (!oldPassword) throw new Error('Enter current password');
  if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters');
  if (newPassword !== confirm) throw new Error('Passwords do not match');
  return { ok: true };
}

// Sports ------------------------------------------------------------------------

/** GET /events?sport=&inPlay= */
export async function getEvents({ sport, inPlay, wbbl } = {}) {
  await delay(150);
  return events.filter(
    (e) =>
      (!sport || e.sport === sport) &&
      (inPlay === undefined || e.inPlay === inPlay) &&
      (!wbbl || e.wbbl),
  );
}

export function getEventsSync() {
  return events;
}

/** GET /event/:id -> event + markets */
export async function getEvent(id) {
  await delay(150);
  const e = events.find((x) => x.id === id);
  if (!e) throw new Error('Event not found');
  return e;
}

/** Build the market depth (3 back / 3 lay levels) for an event runner. */
export function depth(pair) {
  if (!pair) return { back: [null, null, null], lay: [null, null, null] };
  const [b, l] = pair;
  const step = b < 2 ? 0.01 : b < 3 ? 0.02 : b < 4 ? 0.05 : b < 6 ? 0.1 : 0.2;
  const sz = () => Math.round(Math.random() * 14000 + 20);
  return {
    back: [round2(b - 2 * step), round2(b - step), b].map((p) => ({ price: Math.max(1.01, p), size: sz() })),
    lay: [l, round2(l + step), round2(l + 2 * step)].map((p) => ({ price: p, size: sz() })),
  };
}

/** Bookmaker market: rates in paise (e.g. 210 = 3.10), three levels each side. */
export function bookmaker(event) {
  return event.runners
    .map((r, i) => ({ r, pair: event.odds[i], i }))
    .filter((x) => x.pair || x.i !== 1)
    .map(({ r, pair, i }) => {
      if (!pair) return { runner: r, suspended: true, back: [], lay: [], size: '1L' };
      const b = Math.round((pair[0] - 1) * 100);
      const l = Math.round((pair[1] - 1) * 100) + 15;
      return {
        runner: r,
        suspended: !!event.suspended || (i === 1 && b > 300),
        back: [b - 2, b - 1, b],
        lay: [l, l + 1, l + 2],
        size: i === 1 ? '1L' : '3L',
      };
    });
}

export function fancyMarkets(event) {
  // deterministic per event so values don't jump on every render
  let seed = event.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const team = (event.runners[event.runners.length - 1] || '').split(' ').map((w) => w[0]).join('').toUpperCase();
  return FANCY_TEMPLATES.map((f, i) => {
    const base = f.cat === 'single' ? Math.floor(2 + rnd() * 10) : Math.floor(40 + rnd() * 180);
    const bhav = f.name.includes('Bhav');
    return {
      id: `${event.id}-f${i}`,
      cat: f.cat,
      name: f.name.replace('{t}', team),
      no: base, noRate: bhav ? 7 : 100,
      yes: bhav ? base : base + 1, yesRate: bhav ? 4 : 100,
      suspended: rnd() < 0.12,
      max: f.max, mkt: f.mkt,
    };
  });
}

/** GET /marketprovider/marquee */
export async function getMarquee() {
  await delay(100);
  return { message: LOGGED_IN_MARQUEE };
}

// Betting ----------------------------------------------------------------------

/**
 * POST /placebet { eventId, market, selection, side, odds, stake }
 * Returns the matched bet and the new balance/exposure.
 */
export async function placeBet(bet, user) {
  await delay(700);
  const stake = Number(bet.stake);
  if (!stake || stake < 100) throw new Error('Minimum stake is 100');
  if (stake > 500000) throw new Error('Maximum stake is 5,00,000');
  const dec = bet.market === 'Bookmaker' ? 1 + bet.odds / 100 : bet.odds;
  const liability = bet.market === 'Fancy' || bet.side === 'back' ? stake : round2((dec - 1) * stake);
  const available = user.balance - user.exposure;
  if (liability > available) throw new Error('Insufficient balance');
  return {
    bet: { ...bet, id: `b${Date.now()}`, stake, liability, placedAt: new Date().toISOString(), status: 'matched' },
    exposure: round2(user.exposure + liability),
  };
}

// Casino ------------------------------------------------------------------------

export function getCasinoGames(provider) {
  return casinoGames[provider] ?? [];
}
