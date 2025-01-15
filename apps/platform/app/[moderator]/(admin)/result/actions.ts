"use server";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";
import serverApis from "~/lib/server-apis";

export async function getBasicInfo() {
  try {
    await dbConnect();
    const firstRanker = await ResultModel.findOne({ "rank.college": 1 }).lean();
    if (!firstRanker) {
      return Promise.reject("No results found");
    }
    const updatedAt = JSON.parse(JSON.stringify(firstRanker)).updatedAt;

    const [results, branches, batches, hasBacklogs, activeStudents] =
      await Promise.all([
        ResultModel.countDocuments(),
        ResultModel.distinct("branch"),
        ResultModel.distinct("batch"),
        ResultModel.countDocuments({ "semesters.courses.cgpi": 0 }),
        ResultModel.countDocuments({
          $or: [
            {
              programme: "B.Tech",
              "semesters.length": { $lt: 8 },
            },
            {
              programme: "Dual Degree",
              "semesters.length": { $lt: 10 },
            },
          ],
        }),
      ]);

    return Promise.resolve({
      counts: {
        results,
        branches: branches.length,
        batches: batches.length,
        hasBacklogs,
        activeStudents,
      },
      asOf: updatedAt,
    });
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch results");
  }
}

export async function assignRank() {
  try {
    await serverApis.results.assignRank();
    return Promise.resolve("Rank assigned successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to assign rank");
  }
}

export async function assignBranchChange() {
  try {
    await serverApis.results.assignBranchChange();
    return Promise.resolve("Branch change fixed successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fix branch change");
  }
}
