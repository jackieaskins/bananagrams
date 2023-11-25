const baseConfig = require("../jest.config.base");

module.exports = {
  ...baseConfig,
  name: "client",
  displayName: "CLIENT",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { diagnostics: false, tsconfig: "client/tsconfig.json" },
    ],
  },
};
