import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 24시간
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.honyeojok.com",
        pathname: "/**",
      },
    ],
  },
};

// 빌드시 Sentry와 통합하여 소스맵 업로드 및 오류 추적을 활성화합니다.
export default withSentryConfig(nextConfig, {
  org: "honyeojok",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
