"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import type { SpotEntity } from "@/types/spots";
import { fetchSpotDetail } from "@/lib/api/spot/api";

import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/common/Badge";

export default function SpotDetailPage({ id }: { id: string }) {
  const spotId = Number(id);
  const isValidId = !isNaN(spotId);

  const {
    data: spot,
    isLoading,
    isError,
  } = useQuery<SpotEntity>({
    queryKey: ["spot", spotId],
    queryFn: () => fetchSpotDetail(spotId),
    enabled: isValidId,
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
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-10">
        <EmptyState
          title="스팟을 불러오지 못했어요."
          description={"잠시 후 다시 시도해주세요."}
        />
      </Container>
    );
  }

  if (!spot) {
    return (
      <Container className="py-10">
        <EmptyState
          title="해당 스팟을 찾을 수 없어요."
          description="주소를 확인하거나 다른 스팟을 둘러보세요."
        />
      </Container>
    );
  }

  const tags = spot.tags ?? [];
  const destination = spot.destination;
  const creditText = spot.imageCredit;

  return (
    <Container className="py-10">
      {/* ✅ 모든 콘텐츠를 이 컬럼 안에 */}
      <div className="mx-auto max-w-4xl space-y-10">
        {/* 헤더 */}
        <SectionHeader title={spot.name} description={spot.description} />

        {/* 대표 이미지 */}
        <div className="space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-100">
            {spot.imageUrl ? (
              <Image
                src={`${spot.imageUrl}`}
                alt={spot.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                NO IMG
              </div>
            )}
          </div>

          {creditText ? (
            <p className="text-xs text-muted-foreground text-right">
              {creditText}
            </p>
          ) : null}
        </div>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-2">
          {destination?.slug ? (
            <Link
              href={`/destinations/${destination.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              📍 {destination.name ?? destination.slug}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-500">
              📍 지역 정보 없음
            </span>
          )}

          {spot.note ? (
            <Badge className="rounded-full px-3 py-1">{spot.note}</Badge>
          ) : null}
        </div>

        {/* 태그 */}
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t.slug} className="rounded-full px-3 py-1">
                #{t.label}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* 소개 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
          <h2 className="text-base font-semibold">소개</h2>
          <p className="whitespace-pre-line text-sm leading-6 text-neutral-700">
            {spot.description}
          </p>
        </div>

        {/* 정보 */}
        {spot.address || spot.externalUrl ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold">정보</h2>

            {spot.address ? (
              <div className="text-sm text-neutral-700">
                <div className="text-xs text-neutral-500 mb-1">주소</div>
                <div className="leading-6">📌 {spot.address}</div>
              </div>
            ) : null}

            {spot.externalUrl ? (
              <a
                href={spot.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <span>외부 링크 열기</span>
                <span className="text-neutral-400">↗</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </Container>
  );
}
