import PostList from "@/components/community/PostList";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityTab from "@/components/community/CommunityTab";
import Container from "@/components/common/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티 | 혼여족",
  description: "혼여족을 위한 여행 정보 커뮤니티",
};

export default function CommunityPage() {
  return (
    <div className="py-10">
      <Container className="space-y-8">
        <CommunityHeader />
        <CommunityTab />
        <PostList />
      </Container>
    </div>
  );
}
