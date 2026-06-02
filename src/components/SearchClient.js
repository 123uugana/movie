"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";

function searchHref(query, page) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("query", query.trim());
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params.toString() ? `/search?${params.toString()}` : "/search";
}

export default function SearchClient({ currentPage, initialQuery, movies, totalPages, totalResults }) {
  return (
    <main className="page simple-page">
      <h1>Search</h1>

      {initialQuery ? (
        <p className="search-summary">
          {totalResults} results for &quot;{initialQuery}&quot;
        </p>
      ) : null}

      {!initialQuery ? (
        <div className="empty-box">Search movies from TMDB.</div>
      ) : movies.length === 0 ? (
        <div className="empty-box">No movie found.</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {initialQuery && totalPages > 1 ? (
        <nav className="pagination search-pagination" aria-label="Search pagination">
          <Link
            href={searchHref(initialQuery, Math.max(1, currentPage - 1))}
            className={`pagination-step ${currentPage === 1 ? "disabled" : ""}`}
            aria-disabled={currentPage === 1}
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
            <span>Previous</span>
          </Link>

          <span className="search-page-count">
            Page {currentPage} of {totalPages}
          </span>

          <Link
            href={searchHref(initialQuery, Math.min(totalPages, currentPage + 1))}
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
