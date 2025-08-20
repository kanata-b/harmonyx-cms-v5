import { createDirectus, rest, authentication, realtime } from "@directus/sdk";
import { Schema } from "./directus-schemas";

const directusUrl =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

if (!directusUrl) {
  throw new Error("NEXT_PUBLIC_DIRECTUS_URL environment variable is required");
}

export const directus = createDirectus(directusUrl)
  .with(authentication("json", { credentials: "include" }))
  .with(rest({ credentials: "include" }))
  .with(realtime());

export const directusHelpers = {
  // Get asset URL with transformations
  getAssetUrl: (
    fileId: string,
    transforms?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    }
  ) => {
    if (!fileId) return null;

    const baseUrl = `${directusUrl}/assets/${fileId}`;

    if (!transforms) return baseUrl;

    const params = new URLSearchParams();
    if (transforms.width) params.append("width", transforms.width.toString());
    if (transforms.height)
      params.append("height", transforms.height.toString());
    if (transforms.quality)
      params.append("quality", transforms.quality.toString());
    if (transforms.format) params.append("format", transforms.format);

    return `${baseUrl}?${params.toString()}`;
  },

  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  },

  // Format date for display
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const user = await directus.request(
        // @ts-expect-error - Directus types issue
        { method: "GET", path: "/users/me" }
      );
      return !!user;
    } catch {
      return false;
    }
  },
};

export type { Schema };
