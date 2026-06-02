import axios from "axios";

const TMDB_MOVIE_IDS = [
  640146,
  502356,
  594767,
  76600,
  948713,
  677179,
  713704,
  638974,
  315162,
  603692,
  1048300,
  804150,
  1008005,
  700391,
  946310,
  1104040,
  758323,
  842945,
  849869,
  1033219,
  868759,
  934433,
  816904,
  980078,
  536554,
  631842,
  676710,
  758009,
  1101799,
  840326,
  1304313,
];
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = (process.env.TMDB_IMAGE_URL || "https://image.tmdb.org/t/p").replace(
  /\/$/,
  "",
);

function normalizeGenreName(genreName) {
  return String(genreName || "").trim().toLowerCase();
}

function getTmdbAuth() {
  const accessToken = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (accessToken) {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: "application/json",
      },
      apiKey: "",
    };
  }

  if (apiKey) {
    return {
      headers: {
        accept: "application/json",
      },
      apiKey,
    };
  }

  return null;
}

async function fetchTmdb(path, params = {}) {
  const auth = getTmdbAuth();

  if (!auth) {
    return null;
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  if (auth.apiKey) {
    url.searchParams.set("api_key", auth.apiKey);
  }

  try {
    const response = await axios.get(url.toString(), {
      headers: auth.headers,
      timeout: 10000,
    });

    return response.data;
  } catch {
    return null;
  }
}

function imageUrl(path, size = "w500") {
  return path ? `${TMDB_IMAGE_URL}/${size}${path}` : "";
}

function mapTmdbSearchMovie(movie) {
  return {
    id: movie.id,
    title: movie.title || movie.original_title || "Untitled",
    year: movie.release_date || "Coming soon",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    genre: "Movie",
    image: imageUrl(movie.poster_path, "w500") || "/image.svg",
    cover: imageUrl(movie.backdrop_path || movie.poster_path, "original") || "/image.svg",
    description: movie.overview || "No description available.",
    director: "Unknown",
    writers: "Unknown",
    duration: "Unknown",
    trailer: "",
    videoId: "",
    cast: ["Unknown"],
    tags: ["Movie"],
  };
}

function mapTmdbListMovie(movie, genreMap = new Map()) {
  const genreNames =
    movie.genre_ids
      ?.map((genreId) => genreMap.get(genreId))
      .filter(Boolean) || [];

  return {
    id: movie.id,
    title: movie.title || movie.original_title || "Untitled",
    year: movie.release_date || "Coming soon",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    genre: genreNames[0] || "Movie",
    image: imageUrl(movie.poster_path, "w500") || "/image.svg",
    cover: imageUrl(movie.backdrop_path || movie.poster_path, "original") || "/image.svg",
    description: movie.overview || "No description available.",
    director: "Unknown",
    writers: "Unknown",
    duration: "Unknown",
    trailer: "",
    videoId: "",
    cast: ["Unknown"],
    tags: genreNames.length ? genreNames : ["Movie"],
  };
}

function formatDuration(minutes) {
  if (!minutes) {
    return "Unknown";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getTrailer(videoResults = []) {
  return videoResults.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );
}

function mapTmdbMovie(movie) {
  const director = movie.credits?.crew?.find((person) => person.job === "Director");
  const writers =
    movie.credits?.crew
      ?.filter((person) => ["Writer", "Screenplay", "Story"].includes(person.job))
      .map((person) => person.name)
      .filter(Boolean)
      .slice(0, 3) || [];
  const cast =
    movie.credits?.cast
      ?.map((person) => person.name)
      .filter(Boolean)
      .slice(0, 3) || [];
  const trailer = getTrailer(movie.videos?.results);
  const genreNames = movie.genres?.map((genre) => genre.name).filter(Boolean) || [];

  return {
    id: movie.id,
    title: movie.title || movie.original_title || "Untitled",
    year: movie.release_date || "Coming soon",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    genre: genreNames[0] || "Drama",
    image: imageUrl(movie.poster_path, "w500"),
    cover: imageUrl(movie.backdrop_path || movie.poster_path, "original"),
    description: movie.overview || "No description available.",
    director: director?.name || "Unknown",
    writers: writers.join(" · ") || director?.name || "Unknown",
    duration: formatDuration(movie.runtime),
    trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    videoId: trailer?.key || "",
    cast: cast.length ? cast : ["Unknown"],
    tags: genreNames,
  };
}

export async function getTmdbMovieById(id) {
  const movie = await fetchTmdb(`/movie/${id}`, {
    append_to_response: "credits,videos",
  });

  return movie ? mapTmdbMovie(movie) : null;
}

export async function getTmdbMovies() {
  const movies = await Promise.all(
    TMDB_MOVIE_IDS.map((movieId) => getTmdbMovieById(movieId)),
  );

  return movies.filter(Boolean);
}

export async function getTmdbGenreOptions() {
  const genreResult = await fetchTmdb("/genre/movie/list", {
    language: "en-US",
  });

  return (genreResult?.genres || [])
    .filter((genre) => genre.id && genre.name)
    .map((genre) => ({
      id: genre.id,
      name: genre.name,
    }));
}

export async function getTmdbGenres() {
  const genres = await getTmdbGenreOptions();

  return genres.map((genre) => genre.name);
}

export async function discoverTmdbMoviesByGenres(genreNames, page = 1) {
  const selectedGenres = [
    ...new Set(
      genreNames
        .map((genreName) => String(genreName || "").trim())
        .filter(Boolean),
    ),
  ];

  if (selectedGenres.length === 0) {
    return [];
  }

  const genreOptions = await getTmdbGenreOptions();
  const genreLookup = new Map(
    genreOptions.map((genre) => [normalizeGenreName(genre.name), genre.id]),
  );
  const selectedGenreIds = selectedGenres
    .map((genreName) => genreLookup.get(normalizeGenreName(genreName)))
    .filter(Boolean);

  if (selectedGenreIds.length === 0) {
    return [];
  }

  const discoverResult = await fetchTmdb("/discover/movie", {
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    page: String(page),
    sort_by: "popularity.desc",
    with_genres: selectedGenreIds.join("|"),
  });

  if (!discoverResult) {
    return [];
  }

  const genreMap = new Map(genreOptions.map((genre) => [genre.id, genre.name]));

  return (discoverResult.results || []).map((movie) => mapTmdbListMovie(movie, genreMap));
}

export async function searchTmdbMovies(query, page = 1) {
  const searchQuery = String(query || "").trim();

  if (!searchQuery) {
    return {
      movies: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }

  const searchResult = await fetchTmdb("/search/movie", {
    query: searchQuery,
    language: "en-US",
    page: String(page),
  });

  if (!searchResult) {
    return {
      movies: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }

  return {
    movies: (searchResult.results || []).map(mapTmdbSearchMovie),
    page: searchResult.page || 1,
    totalPages: Math.min(searchResult.total_pages || 1, 500),
    totalResults: searchResult.total_results || 0,
  };
}

export { TMDB_MOVIE_IDS };
