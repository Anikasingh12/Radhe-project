import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OddsTable from '../components/OddsTable';
import { BigSportIcon } from '../components/Icons';
import { SPORTS } from '../config';
import { useSports } from '../context/SportsContext';

export default function InPlay() {
  const { events, liveCount } = useSports();
  const { isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');
  const live = events.filter((e) => e.inPlay);
  const shown = filter === 'all' || filter === 'watch' ? SPORTS : SPORTS.filter((s) => s.key === filter);

  return (
    <div>
      <div className="section-head">In-Play</div>
      <ul className="inplay-tabs">
        <li>
          <button className={filter === 'watch' ? 'active' : ''} onClick={() => setFilter('watch')}>
            <BigSportIcon name="watchlive" />
            <span className="inplay-place">Watch Live</span>
          </button>
        </li>
        <li>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            <BigSportIcon name="allgames" />
            <span className="inplay-place">All Games</span>
          </button>
        </li>
        {SPORTS.map((s) => (
          <li key={s.key}>
            <button className={filter === s.key ? 'active' : ''} onClick={() => setFilter(s.key)}>
              <span className="ip-count">{liveCount[s.key] || 0}</span>
              <BigSportIcon name={s.key} />
              <span className="inplay-place">{s.name}</span>
            </button>
          </li>
        ))}
        {isLoggedIn && (
          <li>
            <button onClick={() => nav('/multimarket')}>
              <BigSportIcon name="multimarket" />
              <span className="inplay-place">Multi Markets</span>
            </button>
          </li>
        )}
      </ul>
      {shown.map((s) => (
        <OddsTable
          key={s.key}
          title={s.name}
          events={live.filter((e) => e.sport === s.key && (filter !== 'watch' || e.tv))}
          showTime={false}
        />
      ))}
    </div>
  );
}
