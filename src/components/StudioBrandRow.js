import Link from "next/link";
import { studios } from "@/lib/studios";

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
          <Link
            className="studio-brand-card"
            href={`/studios/${studio.slug}`}
            aria-label={`View ${studio.name} movies`}
            prefetch={false}
            key={studio.name}
          >
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
          </Link>
        ))}
      </div>
    </section>
  );
}
