export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        <p className="text-sm text-neutral-600">불러오는 중...</p>
      </div>
    </div>
  );
}
