import { ResultCard, SkeletonCard } from "@/components/application/result-card";
import Pagination from "@/components/application/result-pagination";
import SearchBox from "@/components/application/result-search";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { BiSpreadsheet } from "react-icons/bi";
import { getCachedLabels, getResults } from "~/actions/result";

import { BaseHeroSection } from "@/components/application/base-hero";
import EmptyArea from "@/components/common/empty-area";
import { NoteSeparator } from "@/components/common/note-separator";
import ConditionalRender from "@/components/utils/conditional-render";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import type { Metadata } from "next";
import { orgConfig } from "~/project.config";

export const metadata: Metadata = {
  title: "Results",
  description: "Search for results in NITH",
  applicationName: "Result Portal",
  alternates: {
    canonical: '/results',
  },
  keywords: [
    orgConfig.shortName,
    orgConfig.name,
    "Results",
    "NITH Results",
    "NITH Result Portal",
    "NITH Result Search",
    "Result Search",
    "NITH Result",
    "Result Portal",
    "NITH Result Portal",
    "NITH Result Search",
    "NITH Result Search Portal",
    "NITH Result Search Engine",
    "NITH Result Search Engine Portal",
  ],
};

export default async function ResultPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    batch?: string;
    branch?: string;
    programme?: string;
    cache?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query?.trim() || "";
  const currentPage = Number(searchParams?.page) || 1;
  const filter = {
    batch: Number(searchParams?.batch),
    branch: searchParams?.branch || "",
    programme: searchParams?.programme || "",
  };
  const new_cache = searchParams?.cache === "new";

  const { results, totalPages } = await getResults(
    query,
    currentPage,
    filter,
    new_cache
  );
  const { branches, programmes, batches } = await getCachedLabels(new_cache);

  return (
    <div className="px-4 md:px-12 xl:px-6 @container">
      <BaseHeroSection
        title={
          <>
            {orgConfig.shortName}{" "}
            <span className="text-primary">Result</span> Portal
          </>
        }
        description="Search for results by entering your roll number or name."
      >
        <Suspense
          key={"key_search_bar"}
          fallback={<Skeleton className="h-12 w-full " />}
        >
          <SearchBox
            branches={branches}
            programmes={programmes}
            batches={batches}
          />
        </Suspense>
      </BaseHeroSection>

      <NoteSeparator label={`${results.length} Results found`} />
      <ErrorBoundaryWithSuspense
        fallback={
          <EmptyArea
            icons={[BiSpreadsheet]}
            title="Failed to load results"
            description="An error occurred while fetching the results. Please try again later."
          />
        }
        loadingFallback={
          <div className="mx-auto max-w-7xl w-full grid gap-4 grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @5xl:grid-cols-4">
            {[...Array(6)].map((_, i) => {
              return <SkeletonCard key={i.toString()} />;
            })}
          </div>
        }
      >
        <ConditionalRender condition={results.length > 0}>
          <div className="mx-auto max-w-7xl w-full xl:px-6 grid gap-3 grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @5xl:grid-cols-4">
            {results.map((result, i) => {
              return (
                <ResultCard
                  key={result._id.toString()}
                  result={result}
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              );
            })}
          </div>
          <div className="max-w-7xl mx-auto p-4 empty:hidden">
            <Suspense
              key={"Pagination_key"}
              fallback={<Skeleton className="h-12 w-full " />}
            >
              <Pagination totalPages={totalPages} />
            </Suspense>
          </div>
        </ConditionalRender>
        <ConditionalRender condition={results.length === 0}>
          <EmptyArea
            icons={[BiSpreadsheet]}
            title="No Results Found"
            description="Try adjusting your search filters."
          />
        </ConditionalRender>
      </ErrorBoundaryWithSuspense>
    </div>
  );
}
