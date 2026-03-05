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
import Button from "../common/Button";
import Badge from "../common/Badge";
import { MapPin } from "lucide-react";

const FALLBACK_IMAGE = "/images/fallback.png";

export default function SpotDetailPage({ id }: { id: string }) {
  const spotId = Number(id);
  const isValidId = Number.isFinite(spotId) && spotId > 0;

  const {
    data: spot,
    isLoading,
    isError,
  } = useQuery<SpotDetailResponse>({
    queryKey: ["spots", spotId],
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
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
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

  const imageSrc = spot.imageUrl?.trim() ? spot.imageUrl : FALLBACK_IMAGE;
  const tags = spot.tags ?? [];
  const destination = spot.destination;

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <SectionHeader title={spot.name} description={spot.summary} />

        <div className="space-y-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={imageSrc}
              alt={spot.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {spot.imageCredit && (
            <p className="text-right text-xs text-neutral-500">
              {spot.imageCredit}
            </p>
          )}
        </div>

        <div className="flex justify-between items-start gap-2">
          {tags.length > 0 && (
            <div className="flex-1 min-w-0 flex flex-wrap gap-3">
              {tags.map((t) => (
                <Badge key={t.slug}>#{t.label}</Badge>
              ))}
            </div>
          )}
          {destination?.slug ? (
            <Link
              className="shrink-0 whitespace-nowrap"
              href={`/spots/${destination.slug}`}
            >
              <Button variant="outline" size="sm" className="gap-1">
                <MapPin className="h-3 w-3 text-neutral-500" aria-hidden />

                {destination.name}
              </Button>
            </Link>
          ) : null}
        </div>

        {spot.honyeoTip && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-2">
            <h2 className="text-base font-semibold">혼여팁</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-neutral-800">
              {spot.honyeoTip}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
          <h2 className="text-base font-semibold">소개</h2>
          <p className="whitespace-pre-line text-sm leading-5 text-neutral-700">
            {spot.description}
          </p>
        </div>

        {(spot.address || spot.externalUrl) && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-base font-semibold">정보</h2>

            {spot.address && (
              <div className="text-sm text-neutral-700">
                <div className="mb-1 text-xs text-neutral-500">주소</div>
                <div className="leading-6 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-neutral-500" aria-hidden />
                  {spot.address}
                </div>
              </div>
            )}

            {spot.externalUrl && (
              <div className="mt-3 space-y-2">
                <a
                  href={spot.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 hover:bg-neutral-50"
                >
                  <span>관련 정보 더 보기 (외부)</span>
                  <span className="text-neutral-400">↗</span>
                </a>
                <p className="text-[11px] ml-2 leading-4 text-neutral-400">
                  예: 가게(카카오맵,다이닝코드) · 장소(VisitKorea 등)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
