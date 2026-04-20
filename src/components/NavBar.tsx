import { Link, useNavigate, useLocation } from "react-router-dom";
import { allArrangements as ritt, getNextRitt, type RittEntry } from "../lib/ritt";

type Race = RittEntry;

function groupByYear(races: Race[]): Map<number, Race[]> {
  const sorted = [...races].sort(
    (a, b) => new Date(a.officialDate + "T00:00:00").getTime() - new Date(b.officialDate + "T00:00:00").getTime()
  );
  const grouped = new Map<number, Race[]>();
  for (const race of sorted) {
    const year = new Date(race.officialDate + "T00:00:00").getFullYear();
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(race);
  }
  return grouped;
}

// Computed once at module load — both are derived from static ritt data.
const grouped = groupByYear(ritt);
const years = [...grouped.keys()].sort((a, b) => b - a);
const nextId = getNextRitt(ritt)?.id ?? ritt[0]?.id ?? "";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/ritt\/([^/]+)/);
  const currentId = match ? match[1] : "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value) void navigate(`/ritt/${value}`);
  }

  return (
    <div className="site-nav-wrapper">
      <nav className="site-nav">
        <Link to="/" className="site-nav__logo">
          Startstreken
        </Link>
        <div className="site-nav__selector">
          <select
            className="site-nav__select"
            value={currentId}
            onChange={handleChange}
            aria-label="Velg arrangement"
          >
            <option value="" disabled>
              Velg arrangement…
            </option>
            {years.map((year) => (
              <optgroup key={year} label={String(year)}>
                {grouped.get(year)!.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.distance} km
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {nextId && (
            <Link to={`/ritt/${nextId}`} className="site-nav__cta">
              Sjekk været →
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
