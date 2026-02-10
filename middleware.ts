import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_: NextRequest) {
  const res = NextResponse.next();

  if (process.env.VERCEL_ENV !== "production") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}
