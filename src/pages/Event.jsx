import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../api';
import BetSlip, { MatchedTable } from '../components/BetSlip';
import { OddsCell } from '../components/OddsTable';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';

const fmtSize = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toFixed(1));
const p2 = (n) => String(n).padStart(2, '0');
const fmtDate = (iso) => {
  const d = new Date(iso);
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
};

/** Teal market bar: pin, title, min/max, collapse toggle. */
export function MarketBar({ title, min, max, open, onToggle }) {
  return (
    <div className="mkt-bar">
      <span className="mkt-pin">
        <i className="fas fa-thumbtack" />
      </span>
      <span className="mkt-name">{title}</span>
      <span className="mkt-limits desktop-only">
        Min: {min} | Max: {max}
      </span>
      <button className="mkt-toggle" onClick={onToggle} aria-label="collapse">
        <i className={`fas fa-${open ? 'minus' : 'plus'}`} />
      </button>
    </div>
  );
}

/** Row above the price grid holding the rounded Back / Lay tabs. */
export function BackLayHead({ min, max, labels = ['Back', 'Lay'], cols = 6 }) {
  return (
    <div className="bl-head">
      <span className="mobile-only bl-limits">
        Min: {min} | Max: {max}
      </span>
      <div className={`bl-tabs cols-${cols}`}>
        <span className={labels[0] === 'Back' ? 'tab-back' : 'tab-lay'}>{labels[0]}</span>
        <span className={labels[1] === 'Lay' ? 'tab-lay' : 'tab-back'}>{labels[1]}</span>
      </div>
    </div>
  );
}

const FANCY_TABS = [
  ['all', 'All'],
  ['overs', 'OVERS'],
  ['single', 'SINGLE OVER'],
  ['batsman', 'BATSMAN'],
];

