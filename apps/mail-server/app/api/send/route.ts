import { render } from "@react-email/components";
import { type NextRequest, NextResponse } from "next/server";

import { getEmailTemplate } from "@/emails";
import { handleEmailFire } from "@/emails/helper";
import { appConfig } from "@/project.config";
import { requestPayloadSchema } from "@/types/schema";



export async function POST(request: NextRequest) {
  try {
    const identityKey = request.headers.get("X-Authorization") || "";
    if (identityKey !== process.env.SERVER_IDENTITY) {
      console.log(
        "Missing or invalid SERVER_IDENTITY",
        "received:",
        identityKey
      );
      return NextResponse.json(
        {
          error: "Missing or invalid SERVER_IDENTITY",
          data: null,
        },
        { status: 403 }
      );
    }
    const body = await request.json();

    console.log("request body", body);
    const res = requestPayloadSchema.safeParse(body);
    console.log("Parsed request body", res);
    if (!res.success) {
      return NextResponse.json(
        {
          error: res.error,
          data: null,
        },
        { status: 400 }
      );
    }
    const { template_key, targets, subject, payload } = res.data;
    console.log("Sending email to", targets);
    console.log("Subject", subject);
    console.log("Template", template_key);
    console.log("Payload", payload);
    const EmailTemplate = getEmailTemplate({ template_key, payload });

    const emailHtml = await render(EmailTemplate);
    const response = await handleEmailFire(
      appConfig.sender, // Use the sender email from appConfig
      {
        to: targets,
        subject: subject,
        html: emailHtml,
      }
    );
    console.log("Email sent", response);

    return NextResponse.json(
      { data: response, error: null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sending email:", error);
    // Handle specific error cases if needed
    return Response.json({ error, data: null }, { status: 500 });
  }
}
