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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
      } catch (error) {
        // 처음 로딩시 실패는 그냥 미로그인 상태로 둠
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
    };

    initializeAuth();
  }, [setAccessToken, logout]);

  return <>{children}</>;
}
