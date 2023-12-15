const baseConfig = require("./jest.config.base.cjs");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!index.tsx",
    "!socket/index.ts",
    "!fixtures/**/*.{ts,tsx}",
  ],
  displayName: "CLIENT",
  rootDir: "./src/client",
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
