import PostDetail from "@/components/community/PostDetail";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id, 10);
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
