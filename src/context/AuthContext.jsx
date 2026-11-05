import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as api from '../api';
import { STAKE_PRESETS } from '../config';

const AuthContext = createContext(null);
const STORAGE_KEY = 'r777_session';
const STAKE_KEY = 'r777_stakes';
const REMEMBER_KEY = 'r777_remember';

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [loginOpen, setLoginOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'stake' | 'password' | 'rules' | null
  const [drawerOpen, setDrawerOpen] = useState(false); // right-side account drawer
  const [toast, setToast] = useState(null);
  const [stakes, setStakes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STAKE_KEY)) || STAKE_PRESETS;
    } catch {
      return STAKE_PRESETS;
    }
  });

  const persist = (s, remember) => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (s) (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify(s));
    setSession(s);
  };

  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast((t) => (t && Date.now() - t.id >= 2900 ? null : t)), 3000);
  }, []);

  const login = async (creds, remember) => {
    const res = await api.login(creds);
    if (remember) localStorage.setItem(REMEMBER_KEY, creds.userId);
    else localStorage.removeItem(REMEMBER_KEY);
    persist(res, remember);
    setLoginOpen(false);
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    persist(res, false);
    setLoginOpen(false);
  };

  const logout = () => {
    setDrawerOpen(false);
    persist(null);
    notify('Logged out successfully');
  };

  const updateUser = (patch) =>
    setSession((s) => {
      if (!s) return s;
      const next = { ...s, user: { ...s.user, ...patch } };
      const store = localStorage.getItem(STORAGE_KEY) ? localStorage : sessionStorage;
      store.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

  const saveStakes = (vals) => {
    setStakes(vals);
    localStorage.setItem(STAKE_KEY, JSON.stringify(vals));
  };

  /** Run `fn` if logged in, otherwise open the login modal. */
  const requireLogin = (fn) => (session ? fn?.() : setLoginOpen(true));

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isLoggedIn: !!session,
      rememberedId: localStorage.getItem(REMEMBER_KEY) || '',
      login, demoLogin, logout, updateUser, requireLogin,
      loginOpen, setLoginOpen, modal, setModal, drawerOpen, setDrawerOpen,
      stakes, saveStakes, toast, notify,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, loginOpen, modal, drawerOpen, stakes, toast],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
