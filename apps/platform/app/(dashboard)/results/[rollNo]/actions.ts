"use server";
import axios from "axios";
import type { ResultTypeWithId } from "src/models/result";


export async function getResultByRollNo(
  rollNo: string,
  update?: boolean
): Promise<ResultTypeWithId | null> {
  const { data } = await axios.get<{
    data: ResultTypeWithId | null;
    message: string;
    error: boolean;
  }>(`${process.env.BASE_SERVER_URL}/api/results/${rollNo}/get`)
  const result = data.data;
  if (!result) {
    return null;
  }

  return JSON.parse(JSON.stringify(result));
}
