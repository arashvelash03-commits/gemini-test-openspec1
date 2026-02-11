import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 2026 Standard: Strict React Mode (default true, but explicit is good)
  reactStrictMode: true,
  // Security: Remove x-powered-by header
  poweredByHeader: false,
  // Experimental/New Features might be here, but keeping it clean for stability
};

export default nextConfig;
