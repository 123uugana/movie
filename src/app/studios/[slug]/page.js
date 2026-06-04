import { notFound } from "next/navigation";
import StudioMoviesPage from "@/components/StudioMoviesPage";
import { getStudioBySlug } from "@/lib/studios";
import { discoverTmdbMoviesByCompanies } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

function getCurrentPage(searchParams) {
  const requestedPage = Number(searchParams?.page || 1);

  return Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
}

export async function generateMetadata({ params }) {
  const studio = getStudioBySlug(params.slug);

  if (!studio) {
    return {
      title: "Studio Movies",
    };
  }

  return {
    title: `${studio.name} Movies`,
  };
}

export default async function StudioPage({ params, searchParams }) {
  const studio = getStudioBySlug(params.slug);

  if (!studio) {
    notFound();
  }

  const movieResult = await discoverTmdbMoviesByCompanies(
    studio.companyIds,
    getCurrentPage(searchParams),
  );

  return (
    <StudioMoviesPage
      basePath={`/studios/${studio.slug}`}
      currentPage={movieResult.page}
      movies={movieResult.movies}
      studio={studio}
      totalPages={movieResult.totalPages}
      totalResults={movieResult.totalResults}
    />
  );
}
