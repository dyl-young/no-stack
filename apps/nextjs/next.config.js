import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
/** @type {import("next").NextConfig} */
export default {
  output: "standalone",
  transpilePackages: ["@no-stack/api", "@no-stack/db"],
  turbopack: { root },
  outputFileTracingRoot: root,
};
