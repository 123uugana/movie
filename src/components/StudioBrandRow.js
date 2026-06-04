const studios = [
  {
    name: "Disney+",
    className: "disney",
    label: "Disney+",
    video: "https://sphereplus.vercel.app/imgs/disney-vv.mp4",
  },
  {
    name: "Star Wars",
    className: "star-wars",
    label: "STAR\nWARS",
    video: "https://sphereplus.vercel.app/imgs/starwars-v.mp4",
  },
  {
    name: "Marvel",
    className: "marvel",
    label: "MARVEL",
    video: "https://sphereplus.vercel.app/imgs/marvel-v.mp4",
  },
  {
    name: "Pixar",
    className: "pixar",
    label: "PIXAR",
    video: "https://sphereplus.vercel.app/imgs/pixar-v.mp4",
  },
  {
    name: "Paramount",
    className: "paramount",
    label: "Paramount",
    video: "https://sphereplus.vercel.app/imgs/paramount-v.mp4",
  },
  {
    name: "National Geographic",
    className: "national-geographic",
    label: "NATIONAL\nGEOGRAPHIC",
    video: "https://sphereplus.vercel.app/imgs/ngeo-v.mp4",
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
            <video
              className="studio-card-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={studio.video} type="video/mp4" />
            </video>
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
