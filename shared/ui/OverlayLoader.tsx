export function OverlayLoader({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 grid place-items-center pointer-events-none">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
    </div>
  );
}