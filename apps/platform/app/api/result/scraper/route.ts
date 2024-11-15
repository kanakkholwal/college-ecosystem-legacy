import { NextRequest, NextResponse } from "next/server";
import { ScrapeResult } from "src/controllers/scraper";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import redis from "src/lib/redis";
import Result from "src/models/result";

export const maxDuration = 60;
const allowedRoles = ["admin", "moderator"];
const environment = process.env.NODE_ENV!;

type LastScrapeData = {
  scrape_ables: number;
  scraping_queue: number;
  scraped_results: number;
  timestamp: string;
  failed_results: number;
};

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const session = await getSession();
    
    if (!session?.user?.roles.some((role) => allowedRoles.includes(role))) {
      return unauthorizedResponse();
    }

    const restart = request.nextUrl.searchParams.get("restart") === "true";
    const scrape = request.nextUrl.searchParams.get("scrape") === "true";
    const retryFailed = request.nextUrl.searchParams.get("retry_failed") === "true";

    await dbConnect();
    const lastScrapeData = await getLastScrapeData(scrape, restart);

    if (lastScrapeData) {
      return NextResponse.json(lastScrapeData, { status: 200 });
    }

    const lockAcquired = await acquireLock();
    if (!lockAcquired) {
      return lockInProgressResponse();
    }

    const resultsQueue = await initializeScrapingQueue(restart, retryFailed);
    await processScrapingQueue(resultsQueue, startTime);

    const data = await getUpdatedScrapeData();
    await cacheLastScrapeData(data);
    await releaseLock();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return serverErrorResponse(error.message);
  }
}

// Utility Functions

function unauthorizedResponse() {
  return NextResponse.json(
    {
      result: "fail",
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

async function getLastScrapeData(scrape: boolean, restart: boolean) {
  const lastScrapeData = await redis.lrange<LastScrapeData>(
    `${environment}-last-scrape`,
    0,
    -1
  );

  if (!scrape && !restart && lastScrapeData.length > 0) {
    return lastScrapeData[0];
  }
  return null;
}

async function acquireLock(): Promise<boolean> {
  const lockKey = `${environment}-scrape-lock`;
  const lock = await redis.set<boolean>(lockKey, true, {
    ex: maxDuration,
    nx: true,
  });
  return !!lock;
}

function lockInProgressResponse() {
  return NextResponse.json(
    {
      result: "fail",
      message: "Scrape already in progress",
    },
    { status: 200 }
  );
}

async function initializeScrapingQueue(restart: boolean, retryFailed: boolean) {
  const rollNumbers = await getRollNumbers();
  let resultsQueue = await redis.lrange<string>(
    `${environment}-results-queue`,
    0,
    -1
  );

  if (restart || resultsQueue.length === 0) {
    await redis.del(`${environment}-results-queue`);
    const rollNos = rollNumbers.map((roll) => roll.rollNo);
    await redis.rpush(`${environment}-results-queue`, ...rollNos);
    resultsQueue = await redis.lrange(`${environment}-results-queue`, 0, -1);
  }

  if (retryFailed) {
    const failedRollNumbers = await getFailedRollNumbers();
    await redis.lpush(`${environment}-results-queue`, ...failedRollNumbers);
  }

  return resultsQueue;
}

async function getRollNumbers() {
  return await Result.find({
    $nor: [
      { $and: [{ "semesters.length": 8 }, { programme: "B.Tech." }] },
      { "semesters.length": 10 },
    ],
  }).select("rollNo");
}

async function getFailedRollNumbers() {
  const allResults = await redis.lrange<scrapeResponse>(
    `${environment}-scraped-results`,
    0,
    -1
  );
  return allResults
    .filter((result) => result.result === "fail")
    .map((result) => result.rollNo);
}

async function processScrapingQueue(resultsQueue: string[], startTime: number) {
  for (const rollNo of resultsQueue) {
    if (Date.now() - startTime >= 55000) {
      console.log("Timeout reached, stopping further scraping.");
      break;
    }

    const scrapeResponse = await scrapeAndUpdateResult(rollNo);
    await redis.rpush(
      `${environment}-scraped-results`,
      JSON.stringify(scrapeResponse)
    );
    await redis.lrem(`${environment}-results-queue`, 0, rollNo);
  }
}

async function getUpdatedScrapeData(): Promise<LastScrapeData> {
  const rollNumbers = await getRollNumbers();
  const [scrapedResultsQueueLength, currentQueueNumber, failedResults] =
    await Promise.all([
      redis.llen(`${environment}-scraped-results`),
      redis.llen(`${environment}-results-queue`),
      redis.lrange<scrapeResponse>(`${environment}-scraped-results`, 0, -1),
    ]);

  return {
    scrape_ables: rollNumbers.length,
    scraping_queue: currentQueueNumber,
    scraped_results: scrapedResultsQueueLength,
    timestamp: new Date().toISOString(),
    failed_results: failedResults.filter((result) => result.result === "fail")
      .length,
  };
}

async function cacheLastScrapeData(data: LastScrapeData) {
  console.log("Adding data to cache", data);
  await redis.lpush(`${environment}-last-scrape`, JSON.stringify(data));
}

async function releaseLock() {
  await redis.del(`${environment}-scrape-lock`);
}

function serverErrorResponse(message: string) {
  return NextResponse.json(
    {
      result: "fail",
      message,
    },
    { status: 500 }
  );
}

// Scraping Function

async function scrapeAndUpdateResult(rollNo: string): Promise<scrapeResponse> {
  try {
    const result = await ScrapeResult(rollNo);
    const existingResult = await Result.findOne({ rollNo: rollNo });

    if (existingResult) {
      updateExistingResult(existingResult, result);
      return scrapeResponseData(rollNo, "success", false);
    } else {
      await saveNewResult(result, rollNo);
      return scrapeResponseData(rollNo, "success", true);
    }
  } catch {
    return scrapeResponseData(rollNo, "fail", false);
  }
}

async function updateExistingResult(existingResult: any, result: any) {
  existingResult.name = result.name;
  existingResult.branch = result.branch;
  existingResult.batch = result.batch;
  existingResult.programme = result.programme;
  existingResult.semesters = result.semesters;
  await existingResult.save();
}

async function saveNewResult(result: any, rollNo: string) {
  const newResult = new Result({
    rollNo: rollNo,
    name: result.name,
    branch: result.branch,
    batch: result.batch,
    programme: result.programme,
    semesters: result.semesters,
  });
  await newResult.save();
}

function scrapeResponseData(
  rollNo: string,
  result: "success" | "fail",
  newResult: boolean
): scrapeResponse {
  return {
    rollNo: rollNo,
    result,
    timestamp: new Date(),
    newResult,
  };
}

type scrapeResponse = {
  rollNo: string;
  result: "success" | "fail";
  newResult: boolean;
  timestamp: Date;
};
