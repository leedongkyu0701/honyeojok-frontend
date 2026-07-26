"use client";

import Button from "@/shared/ui/Button";

type CommentFormProps = {
  value: string;
  placeholder: string;
  submitLabel: string;
  isSubmitting: boolean;
  compact?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

export default function CommentForm({
  value,
  placeholder,
  submitLabel,
  isSubmitting,
  compact = false,
  onChange,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 ${
          compact ? "h-24" : "h-28"
        }`}
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onCancel}
            className="px-3"
          >
            취소
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onSubmit}
          disabled={!value.trim() || isSubmitting}
          className="px-4"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
