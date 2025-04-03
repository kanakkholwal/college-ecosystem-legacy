import { z } from "zod";

const envVariables = z.object({
  MONGODB_URI: z.string().nonempty(),
  REDIS_URL: z.string().nonempty(),
  SERVER_IDENTITY: z.string().nonempty(),
});

envVariables.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
