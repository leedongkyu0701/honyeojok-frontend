"use client";

import type { CategoryType } from "@/types/community";
import { useRouter, useSearchParams } from "next/navigation";

const tabs: { label: string; value: CategoryType }[] = [
  { label: "전체", value: "ALL" },
  { label: "리뷰", value: "REVIEW" },
  { label: "자유", value: "FREE" },
  { label: "질문", value: "QUESTION" },
];

export default function CommunityTab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = (searchParams.get("type") as CategoryType) ?? "ALL";

  const setType = (next: CategoryType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "ALL") params.delete("type");
    else params.set("type", next);

    // 탭 변경 시 페이지 리셋
    params.set("page", "1");
    router.push(`/community?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-6 border-b border-neutral-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setType(tab.value)}
          className={[
            "pb-3 border-b-2 text-sm font-medium transition",
            type === tab.value
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
