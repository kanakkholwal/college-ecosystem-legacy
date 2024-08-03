import { NextRequest, NextResponse } from "next/server";
import { getSession } from "src/lib/auth";
import { updateRanks } from "src/lib/result";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    // only admins can update ranks
    if (!session || !session.user.roles.includes("admin") || !session.user.roles.includes("moderator")) {
      return NextResponse.json(
        {
          result: "fail",
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const data = await updateRanks();

    return NextResponse.json(data, {
      status: 200,
    });
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
