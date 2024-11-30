"use server";
import { ScrapeResult } from "src/controllers/scraper";
import dbConnect from "src/lib/dbConnect";
import ResultModel, { ResultTypeWithId } from "src/models/result";

export async function getResultByRollNo(
  rollNo: string,
  update?: boolean
): Promise<ResultTypeWithId> {
  await dbConnect();
  const result = await ResultModel.findOne({
    rollNo,
  }).exec();
  if (result && update) {
    const new_result = await ScrapeResult(rollNo);
    result.name = new_result.name;
    result.branch = new_result.branch;
    result.batch = new_result.batch;
    result.programme = new_result.programme;
    result.semesters = new_result.semesters;
    await result.save();
    return JSON.parse(JSON.stringify(result));
  }
  return JSON.parse(JSON.stringify(result));
}
