import { Link, useNavigate, useLocation } from "react-router-dom";

import { allArrangements as ritt, type Discipline, type RittEntry } from "../lib/arrangements";
import { DISCIPLINE_LABEL_WITH_EMOJI } from "../lib/disciplines";

type Race = RittEntry;

const DISCIPLINE_ORDER: Discipline[] = ["terreng", "landevei", "langrenn", "triathlon", "ultraløp"];

function groupByDiscipline(races: Race[]): Map<Discipline, Race[]> {
  const sorted = [...races].sort(
    (a, b) => new Date(a.officialDate + "T00:00:00").getTime() - new Date(b.officialDate + "T00:00:00").getTime()
  );
  const grouped = new Map<Discipline, Race[]>();
  for (const discipline of DISCIPLINE_ORDER) grouped.set(discipline, []);
  for (const race of sorted) {
    if (grouped.has(race.discipline)) {
      grouped.get(race.discipline)!.push(race);
    }
  }
  return grouped;
}

// Computed once at module load — derived from static ritt data.
const grouped = groupByDiscipline(ritt);

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/arrangement\/([^/]+)/);
  const currentId = match ? match[1] : "";
  const isLopPage = location.pathname.startsWith("/lop");
  const isGpxPage = location.pathname.startsWith("/gpx");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value) void navigate(`/arrangement/${value}`);
  }

  return (
    <div className="site-nav-wrapper">
      <nav className="site-nav">
        <Link to="/" className="site-nav__logo">
          Løypevær
        </Link>
        <div className="site-nav__selector">
          <Link
            to="/lop"
            className={`site-nav__gpx-link${isLopPage ? " site-nav__gpx-link--active" : ""}`}
          >
            Kortere løp
          </Link>
          <span className="site-nav__divider" aria-hidden="true" />
          <Link to="/gpx" className={`site-nav__gpx-link${isGpxPage ? " site-nav__gpx-link--active" : ""}`}>
            Din egen løype
          </Link>
          <span className="site-nav__divider" aria-hidden="true" />
          <select
            className="site-nav__select"
            value={currentId}
            onChange={handleChange}
            aria-label="Velg arrangement"
          >
            <option value="" disabled>
              Velg arrangement…
            </option>
            {DISCIPLINE_ORDER.filter((d) => (grouped.get(d)?.length ?? 0) > 0).map((d) => (
              <optgroup key={d} label={DISCIPLINE_LABEL_WITH_EMOJI[d]}>
                {grouped.get(d)!.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.distance} km
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </nav>
    </div>
  );
}
