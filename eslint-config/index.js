import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ts.configs.strictTypeChecked,
  prettier,

  // eslint-plugin-simple-import-sort
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  {
    rules: {
      "no-undef": "off",
    },
  },
];
