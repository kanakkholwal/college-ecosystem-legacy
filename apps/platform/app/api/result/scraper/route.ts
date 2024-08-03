import { NextRequest, NextResponse } from "next/server";
import { ScrapeResult } from "src/controllers/scraper";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import redis from "src/lib/redis";
import Result from "src/models/result";

export const maxDuration = 60


const allowedRoles = ["admin", "moderator"];
const environment = process.env.NODE_ENV!;

type lastScrapeData = {
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
    console.log(session)
    if (!session ||
      !session?.user?.roles.some((role) => allowedRoles.includes(role))
    ) {

      return NextResponse.json(
        {
          result: "fail",
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const restart = request.nextUrl.searchParams.get("restart") === "true";
    const scrape = request.nextUrl.searchParams.get("scrape") === "true";
    const retry_failed =
      request.nextUrl.searchParams.get("retry_failed") === "true";

    const lastScrapedResult = await redis.lrange<lastScrapeData>(
      `${environment}-last-scrape`,
      0,
      -1
    );

    if (!scrape && !restart && lastScrapedResult.length > 0) {
      const lastScrapedResultData: lastScrapeData = lastScrapedResult[0];
      return NextResponse.json(lastScrapedResultData, { status: 200 });
    }

    await dbConnect();

    const rollNumbers = await Result.find({
      $nor: [
        { $and: [{ "semesters.length": 8 }, { programme: "B.Tech." }] },
        { "semesters.length": 10 },
      ],
    }).select("rollNo");

    let resultsQueue = await redis.lrange<string>(
      `${environment}-results-queue`,
      0,
      -1
    );
    if (restart || resultsQueue.length === 0) {
      console.log("restarting scrape");
      await redis.del(`${environment}-results-queue`);
      const rollNos = rollNumbers.map((roll) => roll.rollNo);
      await redis.rpush(`${environment}-results-queue`, ...rollNos);
      resultsQueue = await redis.lrange(`${environment}-results-queue`, 0, -1);
    }
    if (retry_failed) {
      console.log("retrying failed results");
      const failedResults = await redis.lrange<scrapeResponse>(
        `${environment}-scraped-results`,
        0,
        -1
      );
      const failedRollNumbers = failedResults
        .filter((result) => result.result === "fail")
        .map((result) => result.rollNo);
      await redis.lpush(`${environment}-results-queue`, ...failedRollNumbers);
      resultsQueue = await redis.lrange(`${environment}-results-queue`, 0, -1);
    }

    for (const rollNo of resultsQueue) {
      const currentTime = Date.now();
      if (currentTime - startTime >= 55000) {
        console.log("timeout", currentTime - startTime);
        break;
      }

      const scrapeResponse = await scrapeAndUpdateResult(rollNo);
      await redis.rpush(
        `${environment}-scraped-results`,
        JSON.stringify(scrapeResponse)
      );
      await redis.lrem(`${environment}-results-queue`, 0, rollNo);
    }

    const [scrapedResultsQueueLength, currentQueueNumber, failedResults] =
      await Promise.all([
        redis.llen(`${environment}-scraped-results`),
        redis.llen(`${environment}-results-queue`),
        redis.lrange<scrapeResponse>(`${environment}-scraped-results`, 0, -1),
      ]);

    const data: lastScrapeData = {
      scrape_ables: rollNumbers.length,
      scraping_queue: currentQueueNumber,
      scraped_results: scrapedResultsQueueLength,
      timestamp: new Date().toISOString(),
      failed_results: failedResults.filter((result) => result.result === "fail")
        .length,
    };
    console.log("cache add", data);
    await redis.lpush(`${environment}-last-scrape`, JSON.stringify(data));

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        result: "fail",
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

type scrapeResponse = {
  rollNo: string;
  result: "success" | "fail";
  newResult: boolean;
  timestamp: Date;
};

async function scrapeAndUpdateResult(rollNo: string): Promise<scrapeResponse> {
  try {
    const result = await ScrapeResult(rollNo);
    const resultData = await Result.findOne({ rollNo: rollNo });

    if (resultData) {
      resultData.name = result.name;
      resultData.branch = result.branch;
      resultData.batch = result.batch;
      resultData.programme = result.programme;
      resultData.semesters = result.semesters;
      await resultData.save();

      return {
        rollNo: rollNo,
        result: "success",
        timestamp: new Date(),
        newResult: false,
      };
    } else {
      const newResult = new Result({
        rollNo: rollNo,
        name: result.name,
        branch: result.branch,
        batch: result.batch,
        programme: result.programme,
        semesters: result.semesters,
      });
      await newResult.save();

      return {
        rollNo: rollNo,
        result: "success",
        timestamp: new Date(),
        newResult: true,
      };
    }
  } catch (error) {
    // console.error(error);
    return {
      rollNo: rollNo,
      result: "fail",
      timestamp: new Date(),
      newResult: false,
    };
  }
}
