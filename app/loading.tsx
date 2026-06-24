export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3"
      >
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900"
        />
        <p className="text-sm text-neutral-600">불러오는 중...</p>
      </div>
    </div>
  );
}