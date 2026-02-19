"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTripRouteDetail } from "@/lib/api/trip-route/api";
import type { TripRouteDetailResponse } from "@/types/trip-routes"; // ✅ 변경

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

const DynamicTripRouteMap = dynamic(() => import("../Map/TripRouteMap"), {
  ssr: false,
});


export default function TripRouteDetail({
  region,
  slug,
}: {
  region: string;
  slug: string;
}) {
  const authInitialized = useAuthStore((s) => s.authInitialized); // ✅ authInitialized 상태 가져오기
  const {
    data: route,
    isLoading,
    isError,
  } = useQuery<TripRouteDetailResponse>({ // ✅ 변경
    queryKey: ["trip-route", region, slug],
    queryFn: () => fetchTripRouteDetail(region, slug),
    enabled: authInitialized, // ✅ authInitialized가 true일 때만 쿼리 실행
  });

  // console.log("Fetched trip route detail:", route); // ✅ 디버깅용 로그
  const queryClient = useQueryClient();
  const router = useRouter();

  // ✅ 북마크 로직 그대로 (절대 수정 안 함)
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
      router.push("/auth"); // ✅ 로직 유지(요청대로 손대지 않음)
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
        <Container className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-12 w-full rounded-xl" />
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

  // ✅ 북마크 로직 그대로
  const handleSaveRoute = () => {
    if (route.bookmarkedByMe) {
      router.push("/auth");
      return;
    }
    bookmarkMutation.mutate();
  };

    const honyeoCostLabel = (() => {
    const cost = route.honyeoCost; // number | null | undefined (원 단위)
    if (!cost || cost <= 0) return null;

    // 만원 단위 표기 (정수면 "10만원", 소수면 "12.5만원" 느낌)
    const man = cost / 10000;
    const manText =
      Number.isInteger(man) ? `${man}` : man.toFixed(1).replace(/\.0$/, "");
    return `약 ${manText}만원`;
  })();


  return (
    <div className="py-10">
      <Container className="space-y-8">
        <SectionHeader title={route.title} description={route.summary} />

        {activeDayEntity ? (
          <DynamicTripRouteMap items={activeDayEntity.items} />
        ) : null}

        {/* 메타 */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-700">
          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1">
            {totalDays}일 코스
          </span>

          {honyeoCostLabel ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1 text-yellow-600">
              {honyeoCostLabel}
            </span>
          ) : null}

          <BookmarkButton
            region={region}
            slug={route.slug}
            bookmarkedByMe={route.bookmarkedByMe}
            initialBookmarkCount={route.bookmarkCount}
          />
        </div>

        {/* 태그 */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t.slug} className="rounded-full px-3 py-1">
                #{t.label}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* 저장 버튼 */}
        <Button size="md" className="w-full" onClick={handleSaveRoute}>
          이 루트 저장하기
        </Button>

        {/* 플랜 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">일정</h2>

          {daysPlanSorted.length === 0 ? (
            <EmptyState
              title="아직 등록된 일정이 없어요."
              description="조금만 기다리면 더 풍부한 루트를 보여드릴게요."
            />
          ) : (
            <>
              {/* Day 탭 */}
              <div className="flex flex-wrap gap-2">
                {daysPlanSorted.map((d) => {
                  const isActive = d.dayNumber === activeDayEntity?.dayNumber;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setActiveDay(d.dayNumber)}
                      className={[
                        "rounded-full px-3 py-1 text-sm transition",
                        isActive
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100",
                      ].join(" ")}
                    >
                      {d.dayNumber}일차
                    </button>
                  );
                })}
              </div>

              {/* Day 내용 */}
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
                      // ✅ DTO 기준 nullable 처리
                      const hasTime = item.startTime || item.endTime;
                      const hasSpotLink = !!item.spot?.id; // slug는 dto에 있지만 링크는 id로만도 가능

                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 rounded-xl border border-neutral-200 p-4"
                        >
                          {/* 순서 번호 */}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                            {item.order}
                          </div>

                          {/* 썸네일 */}
                          {item.imageUrl ? (
                            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            </div>
                          ) : null}

                          {/* 텍스트 영역 */}
                          <div className="min-w-0 flex-1 space-y-2">
                            {/* 제목 라인 */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* ✅ type 뱃지 제거 (DTO에 없음) */}
                              <div className="truncate text-sm font-semibold">
                                {item.title}
                              </div>

                              <div className="text-xs text-neutral-400">
                                혼여 - 추천레벨 {item.recommendedLevel}/5
                              </div>

                              {/* ✅ spot 연결된 경우(있으면) 스팟 보기 */}
                              {hasSpotLink ? (
                                <a
                                  href={`/spots/${region}/${item.spot!.id}`}
                                  className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] text-neutral-600 hover:bg-neutral-50"
                                >
                                  상세 보기 →
                                </a>
                              ) : null}
                            </div>

                            {/* 설명 */}
                            {item.description ? (
                              <div className="line-clamp-2 text-sm text-neutral-600">
                                {item.description}
                              </div>
                            ) : null}

                            {/* 메타 */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                              {/* ✅ address는 DTO에서 string (필수) */}
                              <span>📍 {item.address}</span>

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
                                  rel="noreferrer"
                                  className="text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
                                >
                                  링크
                                </a>
                              ) : null}
                            </div>

                            {/* ✅ 이미지 크레딧(있으면) */}
                            {item.imageCredit ? (
                              <div className="text-[11px] text-neutral-400">
                                {item.imageCredit}
                              </div>
                            ) : null}
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
