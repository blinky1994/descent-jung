import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // A stray lockfile in the home directory confuses root detection.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
