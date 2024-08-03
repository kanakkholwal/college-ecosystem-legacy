"use server";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";

export async function getBasicInfo() {
  try {
    await dbConnect();
    const firstRanker = await ResultModel.findOne({ "rank.college": 1 }).lean();
    if (!firstRanker) {
      return Promise.reject("No results found");
    }
    const updatedAt = JSON.parse(JSON.stringify(firstRanker)).updatedAt;

    const count = await Promise.all([
      ResultModel.countDocuments(),
      ResultModel.distinct("branch"),
      ResultModel.distinct("batch"),
    ]);

    return Promise.resolve({
      counts: {
        results: count[0],
        branches: count[1].length,
        batches: count[2].length,
      },
      asOf: updatedAt,
    });
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch results");
  }
}
