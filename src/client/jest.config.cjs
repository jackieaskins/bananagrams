const baseConfig = require("../../jest.config.base.cjs");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  name: "client",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!index.tsx",
    "!socket/index.ts",
    "!fixures/**/*.{ts,tsx}",
  ],
  displayName: "CLIENT",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { diagnostics: false, tsconfig: "tsconfig.json" },
    ],
  },
};
