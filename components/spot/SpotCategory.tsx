// src/components/spot/SpotCategory.tsx
"use client";

import type { SpotCategory } from "@/types/spots";
import { SPOT_CATEGORY_ITEMS } from "@/lib/spotCategory";

export default function SpotCategorySection({
  value,
  onChange,
}: {
  value: SpotCategory | null;
  onChange: (next: SpotCategory | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={[
          "rounded-full border px-3 py-1 text-sm transition",
          value === null
            ? "border-neutral-900 bg-neutral-900 text-white"
            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300",
        ].join(" ")}
      >
        전체
      </button>

      {SPOT_CATEGORY_ITEMS.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              "rounded-full border px-3 py-1 text-sm transition",
              active
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
