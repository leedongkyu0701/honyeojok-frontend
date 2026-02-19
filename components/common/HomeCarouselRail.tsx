"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function HomeCarouselRail({
  children,
  itemClassName = "",
  className = "",
}: {
  children: React.ReactNode;
  itemClassName?: string;
  className?: string;
}) {
  const items = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // 스크롤을 “한 카드 단위”로 이동시키기 위한 헬퍼
  const scrollToIndex = (idx: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = scroller.querySelector<HTMLElement>(`[data-rail-item="${idx}"]`);
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  const scrollByDir = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(items.length - 1, active + dir));
    scrollToIndex(next);
  };

  // 어떤 카드가 가장 “가까이” 왔는지 관찰해서 active 갱신
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const els = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-rail-item]"),
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // 가장 많이 보이는 애를 active로
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];

        if (!best?.target) return;
        const idx = Number((best.target as HTMLElement).dataset.railItem);
        if (!Number.isNaN(idx)) setActive(idx);
      },
      { root: scroller, threshold: [0.35, 0.55, 0.75] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div className={["relative", className].join(" ")}>
      {/* 스크롤 영역 */}
      <div
        ref={scrollerRef}
        className={[
          "overflow-x-auto pb-2",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "scroll-smooth",
          "snap-x snap-mandatory",
        ].join(" ")}
      >
        <div className="flex gap-3">
          {items.map((child, idx) => (
            <div
              key={idx}
              data-rail-item={idx}
              className={["shrink-0 snap-start", itemClassName].join(" ")}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑 이동 버튼 (오른쪽 아래 + 왼쪽 아래) */}
      <div className="hidden md:flex absolute bottom-3 right-3 gap-2">
        <button
          type="button"
          onClick={() => scrollByDir(-1)}
          disabled={active === 0}
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow ring-1 ring-black/5 disabled:opacity-40"
          aria-label="이전"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByDir(1)}
          disabled={active === items.length - 1}
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow ring-1 ring-black/5 disabled:opacity-40"
          aria-label="다음"
        >
          →
        </button>
      </div>

      {/* 도트 */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={`${idx + 1}번 카드로 이동`}
            className={[
              "h-2.5 rounded-full transition-all",
              idx === active
                ? "w-6 bg-neutral-900"
                : "w-2.5 bg-neutral-300 hover:bg-neutral-400",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
