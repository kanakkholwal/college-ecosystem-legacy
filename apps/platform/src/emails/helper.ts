import jwt, { type JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";

type Payload = {
  to: string;
  subject: string;
  html: string;
};

const smtpSettings = {
  host: "smtp-relay.sendinblue.com", // "smtp.gmail.com", //replace with your email provider
  port: 587,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

export const handleEmailFire = async (from: string, data: Payload) => {
  const transporter = nodemailer.createTransport({
    ...smtpSettings,
  });

  return await transporter.sendMail({
    from: from, // 'Sender Name <sender@server.com>'
    ...data,
  });
};
const secretKey = process.env.JWT_SECRET as string;
const expiresInMinutes = 30; // 30 minutes
// Function to generate a token with a specific expiration time
export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, secretKey, { expiresIn: `${expiresInMinutes}m` });
};
// Function to verify the token and return the data if valid
export const verifyToken = (token: string) => {
  return jwt.verify(token, secretKey) as JwtPayload | null;
};
