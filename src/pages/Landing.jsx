import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import OddsTable from '../components/OddsTable';
import { ASSETS, SPORTS } from '../config';
import { useAuth } from '../context/AuthContext';
import { useSports } from '../context/SportsContext';

export function HeroCarousel({ desktop = ASSETS.heroDesktop, mobile = ASSETS.heroMobile, className = '' }) {
  const [i, setI] = useState(0);
  const n = desktop.length;
  const touch = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [n, i]);

  const go = (d) => setI((x) => (x + d + n) % n);

  return (
    <div
      className={`hero ${className}`}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touch.current ?? 0);
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="hero-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {desktop.map((src, k) => (
          <picture key={src} className="hero-slide">
            <source media="(max-width: 767px)" srcSet={mobile[k]} />
            <img src={src} alt={`banner ${k + 1}`} loading={k ? 'lazy' : 'eager'} />
          </picture>
        ))}
      </div>
      <button className="hero-nav prev" onClick={() => go(-1)} aria-label="Previous">
        <i className="fas fa-chevron-left" />
      </button>
      <button className="hero-nav next" onClick={() => go(1)} aria-label="Next">
        <i className="fas fa-chevron-right" />
      </button>
      <div className="hero-dots">
        {desktop.map((_, k) => (
          <button key={k} className={k === i ? 'active' : ''} onClick={() => setI(k)} aria-label={`${k + 1}`} />
        ))}
      </div>
    </div>
  );
}

function TopGames() {
  const ref = useRef(null);
  const { requireLogin } = useAuth();
  const scroll = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <section className="top-games">
      <h3>Top Games</h3>
      <div className="tg-wrap">
        <button className="tg-nav prev" onClick={() => scroll(-1)} aria-label="Previous">
          <i className="fas fa-chevron-left" />
        </button>
        <div className="tg-track" ref={ref}>
          {ASSETS.topGames.map((src) => (
            <button key={src} className="tg-item" onClick={() => requireLogin()}>
              <img src={src} alt="game" loading="lazy" />
            </button>
          ))}
        </div>
        <button className="tg-nav next" onClick={() => scroll(1)} aria-label="Next">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </section>
  );
}

/** Logged-out landing page (/auth, and /home when logged out). */
export default function Landing() {
  const { events } = useSports();
  return (
    <div className="home">
      <HeroCarousel />

      <div className="promos">
        {ASSETS.promos.map((p) => (
          <Link key={p.img} to={p.to}>
            <img src={p.img} alt="" />
          </Link>
        ))}
      </div>

      <div className="gif-banners">
        {ASSETS.gifBanners.map((g, k) => (
          <Link key={g} to={k ? '/royalcasino' : '/ezugi'}>
            <img src={g} alt="" />
          </Link>
        ))}
      </div>

      <TopGames />

      {SPORTS.map((s) => (
        <OddsTable
          key={s.key}
          title={s.name}
          events={events.filter((e) => e.sport === s.key)}
          limit={3}
          moreLink={`/game/${s.id}`}
        />
      ))}

      <a className="apk-banner" href="#" onClick={(e) => e.preventDefault()}>
        <img src={ASSETS.apkBanner} alt="Download APK" />
      </a>
    </div>
  );
}
