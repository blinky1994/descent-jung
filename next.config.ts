import type { NextConfig } from "next";

// GitHub Pages serves project sites from /<repo>/; the deploy workflow sets this.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // A stray lockfile in the home directory confuses root detection.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
