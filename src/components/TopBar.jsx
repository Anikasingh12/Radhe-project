import { useEffect, useState } from 'react';
import { MARQUEE_TEXT } from '../config';

const fmt = (d) => {
  const p = (n) => String(n).padStart(2, '0');
  const mon = d.toLocaleString('en-GB', { month: 'short' });
  return `${p(d.getDate())} ${mon} ${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export default function TopBar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="topbar">
      <i className="fas fa-bullhorn topbar-icon" />
      <div className="marquee">
        <div className="marquee-track">
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>
      <span className="topbar-time">{fmt(now)}</span>
    </div>
  );
}
