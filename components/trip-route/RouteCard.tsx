import Link from "next/link";
import type { TripRouteCardResponse } from "@/types/trip-routes";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "featured";

export default function RouteCard({
  route,
  variant = "default",
}: {
  route: TripRouteCardResponse;
  variant?: Variant;
}) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/destinations/${route.regionSlug}/trip-routes/${route.slug}`}
      className={cn("group block", isFeatured && "h-full")}
    >
      <Card
        className={cn(
          "rounded-2xl overflow-hidden transition duration-300",
          "group-hover:-translate-y-1 group-hover:shadow-md",
          isFeatured && "h-full flex flex-col",
        )}
      >
        <div
          className={cn(
            "relative border-b border-neutral-100 bg-neutral-50",
            isFeatured ? "p-6 " : "p-4",
          )}
        >
          {isFeatured && (
            <span className="inline-flex  rounded-full bg-neutral-900 px-3 py-1 mb-2 text-xs text-white">
              <Sparkles className="h-3.5 w-3.5" />
              지금 가장 인기
            </span>
          )}

          <h3
            className={cn(
              "font-semibold leading-snug line-clamp-1",
              isFeatured ? "text-lg" : "text-base",
            )}
          >
            {route.title}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm text-neutral-600",
              isFeatured ? "line-clamp-2" : "line-clamp-1",
            )}
          >
            {route.summary}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Badge className="shrink-0 text-xs">{route.days}일</Badge>
          </div>
        </div>

        {isFeatured && (
          <div className="px-4 pt-4">
            <p className="text-sm text-neutral-500">
              루트보기를 클릭하시면 상세 일정과 혼술&혼밥 지도까지 
              확인하실 수 있어요!
            </p>
          </div>
        )}

        <CardContent className={cn("p-4", isFeatured && "mt-auto")}>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              {route.bookmarkCount}
            </span>

            {isFeatured && (
              <span className="shrink-0 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white">
                루트 보기 →
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
