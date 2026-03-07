import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string | ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3",
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
       {action ? (
        <div className="ml-auto w-full sm:w-auto flex justify-end shrink-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}
