"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { ErrorCode } from "@/types/error-code";
import { ApiError } from "@/lib/apiError";
import { parseApiError } from "@/lib/parseApiError";
import { toast } from "sonner";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SocialLoginCallback() {
  const router = useRouter();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        await parseApiError(res);

        const data = await res.json();

        setAccessToken(data.accessToken);
        router.replace("/");
      } catch (error) {
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
  }, [router, setAccessToken]);

  // UX: 로딩 표시(없어도 되지만 화면이 비면 당황함)
  return (
    <div className="min-h-[calc(100vh-60px)] grid place-items-center">
      <div className="text-sm text-neutral-600">로그인 처리 중...</div>
    </div>
  );
}
