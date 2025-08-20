import { directus } from "./directus";
import {
  AuthenticationData,
  login,
  LoginOptions,
  logout,
  refresh,
  readMe,
} from "@directus/sdk";

export interface LoginResult {
  success: boolean;
  data?: AuthenticationData;
  error?: string;
}

export const directusAuth = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    try {
      const options: LoginOptions = {
        mode: "json",
      };
      const result = await directus.request(login(email, password, options));
      return { success: true, data: result };
    } catch {
      return {
        success: false,
        error: "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await directus.request(logout());
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Logout failed",
      };
    }
  },

  refresh: async (): Promise<LoginResult> => {
    try {
      const result = await directus.request(refresh("json"));
      return { success: true, data: result };
    } catch {
      return {
        success: false,
        error: "Token refresh failed",
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const user = await directus.request(readMe());
      return { success: true, data: user };
    } catch {
      // Return null user instead of error for unauthenticated state
      return {
        success: false,
        data: null,
        error: "Not authenticated",
      };
    }
  },
};
