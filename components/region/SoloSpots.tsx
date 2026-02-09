import Link from "next/link";
import Image from "next/image";

import type { SpotCardVM } from "@/types/spots";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";

export default function SoloSpots({ spots }: { spots: SpotCardVM[] }) {
  if (!spots?.length) {
    return (
      <EmptyState
        title="아직 등록된 장소가 없어요."
        description="금방 더 많은 명소를 보여드릴게요."
      />
    );
  }

  const destinationSlug = spots[0]?.destination.slug;

  return (
    <section className="space-y-4">
      {/* ✅ 가로 카드 리스트 */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {spots.map((s) => {
          const badgeText = s.note?.trim() || "추천 스팟";
          const descText = s.note?.trim() || null;

          return (
            <Link
              key={s.id}
              href={`/spots/${s.destination.slug}/${s.id}`}
              className="group block w-70 shrink-0"
            >
              <Card className="h-full overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <div className="relative h-40 bg-neutral-100">
                  {s.imageUrl ? (
                    <Image
                      src={`${s.imageUrl}`}
                      alt={s.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="280px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                      NO IMG
                    </div>
                  )}
                </div>

                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {s.name}
                    </h3>
                    <Badge className="shrink-0">{badgeText}</Badge>
                  </div>

                  {descText && (
                    <p className="line-clamp-2 text-xs text-neutral-500">
                      {descText}
                    </p>
                  )}

                  {s.tags?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {s.tags.slice(0, 3).map((t) => (
                        <span
                          key={t.slug}
                          className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] text-neutral-600"
                        >
                          #{t.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* ✅ 섹션 오른쪽 하단 버튼 */}
      {destinationSlug && (
        <div className="flex justify-end">
          <Link
            href={`/spots/${destinationSlug}`}
            className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            더 많은 여행 장소 보기
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
