import SearchClient from "@/components/SearchClient";
import { searchTmdbMovies } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

function getSearchPage(searchParams) {
  const requestedPage = Number(searchParams?.page || 1);

  return Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
}

export default async function SearchPage({ searchParams }) {
  const initialQuery =
    typeof searchParams?.query === "string"
      ? searchParams.query
      : typeof searchParams?.q === "string"
        ? searchParams.q
        : "";
  const currentPage = getSearchPage(searchParams);
  const searchResult = await searchTmdbMovies(initialQuery, currentPage);

  return (
    <SearchClient
      currentPage={searchResult.page}
      initialQuery={initialQuery}
      movies={searchResult.movies}
      totalPages={searchResult.totalPages}
      totalResults={searchResult.totalResults}
    />
  );
}
