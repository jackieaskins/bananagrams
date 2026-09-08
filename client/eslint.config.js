import { defineConfig, globalIgnores } from "eslint/config";
import bananagrams from "eslint-config-bananagrams";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactDom from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist"]),
  bananagrams,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
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
]);
