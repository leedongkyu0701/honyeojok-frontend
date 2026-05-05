import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "tab";

type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400",
  outline:
    "border border-neutral-200 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-400",
  ghost:
    "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300",
  tab:
    "rounded-none text-sm font-semibold text-neutral-500 " +
    "border-b-2 border-transparent hover:text-neutral-900 " +
    "focus-visible:ring-neutral-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
