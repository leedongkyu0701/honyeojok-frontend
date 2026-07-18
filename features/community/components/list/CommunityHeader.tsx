"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/auth.store";
import Button from "@/shared/ui/Button";

export default function CommunityHeader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">커뮤니티</h1>
        <p className="mt-1 text-neutral-500">자유롭게 글을 남겨보세요!</p>
      </div>

      <Link href={isAuthenticated ? "/community/write" : "/auth/login"}>
        <Button size="sm">글쓰기 →</Button>
      </Link>
    </div>
  );
}
