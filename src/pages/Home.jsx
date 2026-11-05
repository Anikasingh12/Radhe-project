import OddsTable from '../components/OddsTable';
import { ASSETS, SPORTS } from '../config';
import { useSports } from '../context/SportsContext';
import { HeroCarousel } from './Landing';

const DESKTOP = ASSETS.sportsBanners.map((b) => b.d);
const MOBILE = ASSETS.sportsBanners.map((b) => b.m);

/** Logged-in home: sports banner carousel + 5 events per sport. */
export default function Home() {
  const { events } = useSports();
  return (
    <div className="home-in">
      <HeroCarousel desktop={DESKTOP} mobile={MOBILE} className="hero-sports" />
      {SPORTS.map((s) => (
        <OddsTable
          key={s.key}
          title={s.name}
          events={events.filter((e) => e.sport === s.key)}
          limit={5}
          moreLink={`/game/${s.id}`}
        />
      ))}
    </div>
  );
}
