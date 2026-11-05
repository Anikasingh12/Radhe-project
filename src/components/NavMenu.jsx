import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';
import { ASSETS } from '../config';
import { SportIcon } from './Icons';

// Shared menu definition (top nav, mobile icon strip and sidebar).
export const MENU_ITEMS = [
  { to: '/home', label: 'Home', desktopOnly: true },
  { to: '/inplay', label: 'In-Play', icon: 'inplay' },
  { to: '/multimarket', label: 'Multi Markets', icon: 'multimarket', sidebarOnly: true, auth: true },
  { to: '/wbbl', label: 'WBBL 2026', icon: 'iplwinner', cls: 'nav-blink' },
  { to: '/game/4', label: 'Cricket', icon: 'cricket', live: 'cricket' },
  { to: '/game/1', label: 'Soccer', icon: 'soccer', live: 'soccer' },
  { to: '/game/2', label: 'Tennis', icon: 'tennis', live: 'tennis' },
  { to: '/royalcasino', label: 'Indian Poker', icon: 'casino' },
  { to: '/indianpoker', label: 'Indian Poker II', icon: 'indianpoker' },
  { to: '/rvgames', label: 'RV Games', icon: 'evo' },
  { to: '/spribe', label: 'Aviator', icon: 'aviator', plane: true },
  { to: '/inout', label: 'Chicken Road', icon: 'chicken' },
  { to: '/ezugi', label: 'Live Casino', icon: 'evo', cls: 'nav-blink nav-blink-2' },
  { to: '/evolution', label: 'Evolution', icon: 'evo' },
  { to: '/vivo', label: 'Vivo', icon: 'evo' },
  { to: '/betgames', label: 'Betgames', icon: 'evo' },
  { to: '/casino3', label: 'Casino III', icon: 'casino' },
];

/** Red "LIVE n" tag — same markup/CSS as the original (.tag-live). */
function LiveBadge({ n }) {
  return (
    <span className="tag-live">
      <strong />
      {n}
    </span>
  );
}

export default function NavMenu() {
  const { liveCount } = useSports();
  const { pathname } = useLocation();
  // Like the original: an item is highlighted after it is clicked; on a direct page
  // load only In-Play / Home are highlighted.
  const [clicked, setClicked] = useState(null);
  const { isLoggedIn } = useAuth();
  const always = (to) => to === '/inplay' || to === '/home' || to.startsWith('/game/');
  // Logged in, the original never highlights casino items, even after a click.
  const isOn = (to) => pathname === to && (always(to) || (!isLoggedIn && clicked === to));
  return (
    <>
      {/* Desktop text menu */}
      <nav className="navbar desktop-only">
        <ul>
          {MENU_ITEMS.filter((m) => !m.sidebarOnly).map((m) => (
            <li key={m.to}>
              <NavLink
                to={m.to}
                onClick={() => setClicked(m.to)}
                className={() => `${m.cls || ''} ${isOn(m.to) ? 'active' : ''}`}
              >
                {m.live && <LiveBadge n={liveCount[m.live] || 0} />}
                {m.plane && <img src={ASSETS.aviatorIcon} alt="" className="nav-plane" />}
                {m.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile icon strip */}
      <nav className="scrollmenu mobile-only">
        {MENU_ITEMS.filter((m) => !m.desktopOnly && !m.sidebarOnly).map((m) => (
          <NavLink key={m.to} to={m.to} onClick={() => setClicked(m.to)} className={() => (isOn(m.to) ? 'active' : '')}>
            {m.live && <LiveBadge n={liveCount[m.live] || 0} />}
            {m.icon === 'aviator' ? (
              <img src={ASSETS.aviatorIcon} alt="" className="sm-aviator" />
            ) : m.icon === 'chicken' ? (
              <img src={ASSETS.chickenIcon} alt="" className="sm-chicken" />
            ) : (
              <SportIcon name={m.icon} size={28} />
            )}
            <span className={m.cls}>{m.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
