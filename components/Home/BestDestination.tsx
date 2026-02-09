'use client';
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { fetchWeeklyPick } from "@/lib/api/destination/api";

export default function WeeklyPickCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["destinations", "weekly-pick"],
    queryFn: fetchWeeklyPick,
  });

  if (isLoading) {
    return <Skeleton className="h-72 rounded-3xl md:h-96" />;
  }

    if (isError || !data) {
    return (
      <EmptyState
        title="추천 여행지를 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }


  return (
    <Link href={`/destinations/${data.slug}`} className="group block">
      <div className="relative h-72 overflow-hidden rounded-3xl bg-neutral-100 shadow-lg md:h-96">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url('${data.imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/10 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
          <p className="text-sm uppercase tracking-widest text-white/80">
            weekly Editor&apos;s pick
          </p>
          <p className="text-2xl font-semibold leading-tight">
            {data.name}
          </p>
          <div className="pt-2 text-sm text-white/90">
            자세히 보기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
