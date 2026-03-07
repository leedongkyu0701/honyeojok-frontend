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

export default nextConfig;
