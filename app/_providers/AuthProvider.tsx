"use client";
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
    const initializeAuth = async () => {
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
      } catch (error) {
        if (error instanceof ApiError) {
          if (
            error.code === ErrorCode.AUTH_REFRESH_INVALID ||
            error.code === ErrorCode.AUTH_UNAUTHORIZED
          ) {
            logout();
            return;
          }
        }
      }
      finally {
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [setAccessToken, logout, setAuthInitialized]);

  return <>{children}</>;
}
