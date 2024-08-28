import type { Config } from "tailwindcss";

import base from "./base.ts";

export default {
  content: base.content,
  presets: [base],
  theme: {},
} satisfies Config;
