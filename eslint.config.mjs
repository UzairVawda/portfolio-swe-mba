import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vitest writes an HTML coverage report here. It is gitignored, but ESLint
    // still walked into it and reported on generated vendor scripts — a
    // permanent warning in every `npm run lint` that no source change can fix.
    "coverage/**",
  ]),
]);

export default eslintConfig;
