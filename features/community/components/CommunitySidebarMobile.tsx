"use client";

import type { CategoryType } from "@/features/community/schemas/response";
import { ProvinceGroup } from "@/shared/types/util";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";

const tabs: { label: string; value: CategoryType }[] = [
  { label: "전체", value: "ALL" },
  { label: "리뷰", value: "REVIEW" },
  { label: "자유", value: "FREE" },
  { label: "질문", value: "QUESTION" },
];

const provinceItems: { label: string; value: ProvinceGroup | null }[] = [
  { label: "전체", value: null },
  { label: "수도권", value: ProvinceGroup.SEOUL_GYEONGGI },
  { label: "강원", value: ProvinceGroup.GANGWON },
  { label: "충청", value: ProvinceGroup.CHUNGCHEONG },
  { label: "전라", value: ProvinceGroup.JEOLLA },
  { label: "경상", value: ProvinceGroup.GYEONGSANG },
  { label: "제주", value: ProvinceGroup.JEJU },
];

type Props = {
  value: CategoryType;
  onChange: (next: CategoryType) => void;
  province: ProvinceGroup | null;
  onChangeProvince: (next: ProvinceGroup | null) => void;
};

export default function CommunityTabsMobile({
  value,
  onChange,
  province,
  onChangeProvince,
}: Props) {
  const isReview = value === "REVIEW";

  return (
    <div className="md:hidden">
      <div className="flex flex-wrap gap-6 border-b border-neutral-200">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            variant="tab"
            size="sm"
            className={cn(
              tab.value === value && "border-neutral-900 text-neutral-900",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isReview && (
        <div className="mt-3 px-4">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
            {provinceItems.map((p) => {
              const active = province === p.value;
              return (
                <Button
                  key={p.value ?? "ALL"}
                  onClick={() => onChangeProvince(p.value)}
                  variant={active ? "primary" : "outline"}
                  size="sm"
                  className="shrink-0"
                >
                  {p.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
