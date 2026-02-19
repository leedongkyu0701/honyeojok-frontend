"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import Button from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { toast } from "sonner";

import PostCard from "@/components/community/PostCard";
import RouteCard from "@/components/trip-route/RouteCard";

import type { ProfileResponse } from "@/types/user";
import type { TripRouteCardResponse } from "@/types/trip-routes";
import type { PostCardResponse } from "@/types/community";
import {
  fetchMeApi,
  updateNickname,
  getMyBookmarks,
  getMyPosts,
} from "@/lib/api/user/api";
import { logout as logoutServer } from "@/lib/api/auth/api";
import { ApiError } from "@/lib/apiError";
import { ErrorCode } from "@/types/error-code";

const LIMIT = 8;

type TabKey = "bookmarks" | "posts";

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}

function providerLabel(provider?: string) {
  if (!provider) return "-";
  if (provider === "apple") return "애플";
  if (provider === "naver") return "네이버";
  if (provider === "kakao") return "카카오";
  if (provider === "google") return "구글";
  return provider;
}

export default function MyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const [tab, setTab] = useState<TabKey>("bookmarks");
  const [postPage, setPostPage] = useState(1);
  const [bmPage, setBmPage] = useState(1);

  // 탭 바뀌면 페이지 리셋 (UX)
  useEffect(() => {
    setPostPage(1);
    setBmPage(1);
  }, [tab]);

  // ====== Me ======
  const meQuery = useQuery<ProfileResponse>({
    queryKey: ["me"],
    queryFn: fetchMeApi,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const me = meQuery.data;

  // ====== Nickname update ======
  const nicknameMutation = useMutation({
    mutationFn: (nickName: string) => updateNickname(nickName),
    meta: { silent: true }, // 전역토스트 끄기
    onSuccess: async () => {
      // me 재조회(서버가 ok만 주는 경우까지 커버)
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("닉네임이 변경됐어요");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        if(err.code === ErrorCode.DUPLICATE_RESOURCE) {
          toast.error("이미 사용 중인 닉네임이에요");
          return;
        }
        toast.error(err.message || "닉네임 변경에 실패했어요");
        return;
      }
      toast.error("알 수 없는 오류로 닉네임 변경에 실패했어요");
    },
  });

  // ====== Posts ======
  const myPostsQuery = useQuery<{
    posts: PostCardResponse[];
    totalPages: number;
  }>({
    queryKey: ["me", "posts", postPage, LIMIT],
    queryFn: () => getMyPosts(postPage, LIMIT),
    enabled: isAuthenticated && tab === "posts",
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  // ====== Bookmarks ======
  const myBookmarksQuery = useQuery<{
    tripRoutes: TripRouteCardResponse[];
    totalPages: number;
  }>({
    queryKey: ["me", "bookmarks", bmPage, LIMIT],
    queryFn: () => getMyBookmarks(bmPage, LIMIT),
    enabled: isAuthenticated && tab === "bookmarks",
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [nickDraft, setNickDraft] = useState("");

  const openEdit = () => {
    setNickDraft(me?.nickName ?? "");
    setIsEditOpen(true);
  };

  const logoutHandler = async () => {
    try {
      await logoutServer();
    } catch {
      // 서버 로그아웃 실패해도 로컬은 끊는 게 UX상 나음
    } finally {
      logout();
      await queryClient.clear();
      toast.success("로그아웃 완료");
      router.replace("/auth/login");
    }
  };

  // ====== Logged out view ======
  if (!isAuthenticated) {
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <p className="mt-2 text-sm text-neutral-600">
            로그인하면 북마크와 작성한 글을 관리할 수 있어요.
          </p>

          <div className="mt-6 flex gap-3">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">로그인</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // ====== Me loading ======
  if (meQuery.isLoading) {
    return (
      <Container className="py-10">
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </Container>
    );
  }

  // ====== Me error ======
  if (meQuery.isError || !me) {
    return (
      <Container className="py-10">
        <EmptyState
          title="유저 정보를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </Container>
    );
  }

  // ====== Data & Pagination ======
  const posts = myPostsQuery.data?.posts ?? [];
  const bookmarks = myBookmarksQuery.data?.tripRoutes ?? [];

  const postsTotalPages = myPostsQuery.data?.totalPages ?? 1;
  const bookmarksTotalPages = myBookmarksQuery.data?.totalPages ?? 1;

  const canPrevPosts = postPage > 1;
  const canNextPosts = postPage < postsTotalPages;

  const canPrevBm = bmPage > 1;
  const canNextBm = bmPage < bookmarksTotalPages;

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">마이페이지</h1>
            <p className="mt-1 text-sm text-neutral-600">
              내 계정과 활동을 한 곳에서 관리해요.
            </p>
          </div>

          <Button onClick={logoutHandler}>로그아웃</Button>
        </div>

        {/* Profile Card */}
        <Card className="rounded-2xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold truncate">{me.nickName}</h2>
                <Badge>{providerLabel(me.provider)}</Badge>
              </div>

              <div className="mt-2 space-y-1 text-sm text-neutral-600">
                <p className="truncate">
                  이메일:{" "}
                  <span className="text-neutral-800">{me.email ?? "-"}</span>
                </p>
                <p>
                  가입일:{" "}
                  <span className="text-neutral-800">
                    {formatDate(me.createdAt)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={openEdit}>
                닉네임 수정
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("bookmarks")}
            className={[
              "rounded-full px-4 py-2 text-sm transition",
              tab === "bookmarks"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
            ].join(" ")}
          >
            북마크
          </button>

          <button
            onClick={() => setTab("posts")}
            className={[
              "rounded-full px-4 py-2 text-sm transition",
              tab === "posts"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
            ].join(" ")}
          >
            내가 쓴 글
          </button>
        </div>

        {/* Content */}
        {tab === "bookmarks" ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">저장한 여행루트</h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600">
                  {bmPage} / {bookmarksTotalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={!canPrevBm || myBookmarksQuery.isFetching}
                  onClick={() => setBmPage((p) => Math.max(1, p - 1))}
                >
                  이전
                </Button>
                <Button
                  variant="secondary"
                  disabled={!canNextBm || myBookmarksQuery.isFetching}
                  onClick={() => setBmPage((p) => p + 1)}
                >
                  다음
                </Button>
              </div>
            </div>

            {myBookmarksQuery.isError ? (
              <EmptyState
                title="북마크를 불러오지 못했어요"
                description="네트워크 상태를 확인하고 다시 시도해주세요."
              />
            ) : myBookmarksQuery.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-2xl" />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <EmptyState
                title="아직 북마크한 여행루트가 없어요"
                description="마음에 드는 여행루트를 저장해두면 여기서 모아볼 수 있어요."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((route) => (
                  <RouteCard key={route.id ?? route.slug} route={route} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">작성한 글</h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600">
                  {postPage} / {postsTotalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={!canPrevPosts || myPostsQuery.isFetching}
                  onClick={() => setPostPage((p) => Math.max(1, p - 1))}
                >
                  이전
                </Button>
                <Button
                  variant="secondary"
                  disabled={!canNextPosts || myPostsQuery.isFetching}
                  onClick={() => setPostPage((p) => p + 1)}
                >
                  다음
                </Button>
              </div>
            </div>

            {myPostsQuery.isError ? (
              <EmptyState
                title="작성한 글을 불러오지 못했어요"
                description="네트워크 상태를 확인하고 다시 시도해주세요."
              />
            ) : myPostsQuery.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <EmptyState
                title="아직 작성한 글이 없어요"
                description="커뮤니티에 글을 작성하면 여기에 모아볼 수 있어요."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Nickname Edit Modal */}
      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold">닉네임 수정</h4>
            <p className="mt-1 text-sm text-neutral-600">
              다른 유저와 중복되지 않는 닉네임으로 설정해요.
            </p>

            <input
              value={nickDraft}
              onChange={(e) => setNickDraft(e.target.value)}
              className="mt-4 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
              placeholder="새 닉네임"
              maxLength={12}
              autoFocus
            />

            <div className="mt-5 flex gap-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsEditOpen(false)}
                disabled={nicknameMutation.isPending}
              >
                취소
              </Button>

              <Button
                className="w-full"
                disabled={
                  nicknameMutation.isPending || nickDraft.trim().length < 2
                }
                onClick={async () => {
                  // mutateAsync는 에러 throw하므로, 토스트는 onError에서 처리됨
                  await nicknameMutation.mutateAsync(nickDraft.trim());
                  setIsEditOpen(false);
                }}
              >
                {nicknameMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </div>

            {/* 인라인 힌트(선택) */}
            {nickDraft.trim().length > 0 && nickDraft.trim().length < 2 ? (
              <p className="mt-2 text-xs text-neutral-500">
                닉네임은 최소 2자 이상이어야 해요.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </Container>
  );
}
