import { z } from "zod";

const envVariables = z.object({
  // Server Side
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  BASE_MAIL_SERVER_URL: z.string().url(),
  MONGODB_URI: z.string(),
  DATABASE_URL: z.string(),

  NODE_ENV: z.string().default("testing"),
  NEXT_PUBLIC_ENV: z.string().default("development"),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  BASE_URL: z.string().url(),

  // ai 
  DEEPSEEK_API_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),

  SERVER_IDENTITY: z.string().url(),
  BASE_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_BASE_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_BASE_MAIL_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_SERVER_IDENTITY: z.string(),

  REDIS_URL: z.string(),

  

  // Client Side
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
