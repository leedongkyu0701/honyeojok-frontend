"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/shared/ui/Skeleton";
import Button from "@/shared/ui/Button";
import LinkButton from "@/shared/ui/LinkButton";
import { fetchWeeklyPick } from "@/features/destination/api/destination.api";

const FRAME_CLASS = "h-[26rem] overflow-hidden rounded-2xl bg-neutral-100 lg:h-[28rem]";
const FALLBACK_IMAGE = "/images/fallback.png";

export default function WeeklyPickCard() {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["destinations", "weekly-pick"],
    queryFn: fetchWeeklyPick,
  });

  if (isLoading) {
    return (
      <div className={FRAME_CLASS} role="status">
        <Skeleton className="h-full w-full" />
        <span className="sr-only">추천 여행지를 불러오는 중이에요.</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${FRAME_CLASS} flex flex-col items-center justify-center px-6 text-center`}>
        <div role="status">
          <h2 className="text-lg font-semibold text-neutral-900">
            추천 여행지를 불러오지 못했어요
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            다시 불러오거나, 여행지 목록을 먼저 둘러보세요.
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            variant="outline"
            className="min-h-11"
            disabled={isFetching}
            aria-busy={isFetching}
            onClick={() => void refetch({ cancelRefetch: false })}
          >
            {isFetching ? "다시 불러오는 중…" : "다시 시도"}
          </Button>
          <LinkButton href="/destinations" variant="ghost" className="min-h-11">
            여행지 둘러보기
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
      </div>
    );
  }

  const imageUrl = data.imageUrl?.trim() ?? "";
  const hasImage = imageUrl.length > 0 && failedImage !== imageUrl;

  return (
    <Link
      href={`/destinations/${data.slug}`}
      className={`${FRAME_CLASS} group flex flex-col shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Image
          src={hasImage ? imageUrl : FALLBACK_IMAGE}
          alt={hasImage ? data.name : ""}
          fill
          preload
          onError={hasImage ? () => setFailedImage(imageUrl) : undefined}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          sizes="(min-width: 1152px) 468px, (min-width: 1024px) 42vw, calc(100vw - 32px)"
        />
      </div>
      <div className="shrink-0 bg-neutral-50 p-5">
        <h2 className="truncate text-xl font-semibold text-neutral-900">{data.name}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
          {data.summary || "이 지역의 장소와 추천 여행 루트를 살펴보세요."}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-900">
          이 여행지 살펴보기
          <ArrowRight className="h-4 w-4" aria-hidden />
        </p>
      </div>
    </Link>
  );
}
