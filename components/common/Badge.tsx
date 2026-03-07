import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "glass";

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" &&
          "bg-neutral-100 text-neutral-700",
        variant === "glass" &&
          "bg-white/15 text-white backdrop-blur px-3 py-1 text-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
