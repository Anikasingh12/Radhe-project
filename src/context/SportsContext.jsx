import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SportsContext = createContext(null);
const BETS_KEY = 'r777_bets';
const PINS_KEY = 'r777_pins';

export function SportsProvider({ children }) {
  const { user, updateUser, notify } = useAuth();
  const [events, setEvents] = useState(api.getEventsSync);
  const [slip, setSlip] = useState(null); // { eventId, eventName, market, selection, side, odds, stake }
  const [placing, setPlacing] = useState(false);
  const [bets, setBets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(BETS_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [pins, setPins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PINS_KEY)) || [];
    } catch {
      return [];
    }
  });
  const togglePin = (id) =>
    setPins((p) => {
      const next = p.includes(id) ? p.filter((x) => x !== id) : [...p, id];
      localStorage.setItem(PINS_KEY, JSON.stringify(next));
      return next;
    });

  const { pathname } = useLocation();
  useEffect(() => setSlip(null), [pathname]);

  // Live odds feed (mock polling; swap for websocket in production).
  useEffect(() => {
    const t = setInterval(() => setEvents([...api.tickOdds()]), 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => localStorage.setItem(BETS_KEY, JSON.stringify(bets)), [bets]);

  const liveCount = useMemo(() => {
    const c = {};
    events.forEach((e) => {
      if (e.inPlay) c[e.sport] = (c[e.sport] || 0) + 1;
    });
    return c;
  }, [events]);

  const placeBet = async () => {
    if (!slip || !user) return;
    setPlacing(true);
    try {
      const res = await api.placeBet(slip, user);
      setBets((b) => [{ ...res.bet, userId: user.userId }, ...b]);
      updateUser({ exposure: res.exposure });
      notify('Bet placed successfully');
      setSlip(null);
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setPlacing(false);
    }
  };

  const myBets = useMemo(() => bets.filter((b) => b.userId === user?.userId), [bets, user]);

  const value = {
    events, liveCount, slip, setSlip, placeBet, placing, bets: myBets, pins, togglePin,
  };
  return <SportsContext.Provider value={value}>{children}</SportsContext.Provider>;
}

export const useSports = () => useContext(SportsContext);
