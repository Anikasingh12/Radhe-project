import { ASSETS } from '../config';

/** Provider logos + 18+ notice (the original renders only these in its footer). */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="providers">
        {ASSETS.providers.map((p) => (
          <picture key={p.name} className="provider-cell">
            <source media="(max-width: 767px)" srcSet={p.m} />
            <img src={p.img} alt={p.name} />
          </picture>
        ))}
        <picture className="provider-cell p18">
          <source media="(max-width: 767px)" srcSet={ASSETS.plus18.replace('loginimages/', 'loginimages/mobile/')} />
          <img src={ASSETS.plus18} alt="18+" className="plus18" />
        </picture>
      </div>
      <p className="disclaimer rules">
        You must be over 18 years old, or the legal age at which gambling or gaming activities are allowed under the
        law or jurisdiction that applies to you. You must reside in a country in which access to online gambling to its
        residents.
      </p>
    </footer>
  );
}
