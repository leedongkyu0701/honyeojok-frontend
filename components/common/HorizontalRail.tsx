"use client";

import type { ReactNode } from "react";

export default function HorizontalRail({
  children,
  itemClassName = "",
  className = "",
  showFade = true,
}: {
  children: ReactNode;
  itemClassName?: string;
  className?: string;
  showFade?: boolean;
}) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={["relative", className].join(" ")}>
      {/* 스크롤 영역 */}
      <div
        className={[
          "overflow-x-auto",
          "pb-2",
          // 스크롤바 숨기기
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // 스냅(선택이지만 UX 좋아짐)
          "scroll-smooth",
        ].join(" ")}
      >
        {/* ✅ 핵심: 오른쪽에 공간(pr) 만들어서 다음 카드가 살짝 보이게 */}
        <div className="flex gap-4 pr-10 snap-x snap-mandatory">
          {items.map((child, idx) => (
            <div
              key={idx}
              className={["shrink-0", "snap-start", itemClassName].join(" ")}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 오른쪽 페이드: "더 있음" 시그널 */}
      {showFade && (
        <>
          {/* 오른쪽 */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white to-transparent" />
          {/* (옵션) 왼쪽도 살짝: 처음이 아닐 때만 보이게 하려면 JS 필요하지만 일단 약하게 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-white to-transparent opacity-60" />
        </>
      )}
    </div>
  );
}