export default function Event() {
  const { id } = useParams();
  const { events, setSlip, bets } = useSports();
  const { requireLogin } = useAuth();
  const [open, setOpen] = useState({ mo: true, bm: true, fancy: true });
  const [fancyTab, setFancyTab] = useState('all');
  const [mTab, setMTab] = useState('market');
  const e = events.find((x) => x.id === id);

  const depths = useMemo(() => (e ? e.odds.map(api.depth) : []), [e]);
  const bm = useMemo(() => (e?.bm ? api.bookmaker(e) : []), [e]);
  const fancy = useMemo(() => (e?.fancy ? api.fancyMarkets(e) : []), [e]);

  if (!e) {
    return (
      <div className="empty-page">
        Event not found. <Link to="/inplay">Go to In-Play</Link>
      </div>
    );
  }

  const eventBets = bets.filter((b) => b.eventId === e.id);
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const choose = (patch) => requireLogin(() => setSlip({ eventId: e.id, eventName: e.name, stake: '', ...patch }));

  // Running position per runner for a market.
  const pos = (selection, market) =>
    eventBets
      .filter((b) => b.market === market)
      .reduce((acc, b) => {
        const dec = market === 'Bookmaker' ? 1 + b.odds / 100 : b.odds;
        const isSel = b.selection === selection;
        if (b.side === 'back') return acc + (isSel ? (dec - 1) * b.stake : -b.stake);
        return acc + (isSel ? -(dec - 1) * b.stake : b.stake);
      }, 0);
  const Pos = ({ v }) => (v ? <span className={v > 0 ? 'pos-green' : 'pos-red'}>{v.toFixed(2)}</span> : null);

  const runners = e.runners.map((r, i) => ({ r, i })).filter(({ i }) => e.odds[i] || i !== 1);
  const fancyCounts = fancy.reduce((c, f) => ({ ...c, [f.cat]: (c[f.cat] || 0) + 1 }), {});
  const fancyList = fancyTab === 'all' ? fancy : fancy.filter((f) => f.cat === fancyTab);

  return (
    <div className="event-page">
      <div className="event-title">
        <span>
          {e.name} - {e.competition}
        </span>
        <span>{fmtDate(e.start)}</span>
      </div>

      <div className="m-tabs mobile-only">
        <button className={mTab === 'market' ? 'active' : ''} onClick={() => setMTab('market')}>
          Market
        </button>
        <button className={mTab === 'bets' ? 'active' : ''} onClick={() => setMTab('bets')}>
          Open Bets ({eventBets.length})
        </button>
      </div>

      {mTab === 'bets' ? (
        <div className="mobile-only">
          <MatchedTable list={eventBets} />
        </div>
      ) : null}

      <div className={mTab === 'bets' ? 'desktop-only' : ''}>
        {/* ---------------- Match Odds ---------------- */}
        <section className="market">
          <MarketBar title="Match Odds" min="100.00" max="10000.00" open={open.mo} onToggle={() => toggle('mo')} />
          {open.mo && (
            <>
              <BackLayHead min="100.00" max="10000.00" />
              {runners.map(({ r, i }) => {
                const d = depths[i];
                const susp = e.suspended || !e.odds[i];
                return (
                  <div className="mkt-row" key={r}>
                    <div className="runner">
                      {r}
                      <Pos v={pos(r, 'Match Odds')} />
                    </div>
                    <div className={`depth ${susp ? 'is-suspended' : ''}`}>
                      {d.back.map((x, j) => (
                        <OddsCell
                          key={`b${j}`}
                          side="back"
                          className={j < 2 ? 'desktop-only light' : ''}
                          value={x?.price}
                          sub={x && fmtSize(x.size)}
                          onClick={() => choose({ market: 'Match Odds', selection: r, side: 'back', odds: x.price })}
                        />
                      ))}
                      {d.lay.map((x, j) => (
                        <OddsCell
                          key={`l${j}`}
                          side="lay"
                          className={j > 0 ? 'desktop-only light' : ''}
                          value={x?.price}
                          sub={x && fmtSize(x.size)}
                          onClick={() => choose({ market: 'Match Odds', selection: r, side: 'lay', odds: x.price })}
                        />
                      ))}
                      {susp && <div className="row-suspended">Suspended</div>}
                    </div>
                  </div>
                );
              })}
              <BetSlip market="Match Odds" eventId={e.id} />
            </>
          )}
        </section>

        {/* ---------------- Bookmaker ---------------- */}
        {bm.length > 0 && (
          <section className="market">
            <MarketBar title="Bookmaker 0 Commission" min="100.00" max="300000.00" open={open.bm} onToggle={() => toggle('bm')} />
            {open.bm && (
              <>
                <BackLayHead min="100.00" max="300000.00" />
                {bm.map((b) => (
                  <div className="mkt-row" key={b.runner}>
                    <div className="runner">
                      {b.runner}
                      <Pos v={pos(b.runner, 'Bookmaker')} />
                    </div>
                    <div className={`depth ${b.suspended ? 'is-suspended' : ''}`}>
                      {[0, 1, 2].map((j) => (
                        <OddsCell
                          key={`b${j}`}
                          side="back"
                          className={j < 2 ? 'desktop-only light' : ''}
                          value={b.back[j]}
                          sub={b.size}
                          onClick={() => choose({ market: 'Bookmaker', selection: b.runner, side: 'back', odds: b.back[j] })}
                        />
                      ))}
                      {[0, 1, 2].map((j) => (
                        <OddsCell
                          key={`l${j}`}
                          side="lay"
                          className={j > 0 ? 'desktop-only light' : ''}
                          value={b.lay[j]}
                          sub={b.size}
                          onClick={() => choose({ market: 'Bookmaker', selection: b.runner, side: 'lay', odds: b.lay[j] })}
                        />
                      ))}
                      {b.suspended && <div className="row-suspended">Suspended</div>}
                    </div>
                  </div>
                ))}
                <BetSlip market="Bookmaker" eventId={e.id} />
              </>
            )}
          </section>
        )}

        {/* ---------------- Fancy ---------------- */}
        {fancy.length > 0 && (
          <section className="market fancy">
            <div className="fancy-tab-row">
              <div className="fancy-tab">
                Fancy
                <button className="mkt-toggle mobile-only" onClick={() => toggle('fancy')} aria-label="collapse">
                  <i className={`fas fa-${open.fancy ? 'minus' : 'plus'}`} />
                </button>
              </div>
            </div>
            {open.fancy && (
              <>
                <div className="fancy-bar">
                  {FANCY_TABS.map(([k, l]) => (
                    <button key={k} className={fancyTab === k ? 'active' : ''} onClick={() => setFancyTab(k)}>
                      {l}
                      {k !== 'all' && fancyCounts[k] > 0 && <em>{fancyCounts[k]}</em>}
                    </button>
                  ))}
                  <button className="mkt-toggle desktop-only" onClick={() => toggle('fancy')} aria-label="collapse">
                    <i className="fas fa-minus" />
                  </button>
                </div>
                <div className="fancy-head">
                  <span />
                  <span className="nh">
                    <span>No</span>
                    <span>Yes</span>
                  </span>
                  <span className="desktop-only" />
                </div>
                {fancyList.map((f) => (
                  <div className="mkt-row fancy-row" key={f.id}>
                    <div className="runner fancy-name">
                      <span className="mkt-pin small">
                        <i className="fas fa-thumbtack" />
                      </span>
                      {f.name}
                    </div>
                    <div className={`depth fancy-cells ${f.suspended ? 'is-suspended' : ''}`}>
                      <OddsCell side="lay" value={f.no} sub={f.noRate}
                        onClick={() => choose({ market: 'Fancy', selection: f.name, side: 'lay', odds: f.no })} />
                      <OddsCell side="back" value={f.yes} sub={f.yesRate}
                        onClick={() => choose({ market: 'Fancy', selection: f.name, side: 'back', odds: f.yes })} />
                      {f.suspended && <div className="row-suspended">Suspended</div>}
                    </div>
                    <div className="fancy-limits desktop-only">
                      <span className="d-block">Max:{f.max}</span>
                      <span className="d-block">MKT:{f.mkt}</span>
                    </div>
                  </div>
                ))}
                <BetSlip market="Fancy" eventId={e.id} />
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
