"use client";

import {
  COMMUNITY_CATEGORY_OPTIONS,
  PROVINCE_FILTER_OPTIONS,
} from "@/features/community/constants/community.constants";
import type { CategoryType } from "@/features/community/schemas/post.schema";
import { cn } from "@/shared/lib/utils";
import type { ProvinceGroup } from "@/shared/types/util";
import Button from "@/shared/ui/Button";

type CommunityTabsMobileProps = {
  value: CategoryType;
  province: ProvinceGroup | null;
  onChange: (next: CategoryType) => void;
  onChangeProvince: (next: ProvinceGroup | null) => void;
};

export default function CommunityTabsMobile({
  value,
  province,
  onChange,
  onChangeProvince,
}: CommunityTabsMobileProps) {
  return (
    <div className="md:hidden">
      <div className="flex flex-wrap gap-6 border-b border-neutral-200">
        {COMMUNITY_CATEGORY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            variant="tab"
            size="sm"
            className={cn(
              option.value === value && "border-neutral-900 text-neutral-900",
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {value === "REVIEW" ? (
        <div className="mt-3 px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PROVINCE_FILTER_OPTIONS.map((option) => (
              <Button
                key={option.value ?? "ALL"}
                onClick={() => onChangeProvince(option.value)}
                variant={province === option.value ? "primary" : "outline"}
                size="sm"
                className="shrink-0"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
