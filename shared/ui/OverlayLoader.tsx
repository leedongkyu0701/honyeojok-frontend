import { Spinner } from "@/shared/ui/Spinner";

export function OverlayLoader({
  show,
}: {
  show: boolean;
}) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 grid place-items-center">
      <Spinner />
    </div>
  );
}