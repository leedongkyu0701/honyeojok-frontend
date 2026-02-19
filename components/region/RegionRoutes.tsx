import Link from "next/link";
import type { TripRouteCardResponse } from "@/types/trip-routes";
import { Card, CardContent } from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";

export default function RegionRoutes({
  routes,
}: {
  routes: TripRouteCardResponse[];
}) {
  if (!routes?.length) {
    return (
      <EmptyState
        title="아직 등록된 여행 루트가 없어요."
        description="금방 더 많은 여행 루트를 보여드릴게요."
      />
    );
  }

  const [featured, ...rest] = routes;
  const list = rest.slice(0, 2);
  const regionSlug = featured.regionSlug;

  return (
    <section className="space-y-4">
      {/* ✅ 3개 전용 레이아웃: 왼쪽 크게 1개 + 오른쪽 2개 */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* featured */}
        <Link
          href={`/destinations/${featured.regionSlug}/trip-routes/${featured.slug}`}
          className="group lg:col-span-7"
        >
          <Card className="h-full transition group-hover:-translate-y-1 group-hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-2 inline-flex items-center gap-2 text-xs text-neutral-500">
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-white">
                  인기 루트
                </span>
                <span>·</span>
                <span>{featured.days}일</span>
                <span>·</span>
                <span>북마크 {featured.bookmarkCount}</span>
              </div>

              <h3 className="text-base font-semibold line-clamp-2">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                {featured.summary}
              </p>

              <div className="mt-4 flex justify-end">
                <span className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white">
                  루트 보기 →
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* right list */}
        <div className="grid gap-4 lg:col-span-5">
          {list.map((r) => (
            <Link
              key={r.id}
              href={`/destinations/${r.regionSlug}/trip-routes/${r.slug}`}
              className="group"
            >
              <Card className="transition group-hover:-translate-y-1 group-hover:shadow-md">
                <CardContent className="space-y-1 p-4">
                  <h3 className="font-medium line-clamp-2">{r.title}</h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {r.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-xs text-neutral-400">
                    <span>{r.days}일</span>
                    <span>북마크 {r.bookmarkCount}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 더보기 */}
      <div className="flex justify-end">
        <Link
          href={`/destinations/${regionSlug}/trip-routes`}
          className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          더 많은 여행 루트 보기
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
