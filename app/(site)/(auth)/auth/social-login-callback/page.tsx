"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ErrorCode } from "@/shared/types/error-code";
import { ApiError } from "@/shared/api/apiError";
import { refreshToken } from "@/features/auth/api/auth.api";
import { toast } from "sonner";

export default function SocialLoginCallback() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const data = await refreshToken();

        if (!isMounted) return;
        setAccessToken(data.accessToken);
        router.replace("/");
      } catch (error) {
        if (!isMounted) return;
        if (error instanceof ApiError) {
          if (error.code === ErrorCode.OAUTH_FAILED) {
            toast.error("소셜 로그인에 실패했어요", {
              description: "다시 시도해주세요.",
            });
          }
        }
        router.replace("/auth/login");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router, setAccessToken]);

  return (
    <div className="min-h-[calc(100vh-60px)] grid place-items-center">
      <div className="text-sm text-neutral-600">로그인 처리 중...</div>
    </div>
  );
}
