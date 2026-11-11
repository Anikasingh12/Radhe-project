import { Link } from 'react-router-dom';
import { ASSETS } from '../config';
import { useAuth } from '../context/AuthContext';

export const money = (n) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Header({ onMenu }) {
  const { user, isLoggedIn, setLoginOpen, setDrawerOpen } = useAuth();

  return (
    <header className={`header ${isLoggedIn ? 'logged-in' : ''}`}>
      <button className="hamburger upto-tablet" onClick={onMenu} aria-label="menu">
        <i className="fas fa-bars" />
      </button>
      <Link to="/home" className="logo">
        <img src={ASSETS.logo} alt="logo" />
      </Link>

      {isLoggedIn && user.demo && <div className="demo-tab">Demo Account</div>}

      <div className="header-right">
        {!isLoggedIn ? (
          <button className="btn-login" onClick={() => setLoginOpen(true)}>
            <i className="fas fa-user" /> LOG IN
          </button>
        ) : (
          <div className="bal-pills">
            <button className="bal-pill" onClick={() => setDrawerOpen(true)}>
              <img src={ASSETS.coin} alt="" />
              <span className="pv desktop-only">{Number(user.balance).toFixed(2)}</span>
              <span className="pv mobile-only">{user.balance}</span>
            </button>
            <button className="bal-pill exp" onClick={() => setDrawerOpen(true)}>
              <span className="ex-f">Exp :</span>
              <span className="pv">{Number(user.exposure).toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
