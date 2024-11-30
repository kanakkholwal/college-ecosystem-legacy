import { render } from "@react-email/render";
import { generateToken, handleEmailFire } from "src/emails/helper";
import ResetPasswordEmail from "src/emails/templates/reset-password";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "src/lib/dbConnect";
import UserModel from "src/models/user";

import { getSession } from "src/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          result: "fail",
          message: "User is not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    await dbConnect();
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "name email verificationToken"
    );

    user.verificationToken = generateToken(user.email);
    await user.save();

    // send verification email
    await handleEmailFire(`Nexonauts <no_reply@nexonauts.com>`, {
      to: user.email,
      subject: `🌟 Reset Your NexonautsPassword 🛠️ `,
      html: render(
        ResetPasswordEmail({
          payload: {
            name: user.name,
            email: user.email,
            resetUrl: `${process.env.NEXTAUTH_URL}/verify-user?token=${user.verificationToken}`,
          },
        })
      ),
    });
    console.log("Mail sent");

    return NextResponse.json(
      {
        result: "success",
        message: "Please check your Email Now!!!",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        result: "fail",
        message: error?.message,
      },
      {
        status: 500,
      }
    );
  }
}
