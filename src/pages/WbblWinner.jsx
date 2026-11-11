import { useState } from 'react';
import BetSlip from '../components/BetSlip';
import { OddsCell } from '../components/OddsTable';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';
import { WBBL_BOOKMAKER, WBBL_EVENT, WBBL_WINNER } from '../data/wbbl';
import { BackLayHead, MarketBar } from './Event';

const p2 = (n) => String(n).padStart(2, '0');
const fmtDate = (iso) => {
  const d = new Date(iso);
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
};
const fmtSize = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toFixed(1));
const pad3 = (arr) => [0, 1, 2].map((i) => arr[i]);

/** /wbbl: the WBBL tournament page (Winner 2026 + Winner Cup Bookmaker), like the original. */
export default function WbblWinner() {
  const { setSlip } = useSports();
  const { requireLogin } = useAuth();
  const [open, setOpen] = useState({ mo: true, bm: true });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const choose = (patch) =>
    requireLogin(() => setSlip({ eventId: WBBL_EVENT.id, eventName: 'WBBL', stake: '', ...patch }));

  return (
    <div className="event-page wbbl-page">
      <div className="wbbl-title">
        <span className="mkt-pin">
          <i className="fas fa-thumbtack" />
        </span>
        <span>{WBBL_EVENT.title}</span>
      </div>
      <div className="wbbl-info">
        <span>
          <i className="fas fa-stopwatch" /> {fmtDate(WBBL_EVENT.openDate)}
        </span>
        <span>
          Min: {WBBL_EVENT.min} | Max: {WBBL_EVENT.max}
        </span>
      </div>

      {/* ---------------- Winner 2026 ---------------- */}
      <section className="market">
        <MarketBar title={WBBL_WINNER.name} min={WBBL_WINNER.min} max={WBBL_WINNER.max} open={open.mo} onToggle={() => toggle('mo')} />
        {open.mo && (
          <>
            <BackLayHead min={WBBL_WINNER.min} max={WBBL_WINNER.max} />
            {WBBL_WINNER.runners.map((r) => (
              <div className="mkt-row" key={r.name}>
                <div className="runner">{r.name}</div>
                <div className="depth">
                  {pad3(r.back).reverse().map((x, j) => (
                    <OddsCell
                      key={`b${j}`}
                      side="back"
                      className={j < 2 ? 'desktop-only light' : ''}
                      value={x?.[0]}
                      sub={x && fmtSize(x[1])}
                      onClick={() => x && choose({ market: WBBL_WINNER.name, selection: r.name, side: 'back', odds: x[0] })}
                    />
                  ))}
                  {pad3(r.lay).map((x, j) => (
                    <OddsCell
                      key={`l${j}`}
                      side="lay"
                      className={j > 0 ? 'desktop-only light' : ''}
                      value={x?.[0]}
                      sub={x && fmtSize(x[1])}
                      onClick={() => x && choose({ market: WBBL_WINNER.name, selection: r.name, side: 'lay', odds: x[0] })}
                    />
                  ))}
                </div>
              </div>
            ))}
            <BetSlip market={WBBL_WINNER.name} eventId={WBBL_EVENT.id} />
          </>
        )}
      </section>

      {/* ---------------- Winner Cup Bookmaker ---------------- */}
      <section className="market">
        <MarketBar title={WBBL_BOOKMAKER.name} min={WBBL_BOOKMAKER.min} max={WBBL_BOOKMAKER.max} open={open.bm} onToggle={() => toggle('bm')} />
        {open.bm && (
          <>
            <BackLayHead min={WBBL_BOOKMAKER.min} max={WBBL_BOOKMAKER.max} />
            {WBBL_BOOKMAKER.runners.map((r) => (
              <div className="mkt-row" key={r.name}>
                <div className="runner">{r.name}</div>
                <div className={`depth ${r.suspended ? 'is-suspended' : ''}`}>
                  {[...r.back].reverse().map((v, j) => (
                    <OddsCell
                      key={`b${j}`}
                      side="back"
                      className={j < 2 ? 'desktop-only light' : ''}
                      value={v}
                      onClick={() => choose({ market: WBBL_BOOKMAKER.name, selection: r.name, side: 'back', odds: v })}
                    />
                  ))}
                  {[0, 1, 2].map((j) => (
                    <OddsCell key={`l${j}`} side="lay" className={j > 0 ? 'desktop-only light' : ''} />
                  ))}
                  {r.suspended && <div className="row-suspended">Suspended</div>}
                </div>
              </div>
            ))}
            <BetSlip market={WBBL_BOOKMAKER.name} eventId={WBBL_EVENT.id} />
          </>
        )}
      </section>
    </div>
  );
}
