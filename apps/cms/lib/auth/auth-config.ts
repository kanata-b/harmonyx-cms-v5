import type { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { directusAuth } from "../directus/directus-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "directus",
      name: "directus",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize::", credentials);
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        try {
          const response = await directusAuth.login(
            credentials.email,
            credentials.password
          );
          const data = await response.data;

          if (data?.access_token) {
            const meResponse = await fetch(
              `${process.env.DIRECTUS_URL}/users/me`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data?.access_token}`,
                },
              }
            );

            const meData = await meResponse.json();
            // console.log('Me Data:', meData)

            return {
              id: credentials.email,
              email: credentials.email,
              firstName: meData.data.first_name || null,
              lastName: meData.data.last_name || null,
              accessToken: data?.access_token,
              refreshToken: data?.refresh_token,
              expires: data?.expires,
            };
          }

          return null;
        } catch (error) {
          console.error("Directus authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const newToken = { ...token };
      if (user) {
        newToken.accessToken = user.accessToken;
        newToken.refreshToken = user.refreshToken;
        newToken.expires = user.expires;
        newToken.user = {
          email: user.email,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        };
      }

      return newToken;
    },
    async session({ session, token }) {
      const newSession = {
        ...session,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        expires: token.expires as number,
        user: token.user as User,
      };

      return newSession;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
