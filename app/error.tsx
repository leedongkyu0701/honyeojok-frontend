// app/error.tsx
"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">오류 발생</p>
        <h1 className="text-2xl font-bold text-neutral-900">
          문제가 발생했어요
        </h1>
        <p className="text-sm text-neutral-600">
          페이지를 표시하는 중 오류가 발생했어요.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          다시 시도
        </button>

        <Link
          href="/"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
        >
          홈으로 이동
        </Link>
      </div>

      <p className="text-xs text-neutral-500">
        문제가 계속되면 새로고침 후 다시 시도해주세요.
      </p>

    </div>
  );
}
