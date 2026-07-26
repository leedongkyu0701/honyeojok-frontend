import type { Metadata } from "next";
import WritePost from "@/features/community/components/write/WritePost";

export const metadata: Metadata = {
  title: "게시글 작성",
  description: "혼여족을 위한 여행 게시글 작성 페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WritePostPage() {
  return <WritePost />;
}
