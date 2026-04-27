import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EventCard } from "../components/EventCard";
import { useMyEvents } from "../hooks/useMyEvents";
import { allArrangements } from "../lib/arrangements";
import { SITE_URL } from "../lib/seo";

const lopingRaces = allArrangements.filter((r) => r.discipline === "løping");

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCountdown(dateStr: string): string {
  const diff = daysUntil(dateStr);
  if (diff === 0) return "i dag";
  if (diff === 1) return "i morgen";
  if (diff === -1) return "i går";
  if (diff > 0) return `om ${diff} dager`;
  return `${Math.abs(diff)} dager siden`;
}

export function LopPage() {
  const { isPlanned, add, remove } = useMyEvents();

  const sorted = useMemo(
    () =>
      [...lopingRaces].sort(
        (a, b) =>
          new Date(a.officialDate + "T00:00:00").getTime() -
          new Date(b.officialDate + "T00:00:00").getTime()
      ),
    []
  );

  const pageTitle = "Løping – Løypevær";
  const description = `Værvarsler for ${lopingRaces.length} norske løp — bare sanntidsvarsler, ingen historikk.`;
  const pageUrl = `${SITE_URL}/lop`;

  function handleToggle(id: string, officialDate: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (isPlanned(id)) {
      remove(id);
    } else {
      add(id, { date: officialDate, startTime: "", finishTime: "" });
    }
  }

  return (
    <div className="home-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="nb_NO" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <section className="home-page__hero">
        <div className="home-page__hero-eyebrow">Løping</div>
        <h1>Sjekk været.<br />Løp forberedt.</h1>
        <p className="home-page__hero-sub">
          Sanntidsvarsler for hvert nøkkelpunkt langs ruten — kun for løp innenfor
          16-dagersvinduet. Ingen historikk, bare aktuelt vær.
        </p>
        <div className="home-page__hero-stats">
          <span><strong>{lopingRaces.length}</strong> løp</span>
        </div>
      </section>

      <main className="home-page__sections">
        {sorted.length === 0 && (
          <p className="home-page__empty">Ingen løp lagt til ennå.</p>
        )}
        {sorted.length > 0 && (
          <section className="home-page__year-section">
            <div className="home-page__grid">
              {sorted.map((r) => (
                <EventCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  officialDate={r.officialDate}
                  distance={r.distance}
                  distanceLabel={r.distanceLabel}
                  region={r.region}
                  discipline={r.discipline}
                  countdown={formatCountdown(r.officialDate)}
                  planned={isPlanned(r.id)}
                  isPast={daysUntil(r.officialDate) < 0}
                  dateStatus={r.dateStatus}
                  onTogglePlanned={(e) => handleToggle(r.id, r.officialDate, e)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="home-page__cta-banner" style={{ marginTop: "var(--space-xl)" }}>
        <div className="home-page__cta-banner-text">
          <div className="home-page__cta-banner-eyebrow">Sykkel, langrenn og triathlon?</div>
          <h2>Se alle utholdenhetsarrangement</h2>
          <p>Sjekk værvarsler og historiske klimasnitt for lange ritt, langrenn og triathlon.</p>
        </div>
        <div className="home-page__cta-banner-action">
          <Link to="/" className="home-page__cta-banner-btn">
            Tilbake til oversikt →
          </Link>
        </div>
      </div>
    </div>
  );
}
