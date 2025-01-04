import { type NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

import { getEmailTemplate } from '@/emails';

const payloadSchema = z.object({
  template_key: z.string(),
  targets: z.array(z.string().email()),
  subject: z.string(),
  payload: z.record(z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())])),
})


export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    console.log(body);

    const res = payloadSchema.safeParse(body);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
    const { template_key, targets, subject, payload } = res.data;

    const { data, error } = await resend.emails.send({
      from: 'College Platform <onboarding@nith.eu.org>',
      to: [...targets],
      subject: subject,
      react: getEmailTemplate({ template_key, payload }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
