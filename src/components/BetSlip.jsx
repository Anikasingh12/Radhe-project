import { stakeLabel } from '../config';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';

const round2 = (n) => Math.round(n * 100) / 100;

const oddsStep = (o) => (o < 2 ? 0.01 : o < 3 ? 0.02 : o < 4 ? 0.05 : o < 6 ? 0.1 : o < 10 ? 0.2 : 0.5);

/**
 * Inline place-bet row rendered directly under the market that was clicked
 * (desktop: one-line form + stake buttons; mobile: steppers + keypad).
 */
export default function BetSlip({ market, eventId, variant = 'event' }) {
  const { slip, setSlip, placeBet, placing } = useSports();
  const { stakes } = useAuth();
  if (!slip || (market && slip.market !== market)) return null;
  if (eventId && slip.eventId !== eventId) return null;
  if ((slip.source || 'event') !== variant) return null;
  const isList = variant === 'list';

  const set = (patch) => setSlip((s) => ({ ...s, ...patch }));
  const fixedOdds = slip.market !== 'Match Odds';
  const stepOdds = (dir) => {
    if (fixedOdds) return;
    set({ odds: Math.max(1.01, round2(slip.odds + dir * oddsStep(slip.odds))) });
  };
  const stepStake = (dir) => set({ stake: String(Math.max(0, (Number(slip.stake) || 0) + dir * 100) || '') });
  const key = (k) => {
    const cur = String(slip.stake || '');
    if (k === 'del') return set({ stake: cur.slice(0, -1) });
    if (k === '.' && cur.includes('.')) return;
    set({ stake: (cur + k).slice(0, 9) });
  };
  const stake = Number(slip.stake) || 0;

  const steppers = (
    <>
      <div className="slip-stepper">
        <button className="minus" onClick={() => stepOdds(-1)}>
          <i className="fa fa-minus" />
        </button>
        <input
          className={isList ? 'odds-ro' : ''}
          value={slip.odds}
          readOnly={fixedOdds || isList}
          onChange={(e) => set({ odds: e.target.value })}
        />
        <button className="plus" onClick={() => stepOdds(1)}>
          <i className="fa fa-plus" />
        </button>
      </div>
      <div className="slip-stepper">
        <button className="minus" onClick={() => stepStake(-1)}>
          <i className="fa fa-minus" />
        </button>
        <input
          value={slip.stake}
          inputMode="numeric"
          autoFocus
          onChange={(e) => set({ stake: e.target.value.replace(/[^\d.]/g, '') })}
        />
        <button className="plus" onClick={() => stepStake(1)}>
          <i className="fa fa-plus" />
        </button>
      </div>
    </>
  );

  const stakeBtns = stakes.map((s) => (
    <button key={s} className="slip-stake" onClick={() => set({ stake: String(s) })}>
      {stakeLabel(s)}
    </button>
  ));

  const place = (
    <button className="slip-place" disabled={!stake || placing} onClick={placeBet}>
      {placing ? <i className="fas fa-spinner fa-spin" /> : 'Place Bet'}
    </button>
  );
  const cancel = (
    <button className="slip-cancel" onClick={() => setSlip(null)}>
      Cancel
    </button>
  );

  return (
    <div className={`inline-slip ${slip.side}`}>
      {/* Desktop */}
      <div className="desktop-only">
        <div className="slip-row1">
          <span className="slip-title">
            {slip.selection} {!isList && <em>- {slip.market.toUpperCase()}</em>}
          </span>
          {steppers}
        </div>
        <div className="slip-row2">
          {stakeBtns}
          {place}
          {cancel}
        </div>
      </div>

      {/* Mobile */}
      <div className="mobile-only slip-mobile">
        <div className="slip-row1">{steppers}</div>
        <div className="slip-stakes-m">{stakeBtns}</div>
        <div className="keypad">
          {['1', '2', '3', '4', '5', '6'].map((k) => (
            <button key={k} onClick={() => key(k)}>{k}</button>
          ))}
          <button className="kp-del" onClick={() => key('del')} aria-label="backspace">
            <i className="fas fa-backspace" />
          </button>
          {['7', '8', '9', '0', '00', '.'].map((k) => (
            <button key={k} onClick={() => key(k)}>{k}</button>
          ))}
        </div>
        <div className="slip-actions-m">
          {cancel}
          {place}
        </div>
      </div>
    </div>
  );
}

/** Right-hand "Matched Bet" panel. */
export function MatchedBets({ eventId }) {
  const { bets } = useSports();
  const list = eventId ? bets.filter((b) => b.eventId === eventId) : bets;
  return (
    <aside className="right-panel desktop-only">
      <div className="rp-title">Matched Bet</div>
      <MatchedTable list={list} showEmpty={!!eventId} />
    </aside>
  );
}

export function MatchedTable({ list, showEmpty = true }) {
  return (
    <table className="rp-table">
      <thead>
        <tr>
          <th>Matched Bet</th>
          <th>Odds</th>
          <th>Stake</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          !showEmpty ? null : (
          <tr>
            <td colSpan={3} className="no-bets">
              No bets found...
            </td>
          </tr>
          )
        ) : (
          list.map((b) => (
            <tr key={b.id} className={b.side}>
              <td>
                {b.selection}
                <small>{b.market}</small>
              </td>
              <td>{b.odds}</td>
              <td>{b.stake}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
