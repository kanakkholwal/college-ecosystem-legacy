"use server";
import dbConnect from "src/lib/dbConnect";
import redis from "src/lib/redis";
import ResultModel, { type ResultTypeWithId } from "src/models/result";

type getResultsReturnType = {
  results: ResultTypeWithId[];
  totalPages: number;
};

export async function getResults(
  query: string,
  currentPage: number,
  filter: {
    branch?: string;
    programme?: string;
    batch?: number;
  },
  new_cache?: boolean
): Promise<getResultsReturnType> {
  try {
    await dbConnect();
    const resultsPerPage = 32;
    const skip = currentPage * resultsPerPage - resultsPerPage;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const filterQuery: any = {
      $or: [
        { rollNo: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    };

    // Apply filters if provided and not equal to "all"
    if (filter.branch && filter.branch !== "all") {
      filterQuery.branch = filter.branch;
    }

    if (filter.programme && filter.programme !== "all") {
      filterQuery.programme = filter.programme;
    }

    if (filter.batch && filter.batch.toString() !== "all") {
      filterQuery.batch = filter.batch;
    }

    // Check cached results
    const cacheKey = `results_${query}_${currentPage}${filter ? `_${JSON.stringify(filter)}` : ""}`;
    let cachedResults = null;
    try {
      if (!new_cache)
        cachedResults = await redis.get<getResultsReturnType>(cacheKey);
      else {
        await redis.del(cacheKey);
      }
    } catch (redisError) {
      console.error("Redis connection error:", redisError);
    }

    if (cachedResults) {
      return cachedResults;
    }

    const results = await ResultModel.find(filterQuery)
      .sort({ "rank.college": "asc" })
      .skip(skip)
      .limit(resultsPerPage)
      .exec();

    const totalPages = Math.ceil(
      (await ResultModel.countDocuments(filterQuery)) / resultsPerPage
    );

    const response = { results, totalPages };

    // Cache the query results for 1 week
    await redis.set(cacheKey, JSON.stringify(response), {
      ex: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw new Error("Failed to fetch results. Please try again later.");
  }
}

type CachedLabels = {
  branches: string[];
  batches: string[];
  programmes: string[];
};

export async function getCachedLabels(
  new_cache?: boolean
): Promise<CachedLabels> {
  const cacheKey = "cached_labels";
  let cachedLabels: CachedLabels | null = null;
  try {
    try {
      if (!new_cache) cachedLabels = await redis.get(cacheKey);
      else await redis.del(cacheKey);
    } catch (redisError) {
      console.error("Redis connection error:", redisError);
    }
    if (!cachedLabels) {
      await dbConnect();
      const branches = await ResultModel.distinct("branch");
      const batches = await ResultModel.distinct("batch");
      const programmes = await ResultModel.distinct("programme");

      cachedLabels = { branches, batches, programmes };

      // Cache labels for 6 months
      await redis.set(cacheKey, JSON.stringify(cachedLabels), {
        ex: 6 * 30 * 24 * 60 * 60,
      });
    }
  } catch (error) {
    console.error("Error fetching cached labels:", error);
    return { branches: [], batches: [], programmes: [] };
  }
  return cachedLabels || { branches: [], batches: [], programmes: [] };
}
