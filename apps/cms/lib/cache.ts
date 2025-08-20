import { unstable_cache } from "next/cache";

// Cache configuration constants
export const CACHE_TAGS = {
  POSTS: "posts",
  PAGES: "pages",
  CATEGORIES: "categories",
  MEDIA: "media",
  USER: "user",
} as const;

export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Generic cache wrapper for Directus queries
export function createCachedQuery<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix: string,
  tags: string[],
  revalidate: number = CACHE_DURATIONS.MEDIUM
) {
  return unstable_cache(
    async (...args: T) => {
      try {
        return await fn(...args);
      } catch (error) {
        console.error(`Cache miss for ${keyPrefix}:`, error);
        throw error;
      }
    },
    [keyPrefix],
    {
      tags,
      revalidate,
    }
  );
}

// Cache invalidation helpers
export async function invalidateCache(tags: string[]) {
  const { revalidateTag } = await import("next/cache");
  tags.forEach((tag) => {
    revalidateTag(tag);
  });
}

// Memory cache for frequently accessed data
class MemoryCache {
  private cache = new Map<string, { data: unknown; expires: number }>();
  private maxSize = 100;

  set(key: string, data: unknown, ttl: number = CACHE_DURATIONS.SHORT * 1000) {
    // Clean up expired entries
    this.cleanup();

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value ?? "";
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();
