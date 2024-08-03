"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";

type scrapeResponse = {
  scrape_ables: number;
  scraping_queue: number;
  scraped_results: number;
  timestamp: string;
  failed_results: number;
};

const formatUrl = (scrape: boolean, restartScrape: boolean): string => {
  const rootURL = process.env.NEXT_PUBLIC_BASE_URL;
  const formattedURL = new URL(rootURL);
  formattedURL.pathname = "/api/result/scraper";
  if (scrape) formattedURL.searchParams.append("scrape", "true");
  if (restartScrape) formattedURL.searchParams.append("restart", "true");

  return formattedURL.toString();
};

export default function Scraper() {
  const searchParams = useSearchParams();
  const scrape = searchParams.get("scrape") === "true";
  const restartScrape = searchParams.get("restart") === "true";
  const { data, error, isLoading } = useSWR<scrapeResponse>(
    formatUrl(scrape, restartScrape),
    (url: string) =>
      fetch(url, { cache: "no-store" }).then((res) => res.json()),
    { refreshInterval: 5000 }
  );

  if (data && !error)
    return (
      <>
        <h3 className="text-lg font-bold">
          Scraping Results
          <span className="text-sm font-normal text-gray-600">
            {" "}
            (
            {formatDistanceToNow(new Date(data.timestamp), {
              addSuffix: true,
            })}
            )
          </span>
        </h3>
        <div className="grid grid-cols-2 @xl:grid-cols-5 gap-4 divide-x divide-y border rounded">
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-medium">Scrapeables</span>
            <span className="text-lg font-bold">{data?.scrape_ables}</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-medium">Scraping Queue</span>
            <span className="text-lg font-bold">{data?.scraping_queue}</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-medium">Scraped Results</span>
            <span className="text-lg font-bold">{data?.scraped_results}</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-medium">Failing Scrapes</span>
            <span className="text-lg font-bold">{data.failed_results}</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-medium">Last Updated</span>
            <span className="text-lg font-bold">
              {new Date(data?.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-4"></div>
        <div className="flex gap-4">
          <Progress value={data?.scraped_results / data?.scraping_queue || 0} />
          {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        </div>
      </>
    );
  if (error && !isLoading)
    return (
      <>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || "Something went wrong!"}
          </AlertDescription>
        </Alert>
      </>
    );
  if (!data && isLoading)
    return (
      <>
        <Alert variant="info">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <AlertTitle>Please wait...</AlertTitle>
          <AlertDescription>
            Please wait while we collect the results info. (May take upto 1
            minute)
          </AlertDescription>
        </Alert>
      </>
    );
}
