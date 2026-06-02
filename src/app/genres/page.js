import GenresClient from "@/components/GenresClient";
import { getGenres, getMoviesByGenres } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

function getSelectedGenres(searchParams) {
  const genreParams = searchParams?.genre;
  const genreValues = Array.isArray(genreParams) ? genreParams : [genreParams];

  return [
    ...new Set(
      genreValues
        .filter(Boolean)
        .flatMap((genreValue) => genreValue.split(","))
        .map((genre) => genre.trim())
        .filter((genre) => genre && genre !== "All"),
    ),
  ];
}

function getCurrentPage(searchParams) {
  const requestedPage = Number(searchParams?.page || 1);

  return Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
}

export default async function GenresPage({ searchParams }) {
  const selectedGenres = getSelectedGenres(searchParams);
  const movieResult = await getMoviesByGenres(selectedGenres, getCurrentPage(searchParams));
  const genres = await getGenres(movieResult.movies);

  return (
    <GenresClient
      currentPage={movieResult.page}
      genres={genres}
      movies={movieResult.movies}
      totalPages={movieResult.totalPages}
      totalResults={movieResult.totalResults}
    />
  );
}
