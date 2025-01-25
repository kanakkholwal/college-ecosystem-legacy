import { z } from "zod";

const envVariables = z.object({
  // Server Side
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  BASE_URL: z.string().url(),
  BASE_MAIL_SERVER_URL: z.string().url(),
  MONGODB_URI: z.string(),
  DATABASE_URL: z.string(),

  NODE_ENV: z.string().default("testing"),

  SERVER_IDENTITY: z.string().url(),
  BASE_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_BASE_SERVER_URL: z.string().url(),

  REDIS_URL: z.string(),

  HUGGING_FACE_API_KEY: z.string(),
  FIREWORKS_API_KEY: z.string(),

  FIREBASE_DATABASE_URL: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),

  // Client Side
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_WEBSITE_NAME: z.string(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_DB_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
