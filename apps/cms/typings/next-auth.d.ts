import "next-auth";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 * */
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string | null;
    refreshToken?: string | null;
    expires?: number | null;
    user?: User;
  }
  interface User {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    expires?: number | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string | null;
    refreshToken?: string | null;
    expires?: number | null;
    user?: User;
  }
}
