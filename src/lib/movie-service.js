import { genres as localGenres, movies as localMovies } from "@/data/movies";
import {
  discoverTmdbMoviesByGenres,
  getTmdbGenreOptions,
  getTmdbMovieById,
  getTmdbMovies,
} from "@/lib/tmdb";

const GENRE_PAGE_SIZE = 20;

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

function normalizePage(page) {
  const requestedPage = Number(page || 1);

  return Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
}

function paginateMovies(movies, page) {
  const totalPages = Math.max(1, Math.ceil(movies.length / GENRE_PAGE_SIZE));
  const currentPage = Math.min(normalizePage(page), totalPages);

  return {
    movies: movies.slice((currentPage - 1) * GENRE_PAGE_SIZE, currentPage * GENRE_PAGE_SIZE),
    page: currentPage,
    totalPages,
    totalResults: movies.length,
  };
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

export async function getMoviesByGenres(genres, page = 1) {
  const selectedGenres = genres.filter((genre) => genre && genre !== "All");

  if (selectedGenres.length === 0) {
    const movies = await getMovies();

    return paginateMovies(movies, page);
  }

  const tmdbResult = await discoverTmdbMoviesByGenres(selectedGenres, page);

  if (tmdbResult.movies.length > 0 || tmdbResult.totalResults > 0) {
    return tmdbResult;
  }

  const movies = await getMovies();

  return paginateMovies(filterMoviesByGenres(movies, selectedGenres), page);
}
