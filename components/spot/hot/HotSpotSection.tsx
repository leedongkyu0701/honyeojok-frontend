"use client";

import type { SpotCardVM } from "@/types/spots";
import EmptyState from "@/components/common/EmptyState";
import HotSpotRail from "./HotSpotRail";

export default function HotSpotSection({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: SpotCardVM[];
}) {
  const hasItems = (items?.length ?? 0) > 0;

  return (
    <section className="space-y-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>

      {hasItems ? (
        <HotSpotRail items={items} />
      ) : (
        <EmptyState title="아직 스팟이 없어요." description="곧 채워둘게요." />
      )}
    </section>
  );
}
