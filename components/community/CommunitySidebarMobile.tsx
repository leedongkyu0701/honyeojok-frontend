"use client";

import type { CategoryType } from "@/types/community";
import { ProvinceGroup } from "@/types/util";
import { cn } from "@/lib/utils";

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

  // ✅ 추가
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
      {/* 탭 */}
      <div className="flex flex-wrap gap-6 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "pb-3 border-b-2 text-sm font-medium transition",
              value === tab.value
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ 리뷰일 때만: 지역 칩 */}
      {isReview && (
        <div className="mt-3 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {provinceItems.map((p) => {
              const active = province === p.value;
              return (
                <button
                  key={p.value ?? "ALL"}
                  onClick={() => onChangeProvince(p.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-sm transition",
                    active
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}