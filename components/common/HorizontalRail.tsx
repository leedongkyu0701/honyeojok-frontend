"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function HorizontalRail({
  children,
  itemClassName = "",
  className = "",
  showFade = true,
  showControls = false,
  showDots = false,
}: {
  children: ReactNode;
  itemClassName?: string;
  className?: string;
  showFade?: boolean;
  showControls?: boolean;
  showDots?: boolean;
}) {
  const items = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // 특정 카드로 스크롤
  const scrollToIndex = (idx: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = scroller.querySelector<HTMLElement>(`[data-rail-item="${idx}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  // 다음/이전 (대충 카드 1~2장)
  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // active 카드 추적 (controls/dots 품질 올리기)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const els = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-rail-item]"),
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
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

  const isFirst = active <= 0;
  const isLast = active >= items.length - 1;

  return (
    <div className={["relative", className].join(" ")}>
      {/* ✅ 스크롤 컨테이너에 snap을 둬야 안정적 */}
      <div
        ref={scrollerRef}
        className={[
          "overflow-x-auto pb-2",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "scroll-smooth",
          "snap-x snap-mandatory",
        ].join(" ")}
      >
        {/* 오른쪽 여백(pr)으로 다음 카드 살짝 보이게 */}
        <div className="flex gap-4 pr-10">
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

      {/* Fade는 controls 있을 때는 보통 꺼도 깔끔함(원하면 유지) */}
      {showFade ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-white to-transparent opacity-60" />
        </>
      ) : null}

      {/* ✅ 데스크탑 이동 버튼 */}
      {showControls ? (
        <div className="hidden md:flex absolute bottom-3 right-3 gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={isFirst}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow ring-1 ring-black/5 hover:bg-white disabled:opacity-40"
            aria-label="이전"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={isLast}
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow ring-1 ring-black/5 hover:bg-white disabled:opacity-40"
            aria-label="다음"
          >
            →
          </button>
        </div>
      ) : null}

      {/* ✅ 도트(홈 같은 메인 섹션에 특히 좋음) */}
      {showDots ? (
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
      ) : null}
    </div>
  );
}
