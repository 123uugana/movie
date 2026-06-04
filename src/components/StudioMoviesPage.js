import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "start-ellipsis", currentPage, "end-ellipsis", totalPages];
}

function studioPageHref(basePath, page) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export default function StudioMoviesPage({
  basePath,
  currentPage,
  movies,
  studio,
  totalPages,
  totalResults,
}) {
  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <main className="page popular-page">
      <div className="popular-header studio-results-header">
        <h1>{studio.name} Movies</h1>
        <p>{totalResults} movies from TMDB</p>
      </div>

      {movies.length === 0 ? (
        <div className="empty-box">No movies found.</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="pagination" aria-label={`${studio.name} pagination`}>
          <Link
            href={studioPageHref(basePath, Math.max(1, currentPage - 1))}
            className={`pagination-step ${currentPage === 1 ? "disabled" : ""}`}
            aria-disabled={currentPage === 1}
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
            <span>Previous</span>
          </Link>

          <div className="pagination-pages">
            {pageItems.map((item) =>
              typeof item === "number" ? (
                <Link
                  href={studioPageHref(basePath, item)}
                  className={`pagination-number ${item === currentPage ? "active" : ""}`}
                  aria-current={item === currentPage ? "page" : undefined}
                  key={item}
                >
                  {item}
                </Link>
              ) : (
                <span className="pagination-ellipsis" key={item}>
                  ...
                </span>
              ),
            )}
          </div>

          <Link
            href={studioPageHref(basePath, Math.min(totalPages, currentPage + 1))}
            className={`pagination-step ${currentPage === totalPages ? "disabled" : ""}`}
            aria-disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <ChevronRight size={24} strokeWidth={2.2} />
          </Link>
        </nav>
      ) : null}
    </main>
  );
}
