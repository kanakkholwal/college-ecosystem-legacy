"use server";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";
import { emailSchema } from "~/constants";
import serverApis from "~/lib/server-apis/server";
import { mailFetch } from "~/lib/server-fetch";

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
    const { data: response } = await serverApis.results.assignRank();
    if (response?.error) {
      console.log(response)
      return Promise.reject(response.message || "Failed to assign rank");
    }
    return Promise.resolve("Rank assigned successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to assign rank");
  }
}
export async function sendMailUpdate(targets: string[]) {
  const validTargets = targets.filter((target) => emailSchema.safeParse(target).success);
  if (validTargets.length === 0) {
    return Promise.reject("Invalid email addresses provided");
  }
  try {
    const { data: response } = await mailFetch<{
      data: {
        accepted: string[];
        rejected: string[];
      } | null;
      error?: string | null | object;
    }>("/api/send", {
      method: "POST",
      body: JSON.stringify({
        template_key: "result_update",
        targets: validTargets.map((email) => email.toLowerCase()),
        subject: "Semester Result Notification",
        payload: {
          batch: "Academic Year " + new Date().getFullYear(),
        },
      }),
    });


    if (response?.error || !response?.data) {
      console.log(response);
      return Promise.reject(response?.error || "Failed to send mail");
    }
    return Promise.resolve({
      accepted: response?.data?.accepted || [],
      rejected: response?.data?.rejected || [],
    });
  } catch (err) {
    console.log("Error sending mail:", err);
    return Promise.reject("Failed to send mail");
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
