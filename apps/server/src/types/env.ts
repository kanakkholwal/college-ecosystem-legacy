import { z } from "zod";

const envVariables = z.object({
    MONGODB_URI: z.string(),
    REDIS_URL: z.string(),
    IDENTITY_KEY: z.string().length(32),
});

envVariables.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
