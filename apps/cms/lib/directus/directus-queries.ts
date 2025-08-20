import {
  readItems,
  readItem,
  createItem,
  updateItem,
  deleteItem,
  uploadFiles,
  aggregate,
  deleteItems,
  createItems,
  updateItems,
} from "@directus/sdk";
import { directus } from "./directus";
import type {
  Schema,
  Post,
  Page,
  Form,
  Navigation,
  Globals,
  BlockHero,
  BlockRichtext,
  BlockForm,
  BlockPost,
  BlockGallery,
  BlockPricing,
  AiPrompt,
  Redirect,
  FormSubmission,
  PageBlock,
  NavigationItem,
  FormField,
  BlockButton,
  BlockButtonGroup,
  BlockPricingCard,
  BlockGalleryItem,
} from "./directus-schemas";

// Types for Query Options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: string[];
  fields?: string[];
  filter?: Record<string, unknown>;
  search?: string;
  deep?: Record<string, QueryOptions>;
  meta?: string[];
}

export interface GetByIdOptions {
  fields?: string[];
  deep?: Record<string, QueryOptions>;
}

// Utility function for error handling
const handleError = <T>(fallback: T) => (error: unknown) => {
  console.error("Directus query error:", error);
  return fallback;
};

// Utility function for search filters
const createSearchFilter = (searchTerm: string, fields: string[]) => {
  if (!searchTerm) return {};
  return {
    _or: fields.map(field => ({
      [field]: { _icontains: searchTerm }
    }))
  };
};

