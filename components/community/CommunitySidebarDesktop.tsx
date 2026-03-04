"use client";

import type { CategoryType } from "@/types/community";
import { ProvinceGroup } from "@/types/util";
import { cn } from "@/lib/utils";
import Button from "../common/Button";

const items: { label: string; value: CategoryType; desc?: string }[] = [
  { label: "전체", value: "ALL", desc: "전체 글" },
  { label: "리뷰", value: "REVIEW", desc: "여행 후기" },
  { label: "자유", value: "FREE", desc: "잡담/공유" },
  { label: "질문", value: "QUESTION", desc: "도움 요청" },
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

export default function CommunitySidebarDesktop({
  value,
  onChange,
  province,
  onChangeProvince,
}: Props) {
  const isReview = value === "REVIEW";

  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 h-[calc(100vh-6rem)]">
        <div className="h-full overflow-auto rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-neutral-900">게시판</p>
            <p className="mt-1 text-xs text-neutral-500">
              원하는 글만 빠르게 찾아보세요
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map((it) => {
              const active = value === it.value;
              return (
                <Button
                  key={it.value}
                  onClick={() => onChange(it.value)}
                  variant={active ? "primary" : "outline"}
                  className="mb-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{it.label}</span>
                  </div>
                  {it.desc && (
                    <div
                      className={cn(
                        "mt-0.5 text-xs",
                        active ? "text-white/80" : "text-neutral-500",
                      )}
                    >
                      {it.desc}
                    </div>
                  )}
                </Button>
              );
            })}
          </nav>


          {isReview && (
            <div className="mt-6 pt-5 border-t border-neutral-200">
              <div className="mb-3">
                <p className="text-sm font-semibold text-neutral-900">지역</p>
                <p className="mt-1 text-xs text-neutral-500">
                  리뷰를 지역별로 모아볼 수 있어요
                </p>
              </div>

              <div className="flex flex-col gap-1">
                {provinceItems.map((p) => {
                  const active = province === p.value;
                  return (
                    <Button
                      key={p.value ?? "ALL"}
                      onClick={() => onChangeProvince(p.value)}
                      variant={active ? "primary" : "outline"}
                      size="sm"
                      className="w-full rounded-xl px-3 py-2 text-left transition"
                    >
                      <span className="text-sm font-medium">{p.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}