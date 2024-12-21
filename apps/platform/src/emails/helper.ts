import jwt, { type JwtPayload } from "jsonwebtoken";
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_TOKEN);


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
