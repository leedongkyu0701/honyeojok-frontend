import { Spinner } from "@/shared/ui/Spinner";

type PageLoaderProps = {
  message?: string;
};

export function PageLoader({
  message = "불러오는 중이에요.",
}: PageLoaderProps) {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6"
      role="status"
      aria-live="polite"
    >
      <Spinner aria-hidden />

      <p className="text-sm text-neutral-600">
        {message}
      </p>
    </main>
  );
}