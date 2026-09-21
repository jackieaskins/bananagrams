import convex from "@convex-dev/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import bananagrams from "eslint-config-bananagrams";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactDom from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import globals from "globals";

export default defineConfig([
  globalIgnores(["convex/_generated", "dist"]),
  bananagrams,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      convex.configs.recommended,
      reactDom.configs.strict,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs["strict-type-checked"],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jsxA11y.flatConfigs.strict,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["convex/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*/_generated/server"],
              importNames: ["query", "mutation", "action"],
              message: "Use functions.ts for query, mutation, or action",
            },
            {
              group: ["convex/values"],
              importNames: ["ConvexError"],
              message: "Use ApplicationError instead",
            },
          ],
        },
      ],
    },
  },
]);
