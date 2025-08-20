import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../server/routers/app";
import superjson from "superjson";

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // authorization: getAuthCookie(),
        };
      },
    }),
  ],
});
