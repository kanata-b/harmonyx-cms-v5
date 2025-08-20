"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../components/theme/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { useState } from "react";
import { APIProvider } from "@/hooks/use-api";
import { trpc, trpcClient } from "@/lib/trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount) => {
              if (failureCount < 2) return true;
              return false;
            },
          },
        },
      })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <APIProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* <AuthProvider>{children}</AuthProvider> */}
          </ThemeProvider>
        </APIProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
