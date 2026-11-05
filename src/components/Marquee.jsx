import { useEffect, useState } from 'react';
import * as api from '../api';

/** Logged-in announcement bar: fixed to the bottom on desktop, under the header on mobile. */
export default function Marquee() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api.getMarquee().then((r) => setMsg(r.message));
  }, []);
  if (!msg) return null;
  return (
    <div className="news-bar">
      <i className="fas fa-bullhorn desktop-only news-icon" />
      <div className="news-marquee">
        <div className="news-track">
          <span>{msg}</span>
          <span>{msg}</span>
        </div>
      </div>
    </div>
  );
}
