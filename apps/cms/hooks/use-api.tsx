"use client";

import React, { createContext, useContext } from "react";
import { trpc } from "@/lib/trpc";

interface APIContextValue {
  posts: typeof trpc.posts;
  pages: typeof trpc.pages;
}

const APIContext = createContext<APIContextValue | null>(null);

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
  const value: APIContextValue = {
    posts: trpc.posts,
    pages: trpc.pages,
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error("useAPI must be used within APIProvider");
  }
  return context;
};
