"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/apiError";
import { ErrorCode } from "@/types/error-code";

export default function SentryTagTestPage() {
  useQuery({
    queryKey: ["sentry-tag-test"],
    queryFn: async () => {
      throw new ApiError(
        500,
        "This is a test error for Sentry tags",
        "INTERNAL_SERVER_ERROR" as ErrorCode,
        undefined,
        "test-request-id-123",
      );
    },
    retry: false,
  });

  return <div>테스트 페이지</div>;
}
