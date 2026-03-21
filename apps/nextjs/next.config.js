import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@no-stack/api",
    "@no-stack/db",
    "@no-stack/validators",
    "next-themes",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "http",
        hostname: process.env.VERCEL_URL || "localhost",
      },
      {
        protocol: "https",
        hostname: "*.supabase.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },

  turbopack: {},

  /** Webpack configuration for external dependencies */
  webpack: (config, { isServer }) => {
    // Mark trpc-ui and its dependencies as external to prevent bundling
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "trpc-ui",
        "@emotion/react",
        "@emotion/styled",
        "@mui/material",
      ];
    }

    return config;
  },
};

export default config;
