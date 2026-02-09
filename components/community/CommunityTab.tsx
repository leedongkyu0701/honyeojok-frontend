"use client";
import { useCommunityStore } from "@/stores/community.store";
import { CategoryType } from "@/types/post";

const tabs: { label: string; value: CategoryType }[] = [
  { label: "전체", value: "ALL" },
  { label: "리뷰", value: "REVIEW" },
  { label: "자유", value: "FREE" },
  { label: "질문", value: "QUESTION" },
];

export default function CommunityTab() {
  const category = useCommunityStore((state) => state.category);
  const setCategory = useCommunityStore((state) => state.setCategory);
  return (
    <div className="flex flex-wrap gap-6 border-b border-neutral-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setCategory(tab.value)}
          className={`pb-3 border-b-2 text-sm font-medium transition
    ${
      category === tab.value
        ? "border-neutral-900 text-neutral-900"
        : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
    }
  `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
