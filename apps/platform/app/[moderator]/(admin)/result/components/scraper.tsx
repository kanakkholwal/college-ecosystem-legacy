"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useActionState } from "@/hooks/useActionState";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { updateRanks } from "src/lib/result";
import useSWR from "swr";

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
  const [run, { loading, error: rankError }] = useActionState(updateRanks);

  const searchParams = useSearchParams();
  const router = useRouter();
  const scrape = searchParams.get("scrape") === "true";
  const restartScrape = searchParams.get("restart") === "true";
  const { data, error, isLoading } = useSWR<scrapeResponse>(
    formatUrl(scrape, restartScrape),
    (url: string) =>
      fetch(url, { cache: "no-store" }).then((res) => res.json()),
    { refreshInterval: 60000 }
  );

  // console.log("swr",data, error, isLoading);
  // console.log("scrape", scrape, "restartScrape", restartScrape);
  console.log("rankError", rankError);

  if (data && !error)
    return (
      <>
        <div className="w-full flex flex-wrap justify-between gap-4">
          <h3 className="text-lg font-bold">
            Scraping Results
            <span className="text-sm font-normal text-gray-600">
              {" "}
              (
              {formatDistanceToNow(new Date(data?.timestamp || new Date()), {
                addSuffix: true,
              })}
              )
            </span>
          </h3>
          <div className="flex gap-4">
            <Button
              size="sm"
              onClick={() =>
                toast.promise(run(), {
                  loading: "Updating ranks...",
                  success: "Ranks updated successfully",
                  error: rankError?.message || "Failed to update ranks",
                })
              }
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Rank"}
            </Button>
            {/* <Button
              size="sm"
              variant="default_light"
              onClick={() => {
                router.push(`/admin/result?start=true`);
              }}
              disabled={isLoading}
            >
              {loading ? "Starting..." : "Start Scrape"}
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-2 @xl:grid-cols-4 gap-4 divide-x divide-y border rounded">
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
        </div>
        <div className="flex gap-4 flex-col border p-4 rounded-lg">
          <h4 className="text-lg font-bold">Scraping Progress</h4>
          <p className="text-sm font-medium">
            <strong>{data?.scraped_results}</strong> results scraped out of{" "}
            <strong>{data?.scrape_ables}</strong> from the queue of{" "}
            <strong>{data?.scraping_queue}</strong> results.
          </p>
          <div className="flex items-center gap-4 p-2">
            <Badge variant="info">
              {(
                (data?.scraped_results / data?.scrape_ables || 0) * 100
              ).toPrecision(3)}
              %
            </Badge>
            <Progress
              value={(data?.scraped_results / data?.scrape_ables || 0) * 100}
            />
            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          </div>
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
