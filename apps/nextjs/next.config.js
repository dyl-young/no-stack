import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
/** @type {import("next").NextConfig} */
export default {
  transpilePackages: ["@no-stack/api"],
  turbopack: { root },
  outputFileTracingRoot: root,
};
