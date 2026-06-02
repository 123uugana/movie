"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";

function getGenresFromParams(searchParams, genres) {
  const genreValues = searchParams.getAll("genre").flatMap((genreValue) => genreValue.split(","));

  return [...new Set(
    genreValues
      .map((genre) => genre.trim())
      .filter((genre) => genre && genre !== "All" && genres.includes(genre)),
  )];
}

function genreHref(pathname, selectedGenres, page) {
  const params = new URLSearchParams();

  if (selectedGenres.length > 0) {
    params.set("genre", selectedGenres.join(","));
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params.toString() ? `${pathname}?${params.toString()}` : pathname;
}

function clampPage(page, totalPages) {
  const requestedPage = Number(page);

  if (!Number.isFinite(requestedPage)) {
    return 1;
  }

  return Math.min(Math.max(Math.floor(requestedPage), 1), totalPages);
}

export default function GenresClient({
  currentPage,
  genres,
  movies,
  totalPages,
  totalResults,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenres = getGenresFromParams(searchParams, genres);

  const filteredMovies =
    selectedGenres.length === 0
      ? movies
      : movies.filter((movie) => {
          const movieGenres = new Set([movie.genre, ...(movie.tags || [])].filter(Boolean));

          return selectedGenres.some((genre) => movieGenres.has(genre));
        });
  const resultsLabel = selectedGenres.length === 0 ? "All" : selectedGenres.join(", ");

  function toggleGenre(genre) {
    if (genre === "All") {
      updateGenreParams([]);
      return;
    }

    const nextGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((currentGenre) => currentGenre !== genre)
      : [...selectedGenres, genre];

    updateGenreParams(nextGenres);
  }

  function updateGenreParams(nextGenres) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("genre");
    params.delete("page");

    if (nextGenres.length > 0) {
      params.set("genre", nextGenres.join(","));
    }

    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }

  function jumpToPage(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextPage = clampPage(formData.get("page"), totalPages);

    router.push(genreHref(pathname, selectedGenres, nextPage), {
      scroll: false,
    });
  }

  return (
    <main className="page genre-page">
      <div className="genre-results">
        <h1>Search results</h1>
        <h2>
          {totalResults} results for &quot;{resultsLabel}&quot;
        </h2>

        {filteredMovies.length === 0 ? (
          <div className="empty-box">No results found.</div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="pagination search-pagination" aria-label="Genre pagination">
            <Link
              href={genreHref(pathname, selectedGenres, Math.max(1, currentPage - 1))}
              className={`pagination-step ${currentPage === 1 ? "disabled" : ""}`}
              aria-disabled={currentPage === 1}
            >
              <ChevronLeft size={24} strokeWidth={2.2} />
              <span>Previous</span>
            </Link>

            <span className="search-page-count">
              Page {currentPage} of {totalPages}
            </span>

            <form className="page-jump" onSubmit={jumpToPage}>
              <label htmlFor="genre-page-jump">Page</label>
              <input
                id="genre-page-jump"
                key={currentPage}
                name="page"
                type="number"
                min="1"
                max={totalPages}
                defaultValue={currentPage}
                inputMode="numeric"
              />
              <button type="submit">Go</button>
            </form>

            <Link
              href={genreHref(pathname, selectedGenres, Math.min(totalPages, currentPage + 1))}
              className={`pagination-step ${currentPage === totalPages ? "disabled" : ""}`}
              aria-disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight size={24} strokeWidth={2.2} />
            </Link>
          </nav>
        ) : null}
      </div>

      <div className="genre-sidebar">
        <h1>Search by genre</h1>
        <p>See lists of movies by genre</p>

        <div className="genre-list">
          {genres.map((genre) => {
            const isActive =
              genre === "All" ? selectedGenres.length === 0 : selectedGenres.includes(genre);

            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={isActive ? "active-genre" : ""}
                type="button"
                aria-pressed={isActive}
              >
                {genre} <span>{isActive && genre !== "All" ? "✓" : "›"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
