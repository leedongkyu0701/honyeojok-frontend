"use client";

import { cn } from "@/lib/utils";
import type { SpotCategory } from "@/types/spots";
import { SPOT_CATEGORY_ITEMS } from "@/lib/spotCategory";
import Button from "../common/Button";

export default function SpotCategorySection({
  value,
  onChange,
}: {
  value: SpotCategory | null;
  onChange: (next: SpotCategory | null) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {SPOT_CATEGORY_ITEMS.map((p) => {
        const active = p.value === value;
        return (
          <Button
            key={p.value}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(p.value)}
            aria-pressed={active}
            className={cn(
              "shrink-0 rounded-full",
              active &&
                "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-900",
            )}
          >
            {p.label}
          </Button>
        );
      })}
    </div>
  );
}
