import { z } from "zod";

// Posts Schema
export const PostsSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["draft", "published"]),
  created_at: z.string(),
  updated_at: z.string(),
  author: z.string(),
  featured_image: z.string().optional(),
  excerpt: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Create Post Schema (for API input)
export const CreatePostSchema = PostsSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update Post Schema (for API input)
export const UpdatePostSchema = PostsSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Pages Schema
export const PagesSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["draft", "published"]),
  created_at: z.string(),
  updated_at: z.string(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  template: z.string().optional(),
});

// Create Page Schema (for API input)
export const CreatePageSchema = PagesSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update Page Schema (for API input)
export const UpdatePageSchema = PagesSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Categories Schema
export const CategoriesSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  created_at: z.string(),
});

// Create Category Schema (for API input)
export const CreateCategorySchema = CategoriesSchema.omit({
  id: true,
  created_at: true,
});

// Update Category Schema (for API input)
export const UpdateCategorySchema = CategoriesSchema.partial().omit({
  id: true,
  created_at: true,
});

// Media Schema
export const MediaSchema = z.object({
  id: z.string(),
  filename_disk: z.string(),
  filename_download: z.string(),
  title: z.string().optional(),
  type: z.string(),
  filesize: z.number().positive("Filesize must be positive"),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  uploaded_on: z.string(),
});

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string(),
  avatar: z.string().optional(),
  created_on: z.string(),
});

// Create User Schema (for API input)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_on: true,
});

// Update User Schema (for API input)
export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  created_on: true,
});

// Type exports (inferred from schemas)
export type Posts = z.infer<typeof PostsSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;

export type Pages = z.infer<typeof PagesSchema>;
export type CreatePage = z.infer<typeof CreatePageSchema>;
export type UpdatePage = z.infer<typeof UpdatePageSchema>;

export type Categories = z.infer<typeof CategoriesSchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export type Media = z.infer<typeof MediaSchema>;

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// Common schemas for API responses
export const PaginationSchema = z.object({
  page: z.number().min(0),
  limit: z.number().min(1).max(100),
  total: z.number(),
  hasMore: z.boolean(),
});

export const ApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  });

export const PaginatedApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: z.array(dataSchema),
    pagination: PaginationSchema,
    success: z.boolean(),
    message: z.string().optional(),
  });

// Query parameter schemas
export const PostsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(["draft", "published"]).optional(),
  author: z.string().optional(),
  search: z.string().optional(),
});

export const PagesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(["draft", "published"]).optional(),
  search: z.string().optional(),
});

export const CategoriesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const MediaQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.string().optional(),
});

export type PostsQuery = z.infer<typeof PostsQuerySchema>;
export type PagesQuery = z.infer<typeof PagesQuerySchema>;
export type CategoriesQuery = z.infer<typeof CategoriesQuerySchema>;
export type MediaQuery = z.infer<typeof MediaQuerySchema>;
