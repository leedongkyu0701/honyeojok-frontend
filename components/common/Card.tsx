import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  children: ReactNode;
};

type CardContentProps = {
  className?: string;
  children: ReactNode;
};

export function Card({
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardContent({
  className,
  children,
}: CardContentProps) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}
