"use client";
import * as Sentry from "@sentry/nextjs";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ReactNode, useEffect } from "react";
import { refreshToken } from "@/features/auth/api/auth.api";
import { ApiError } from "@/shared/api/apiError";
import { ErrorCode } from "@/shared/types/error-code";

export default function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const logout = useAuthStore((s) => s.logout);
  const setAuthInitialized = useAuthStore((s) => s.setAuthInitialized);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const data = await refreshToken();
        if (isMounted) setAccessToken(data.accessToken);
      } catch (error) {
        const isSignedOut =
          error instanceof ApiError &&
          (error.code === ErrorCode.AUTH_REFRESH_INVALID ||
            error.code === ErrorCode.AUTH_UNAUTHORIZED);

        if (!isSignedOut && error instanceof ApiError && error.status >= 500) {
          Sentry.captureException(error, {
            tags: { source: "auth-initialization" },
          });
        }

        if (isMounted) logout();
      } finally {
        if (isMounted) setAuthInitialized(true);
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [setAccessToken, logout, setAuthInitialized]);

  return <>{children}</>;
}
