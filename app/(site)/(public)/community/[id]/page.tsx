import PostDetail from "@/features/community/components/detail/PostDetail";
import Container from "@/shared/ui/Container";
import EmptyState from "@/shared/ui/EmptyState";
import type { Metadata } from "next";
import { fetchPostDetail } from "@/features/community/api/post.api";
import { notFound } from "next/navigation";
import { ApiError } from "@/shared/api/apiError";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const postId = parseInt(id, 10);
    if (!Number.isFinite(postId) || postId <= 0) {
      notFound();
    }

    const post = await fetchPostDetail(postId);
    const title = `${post.title}`;
    const description = `${post.content.slice(0, 100)}...`;

    return {
      title,
      description,
      alternates: {
        canonical: `/community/${postId}`,
      },
      openGraph: {
        title,
        description,
        images: [
          {
            url: post.images?.[0]?.url ?? "/og.png",
            alt: post.title,
          },
        ],
      },
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id, 10);
  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  return (
    <div className="py-10">
      <Container className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <PostDetail id={postId} />
        <aside className="space-y-4 lg:sticky lg:top-24">
          <h3 className="text-lg font-semibold">관련 글</h3>
          <EmptyState
            title="추천 글을 준비 중이에요."
            description="곧 더 많은 이야기를 연결해드릴게요."
          />
        </aside>
      </Container>
    </div>
  );
}
