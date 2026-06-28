"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  children: React.ReactNode;
  itemClassName?: string;
  className?: string;
};

export default function HorizontalRail({
  children,
  itemClassName,
  className,
}: Props) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const items = useMemo(() => React.Children.toArray(children), [children]);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateCanScroll = () => {
    const el = railRef.current;
    if (!el) return;

    // maxScrollLeft = 맨 끝까지 갔을 때 scrollLeft 값
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    // scrollwidth: 스크롤 가능한 전체 너비, clientWidth: 실제 보이는 너비(콘텐츠의 너비)

    // 브라우저마다 소수점/오차가 있어서 약간의 여유(EPS)를 둠
    const EPS = 2;

    setCanPrev(el.scrollLeft > EPS); // scrollLeft: 현재 스크롤이 왼쪽에서 얼마나 떨어져 있는지
    setCanNext(el.scrollLeft < maxScrollLeft - EPS);
  };


  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    updateCanScroll();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateCanScroll);
    };

    // 레이아웃(폭) 바뀌면 clientWidth/scrollWidth가 바뀌므로 재계산 필요
    const ro = new ResizeObserver(() => updateCanScroll());

    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);

    // children이 바뀐 직후에는 scrollWidth가 즉시 반영 안될 수 있어서 한 틱 뒤 재계산
    const t = window.setTimeout(() => updateCanScroll(), 0);

    return () => {
      window.clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const scrollByOne = (dir: -1 | 1) => {
    const element = railRef.current;
    if (!element) return;

    const first = element.querySelector<HTMLElement>("[data-rail-item='true']");
    if (!first) return;

    const styles = getComputedStyle(element);
    const gap = parseFloat(styles.gap || styles.columnGap || "0") || 0;
    const step = first.offsetWidth + gap;

    element.scrollTo({
      left: element.scrollLeft + step * dir,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => scrollByOne(-1)}
        aria-label="Previous"
        className={cn(
          "hidden sm:inline-flex shrink-0 transition",
          canPrev
            ? "text-neutral-900 hover:bg-neutral-100"
            : "text-neutral-300 cursor-default",
        )}
        disabled={!canPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* RAIL */}
      <div
        ref={railRef}
        className={cn(
          "flex flex-1 gap-4 overflow-x-auto scroll-smooth",
          "snap-x snap-proximity",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // 보통 브라우저 별로 스크롤바가 다르게 표시되는데, 이걸 통일시키기 위해 위와 같이 작성함(모든 브라우저에서 스크롤바를 숨김)
        )}
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-rail-item="true"
            className={cn("shrink-0 snap-start", itemClassName)}
          >
            {item}
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => scrollByOne(1)}
        aria-label="Next"
        className={cn(
          "hidden sm:inline-flex shrink-0 transition",
          canNext
            ? "text-neutral-900 hover:bg-neutral-100"
            : "text-neutral-300 cursor-default",
        )}
        disabled={!canNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
