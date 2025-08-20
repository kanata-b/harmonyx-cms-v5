import { directusQueries } from "./directus-queries";
import {
  createCachedQuery,
  CACHE_TAGS,
  CACHE_DURATIONS,
  memoryCache,
} from "../cache";
import type {
  Post,
  Page,
  Form,
  Navigation,
  Globals,
  AiPrompt,
  Redirect,
  FormSubmission,
} from "./directus-schemas";

// Extended Cache Tags for new collections
export const EXTENDED_CACHE_TAGS = {
  ...CACHE_TAGS,
  NAVIGATION: "navigation",
  GLOBALS: "globals",
  FORMS: "forms",
  AI_PROMPTS: "ai_prompts",
  REDIRECTS: "redirects",
  FORM_SUBMISSIONS: "form_submissions",
} as const;

// Helper function for conditional caching based on content status
function createConditionalCache<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  getDuration: (...args: T) => number,
  tags: string[]
) {
  return (...args: T) => {
    const duration = getDuration(...args);
    const keyPrefix = `conditional-${fn.name}-${JSON.stringify(args)}`;
    return createCachedQuery(fn, keyPrefix, tags, duration)(...args);
  };
}

// Cached versions of Directus queries with appropriate cache strategies
export const cachedDirectusQueries = {
  // POSTS - High Priority with Conditional Caching
  posts: {
    getAll: createConditionalCache(
      directusQueries.posts.getAll,
      (options) => {
        // Published posts cache longer than drafts
        const hasPublishedFilter = options?.filter && 
          JSON.stringify(options.filter).includes('"status":{"_eq":"published"}');
        return hasPublishedFilter ? CACHE_DURATIONS.LONG : CACHE_DURATIONS.MEDIUM;
      },
      [EXTENDED_CACHE_TAGS.POSTS]
    ),

    getBySlug: createCachedQuery(
      directusQueries.posts.getBySlug,
      "posts-by-slug",
      [EXTENDED_CACHE_TAGS.POSTS],
      CACHE_DURATIONS.LONG
    ),

    getById: createCachedQuery(
      directusQueries.posts.getById,
      "posts-by-id",
      [EXTENDED_CACHE_TAGS.POSTS],
      CACHE_DURATIONS.MEDIUM
    ),
  },

  // PAGES - Long Cache for Static Content
  pages: {
    getAll: createCachedQuery(
      directusQueries.pages.getAll,
      "pages-all",
      [EXTENDED_CACHE_TAGS.PAGES],
      CACHE_DURATIONS.LONG
    ),

    getBySlug: createCachedQuery(
      directusQueries.pages.getBySlug,
      "pages-by-slug",
      [EXTENDED_CACHE_TAGS.PAGES],
      CACHE_DURATIONS.VERY_LONG // Static pages cache longer
    ),

    getById: createCachedQuery(
      directusQueries.pages.getById,
      "pages-by-id",
      [EXTENDED_CACHE_TAGS.PAGES],
      CACHE_DURATIONS.MEDIUM
    ),
  },

  // GLOBALS - Ultra Long Cache (Site Settings)
  globals: {
    get: createCachedQuery(
      directusQueries.globals.get,
      "globals",
      [EXTENDED_CACHE_TAGS.GLOBALS],
      CACHE_DURATIONS.VERY_LONG
    ),
  },

  // NAVIGATION - Very Long Cache
  navigation: {
    getActive: createCachedQuery(
      directusQueries.navigation.getActive,
      "navigation-active",
      [EXTENDED_CACHE_TAGS.NAVIGATION],
      CACHE_DURATIONS.VERY_LONG
    ),

    getAll: createCachedQuery(
      directusQueries.navigation.getAll,
      "navigation-all",
      [EXTENDED_CACHE_TAGS.NAVIGATION],
      CACHE_DURATIONS.LONG
    ),

    getById: createCachedQuery(
      directusQueries.navigation.getById,
      "navigation-by-id",
      [EXTENDED_CACHE_TAGS.NAVIGATION],
      CACHE_DURATIONS.MEDIUM
    ),
  },

  // FORMS - Medium Cache
  forms: {
    getAll: createCachedQuery(
      directusQueries.forms.getAll,
      "forms-all",
      [EXTENDED_CACHE_TAGS.FORMS],
      CACHE_DURATIONS.LONG
    ),

    getById: createCachedQuery(
      directusQueries.forms.getById,
      "forms-by-id",
      [EXTENDED_CACHE_TAGS.FORMS],
      CACHE_DURATIONS.MEDIUM
    ),
  },

  // AI PROMPTS - Long Cache
  aiPrompts: {
    getAll: createCachedQuery(
      directusQueries.aiPrompts.getAll,
      "ai-prompts-all",
      [EXTENDED_CACHE_TAGS.AI_PROMPTS],
      CACHE_DURATIONS.LONG
    ),

    getPublished: createCachedQuery(
      directusQueries.aiPrompts.getPublished,
      "ai-prompts-published",
      [EXTENDED_CACHE_TAGS.AI_PROMPTS],
      CACHE_DURATIONS.LONG
    ),

    getById: createCachedQuery(
      directusQueries.aiPrompts.getById,
      "ai-prompts-by-id",
      [EXTENDED_CACHE_TAGS.AI_PROMPTS],
      CACHE_DURATIONS.MEDIUM
    ),
  },

  // REDIRECTS - Very Long Cache
  redirects: {
    getAll: createCachedQuery(
      directusQueries.redirects.getAll,
      "redirects-all",
      [EXTENDED_CACHE_TAGS.REDIRECTS],
      CACHE_DURATIONS.VERY_LONG
    ),

    getByFromUrl: createCachedQuery(
      directusQueries.redirects.getByFromUrl,
      "redirects-by-url",
      [EXTENDED_CACHE_TAGS.REDIRECTS],
      CACHE_DURATIONS.VERY_LONG
    ),

    getById: createCachedQuery(
      directusQueries.redirects.getById,
      "redirects-by-id",
      [EXTENDED_CACHE_TAGS.REDIRECTS],
      CACHE_DURATIONS.MEDIUM
    ),
  },

  // FORM SUBMISSIONS - Short Cache (Frequently Updated)
  formSubmissions: {
    getAll: createCachedQuery(
      directusQueries.formSubmissions.getAll,
      "form-submissions-all",
      [EXTENDED_CACHE_TAGS.FORM_SUBMISSIONS],
      CACHE_DURATIONS.SHORT
    ),

    getById: createCachedQuery(
      directusQueries.formSubmissions.getById,
      "form-submissions-by-id",
      [EXTENDED_CACHE_TAGS.FORM_SUBMISSIONS],
      CACHE_DURATIONS.SHORT
    ),

    getByForm: createCachedQuery(
      directusQueries.formSubmissions.getByForm,
      "form-submissions-by-form",
      [EXTENDED_CACHE_TAGS.FORM_SUBMISSIONS],
      CACHE_DURATIONS.SHORT
    ),
  },
};

