import { defineConfig, globalIgnores } from "eslint/config";
import bananagrams from "eslint-config-bananagrams";

export default defineConfig([globalIgnores(["dist"]), bananagrams]);
