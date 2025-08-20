import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_DIRECTUS_URL: z.string(),
  },
  server: {
    STAGE: z.string(),
    AUTH_SECRET:
      process.env.STAGE === "production" ? z.string() : z.string().optional(),
    AUTH_URL: z.string(),
    AUTH_TRUST_HOST: z.string().optional(),
    DIRECTUS_URL: z.string(),
  },
  runtimeEnv: {
    STAGE: process.env.STAGE,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    NEXT_PUBLIC_DIRECTUS_URL: process.env.NEXT_PUBLIC_DIRECTUS_URL,
    DIRECTUS_URL: process.env.DIRECTUS_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
