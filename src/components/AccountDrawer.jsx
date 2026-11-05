import { useNavigate } from 'react-router-dom';
import { ASSETS } from '../config';
import { useAuth } from '../context/AuthContext';
import { money } from './Header';

// Items shown to real accounts. Demo accounts only get Rules + Logout (as on the original).
const FULL_MENU = [
  { label: 'Account Statement', icon: 'statement', to: '/account-statement' },
  { label: 'Profit Loss Report', icon: 'pl', to: '/profit-loss' },
  { label: 'Bet Histroy', icon: 'history', to: '/bet-history' },
  { label: 'Unsettled Bet', icon: 'unsettled', to: '/unsettled-bets' },
  { label: 'Set Stake', icon: 'stake', modal: 'stake' },
  { label: 'Change Password', icon: 'password', modal: 'password' },
];

/** Right-hand slide-in account panel opened from the balance pills. */
export default function AccountDrawer() {
  const { user, drawerOpen, setDrawerOpen, setModal, logout } = useAuth();
  const nav = useNavigate();
  if (!user) return null;

  const items = [
    ...(user.demo ? [] : FULL_MENU),
    { label: 'Rules', icon: 'rules', modal: 'rules' },
  ];

  const pick = (m) => {
    setDrawerOpen(false);
    if (m.modal) setModal(m.modal);
    else nav(m.to);
  };

  return (
    <>
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`account-drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="close">
          ×
        </button>
        <div className="drawer-user">
          <i className="fas fa-user" /> {user.name} - (
          <span className="desktop-only">{money(user.balance)}</span>
          <span className="mobile-only">{user.balance}</span>)
        </div>
        <div className="drawer-tiles">
          <div className="drawer-tile" onClick={() => pick({ to: '/unsettled-bets' })}>
            <b>Exposure</b>
            <span>{Number(user.exposure).toFixed(2)}</span>
          </div>
          <div className="drawer-tile" onClick={() => !user.demo && pick({ to: '/profit-loss' })}>
            <b>P&amp;L</b>
            <span>{Number(user.pnl).toFixed(2)}</span>
          </div>
        </div>
        <ul className="drawer-menu">
          {items.map((m) => (
            <li key={m.label} onClick={() => pick(m)}>
              <img src={ASSETS.accountMenu[m.icon]} alt="" /> {m.label}
            </li>
          ))}
          <li
            onClick={() => {
              logout();
              nav('/auth');
            }}
          >
            <img src={ASSETS.accountMenu.logout} alt="" /> Logout
          </li>
        </ul>
      </aside>
    </>
  );
}
