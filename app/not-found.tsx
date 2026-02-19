import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">404</p>
        <h1 className="text-2xl font-bold text-neutral-900">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-sm text-neutral-600">
          주소가 잘못됐거나, 삭제된 페이지일 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          홈으로 가기
        </Link>

        <Link
          href="/destinations"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
        >
          여행지 둘러보기
        </Link>
      </div>

      <p className="text-xs text-neutral-500">
        문제가 계속되면 새로고침 후 다시 시도해주세요.
      </p>
    </div>
  );
}
