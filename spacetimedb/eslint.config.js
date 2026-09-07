import { defineConfig } from "eslint/config";
import bananagrams from "eslint-config-bananagrams";
import ts from "typescript-eslint";

export default defineConfig(bananagrams, {
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.js"],
      },
      parser: ts.parser,
    },
  },
});
