"use client";

import Link from "next/link";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/stores/auth.store";

export default function CommunityHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">커뮤니티</h1>
        <p className="text-neutral-500 mt-1">자유롭게 글을 남겨보세요.</p>
      </div>

      {isAuthenticated ? (
        <Link href="/community/write">
          <Button size="sm">글쓰기 →</Button>
        </Link>
      ) : (
        <Link href="/auth/login">
          <Button size="sm">글쓰기 →</Button>
        </Link>
      )}
    </div>
  );
}
