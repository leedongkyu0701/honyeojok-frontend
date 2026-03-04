"use client";

import Button from "@/components/common/Button";

export default function CommentForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "댓글을 남겨보세요.",
  submitLabel = "등록",
  isSubmitting = false,
  compact = false,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  compact?: boolean;
}) {
  const disabled = !value.trim() || isSubmitting;

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 ${
          compact ? "h-24" : "h-28"
        }`}
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button variant="ghost" size="sm" type="button" onClick={onCancel} className="px-3">
            취소
          </Button>
        ) : null}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onSubmit}
          disabled={disabled}
          className="px-4"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
