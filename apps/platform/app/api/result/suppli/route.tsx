import { NextRequest, NextResponse } from "next/server";
import dbConnect from "src/lib/dbConnect";
import Result from "src/models/result";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    //  find all results with semesters[n].courses[m].cgpi =0
    const results = await Result.find({
      "semesters.courses.cgpi": 0,
    }).select("name rollNo semesters");

    return NextResponse.json(
      {
        result: "success",
        length: results.length,
        data: results,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
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
