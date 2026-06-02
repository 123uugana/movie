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

export default async function GenresPage({ searchParams }) {
  const selectedGenres = getSelectedGenres(searchParams);
  const movies = await getMoviesByGenres(selectedGenres);
  const genres = await getGenres(movies);

  return <GenresClient genres={genres} movies={movies} />;
}
