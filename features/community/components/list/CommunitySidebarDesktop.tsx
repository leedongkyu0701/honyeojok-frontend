"use client";

import {
  COMMUNITY_CATEGORY_OPTIONS,
  PROVINCE_FILTER_OPTIONS,
} from "@/features/community/constants/community.constants";
import type { CategoryType } from "@/features/community/schemas/post.schema";
import { cn } from "@/shared/lib/utils";
import type { ProvinceGroup } from "@/shared/types/util";
import Button from "@/shared/ui/Button";

type CommunitySidebarDesktopProps = {
  value: CategoryType;
  province: ProvinceGroup | null;
  onChange: (next: CategoryType) => void;
  onChangeProvince: (next: ProvinceGroup | null) => void;
};

export default function CommunitySidebarDesktop({
  value,
  province,
  onChange,
  onChangeProvince,
}: CommunitySidebarDesktopProps) {
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
            {COMMUNITY_CATEGORY_OPTIONS.map((option) => {
              const active = value === option.value;
              return (
                <Button
                  key={option.value}
                  onClick={() => onChange(option.value)}
                  variant={active ? "primary" : "outline"}
                  className="mb-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <div
                    className={cn(
                      "mt-0.5 text-xs",
                      active ? "text-white/80" : "text-neutral-500",
                    )}
                  >
                    {option.description}
                  </div>
                </Button>
              );
            })}
          </nav>

          {value === "REVIEW" ? (
            <div className="mt-6 border-t border-neutral-200 pt-5">
              <div className="mb-3">
                <p className="text-sm font-semibold text-neutral-900">지역</p>
                <p className="mt-1 text-xs text-neutral-500">
                  리뷰를 지역별로 모아볼 수 있어요
                </p>
              </div>

              <div className="flex flex-col gap-1">
                {PROVINCE_FILTER_OPTIONS.map((option) => (
                  <Button
                    key={option.value ?? "ALL"}
                    onClick={() => onChangeProvince(option.value)}
                    variant={province === option.value ? "primary" : "outline"}
                    size="sm"
                    className="w-full rounded-xl px-3 py-2 text-left transition"
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
