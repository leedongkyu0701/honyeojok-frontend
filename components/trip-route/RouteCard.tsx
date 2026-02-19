import Link from "next/link";
import type { TripRouteCardResponse } from "@/types/trip-routes";
import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { Bookmark, Clock3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type RouteCardVariant = "default" | "featured" | "compact";

export default function RouteCard({
  route,
  variant = "default",
}: {
  route: TripRouteCardResponse;
  variant?: RouteCardVariant;
}) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

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
          isCompact && "hover:translate-y-0",
        )}
      >
        {/* 상단 정보 영역 */}
        <div
          className={cn(
            "relative border-b border-neutral-100 bg-neutral-50",
            isFeatured ? "p-6" : "p-4",
          )}
        >
          {isFeatured && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-xs text-white">
                <Sparkles className="h-3.5 w-3.5" />
                지금 가장 인기
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700">
                <Clock3 className="h-3.5 w-3.5" />
                {route.days}일 루트
              </span>
            </div>
          )}

          <h3
            className={cn(
              "font-semibold leading-snug line-clamp-2",
              isFeatured ? "text-lg" : isCompact ? "text-sm" : "text-base",
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
        </div>

        {/* 하단 */}
        {isFeatured ? (
          <div className="mt-auto px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
                <Bookmark className="h-4 w-4" />
                {route.bookmarkCount}명이 저장
              </span>
              <span className="shrink-0 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white">
                루트 보기 →
              </span>
            </div>
          </div>
        ) : (
          <CardContent className={cn("p-4", isCompact ? "space-y-1" : "space-y-2")}>
            <div className="flex items-center justify-between gap-3">
              <Badge className="shrink-0 text-xs">{route.days}일</Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                {route.bookmarkCount}
              </span>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
