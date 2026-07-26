"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
  labelledBy?: string;
  describedBy?: string;
};

export default function StarRating({
  value,
  onChange,
  max = 5,
  disabled = false,
  labelledBy,
  describedBy,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="flex items-center gap-1"
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          disabled={disabled}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          onClick={() => onChange(star)}
          className="rounded-md p-1 disabled:cursor-not-allowed"
          aria-label={`${star}점`}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-transform",
              !disabled ? "hover:scale-110" : "",
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-neutral-300",
            )}
          />
        </button>
      ))}

      <span className="ml-2 text-sm text-neutral-500">
        {value} / {max}
      </span>
    </div>
  );
}
