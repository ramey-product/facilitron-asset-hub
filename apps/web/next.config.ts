import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features
  reactStrictMode: true,

  // Transpile workspace packages
  transpilePackages: ["@asset-hub/shared"],

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001",
  },

  // Minimal experimental config — expand as needed
  experimental: {},
};

export default nextConfig;