// Enhanced queries with memory caching for frequently accessed data
export const enhancedQueries = {
  // Get popular posts with memory cache
  getPopularPosts: async (limit = 10): Promise<Post[]> => {
    const cacheKey = `popular-posts-${limit}`;
    const cached = memoryCache.get(cacheKey);

    if (cached) return cached as Post[];

    const posts = await cachedDirectusQueries.posts.getAll({
      filter: { status: { _eq: "published" } },
      limit,
      sort: ["-date_created"]
    });

    memoryCache.set(cacheKey, posts, CACHE_DURATIONS.MEDIUM * 1000);
    return posts as Post[];
  },

  // Get site navigation with aggressive memory caching
  getSiteNavigation: async (): Promise<Navigation[]> => {
    const cacheKey = "site-navigation";
    const cached = memoryCache.get(cacheKey);

    if (cached) return cached as Navigation[];

    const navigation = await cachedDirectusQueries.navigation.getActive();
    memoryCache.set(cacheKey, navigation, CACHE_DURATIONS.VERY_LONG * 1000);
    return navigation as Navigation[];
  },

  // Get global settings with memory cache
  getGlobalSettings: async (): Promise<Globals | null> => {
    const cacheKey = "global-settings";
    const cached = memoryCache.get(cacheKey);

    if (cached) return cached as Globals;

    const globals = await cachedDirectusQueries.globals.get();
    memoryCache.set(cacheKey, globals, CACHE_DURATIONS.VERY_LONG * 1000);
    return globals;
  },

  // Homepage content bundle for performance
  getHomepageData: async () => {
    const cacheKey = "homepage-bundle";
    const cached = memoryCache.get(cacheKey);

    if (cached) return cached;

    try {
      const [globals, navigation, recentPosts, homepage] = await Promise.all([
        cachedDirectusQueries.globals.get(),
        cachedDirectusQueries.navigation.getActive(),
        cachedDirectusQueries.posts.getAll({ 
          limit: 5, 
          filter: { status: { _eq: "published" } } 
        }),
        cachedDirectusQueries.pages.getBySlug("home") || 
        cachedDirectusQueries.pages.getBySlug("/")
      ]);

      const bundle = { globals, navigation, recentPosts, homepage };
      memoryCache.set(cacheKey, bundle, CACHE_DURATIONS.LONG * 1000);
      return bundle;
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      return {
        globals: null,
        navigation: [],
        recentPosts: [],
        homepage: null
      };
    }
  },

  // Get published forms for public use
  getPublishedForms: async (): Promise<Form[]> => {
    const cacheKey = "published-forms";
    const cached = memoryCache.get(cacheKey);

    if (cached) return cached as Form[];

    const forms = await cachedDirectusQueries.forms.getAll({
      filter: { is_active: { _eq: true } }
    });

    memoryCache.set(cacheKey, forms, CACHE_DURATIONS.LONG * 1000);
    return forms as Form[];
  },

  // Get recent posts for sidebars/widgets
  getRecentPosts: async (limit = 5): Promise<Post[]> => {
    const cacheKey = `recent-posts-${limit}`;
    const cached = memoryCache.get(cacheKey);

    if (cached) return cached as Post[];

    const posts = await cachedDirectusQueries.posts.getAll({
      filter: { status: { _eq: "published" } },
      limit,
      sort: ["-published_at", "-date_created"],
      fields: ["id", "title", "slug", "description", "image", "published_at"]
    });

    memoryCache.set(cacheKey, posts, CACHE_DURATIONS.MEDIUM * 1000);
    return posts as Post[];
  },
};

