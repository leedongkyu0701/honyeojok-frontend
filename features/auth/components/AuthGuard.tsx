"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/shared/ui/PageLoader";

import { useAuthStore } from "@/features/auth/store/auth.store";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authInitialized = useAuthStore((state) => state.authInitialized);

  useEffect(() => {
    if (authInitialized && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authInitialized, isAuthenticated, router]);

  if (!authInitialized) {
    // 로그인 상태 확인 중이면 로딩 화면 표시
    return <PageLoader message="로그인 정보를 확인하고 있어요." />;
  }

  if (!isAuthenticated) {
    // 로그인 상태가 아니면 로그인 페이지로 이동
    return <PageLoader message="로그인 페이지로 이동하고 있어요." />;
  }
  return children;
}
