"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, User } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import Container from "@/shared/ui/Container";
import { cn } from "@/shared/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isCommunity = pathname.startsWith("/community");
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 p-1">
          <Image src="/logo.svg" alt="HonYeo" width={50} height={50} priority />
          <span className="sr-only">혼자여행</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/community"
            aria-label="커뮤니티"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              isCommunity
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <MessageCircle className="h-4.5 w-4.5" />
          </Link>

          <Link
            href={isAuthenticated ? "/auth" : "/auth/login"}
            aria-label={isAuthenticated ? "마이페이지" : "로그인"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              isAuthPage
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <User className="h-4.5 w-4.5" />
          </Link>
        </div>
      </Container>
    </nav>
  );
}
