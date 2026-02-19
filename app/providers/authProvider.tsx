"use client";
import { useAuthStore } from "@/stores/auth.store";
import { ReactNode, useEffect } from "react";
import { refreshToken } from "@/lib/api/auth/api";
import { ApiError } from "@/lib/apiError";
import { ErrorCode } from "@/types/error-code";

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
        setAuthInitialized(true); // 초기화 완료 표시 (성공/실패 상관없이)
      }
    };

    initializeAuth();
  }, [setAccessToken, logout, setAuthInitialized]);

  return <>{children}</>;
}
