import Link from "next/link";

export default function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-8">
          <Link
            href="/auth/login"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ← 로그인화면으로
          </Link>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            최종 수정일: {updatedAt}
          </p>
        </div>

        <article className="space-y-6 text-neutral-800 leading-relaxed">
          {children}
        </article>

      </div>
    </main>
  );
}
