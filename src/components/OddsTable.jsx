import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BetSlip from './BetSlip';
import { useSports } from '../context/SportsContext';
import { MarketBadges } from './Icons';

const fmtTime = (iso) => {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())} ${d.toLocaleString('en-GB', { month: 'short' })} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/** A back/lay price cell that flashes when its value changes. */
export function OddsCell({ side, value, sub, onClick, className = '' }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (prev.current !== value && prev.current != null && value != null) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);
  return (
    <button
      type="button"
      className={`odd ${side} ${flash ? 'flash' : ''} ${className}`}
      onClick={value != null ? onClick : undefined}
      disabled={value == null}
    >
      <span>{value ?? ''}</span>
      {sub != null && <small>{sub}</small>}
    </button>
  );
}

function EventRow({ e, showTime }) {
  const { requireLogin, isLoggedIn } = useAuth();
  const { setSlip, pins, togglePin } = useSports();
  const pinned = pins.includes(e.id);

  const pick = (i, side) =>
    requireLogin(() => {
      // Like the original: the slip opens inline, directly under this row.
      setSlip({
        eventId: e.id, eventName: e.name, market: 'Match Odds', source: 'list',
        selection: e.runners[i] ?? (i === 1 ? 'The Draw' : ''), side,
        odds: e.odds[i][side === 'back' ? 0 : 1], stake: '',
      });
    });

  const cells = (
    <div className={`odds-cells ${e.suspended ? 'is-suspended' : ''}`}>
      {[0, 1, 2].map((i) => (
        <div className="odds-pair" key={i}>
          <OddsCell side="back" value={e.odds[i]?.[0]} onClick={() => pick(i, 'back')} />
          <OddsCell side="lay" value={e.odds[i]?.[1]} onClick={() => pick(i, 'lay')} />
        </div>
      ))}
      {e.suspended && (
        <div className="suspended-overlay">
          <span>Suspended</span>
          <span>Suspended</span>
          <span>Suspended</span>
        </div>
      )}
    </div>
  );

  return (
    <>
    <div className="event-row">
      <div className="event-info">
        <Link to={`/event/${e.id}`} className={`event-name ${showTime ? 'timed' : ''}`}>
          {showTime ? (
            <>
              <span className="desktop-only dtime">{fmtTime(e.start)} |</span>
              {e.inPlay && <span className={`dot-live ${isLoggedIn ? '' : 'mobile-only'}`} />}
              {e.name}
            </>
          ) : (
            <>
              <span className="dot-live" />
              {e.name}
            </>
          )}
          {e.inPlay && <span className={`live-now ${showTime && !isLoggedIn ? 'mobile-only' : ''}`}>Live Now</span>}
        </Link>
        <div className="event-meta mobile-only">
          <i className="far fa-clock" /> {fmtTime(e.start)}
        </div>
        <MarketBadges event={e} />
        <button
          className={`pin mobile-only ${pinned ? 'pinned' : ''}`}
          aria-label="pin"
          onClick={() => requireLogin(() => togglePin(e.id))}
        >
          <i className="fas fa-thumbtack" />
        </button>
      </div>
      {cells}
      {isLoggedIn && (
        <button
          className={`pin pin-col desktop-only ${pinned ? 'pinned' : ''}`}
          aria-label="pin"
          title={pinned ? 'Remove from Multi Markets' : 'Add to Multi Markets'}
          onClick={() => togglePin(e.id)}
        >
          <i className="fas fa-thumbtack" />
        </button>
      )}
    </div>
    <BetSlip eventId={e.id} variant="list" />
    </>
  );
}

/** Sport section with header bar, 1/x/2 column labels, rows and "View More". */
export default function OddsTable({ title, events, limit, showTime = true, moreLink, emptyText }) {
  const { isLoggedIn } = useAuth();
  const list = limit ? events.slice(0, limit) : events;
  return (
    <section className={`odds-table ${isLoggedIn ? 'with-pin' : ''}`}>
      <div className="section-head">{title}</div>
      {list.length === 0 ? (
        <div className="empty-row">{emptyText || 'has no live event.'}</div>
      ) : (
        <>
          <div className="odds-head desktop-only">
            <div />
            <div className="odds-labels">
              <span>1</span>
              <span>x</span>
              <span>2</span>
            </div>
            <div />
          </div>
          {list.map((e) => (
            <EventRow key={e.id} e={e} showTime={showTime} />
          ))}
        </>
      )}
      {moreLink && (
        <div className="view-more-row">
          <Link className="view-more" to={moreLink}>
            View More...
          </Link>
        </div>
      )}
    </section>
  );
}
