import baseConfig, { restrictEnvAccess } from "@no-stack/eslint-config/base";
import nextjsConfig from "@no-stack/eslint-config/nextjs";
import reactConfig from "@no-stack/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
