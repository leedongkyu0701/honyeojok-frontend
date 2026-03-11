"use client";

import { useState } from "react";

export default function SentryTraceTestPage() {
  const [result, setResult] = useState<string>("");

  async function handleSuccessRequest() {
    try {
      setResult("요청 중...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/debug/debug/trace-check`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const text = await res.text();
      setResult(`성공 응답: ${text}`);
    } catch (error) {
      console.error("success request error", error);
      setResult("성공 요청 실패");
    }
  }

  

  async function handleErrorRequest() {
    try {
      setResult("에러 요청 중...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/debug/sentry`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const text = await res.text();
      setResult(`에러 응답: ${text}`);
    } catch (error) {
      console.error("error request catch", error);
      setResult("에러 요청 catch됨");
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold">Sentry Trace 연결 테스트</h1>

      <p className="text-sm text-gray-600">
        이 페이지는 프론트 → 백엔드 trace 연결 확인용입니다.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSuccessRequest}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          정상 API 호출
        </button>

        <button
          type="button"
          onClick={handleErrorRequest}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          에러 API 호출
        </button>
      </div>

      <div className="rounded-lg border p-4 text-sm">
        <strong>결과:</strong>
        <div className="mt-2 break-all">{result || "아직 없음"}</div>
      </div>
    </main>
  );
}