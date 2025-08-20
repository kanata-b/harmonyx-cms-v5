import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export const createTRPCContext = () => {
  return {
    user: null, // Will be populated by middleware when needed
  };
};

type Context = ReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
