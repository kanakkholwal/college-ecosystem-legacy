import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "~/lib/dbConnect";
import Result from "~/models/result";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const results = await Result.find({
      batch: "2020",
    }).limit(250);

    return NextResponse.json(
      {
        result: "success",
        message: "Ranks assigned successfully.",
        data: results,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
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
    return NextResponse.json(
      {
        result: "fail",
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
