import Link from "next/link";
import type { TripRouteCardEntity } from "@/types/trip-routes";
import { Card, CardContent } from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";

export default function RecommendedRoutes({
  region,
  routes,
}: {
  region: string;
  routes: TripRouteCardEntity[];
}) {
  if (routes.length === 0) {
      return (
        <EmptyState
          title="아직 등록된 여행 루트가 없어요."
          description="금방 더 많은 여행 루트를 보여드릴게요."
        />
      );
    }
  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {routes.map((r) => (
          <Link
            key={r.id}
            href={`/destinations/${region}/trip-routes/${r.slug}`}
            className="group"
          >
            <Card className="transition group-hover:-translate-y-1 group-hover:shadow-md">
              <CardContent className="pt-3">
                <h3 className="font-medium">{r.title}</h3>
                <p className="text-sm text-neutral-500">{r.summary}</p>
                <p className="text-xs text-neutral-400 text-right">{r.days}일 루트</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          href={`/destinations/${region}/trip-routes`}
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
