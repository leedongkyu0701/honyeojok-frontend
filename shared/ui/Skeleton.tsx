import { cn } from "@/shared/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-neutral-200/70",
        className
      )}
    />
  );
}
