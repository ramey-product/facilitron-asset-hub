import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features
  reactStrictMode: true,

  // Transpile workspace packages (including API for embedded Hono routes)
  transpilePackages: ["@asset-hub/shared", "@asset-hub/api"],

  // Environment variables exposed to the browser
  // In production (Vercel), API is same-origin via Next.js route handlers — use empty string.
  // In development, proxy to the standalone Hono server on port 3001.
  env: {
    NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"] ?? (process.env["VERCEL"] ? "" : "http://localhost:3001"),
  },

  // Minimal experimental config — expand as needed
  experimental: {},

  // Resolve .js imports to .ts files — needed because @asset-hub/api uses ESM-style
  // .js extensions in its TypeScript imports (standard for Node ESM projects).
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };
    return config;
  },
};

export default nextConfig;
