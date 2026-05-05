import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBookmarkTripRoute } from "@/features/trip-route/api/trip-route.api";
import { Bookmark } from "lucide-react";
import { cn } from "@/shared/lib/utils";       

export default function BookmarkButton({
  slug,
  initialBookmarkCount,
  bookmarkedByMe,
  region,
}: {
  slug: string;
  initialBookmarkCount: number;
  bookmarkedByMe: boolean;
  region: string;
}) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<{
    bookmarkedByMe: boolean;
    bookmarkCount: number;
  }>(["trip-route", region, slug]);
  const bookmarkedByMeCached = cached ? cached.bookmarkedByMe : bookmarkedByMe;
  const bookmarkCountCached = cached
    ? cached.bookmarkCount
    : initialBookmarkCount;

  const mutation = useMutation({
    mutationFn: () => toggleBookmarkTripRoute(slug),
    onMutate: async () => {
      // 낙관적 업데이트 (상세 캐시만 바로 바꾸고 안될경우 롤백)
      await queryClient.cancelQueries({ queryKey: ["trip-route", region, slug] });

      const previousRoute = queryClient.getQueryData<{
        bookmarkedByMe: boolean;
        bookmarkCount: number;
      }>(["trip-route", region, slug]);

      queryClient.setQueryData<{
        bookmarkedByMe: boolean;
        bookmarkCount: number;
      }>(["trip-route", region, slug], (old) => {
        const base = old ?? {
          bookmarkedByMe: bookmarkedByMeCached,
          bookmarkCount: bookmarkCountCached,
        };
        return {
          ...base,
          bookmarkedByMe: !base.bookmarkedByMe,
          bookmarkCount: base.bookmarkedByMe
            ? base.bookmarkCount - 1
            : base.bookmarkCount + 1,
        };
      });

      return { previousRoute };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousRoute) {
        queryClient.setQueryData(
          ["trip-route", region, slug],
          context.previousRoute,
        );
      } else {
        queryClient.removeQueries({ queryKey: ["trip-route", region, slug] });
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData<{
        bookmarkedByMe: boolean;
        bookmarkCount: number;
      }>(["trip-route", region, slug], (old) => {
        if (!old) return old;
        return {
          ...old,
          bookmarkedByMe: data.bookmarked,
          bookmarkCount: data.bookmarkCount,
        };
      });
    },
  });

  const handleClick = () => {
    if (mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 transition",
        bookmarkedByMeCached
          ? "border-yellow-400 bg-yellow-50 text-yellow-600"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral      -400 hover:bg-neutral-50",
      )}
    >
      <Bookmark
        className={cn(
          "w-5 h-5 transition",
          bookmarkedByMeCached
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-400 hover:text-gray-600",
        )}
      />
      <span>
        {bookmarkedByMeCached ? "저장됨" : "저장"} {bookmarkCountCached}
      </span>
    </button>
  );
}
