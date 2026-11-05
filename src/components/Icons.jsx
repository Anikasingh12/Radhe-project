import { ASSETS, SPRITE } from '../config';

/** Sport/casino icon cut from the original sprite sheet. */
export function SportIcon({ name, size = 28, variant }) {
  if (name === 'aviator') return <img className="side-img-icon aviator" src={ASSETS.aviatorIcon} alt="" />;
  if (name === 'chicken')
    return (
      <img
        className="side-img-icon chicken"
        src={variant === 'side' ? ASSETS.chickenIconSide : ASSETS.chickenIcon}
        alt=""
      />
    );
  const y = SPRITE[name] ?? SPRITE.casino;
  const scale = size / 28;
  return (
    <span
      className="sports-icon"
      style={{
        backgroundImage: `url(${ASSETS.sportsSprite})`,
        backgroundPosition: `0 ${y * scale}px`,
        backgroundSize: `${size}px auto`,
        width: size,
        height: size * (24 / 28),
      }}
    />
  );
}

/** TV / BM / Fancy badges shown beside an event name. */
export function MarketBadges({ event }) {
  return (
    <span className="mk-badges">
      {event.tv && <img src={ASSETS.tv} alt="tv" className="mk-tv" />}
      {event.bm && <img src={ASSETS.bm} alt="BM" className="mk-bm" />}
      {event.fancy && <img src={ASSETS.fancy} alt="F" className="mk-f" />}
    </span>
  );
}

// Large (55px-wide sprite) icons used in the In-Play tab strip; offsets from the original CSS.
const BIG = {
  watchlive: '0 -3001px',
  allgames: '-3px -915px',
  cricket: '0 -642px',
  soccer: '0 -2017px',
  tennis: '0 -2155px',
  multimarket: '0 0',
};
export function BigSportIcon({ name }) {
  return (
    <span
      className="sports-icon big-icon"
      style={{ backgroundImage: `url(${ASSETS.sportsSprite})`, backgroundPosition: BIG[name], backgroundSize: '55px auto' }}
    />
  );
}
