import PostList from "@/components/community/PostList";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityFilters from "@/components/community/CommunityFilters";
import Container from "@/components/common/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "혼여족을 위한 여행 정보 커뮤니티",
};

export default function CommunityPage() {
  return (
    <div className="py-10">
      <Container className="space-y-10">
        <CommunityHeader />

        <div className="grid gap-10 md:grid-cols-[200px_1fr]">
          <CommunityFilters />
          <PostList />
        </div>
      </Container>
    </div>
  );
}
