"use client";

import { ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/apiError";
import { ErrorCode } from "@/types/error-code";

const isProd = process.env.NODE_ENV === "production";

function isAuthCode(code?: ErrorCode) {
  return (
    code === ErrorCode.AUTH_FORBIDDEN ||
    code === ErrorCode.AUTH_UNAUTHORIZED ||
    code === ErrorCode.AUTH_TOKEN_EXPIRED ||
    code === ErrorCode.AUTH_INVALID_TOKEN ||
    code === ErrorCode.AUTH_REFRESH_INVALID
  );
}

/**
 * ✅ AUTH 토스트 중복 방지 가드
 * - fetchClient가 이미 logout을 담당하므로 여기서는 "알림"만 1회 표시
 */
let authToastHandled = false;
function toastAuthOnce(title: string, description: string) {
  if (authToastHandled) return;
  authToastHandled = true;

  toast.error(title, { description });

  setTimeout(() => {
    authToastHandled = false;
  }, 1500);
}

let lastRateToastAt = 0;
function toastRateLimitOnce() {
  const now = Date.now();
  if (now - lastRateToastAt < 5000) return; // 5초 이내 중복 방지
  lastRateToastAt = now;

  toast.error("요청이 너무 많아요", {
    description: "잠시 후 다시 시도해주세요.",
  });
}



function handleQueryError(error: unknown) {
  // Query(조회)는 토스트 남발 방지: AUTH만 예외로 "한 번만" 토스트
  if (error instanceof ApiError) {
    if (isAuthCode(error.code)) {
      toastAuthOnce("로그인이 필요한 서비스에요.","우측 상단의 로그인 버튼을 눌러주세요.");
      return;
    }

    if (error.code === ErrorCode.RATE_LIMITED) {
      toastRateLimitOnce();
      return;
    }

    // Query는 화면에서 EmptyState로 처리하므로 토스트 X, 대신 로그
    if (!isProd) {
      console.error("[Query ApiError]", {
        status: error.status,
        code: error.code,
        message: error.message,
        requestId: error.requestId,
      });
    }
    return;
  }
  if (!isProd) {
  console.error("[Query Unknown Error]", error);
  }
}

function handleMutationError(error: unknown) {
  // Mutation(저장/수정/삭제)은 유저 액션이므로 토스트 OK
  if (error instanceof ApiError) {
    if (isAuthCode(error.code)) {
      toastAuthOnce("로그인이 필요한 서비스에요.","우측 상단의 로그인 버튼을 눌러주세요.");
      return;
    }
    
    if (error.code === ErrorCode.RATE_LIMITED) {
      toastRateLimitOnce();
      return;
    }

    toast.error("요청에 실패했어요", {
      description: error.message || "잠시 후 다시 시도해주세요.",
    });

    if (!isProd) {
      console.error("[Mutation ApiError]", {
        status: error.status,
        code: error.code,
        message: error.message,
        requestId: error.requestId,
      });
    }
    return;
  }

  toast.error("알 수 없는 오류가 발생했어요", {
    description: "잠시 후 다시 시도해주세요.",
  });
  if (!isProd) {
    console.error("[Mutation Unknown Error]", error);
  }
}

export default function QCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // ✅ v5 전역 에러 처리: queryCache / mutationCache
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // mutation meta로 전역 토스트 억제 가능
            const meta = mutation.options.meta as
              | { silent?: boolean }
              | undefined;
            if (meta?.silent) return;
            handleMutationError(error);
          },
        }),

        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            retry: (failureCount, err) => {
              // ✅ 조회는 가벼운 재시도 1번 정도만 (실무에서 흔함)
              if (err instanceof ApiError) {
                if (isAuthCode(err.code)) return false;
                if (err.code === ErrorCode.RESOURCE_NOT_FOUND) return false;
                if (err.code === ErrorCode.RATE_LIMITED) return false;
                if (err.code === ErrorCode.BAD_REQUEST) return false;
              }
              return failureCount < 1;
            },
          },
          mutations: {
            retry: false, // ✅ mutation은 중복 저장 위험 때문에 보통 꺼둠
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
