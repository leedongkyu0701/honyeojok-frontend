"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTripRouteDetail } from "@/lib/api/trip-route/api";
import type { TripRouteDetailResponse } from "@/types/trip-routes";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import BookmarkButton from "./BookmarkButton";
import { addBookmarkTripRoute } from "@/lib/api/trip-route/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/stores/auth.store";
import { fetchNearbyTripRoutes } from "@/lib/api/trip-route/api";
import { SpotCategory, SpotMapResponse } from "@/types/spots";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MapPin } from "lucide-react";

const DynamicTripRouteMap = dynamic(() => import("../Map/TripRouteMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full rounded-2xl" />,
});

export default function TripRouteDetail({
  region,
  slug,
}: {
  region: string;
  slug: string;
}) {
  const authInitialized = useAuthStore((s) => s.authInitialized);
  const {
    data: route,
    isLoading,
    isError,
  } = useQuery<TripRouteDetailResponse>({
    queryKey: ["trip-route", region, slug],
    queryFn: () => fetchTripRouteDetail(region, slug),
    enabled: authInitialized,
  });

  const {
    data: nearbySpots,
    isLoading: nearbySpotsLoading,
    isError: nearbySpotsError,
  } = useQuery({
    queryKey: ["trip-route", "nearby-spots", region, slug],
    queryFn: () =>
      fetchNearbyTripRoutes(slug, {
        radiusKm: 5,
        limit: 10,
      }),
    enabled: !!route && authInitialized,
  });

  const defaultNearbyCats: SpotCategory[] = [SpotCategory.FOOD];

  const [enabledNearbyCats, setEnabledNearbyCats] =
    useState<SpotCategory[]>(defaultNearbyCats);

  const toggleNearbyCat = (cat: SpotCategory) => {
    setEnabledNearbyCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const nearbyFlatForMap = useMemo(() => {
    if (!nearbySpots) return [];
    const all = Object.values(nearbySpots).flat();
    const uniq = new Map<number, SpotMapResponse>();
    for (const s of all) uniq.set(s.id, s);
    return [...uniq.values()];
  }, [nearbySpots]);

  const nearbyFilteredForMap = useMemo(() => {
    return nearbyFlatForMap.filter((s) =>
      enabledNearbyCats.includes(s.category),
    );
  }, [nearbyFlatForMap, enabledNearbyCats]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      return await addBookmarkTripRoute(slug);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["trip-route", region, slug],
      });

      const previousRoute = queryClient.getQueryData<TripRouteDetailResponse>([
        "trip-route",
        region,
        slug,
      ]);

      queryClient.setQueryData<TripRouteDetailResponse>(
        ["trip-route", region, slug],
        (oldRoute) => {
          if (!oldRoute) return oldRoute;
          return {
            ...oldRoute,
            bookmarkedByMe: true,
            bookmarkCount: oldRoute.bookmarkCount + 1,
          };
        },
      );
      return { previousRoute };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousRoute) {
        queryClient.setQueryData(
          ["trip-route", region, slug],
          context.previousRoute,
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<TripRouteDetailResponse>(
        ["trip-route", region, slug],
        (oldRoute) => {
          if (!oldRoute) return oldRoute;
          return {
            ...oldRoute,
            bookmarkedByMe: data.bookmarked,
            bookmarkCount: data.bookmarkCount,
          };
        },
      );
      router.push("/auth");
    },
  });

  const daysPlanSorted = useMemo(() => {
    const days = route?.daysPlan ?? [];
    return [...days]
      .sort((a, b) => a.dayNumber - b.dayNumber)
      .map((d) => ({
        ...d,
        items: [...(d.items ?? [])].sort((a, b) => a.order - b.order),
      }));
  }, [route]);

  const [activeDay, setActiveDay] = useState<number>(1);

  const activeDayEntity = useMemo(() => {
    if (!daysPlanSorted.length) return null;
    const found = daysPlanSorted.find((d) => d.dayNumber === activeDay);
    return found ?? daysPlanSorted[0];
  }, [daysPlanSorted, activeDay]);

  if (isLoading || !authInitialized) {
    return (
      <div className="py-10">
        <Container className="space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-9 w-1/3 rounded-lg" />
            <Skeleton className="h-5 w-2/3 rounded-md" />
          </div>

          <Skeleton className="h-80 w-full rounded-2xl" />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-12 w-full rounded-xl" />

          <Skeleton className="h-100 w-full rounded-xl" />
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10">
        <Container>
          <EmptyState
            title="여행 루트를 불러오지 못했어요."
            description={"잠시 후 다시 시도해주세요."}
          />
        </Container>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="py-10">
        <Container>
          <EmptyState
            title="해당 여행 루트를 찾을 수 없어요."
            description="주소를 확인하거나 다른 루트를 둘러보세요."
          />
        </Container>
      </div>
    );
  }

  const tags = route.tags ?? [];
  const totalDays = route.days;

  const handleSaveRoute = () => {
    if (route.bookmarkedByMe) {
      router.push("/auth");
      return;
    }
    bookmarkMutation.mutate();
  };

  const honyeoCostLabel = (() => {
    const cost = route.honyeoCost;
    if (!cost || cost <= 0) return null;

    const man = cost / 10000;
    const manText = Number.isInteger(man)
      ? `${man}`
      : man.toFixed(1).replace(/\.0$/, "");
    return `약 ${manText}만원`;
  })();

  return (
    <div className="py-10">
      <Container className="space-y-8">
        <SectionHeader title={route.title} description={route.summary} />
        {activeDayEntity ? (
          <>
            <DynamicTripRouteMap
              items={activeDayEntity.items}
              nearbySpots={nearbyFilteredForMap}
              region={region}
            />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2 mb-6 lg:mb-0">
                <Button
                  type="button"
                  variant={
                    enabledNearbyCats.includes(SpotCategory.FOOD)
                      ? "primary"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleNearbyCat(SpotCategory.FOOD)}
                >
                  혼밥 지도
                </Button>

                <Button
                  type="button"
                  variant={
                    enabledNearbyCats.includes(SpotCategory.CAFE)
                      ? "primary"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleNearbyCat(SpotCategory.CAFE)}
                >
                  카페 지도
                </Button>

                <Button
                  type="button"
                  variant={
                    enabledNearbyCats.includes(SpotCategory.DRINK)
                      ? "primary"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleNearbyCat(SpotCategory.DRINK)}
                >
                  혼술 지도
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-700">
                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1">
                  {totalDays}일 코스
                </span>

                {honyeoCostLabel ? (
                  <span className="inline-flex items-center gap-1 mr-4 rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1 text-yellow-600">
                    {honyeoCostLabel}
                  </span>
                ) : null}

                <div className="ml-auto">
                  <BookmarkButton
                    region={region}
                    slug={route.slug}
                    bookmarkedByMe={route.bookmarkedByMe}
                    initialBookmarkCount={route.bookmarkCount}
                  />
                </div>
              </div>
            </div>

            {nearbySpotsLoading ? (
              <div className="text-xs text-neutral-500">
                근처 스팟 불러오는 중...
              </div>
            ) : nearbySpotsError ? (
              <div className="text-xs text-red-500">
                근처 스팟을 불러오지 못했어요.
              </div>
            ) : null}
          </>
        ) : null}

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 5).map((t) => (
              <Badge key={t.slug} className="rounded-full px-3 py-1">
                #{t.label}
              </Badge>
            ))}
          </div>
        ) : null}
        <Button size="md" className="w-full" onClick={handleSaveRoute}>
          이 루트 저장하기
        </Button>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">일정</h2>

          {daysPlanSorted.length === 0 ? (
            <EmptyState
              title="아직 등록된 일정이 없어요."
              description="조금만 기다리면 더 풍부한 루트를 보여드릴게요."
            />
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {daysPlanSorted.map((d) => {
                  const isActive = d.dayNumber === activeDayEntity?.dayNumber;
                  return (
                    <Button
                      key={d.id}
                      onClick={() => setActiveDay(d.dayNumber)}
                      variant="tab"
                      size="sm"
                      role="tab"
                      aria-selected={isActive}
                      className={cn(
                        isActive && "border-neutral-900 text-neutral-900",
                      )}
                    >
                      {d.dayNumber}일차
                    </Button>
                  );
                })}
              </div>

              {activeDayEntity ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">
                      {activeDayEntity.title ??
                        `${activeDayEntity.dayNumber}일차 일정`}
                    </div>
                    {activeDayEntity.note ? (
                      <div className="text-xs text-neutral-500">
                        {activeDayEntity.note}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 space-y-3">
                    {activeDayEntity.items.map((item) => {
                      const hasTime = item.startTime || item.endTime;
                      const hasSpotLink = item.spot?.id;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4 lg:flex-row"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                            {item.order}
                          </div>

                          {item.imageUrl ? (
                            <div className="relative w-full overflow-hidden rounded-lg bg-neutral-100 aspect-16/10 lg:h-24 lg:w-32 lg:shrink-0 lg:aspect-auto">
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 128px"
                              />
                            </div>
                          ) : null}

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="truncate text-sm font-semibold">
                                {item.title}
                              </div>

                              <div className="text-xs">
                                {"⭐".repeat(Math.floor(item.recommendedLevel))}
                              </div>

                              {hasSpotLink ? (
                                <Link
                                  href={`/spots/${region}/${item.spot!.id}`}
                                  className="ml-auto shrink-0"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-neutral-600 font-normal"
                                  >
                                    상세보기 →
                                  </Button>
                                </Link>
                              ) : null}
                            </div>

                            {item.description ? (
                              <div className=" text-sm text-neutral-600">
                                {item.description}
                              </div>
                            ) : null}

                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.address}
                              </span>

                              {hasTime ? (
                                <span>
                                  ⏱ {item.startTime ?? "?"} ~{" "}
                                  {item.endTime ?? "?"}
                                </span>
                              ) : null}

                              {item.externalUrl ? (
                                <a
                                  href={item.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
                                >
                                  외부에서 보기 →
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
