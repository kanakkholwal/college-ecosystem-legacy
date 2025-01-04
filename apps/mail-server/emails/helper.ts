import nodemailer from "nodemailer";

type Payload = {
  to: string[];
  subject: string;
  html: string;
};

const smtpSettings = {
  host: "smtp-relay.sendinblue.com", // "smtp.gmail.com", //replace with your email provider
  port: 587,
  // secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_EMAIL as string,
    pass: process.env.MAIL_PASSWORD as string,
  },
};

export const handleEmailFire = async (from: string, data: Payload) => {
  const transporter = nodemailer.createTransport({
    ...smtpSettings,
  });

  return await transporter.sendMail({
    from: from, // 'Sender Name <sender@server.com>'
    to: data.to,
    ...data,
  });
};
