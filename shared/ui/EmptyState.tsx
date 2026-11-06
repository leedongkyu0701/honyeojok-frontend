import { cn } from "@/shared/lib/utils";
import Button from "./Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-neutral-500">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          className="mt-4 min-h-11"
          variant="outline"
          size="sm"
          onClick={onAction}
          disabled={actionDisabled}
          aria-busy={actionDisabled}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
