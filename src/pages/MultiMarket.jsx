import OddsTable from '../components/OddsTable';
import { useSports } from '../context/SportsContext';

/** Events the user pinned with the pin button. */
export default function MultiMarket() {
  const { events, pins } = useSports();
  const list = events.filter((e) => pins.includes(e.id));
  return (
    <OddsTable
      title="Multi Markets"
      events={list}
      emptyText="There are currently no followed multi markets."
    />
  );
}
