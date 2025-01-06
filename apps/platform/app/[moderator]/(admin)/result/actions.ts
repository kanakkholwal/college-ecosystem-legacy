"use server";

import dbConnect from "src/lib/dbConnect";
import ResultModel, { type ResultTypeWithId } from "src/models/result";
import { serverFetch } from "~/lib/server-fetch";

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

export async function getResultByRollNo(
  rollNo: string
): Promise<ResultTypeWithId> {
  try {
    await dbConnect();
    const result = await ResultModel.findOne({ rollNo }).lean();
    if (!result) {
      return Promise.reject("No results found");
    }
    return Promise.resolve(JSON.parse(JSON.stringify(result)));
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch results");
  }
}


export async function assignRanks() {
  const response = await serverFetch<{
    error: boolean;
    message: string;
    data: object | null;
  }>("/api/result/assign-ranks", {
    method: "POST",
  });

  console.log(response);

  if (response.error) {
    return Promise.reject("Failed to assign ranks");
  }
  return Promise.resolve(true);
}