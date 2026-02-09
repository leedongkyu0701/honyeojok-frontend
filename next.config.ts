import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     minimumCacheTTL: 600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2c7d85aaca184cb4b664f61c82d16150.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
