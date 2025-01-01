"use server";
import axios from "axios";
import type { ResultTypeWithId } from "src/models/result";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";

export async function getResultByRollNo(
  rollNo: string,
  update?: boolean
): Promise<ResultTypeWithId> {
  await dbConnect();
  const result = await ResultModel.findOne({
    rollNo,
  }).exec();
  if (result && update) {
    const {data:response} = await axios.get<{
      data: ResultTypeWithId | null;
      message: string;
      error: boolean;
    }>(`${process.env.BASE_SERVER_URL}/api/results/${rollNo}/update`)
    if (response.error || !response.data) {
      return JSON.parse(JSON.stringify(result));
    }
    const new_result = response.data;
    return JSON.parse(JSON.stringify(response.data));
  }
  return JSON.parse(JSON.stringify(result));
}