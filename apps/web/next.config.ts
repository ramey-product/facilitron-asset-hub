import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features
  reactStrictMode: true,

  // Transpile workspace packages (including API for embedded Hono routes)
  transpilePackages: ["@asset-hub/shared", "@asset-hub/api"],

  // Environment variables exposed to the browser
  // Default: empty string (same-origin — works on Vercel via embedded API route).
  // For local dev with standalone Hono: create .env.local with NEXT_PUBLIC_API_URL=http://localhost:3001
  env: {
    NEXT_PUBLIC_API_URL: process.env["NEXT_PUBLIC_API_URL"] ?? "",
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
