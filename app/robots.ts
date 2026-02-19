import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    // 가배포 / 개발 환경 → 전체 차단
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // 실제 운영 환경
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
