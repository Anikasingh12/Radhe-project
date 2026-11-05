import OddsTable from '../components/OddsTable';
import { SPORTS } from '../config';
import { useSports } from '../context/SportsContext';

/** /game/4, /game/1, /game/2 (+ /wbbl): sport banner + every event of that sport, like the original. */
export default function Sport({ sport }) {
  const { events } = useSports();
  const cfg = SPORTS.find((s) => s.key === sport);
  const list = sport === 'wbbl' ? events.filter((e) => e.wbbl) : events.filter((e) => e.sport === sport);
  return (
    <div className="sport-page">
      {cfg?.banner && (
        <div className="sport-banner">
          <img src={cfg.banner} alt={cfg.name} />
        </div>
      )}
      <OddsTable title={cfg ? cfg.name : 'WBBL 2026'} events={list} emptyText="No events available." />
    </div>
  );
}
