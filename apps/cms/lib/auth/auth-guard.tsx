"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getAuthSession } from "./action";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Public routes that don't require authentication
      const publicRoutes = ["/", "/login", "/posts"];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (isPublicRoute) {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // Check sessionStorage for auth token
      getAuthSession().then((session) => {
        // console.log('session', session)
        if (!session) {
          console.log("No valid token found, redirecting to signin...");
          router.push("/login");
          return;
        }

        setIsAuthenticated(true);
        setIsChecking(false);
      });
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  // If not authenticated and on protected route, don't render children
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
