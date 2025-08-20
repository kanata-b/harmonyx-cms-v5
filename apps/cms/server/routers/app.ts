import { z } from "zod";
import { procedure, router } from "../trpc";
import { directusQueries } from "@/lib/directus/directus-queries";
import {
  Pages,
  PagesQuerySchema,
  PagesSchema,
  PaginatedApiResponseSchema,
  Posts,
  PostsQuery,
  PostsQuerySchema,
  PostsSchema,
} from "../schema";

export const appRouter = router({
  // Health check endpoint
  health: procedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() };
  }),

  // Basic posts endpoints
  posts: router({
    getAll: procedure
      .input(PostsQuerySchema)
      .output(PaginatedApiResponseSchema<Posts>(PostsSchema))
      .query(async ({ input }: { input: PostsQuery }) => {
        const posts = await directusQueries.posts.getAll(input);
        return {
          data: posts as Posts[],
          pagination: {
            total: posts.length,
            limit: input.limit,
            page: input.page,
            hasMore:
              posts.length > input.limit + (input.page - 1) * input.limit,
          },
          success: true,
        };
      }),
    getById: procedure
      .input(z.string())
      .output(PostsSchema)
      .query(async ({ input }) => {
        const post = await directusQueries.posts.getById(input);
        return post as Posts;
      }),
  }),

  // Basic pages endpoints
  pages: router({
    getAll: procedure
      .input(PagesQuerySchema)
      .output(PaginatedApiResponseSchema<Pages>(PagesSchema))
      .query(async ({ input }) => {
        const pages = await directusQueries.pages.getAll(input);
        return {
          data: pages as Pages[],
          pagination: {
            total: pages.length,
            limit: input.limit,
            page: input.page,
            hasMore:
              pages.length > input.limit + (input.page - 1) * input.limit,
          },
          success: true,
        };
      }),
    getBySlug: procedure
      .input(z.string())
      .output(PagesSchema)
      .query(async ({ input }) => {
        const page = await directusQueries.pages.getBySlug(input);
        return page as Pages;
      }),
  }),
});

export type AppRouter = typeof appRouter;
