import { Link, NavLink, useLocation } from 'react-router-dom';
import { ASSETS } from '../config';

/** Fixed bottom bar on mobile: Home, In-Play, mini games, menu. */
export default function BottomNav({ onMenu }) {
  const { pathname } = useLocation();
  const anyActive = ['/home', '/auth', '/inplay'].includes(pathname);
  return (
    <div className={`bottom-nav mobile-only ${anyActive ? '' : 'none-active'}`}>
      <NavLink to="/home" className={({ isActive }) => `bn-item ${isActive || pathname === '/auth' ? 'active' : ''}`}>
        <img src={ASSETS.navHome} alt="" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/inplay" className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}>
        <img src={ASSETS.navInplay} alt="" />
        <span>In-Play</span>
      </NavLink>
      <Link to="/rvgames" className="bn-item">
        <img src={ASSETS.navMiniGames} alt="" />
        <span>Games</span>
      </Link>
      <button className="bn-item" onClick={onMenu}>
        <img src={ASSETS.navMenu} alt="" />
        <span>Menu</span>
      </button>
    </div>
  );
}
