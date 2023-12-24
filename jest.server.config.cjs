const baseConfig = require("./jest.config.base.cjs");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  collectCoverageFrom: ["**/*.ts", "!index.ts", "!dictionary/words.ts"],
  displayName: "SERVER",
  rootDir: "./src/server/",
};
