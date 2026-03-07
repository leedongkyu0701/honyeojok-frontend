import WritePost from "@/components/community/WritePost";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시글 작성",
  description: "혼여족을 위한 여행 게시글 작성 페이지",
};

export default function WritePostPage() {
  return (
      <WritePost />
  );
}