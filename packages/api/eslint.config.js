import baseConfig from "@no-stack/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  {
    files: ["tests/*.test.ts"],
    languageOptions: { parserOptions: { project: "./tests/tsconfig.json" } },
  },
];
