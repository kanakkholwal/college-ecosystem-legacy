import nodemailer from "nodemailer";
import {SMTP_SETTINGS} from "@/project.config";
import {mailerPayloadSchema,type MailerPayload} from "@/types/schema";



export const handleEmailFire = async (from: string, data: MailerPayload) => {
  // Validate the payload`
  const res = mailerPayloadSchema.safeParse(data);
  if (!res.success) {
    throw new Error(res.error.message);
  }
  const transporter = nodemailer.createTransport({
    ...SMTP_SETTINGS,
  });

  return await transporter.sendMail({
    from: from, // 'Sender Name <sender@server.com>'
    ...res.data,
  });
};