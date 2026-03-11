"use client";
import * as Sentry from "@sentry/nextjs";

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

const lastToastAt: Record<string, number> = {};

function throttleToast(
  key: string,
  title: string,
  description: string,
  delay: number,
) {
  const now = Date.now();
  if (now - (lastToastAt[key] || 0) < delay) return;

  lastToastAt[key] = now;
  toast.error(title, { description });
}

function toastAuthOnce(title: string, description: string) {
  throttleToast("auth", title, description, 1500);
}

function toastRateLimitOnce(title: string, description: string) {
  throttleToast("rate", title, description, 5000);
}

function shouldReportToSentry(error: unknown) {
  if (error instanceof ApiError) {
    if (isAuthCode(error.code)) return false;
    if (error.code === ErrorCode.RATE_LIMITED) return false;
    if (error.code === ErrorCode.BAD_REQUEST) return false;
    if (error.code === ErrorCode.RESOURCE_NOT_FOUND) return false;

    return error.status >= 500;
  }

  if (error instanceof TypeError) {
    if (error.message.includes("Failed to fetch")) {
      return false;
    }
  }

  return true;
}

function reportToSentry(error: unknown, source: "query" | "mutation") {
  if (!shouldReportToSentry(error)) return;

  if (error instanceof ApiError) {
    Sentry.captureException(error, {
      tags: {
        source,
        errorType: "ApiError",
      },
      extra: {
        status: error.status,
        code: error.code,
        requestId: error.requestId,
      },
    });
    return;
  }

  Sentry.captureException(error, {
    tags: {
      source,
      errorType: "UnknownError",
    },
  });
}

function handleQueryError(error: unknown) {
  if (error instanceof ApiError) {
    if (isAuthCode(error.code)) {
      toastAuthOnce(
        "로그인이 필요한 서비스에요.",
        "우측 상단의 로그인 버튼을 눌러주세요.",
      );
      return;
    }

    if (error.code === ErrorCode.RATE_LIMITED) {
      toastRateLimitOnce("요청이 너무 많아요", "잠시만 기다려주세요");
      return;
    }

    reportToSentry(error, "query");

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
  reportToSentry(error, "query");
  if (!isProd) {
    console.error("[Query Unknown Error]", error);
  }
}

function handleMutationError(error: unknown) {
  // Mutation(저장/수정/삭제)은 유저 액션이므로 토스트 OK
  if (error instanceof ApiError) {
    if (isAuthCode(error.code)) {
      toastAuthOnce(
        "로그인이 필요한 서비스에요.",
        "우측 상단의 로그인 버튼을 눌러주세요.",
      );
      return;
    }

    if (error.code === ErrorCode.RATE_LIMITED) {
      toastRateLimitOnce("요청이 너무 많아요", "잠시만 기다려주세요");
      return;
    }

    toast.error("요청에 실패했어요", {
      description: error.message || "잠시 후 다시 시도해주세요.",
    });

    reportToSentry(error, "mutation");

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

  reportToSentry(error, "mutation");

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
            refetchOnWindowFocus: false, // 탭 간 이동 시 자동 새로고침 비활성화
            staleTime: 1000 * 60 * 5, // 불필요 중복 요청 방지
            gcTime: 1000 * 60 * 30, // 캐시 데이터가 메모리에서 완전히 제거되기 전까지의 시간
            retry: (failureCount, err) => {
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
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