// Cache Management System
export const cacheManager = {
  // Invalidate related caches when content changes
  invalidateContentCaches: async (collection: string, id?: string) => {
    const { revalidateTag } = await import("next/cache");
    
    try {
      switch (collection) {
        case "posts":
          revalidateTag(EXTENDED_CACHE_TAGS.POSTS);
          memoryCache.delete("popular-posts");
          memoryCache.delete("recent-posts");
          memoryCache.delete("homepage-bundle");
          break;
        case "pages":
          revalidateTag(EXTENDED_CACHE_TAGS.PAGES);
          memoryCache.delete("homepage-bundle");
          break;
        case "navigation":
          revalidateTag(EXTENDED_CACHE_TAGS.NAVIGATION);
          memoryCache.delete("site-navigation");
          memoryCache.delete("homepage-bundle");
          break;
        case "globals":
          revalidateTag(EXTENDED_CACHE_TAGS.GLOBALS);
          memoryCache.delete("global-settings");
          memoryCache.delete("homepage-bundle");
          break;
        case "forms":
          revalidateTag(EXTENDED_CACHE_TAGS.FORMS);
          memoryCache.delete("published-forms");
          break;
        case "ai_prompts":
          revalidateTag(EXTENDED_CACHE_TAGS.AI_PROMPTS);
          break;
        case "redirects":
          revalidateTag(EXTENDED_CACHE_TAGS.REDIRECTS);
          break;
        case "form_submissions":
          revalidateTag(EXTENDED_CACHE_TAGS.FORM_SUBMISSIONS);
          break;
        default:
          console.warn(`Unknown collection for cache invalidation: ${collection}`);
      }
    } catch (error) {
      console.error(`Error invalidating cache for ${collection}:`, error);
    }
  },

  // Cache warming for critical paths
  warmCriticalCaches: async () => {
    console.log("🔥 Warming critical caches...");
    
    try {
      await Promise.allSettled([
        enhancedQueries.getGlobalSettings(),
        enhancedQueries.getSiteNavigation(),
        enhancedQueries.getPopularPosts(5),
        enhancedQueries.getHomepageData(),
        enhancedQueries.getPublishedForms(),
        enhancedQueries.getRecentPosts(10),
      ]);
      
      console.log("✅ Critical caches warmed successfully");
    } catch (error) {
      console.error("❌ Error warming caches:", error);
    }
  },

  // Clear all memory caches
  clearAllMemoryCaches: () => {
    const keys = [
      "popular-posts",
      "recent-posts", 
      "site-navigation",
      "global-settings",
      "homepage-bundle",
      "published-forms"
    ];
    
    keys.forEach(key => {
      // Clear with different limits/variations
      if (key.includes("posts")) {
        for (let i = 1; i <= 20; i++) {
          memoryCache.delete(`${key}-${i}`);
        }
      } else {
        memoryCache.delete(key);
      }
    });
    
    console.log("🧹 All memory caches cleared");
  },

  // Get cache statistics
  getCacheStats: () => {
    // Track known cache keys instead of querying cache internals
    const knownCacheKeys = [
      "popular-posts", "recent-posts", "site-navigation", 
      "global-settings", "homepage-bundle", "published-forms"
    ];
    
    // Check which caches are active
    const activeCaches = knownCacheKeys.filter(key => {
      try {
        return memoryCache.get(key) !== undefined;
      } catch {
        return false;
      }
    });

    return {
      memoryCache: {
        knownKeys: knownCacheKeys,
        activeCaches: activeCaches,
        activeCount: activeCaches.length,
      },
      timestamp: new Date().toISOString()
    };
  },
};
