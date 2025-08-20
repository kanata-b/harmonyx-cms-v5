"use server";

import { signIn, signOut, auth } from ".";

async function getAuthSession() {
  try {
    console.log('Fetching auth session...')
    const session = await auth();
    console.log('Session fetched:', session)
    return session;
  } catch (error: unknown) {
    console.error("Failed to get session", error);
    return null;
  }
}

async function getAuthUser() {
  const session = await getAuthSession();
  return session?.user;
}

export { signIn, signOut, getAuthSession, getAuthUser };
