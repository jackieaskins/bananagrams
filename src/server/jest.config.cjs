const baseConfig = require("../../jest.config.base.cjs");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  name: "server",
  displayName: "SERVER",
  collectCoverageFrom: ["**/*.ts", "!index.ts", "!dictionary/words.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { diagnostics: false, tsconfig: "tsconfig.json" }],
  },
};
