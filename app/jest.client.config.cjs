const baseConfig = require("./jest.config.base.cjs");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!index.tsx",
    "!socket/index.ts",
    "!fixtures/*.ts",
    "!vite-env.d.ts",
  ],
  displayName: "CLIENT",
  rootDir: "./src/client",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testEnvironment: "jsdom",
};
