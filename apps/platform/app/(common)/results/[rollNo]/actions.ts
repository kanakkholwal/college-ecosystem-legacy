"use server";
import type { ResultTypeWithId } from "src/models/result";

import dbConnect from "src/lib/dbConnect";
import ResultModel from "src/models/result";
import { serverFetch } from "~/lib/server-fetch";

export async function getResultByRollNo(
  rollNo: string,
  update?: boolean,
  is_new?: boolean
): Promise<ResultTypeWithId> {
  await dbConnect();
  const result = await ResultModel.findOne({
    rollNo,
  }).exec();
  if (result && update) {
    const response = await serverFetch<{
      data: ResultTypeWithId | null;
      message: string;
      error: boolean;
    }>("/api/results/:rollNo/update",
      {
        params: { rollNo }
      });
    if (response.error || !response.data) {
      return JSON.parse(JSON.stringify(result));
    }
    return JSON.parse(JSON.stringify(response.data));
  }
  if (!result && is_new) {
    const response = await serverFetch<{
      data: ResultTypeWithId | null;
      message: string;
      error: boolean;
    }>("/api/results/:rollNo/add",
      {
        params: { rollNo }
      });
    if (response.error || !response.data) {
      return JSON.parse(JSON.stringify(result));
    }
    return JSON.parse(JSON.stringify(response.data));
  }
  return JSON.parse(JSON.stringify(result));
}
