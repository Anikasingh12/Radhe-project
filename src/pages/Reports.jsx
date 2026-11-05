import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';

const TITLES = {
  statement: 'Account Statement',
  pl: 'Profit Loss Report',
  history: 'Bet History',
  unsettled: 'Unsettled Bet',
};

const iso = (d) => d.toISOString().slice(0, 10);

/** Account report pages (filters + table), populated from the user's bets. */
export default function Reports({ type }) {
  const { isLoggedIn, user } = useAuth();
  const { bets } = useSports();
  const [from, setFrom] = useState(iso(new Date(Date.now() - 7 * 864e5)));
  const [to, setTo] = useState(iso(new Date()));
  const [applied, setApplied] = useState({ from, to });

  if (!isLoggedIn) return <Navigate to="/auth" replace />;

  const inRange = bets.filter((b) => {
    const d = b.placedAt.slice(0, 10);
    return d >= applied.from && d <= applied.to;
  });

  let head, rows;
  if (type === 'statement') {
    head = ['Date', 'Description', 'Credit', 'Debit', 'Balance'];
    rows = [[new Date().toLocaleDateString('en-GB'), 'Opening Balance', '-', '-', user.balance.toFixed(2)]];
  } else if (type === 'pl') {
    head = ['Event', 'Market', 'P/L'];
    rows = [];
  } else {
    const list = type === 'unsettled' ? bets : inRange;
    head = ['Event', 'Selection', 'Market', 'Type', 'Odds', 'Stake', 'Liability', 'Placed'];
    rows = list.map((b) => [
      b.eventName, b.selection, b.market, b.side.toUpperCase(), b.odds, b.stake, b.liability,
      new Date(b.placedAt).toLocaleString('en-GB'),
    ]);
  }

  return (
    <div className="report">
      <div className="section-head">{TITLES[type]}</div>
      {type !== 'unsettled' && (
        <div className="report-filters">
          <label>
            From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button className="btn-grad small" onClick={() => setApplied({ from, to })}>
            Submit
          </button>
        </div>
      )}
      <div className="table-scroll">
        <table className="report-table">
          <thead>
            <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={head.length} className="no-data">No data found</td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
