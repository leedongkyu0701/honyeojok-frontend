"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import type { SpotDetailResponse } from "@/types/spots";
import { fetchSpotDetail } from "@/lib/api/spot/api";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/common/Badge";

const FALLBACK_IMAGE = "/images/fallback.png";

export default function SpotDetailPage({ id }: { id: string }) {
  const spotId = Number(id);
  const isValidId = Number.isFinite(spotId) && spotId > 0;

  const {
    data: spot,
    isLoading,
    isError,
  } = useQuery<SpotDetailResponse>({
    queryKey: ["spot", spotId],
    queryFn: () => fetchSpotDetail(spotId),
    enabled: isValidId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (!isValidId) {
    return (
      <Container className="py-10">
        <EmptyState
          title="잘못된 주소예요."
          description="스팟 ID가 올바르지 않습니다."
        />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </Container>
    );
  }

  if (isError || !spot) {
    return (
      <Container className="py-10">
        <EmptyState
          title="스팟을 찾을 수 없어요."
          description="잠시 후 다시 시도해주세요."
        />
      </Container>
    );
  }

  const imageSrc = spot.imageUrl ?? FALLBACK_IMAGE;
  const tags = spot.tags ?? [];
  const destination = spot.destination;

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* 헤더 */}
        <SectionHeader title={spot.name} />

        {/* 대표 이미지 */}
        <div className="space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={imageSrc}
              alt={spot.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {spot.imageCredit && (
            <p className="text-right text-xs text-neutral-500">
              {spot.imageCredit}
            </p>
          )}
        </div>

        {/* 지역 */}
        <div className="flex flex-wrap items-center gap-2">
          {destination?.slug ? (
            <Link
              href={`/spots/${destination.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              📍 {destination.name}
            </Link>
          ) : null}
        </div>

        {/* ✅ 태그 강조 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge
                key={t.slug}
                className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
              >
                #{t.label}
              </Badge>
            ))}
          </div>
        )}

        {/* 혼여팁 */}
        {spot.honyeoTip && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-2">
            <h2 className="text-base font-semibold">혼여팁</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-neutral-800">
              {spot.honyeoTip}
            </p>
          </div>
        )}

        {/* 소개 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
          <h2 className="text-base font-semibold">소개</h2>
          <p className="whitespace-pre-line text-sm leading-6 text-neutral-700">
            {spot.description}
          </p>
        </div>

        {/* 정보 */}
        {(spot.address || spot.externalUrl) && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold">정보</h2>

            {spot.address && (
              <div className="text-sm text-neutral-700">
                <div className="mb-1 text-xs text-neutral-500">주소</div>
                <div className="leading-6">📌 {spot.address}</div>
              </div>
            )}

            {spot.externalUrl && (
              <a
                href={spot.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <span>외부 링크 열기</span>
                <span className="text-neutral-400">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
