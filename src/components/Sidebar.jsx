import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';
import { MENU_ITEMS } from './NavMenu';
import { SportIcon } from './Icons';


export default function Sidebar({ open, onClose }) {
  const { events } = useSports();
  const { isLoggedIn } = useAuth();
  const [expanded, setExpanded] = useState({});

  const toggle = (k) => setExpanded((e) => ({ ...e, [k]: !e[k] }));

  return (
    <>
      {open && <div className="sidebar-backdrop mobile-only" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-title">
          Popular
          <button className="mobile-only sidebar-close" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>
        <ul className="list-unstyled components">
          <li className="tab-show mobile-only">
            <div className="side-row">
              <NavLink to="/home" onClick={onClose}>
                <SportIcon name="home" variant="side" />
                <span>Home</span>
              </NavLink>
            </div>
          </li>
          {MENU_ITEMS.filter((m) => !m.desktopOnly && (!m.auth || isLoggedIn)).map((m) => {
            const key = m.live || m.to.slice(1);
            const isSport = !!m.live;
            const list = isSport ? events.filter((e) => e.sport === key) : [];
            const comps = [...new Set(list.map((e) => e.competition))];
            return (
              <li key={m.to} className={key === 'tennis' ? 'group-end' : ''}>
                <div className="side-row">
                  <NavLink to={m.to} onClick={onClose} className="">
                    <SportIcon name={m.icon} variant="side" />
                    <span>{m.label}</span>
                  </NavLink>
                  {isSport && (
                    <button className="side-caret" onClick={() => toggle(key)} aria-label="expand">
                      <i className={`fas fa-caret-${expanded[key] ? 'up' : 'down'}`} />
                    </button>
                  )}
                </div>
                {isSport && expanded[key] && (
                  <ul className="side-sub">
                    {comps.map((c) => (
                      <li key={c}>
                        <div className="side-comp">{c}</div>
                        {list
                          .filter((e) => e.competition === c)
                          .map((e) => (
                            <Link key={e.id} to={`/event/${e.id}`} onClick={onClose} className="side-event">
                              {e.inPlay && <span className="dot-live" />} {e.name}
                            </Link>
                          ))}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
