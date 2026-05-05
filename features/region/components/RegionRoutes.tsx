import Link from "next/link";
import type { TripRouteCardResponse } from "@/features/trip-route/types/trip-routes";
import EmptyState from "@/shared/ui/EmptyState";
import Button from "@/shared/ui/Button";
import RouteCard from "@/features/trip-route/components/RouteCard";

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
       <div className="grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <RouteCard route={featured} variant="featured" />
        </div>
        <div className="grid gap-4 sm:col-span-5">
          {list.map((r) => (
            <RouteCard key={r.id} route={r} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={`/destinations/${regionSlug}/trip-routes`}>
          <Button variant="ghost" size="sm">
            더 많은 여행 루트 보기 →
          </Button>
        </Link>
      </div>
    </section>
  );
}
