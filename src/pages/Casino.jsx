import { useState } from 'react';
import * as api from '../api';
import { CASINO_POPUP_IMG, CASINOS, LOBBY_HEAD_LOGGED_IN, LOBBY_POPUP } from '../config';
import { useAuth } from '../context/AuthContext';

// Per-lobby tile spacing/radius measured from the original site.
const TILE_STYLE = {
  casino3: { gap: 0, radius: 10 },
  spribe: { gap: 7.2, radius: 10 },
};
const DEFAULT_STYLE = { gap: 10, radius: 5 };

/** Provider lobby: grid of game tiles at their natural image size; PLAY requires login. */
export default function Casino({ provider }) {
  const { requireLogin, notify, isLoggedIn } = useAuth();
  // Logged in, several lobbies open with the "1 POINT = 100" notice (as on the original).
  const [popup, setPopup] = useState(() => isLoggedIn && LOBBY_POPUP.includes(provider));
  const games = api.getCasinoGames(provider);
  const cfg = CASINOS[provider];
  const st = TILE_STYLE[provider] || DEFAULT_STYLE;
  const head = isLoggedIn ? LOBBY_HEAD_LOGGED_IN[provider] : 'Casino';

  const play = (g) => requireLogin(() => notify(`Launching ${g.name || cfg.title}…`));

  return (
    <div>
      {head && <div className="section-head">{head}</div>}
      <div className="casino-grid" style={{ '--tile-gap': `${st.gap}px`, '--tile-radius': `${st.radius}px` }}>
        {games.map((g, i) => (
          <div key={g.id} className="casino-col">
            <div className="casino-tile" onClick={() => play(g)}>
              <img src={g.img} alt={g.name} loading={i < 12 ? 'eager' : 'lazy'} />
              <div className="casino-play">
                <span>PLAY</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {popup && (
        <div className="casino-popup" onClick={() => setPopup(false)}>
          <div className="casino-popup-box" onClick={(e) => e.stopPropagation()}>
            <button className="casino-popup-x" onClick={() => setPopup(false)} aria-label="close">
              ×
            </button>
            <img src={CASINO_POPUP_IMG} alt="Welcome to our casino lobby — 1 point = 100" />
            <button className="casino-popup-ok" onClick={() => setPopup(false)} aria-label="OK, I agree" />
          </div>
        </div>
      )}
    </div>
  );
}
