import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const time = new Date();

    return NextResponse.json(
      {
        result: "success",
        message: "Ranks assigned successfully.",
        timeTake: `${(new Date().getTime() - time.getTime()) / 1000}s`,
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
