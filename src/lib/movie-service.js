import { genres as localGenres, movies as localMovies } from "@/data/movies";
import {
  discoverTmdbMoviesByGenres,
  getTmdbGenreOptions,
  getTmdbMovieById,
  getTmdbMovies,
} from "@/lib/tmdb";

function uniqueGenres(genres) {
  return [
    "All",
    ...new Set(
      genres
        .filter((genre) => genre && genre !== "All")
        .sort((firstGenre, secondGenre) => firstGenre.localeCompare(secondGenre)),
    ),
  ];
}

function getMovieGenreNames(movies) {
  return movies.flatMap((movie) => [movie.genre, ...(movie.tags || [])]).filter(Boolean);
}

function filterMoviesByGenres(movies, genres) {
  const selectedGenres = new Set(genres);

  return movies.filter((movie) => {
    const movieGenres = [movie.genre, ...(movie.tags || [])].filter(Boolean);

    return movieGenres.some((genre) => selectedGenres.has(genre));
  });
}

export async function getMovies() {
  const tmdbMovies = await getTmdbMovies();
  const tmdbIds = new Set(tmdbMovies.map((movie) => movie.id));

  return [
    ...tmdbMovies,
    ...localMovies.filter((movie) => !tmdbIds.has(movie.id)),
  ];
}

export async function getMovieById(id) {
  const movieId = Number(id);
  const localMovie = localMovies.find((movie) => movie.id === movieId);

  if (localMovie) {
    return localMovie;
  }

  return getTmdbMovieById(movieId);
}

export async function getGenres(movies = []) {
  const tmdbGenres = await getTmdbGenreOptions();

  if (tmdbGenres.length > 0) {
    return uniqueGenres(tmdbGenres.map((genre) => genre.name));
  }

  return uniqueGenres([...localGenres, ...getMovieGenreNames(movies)]);
}

export async function getMoviesByGenres(genres) {
  const selectedGenres = genres.filter((genre) => genre && genre !== "All");

  if (selectedGenres.length === 0) {
    return getMovies();
  }

  const tmdbMovies = await discoverTmdbMoviesByGenres(selectedGenres);

  if (tmdbMovies.length > 0) {
    return tmdbMovies;
  }

  const movies = await getMovies();

  return filterMoviesByGenres(movies, selectedGenres);
}
