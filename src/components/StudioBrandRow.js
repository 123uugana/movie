const studios = [
  {
    name: "Disney+",
    className: "disney",
    label: "Disney+",
  },
  {
    name: "Star Wars",
    className: "star-wars",
    label: "STAR\nWARS",
  },
  {
    name: "Marvel",
    className: "marvel",
    label: "MARVEL",
  },
  {
    name: "Pixar",
    className: "pixar",
    label: "PIXAR",
  },
  {
    name: "Paramount",
    className: "paramount",
    label: "Paramount",
  },
  {
    name: "National Geographic",
    className: "national-geographic",
    label: "NATIONAL\nGEOGRAPHIC",
  },
];

function StudioLogo({ studio }) {
  return (
    <span className={`studio-logo ${studio.className}`}>
      {studio.label.split("\n").map((line) => (
        <span key={line}>{line}</span>
      ))}
    </span>
  );
}

export default function StudioBrandRow() {
  return (
    <section className="studio-brand-row" aria-label="Featured studios">
      <div className="studio-brand-grid">
        {studios.map((studio) => (
          <button className="studio-brand-card" type="button" key={studio.name}>
            <span className={`studio-card-motion ${studio.className}`} aria-hidden="true" />
            <StudioLogo studio={studio} />
            <span className="studio-card-overlay" aria-hidden="true">
              <StudioLogo studio={studio} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
