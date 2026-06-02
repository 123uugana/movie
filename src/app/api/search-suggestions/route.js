import { searchTmdbMovies } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  if (!query.trim()) {
    return Response.json({ suggestions: [] });
  }

  const searchResult = await searchTmdbMovies(query, 1);
  const suggestions = searchResult.movies.slice(0, 5).map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.year,
  }));

  return Response.json({ suggestions });
}