export const directusQueries = {
  // POSTS CRUD API
  posts: {
    getAll: async (options: QueryOptions = {}): Promise<Post[]> => {
      try {
        const {
          limit = 10,
          offset = 0,
          sort = ["-date_created"],
          fields,
          filter = {},
          search,
          deep,
          meta
        } = options;

        let finalFilter = { ...filter };
        
        if (search) {
          const searchFilter = createSearchFilter(search, ["title", "content", "description"]);
          finalFilter = { _and: [finalFilter, searchFilter] };
        }

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter: finalFilter,
          fields: fields || ["*", "author.*"],
        };

        if (deep) queryOptions.deep = deep;
        if (meta) queryOptions.meta = meta;

        const posts = await directus.request(readItems("posts", queryOptions));
        return posts as Post[];
      } catch (error) {
        return handleError<Post[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<Post | null> => {
      try {
        const { fields, deep } = options;
        const queryOptions: any = {
          fields: fields || ["*", "author.*"],
        };
        if (deep) queryOptions.deep = deep;

        const post = await directus.request(readItem("posts", id, queryOptions));
        return post as Post;
      } catch (error) {
        return handleError<Post | null>(null)(error);
      }
    },

    getBySlug: async (slug: string): Promise<Post | null> => {
      try {
        const result = await directus.request(
          readItems("posts", {
            filter: { slug: { _eq: slug } },
            limit: 1,
            fields: ["*", "author.*"],
          })
        );
        return result[0] as Post || null;
      } catch (error) {
        return handleError<Post | null>(null)(error);
      }
    },

    create: async (data: Partial<Post>): Promise<Post> => {
      const post = await directus.request(createItem("posts", data));
      return post as Post;
    },

    update: async (id: string, data: Partial<Post>): Promise<Post> => {
      const post = await directus.request(updateItem("posts", id, data));
      return post as Post;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("posts", id));
    },

    createMany: async (data: Partial<Post>[]): Promise<Post[]> => {
      const posts = await directus.request(createItems("posts", data));
      return posts as Post[];
    },

    updateMany: async (filter: Record<string, unknown>, data: Partial<Post>): Promise<Post[]> => {
      const posts = await directus.request(updateItems("posts", filter, data));
      return posts as Post[];
    },

    deleteMany: async (ids: string[]): Promise<void> => {
      await directus.request(deleteItems("posts", ids));
    },

    // Utility methods
    publish: async (id: string): Promise<Post> => {
      return await directusQueries.posts.update(id, { status: "published", published_at: new Date().toISOString() });
    },

    unpublish: async (id: string): Promise<Post> => {
      return await directusQueries.posts.update(id, { status: "draft", published_at: null });
    },
  },

  // PAGES CRUD API
  pages: {
    getAll: async (options: QueryOptions = {}): Promise<Page[]> => {
      try {
        const {
          limit = 10,
          offset = 0,
          sort = ["-date_created"],
          fields,
          filter = {},
          search,
          deep,
          meta
        } = options;

        let finalFilter = { ...filter };
        
        if (search) {
          const searchFilter = createSearchFilter(search, ["title", "permalink"]);
          finalFilter = { _and: [finalFilter, searchFilter] };
        }

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter: finalFilter,
          fields: fields || ["*", "blocks.*", "blocks.item.*"],
        };

        if (deep) queryOptions.deep = deep;
        if (meta) queryOptions.meta = meta;

        const pages = await directus.request(readItems("pages", queryOptions));
        return pages as Page[];
      } catch (error) {
        return handleError<Page[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<Page | null> => {
      try {
        const { fields, deep } = options;
        const queryOptions: any = {
          fields: fields || ["*", "blocks.*", "blocks.item.*"],
        };
        if (deep) queryOptions.deep = deep;

        const page = await directus.request(readItem("pages", id, queryOptions));
        return page as Page;
      } catch (error) {
        return handleError<Page | null>(null)(error);
      }
    },

    getBySlug: async (slug: string): Promise<Page | null> => {
      try {
        const result = await directus.request(
          readItems("pages", {
            filter: { permalink: { _eq: slug } },
            limit: 1,
            fields: ["*", "blocks.*", "blocks.item.*"],
          })
        );
        return result[0] as Page || null;
      } catch (error) {
        return handleError<Page | null>(null)(error);
      }
    },

    create: async (data: Partial<Page>): Promise<Page> => {
      const page = await directus.request(createItem("pages", data));
      return page as Page;
    },

    update: async (id: string, data: Partial<Page>): Promise<Page> => {
      const page = await directus.request(updateItem("pages", id, data));
      return page as Page;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("pages", id));
    },

    publish: async (id: string): Promise<Page> => {
      return await directusQueries.pages.update(id, { status: "published", published_at: new Date().toISOString() });
    },

    unpublish: async (id: string): Promise<Page> => {
      return await directusQueries.pages.update(id, { status: "draft", published_at: null });
    },
  },

  // FORMS CRUD API
  forms: {
    getAll: async (options: QueryOptions = {}): Promise<Form[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["title"],
          fields,
          filter = {},
          search,
          deep,
        } = options;

        let finalFilter = { ...filter };
        
        if (search) {
          const searchFilter = createSearchFilter(search, ["title"]);
          finalFilter = { _and: [finalFilter, searchFilter] };
        }

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter: finalFilter,
          fields: fields || ["*", "fields.*"],
        };

        if (deep) queryOptions.deep = deep;

        const forms = await directus.request(readItems("forms", queryOptions));
        return forms as Form[];
      } catch (error) {
        return handleError<Form[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<Form | null> => {
      try {
        const { fields, deep } = options;
        const queryOptions: any = {
          fields: fields || ["*", "fields.*", "submissions.*"],
        };
        if (deep) queryOptions.deep = deep;

        const form = await directus.request(readItem("forms", id, queryOptions));
        return form as Form;
      } catch (error) {
        return handleError<Form | null>(null)(error);
      }
    },

    create: async (data: Partial<Form>): Promise<Form> => {
      const form = await directus.request(createItem("forms", data));
      return form as Form;
    },

    update: async (id: string, data: Partial<Form>): Promise<Form> => {
      const form = await directus.request(updateItem("forms", id, data));
      return form as Form;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("forms", id));
    },

    activate: async (id: string): Promise<Form> => {
      return await directusQueries.forms.update(id, { is_active: true });
    },

    deactivate: async (id: string): Promise<Form> => {
      return await directusQueries.forms.update(id, { is_active: false });
    },
  },

  // NAVIGATION CRUD API
  navigation: {
    getAll: async (options: QueryOptions = {}): Promise<Navigation[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["title"],
          fields,
          filter = {},
          deep,
        } = options;

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter,
          fields: fields || ["*", "items.*", "items.page.*", "items.post.*", "items.children.*"],
        };

        if (deep) queryOptions.deep = deep;

        const navigation = await directus.request(readItems("navigation", queryOptions));
        return navigation as Navigation[];
      } catch (error) {
        return handleError<Navigation[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<Navigation | null> => {
      try {
        const { fields, deep } = options;
        const queryOptions: any = {
          fields: fields || ["*", "items.*", "items.page.*", "items.post.*", "items.children.*"],
        };
        if (deep) queryOptions.deep = deep;

        const navigation = await directus.request(readItem("navigation", id, queryOptions));
        return navigation as Navigation;
      } catch (error) {
        return handleError<Navigation | null>(null)(error);
      }
    },

    getActive: async (): Promise<Navigation[]> => {
      return await directusQueries.navigation.getAll({
        filter: { is_active: { _eq: true } }
      });
    },

    create: async (data: Partial<Navigation>): Promise<Navigation> => {
      const navigation = await directus.request(createItem("navigation", data));
      return navigation as Navigation;
    },

    update: async (id: string, data: Partial<Navigation>): Promise<Navigation> => {
      const navigation = await directus.request(updateItem("navigation", id, data));
      return navigation as Navigation;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("navigation", id));
    },

    activate: async (id: string): Promise<Navigation> => {
      return await directusQueries.navigation.update(id, { is_active: true });
    },

    deactivate: async (id: string): Promise<Navigation> => {
      return await directusQueries.navigation.update(id, { is_active: false });
    },
  },

  // GLOBALS CRUD API
  globals: {
    get: async (): Promise<Globals | null> => {
      try {
        const result = await directus.request(
          readItems("globals", {
            limit: 1,
            fields: ["*", "favicon.*", "logo.*", "logo_dark_mode.*"],
          })
        );
        return result[0] as Globals || null;
      } catch (error) {
        return handleError<Globals | null>(null)(error);
      }
    },

    update: async (data: Partial<Globals>): Promise<Globals> => {
      // Globals typically has a single record with ID = 1
      const globals = await directus.request(updateItem("globals", "1", data));
      return globals as Globals;
    },
  },

  // BLOCK HERO CRUD API
  blockHero: {
    getAll: async (options: QueryOptions = {}): Promise<BlockHero[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["-date_created"],
          fields,
          filter = {},
          deep,
        } = options;

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter,
          fields: fields || ["*", "image.*", "button_group.*", "button_group.buttons.*"],
        };

        if (deep) queryOptions.deep = deep;

        const blocks = await directus.request(readItems("block_hero", queryOptions));
        return blocks as BlockHero[];
      } catch (error) {
        return handleError<BlockHero[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<BlockHero | null> => {
      try {
        const { fields, deep } = options;
        const queryOptions: any = {
          fields: fields || ["*", "image.*", "button_group.*", "button_group.buttons.*"],
        };
        if (deep) queryOptions.deep = deep;

        const block = await directus.request(readItem("block_hero", id, queryOptions));
        return block as BlockHero;
      } catch (error) {
        return handleError<BlockHero | null>(null)(error);
      }
    },

    create: async (data: Partial<BlockHero>): Promise<BlockHero> => {
      const block = await directus.request(createItem("block_hero", data));
      return block as BlockHero;
    },

    update: async (id: string, data: Partial<BlockHero>): Promise<BlockHero> => {
      const block = await directus.request(updateItem("block_hero", id, data));
      return block as BlockHero;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("block_hero", id));
    },
  },

  // BLOCK RICHTEXT CRUD API
  blockRichtext: {
    getAll: async (options: QueryOptions = {}): Promise<BlockRichtext[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["-date_created"],
          fields,
          filter = {},
          search,
        } = options;

        let finalFilter = { ...filter };
        
        if (search) {
          const searchFilter = createSearchFilter(search, ["headline", "content"]);
          finalFilter = { _and: [finalFilter, searchFilter] };
        }

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter: finalFilter,
          fields: fields || ["*"],
        };

        const blocks = await directus.request(readItems("block_richtext", queryOptions));
        return blocks as BlockRichtext[];
      } catch (error) {
        return handleError<BlockRichtext[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<BlockRichtext | null> => {
      try {
        const { fields } = options;
        const block = await directus.request(readItem("block_richtext", id, { fields: fields || ["*"] }));
        return block as BlockRichtext;
      } catch (error) {
        return handleError<BlockRichtext | null>(null)(error);
      }
    },

    create: async (data: Partial<BlockRichtext>): Promise<BlockRichtext> => {
      const block = await directus.request(createItem("block_richtext", data));
      return block as BlockRichtext;
    },

    update: async (id: string, data: Partial<BlockRichtext>): Promise<BlockRichtext> => {
      const block = await directus.request(updateItem("block_richtext", id, data));
      return block as BlockRichtext;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("block_richtext", id));
    },
  },

  // AI PROMPTS CRUD API
  aiPrompts: {
    getAll: async (options: QueryOptions = {}): Promise<AiPrompt[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["-date_created"],
          fields,
          filter = {},
          search,
        } = options;

        let finalFilter = { ...filter };
        
        if (search) {
          const searchFilter = createSearchFilter(search, ["name", "description"]);
          finalFilter = { _and: [finalFilter, searchFilter] };
        }

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter: finalFilter,
          fields: fields || ["*"],
        };

        const prompts = await directus.request(readItems("ai_prompts", queryOptions));
        return prompts as AiPrompt[];
      } catch (error) {
        return handleError<AiPrompt[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<AiPrompt | null> => {
      try {
        const { fields } = options;
        const prompt = await directus.request(readItem("ai_prompts", id, { fields: fields || ["*"] }));
        return prompt as AiPrompt;
      } catch (error) {
        return handleError<AiPrompt | null>(null)(error);
      }
    },

    getPublished: async (): Promise<AiPrompt[]> => {
      return await directusQueries.aiPrompts.getAll({
        filter: { status: { _eq: "published" } }
      });
    },

    create: async (data: Partial<AiPrompt>): Promise<AiPrompt> => {
      const prompt = await directus.request(createItem("ai_prompts", data));
      return prompt as AiPrompt;
    },

    update: async (id: string, data: Partial<AiPrompt>): Promise<AiPrompt> => {
      const prompt = await directus.request(updateItem("ai_prompts", id, data));
      return prompt as AiPrompt;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("ai_prompts", id));
    },

    publish: async (id: string): Promise<AiPrompt> => {
      return await directusQueries.aiPrompts.update(id, { status: "published" });
    },

    unpublish: async (id: string): Promise<AiPrompt> => {
      return await directusQueries.aiPrompts.update(id, { status: "draft" });
    },
  },

  // REDIRECTS CRUD API
  redirects: {
    getAll: async (options: QueryOptions = {}): Promise<Redirect[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["-date_created"],
          fields,
          filter = {},
          search,
        } = options;

        let finalFilter = { ...filter };
        
        if (search) {
          const searchFilter = createSearchFilter(search, ["url_from", "url_to", "note"]);
          finalFilter = { _and: [finalFilter, searchFilter] };
        }

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter: finalFilter,
          fields: fields || ["*"],
        };

        const redirects = await directus.request(readItems("redirects", queryOptions));
        return redirects as Redirect[];
      } catch (error) {
        return handleError<Redirect[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<Redirect | null> => {
      try {
        const { fields } = options;
        const redirect = await directus.request(readItem("redirects", id, { fields: fields || ["*"] }));
        return redirect as Redirect;
      } catch (error) {
        return handleError<Redirect | null>(null)(error);
      }
    },

    getByFromUrl: async (fromUrl: string): Promise<Redirect | null> => {
      try {
        const result = await directus.request(
          readItems("redirects", {
            filter: { url_from: { _eq: fromUrl } },
            limit: 1,
          })
        );
        return result[0] as Redirect || null;
      } catch (error) {
        return handleError<Redirect | null>(null)(error);
      }
    },

    create: async (data: Partial<Redirect>): Promise<Redirect> => {
      const redirect = await directus.request(createItem("redirects", data));
      return redirect as Redirect;
    },

    update: async (id: string, data: Partial<Redirect>): Promise<Redirect> => {
      const redirect = await directus.request(updateItem("redirects", id, data));
      return redirect as Redirect;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("redirects", id));
    },
  },

  // FORM SUBMISSIONS CRUD API
  formSubmissions: {
    getAll: async (options: QueryOptions = {}): Promise<FormSubmission[]> => {
      try {
        const {
          limit = 50,
          offset = 0,
          sort = ["-timestamp"],
          fields,
          filter = {},
          deep,
        } = options;

        const queryOptions: any = {
          limit,
          offset,
          sort,
          filter,
          fields: fields || ["*", "form.*", "values.*", "values.field.*"],
        };

        if (deep) queryOptions.deep = deep;

        const submissions = await directus.request(readItems("form_submissions", queryOptions));
        return submissions as FormSubmission[];
      } catch (error) {
        return handleError<FormSubmission[]>([])(error);
      }
    },

    getById: async (id: string, options: GetByIdOptions = {}): Promise<FormSubmission | null> => {
      try {
        const { fields, deep } = options;
        const queryOptions: any = {
          fields: fields || ["*", "form.*", "values.*", "values.field.*", "values.file.*"],
        };
        if (deep) queryOptions.deep = deep;

        const submission = await directus.request(readItem("form_submissions", id, queryOptions));
        return submission as FormSubmission;
      } catch (error) {
        return handleError<FormSubmission | null>(null)(error);
      }
    },

    getByForm: async (formId: string, options: QueryOptions = {}): Promise<FormSubmission[]> => {
      return await directusQueries.formSubmissions.getAll({
        ...options,
        filter: { form: { _eq: formId }, ...options.filter }
      });
    },

    create: async (data: Partial<FormSubmission>): Promise<FormSubmission> => {
      const submission = await directus.request(createItem("form_submissions", data));
      return submission as FormSubmission;
    },

    delete: async (id: string): Promise<void> => {
      await directus.request(deleteItem("form_submissions", id));
    },

    deleteMany: async (ids: string[]): Promise<void> => {
      await directus.request(deleteItems("form_submissions", ids));
    },
  },

  // UTILITY FUNCTIONS
  utils: {
    // File upload
    uploadFile: async (file: File): Promise<any> => {
      const formData = new FormData();
      formData.append("file", file);
      return await directus.request(uploadFiles(formData));
    },

    // Get aggregate data
    getCount: async (collection: string, filter?: Record<string, unknown>): Promise<number> => {
      try {
        const result = await directus.request(
          aggregate(collection, {
            aggregate: { count: "*" },
            query: { filter }
          })
        );
        return Number(result[0]?.count) || 0;
      } catch (error) {
        return 0;
      }
    },

    // Bulk publish/unpublish
    bulkPublish: async (collection: string, ids: string[]): Promise<void> => {
      await directus.request(
        updateItems(collection, ids, { 
          status: "published", 
          published_at: new Date().toISOString() 
        })
      );
    },

    bulkUnpublish: async (collection: string, ids: string[]): Promise<void> => {
      await directus.request(
        updateItems(collection, ids, { 
          status: "draft", 
          published_at: null 
        })
      );
    },

    // Search across multiple collections
    globalSearch: async (searchTerm: string, collections: string[] = ["posts", "pages"]): Promise<any> => {
      const results: Record<string, any[]> = {};
      
      for (const collection of collections) {
        try {
          let searchFields: string[] = [];
          
          // Define search fields per collection
          switch (collection) {
            case "posts":
              searchFields = ["title", "content", "description"];
              break;
            case "pages":
              searchFields = ["title"];
              break;
            case "forms":
              searchFields = ["title"];
              break;
            case "ai_prompts":
              searchFields = ["name", "description"];
              break;
            default:
              searchFields = ["title", "name"];
          }

          const filter = createSearchFilter(searchTerm, searchFields);
          
          const items = await directus.request(
            readItems(collection, {
              filter,
              limit: 10,
              fields: ["id", "title", "name", "status", "date_created"].filter(Boolean),
            })
          );
          
          results[collection] = items;
        } catch (error) {
          results[collection] = [];
        }
      }
      
      return results;
    },
  },
};
