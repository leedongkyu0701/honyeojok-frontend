import { cn } from "@/shared/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({
  className,
  label = "불러오는 중",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block size-5 animate-spin rounded-full",
        "border-2 border-neutral-300 border-t-neutral-900",
        className,
      )}
    />
  );
}