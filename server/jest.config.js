const baseConfig = require("../jest.config.base");

module.exports = {
  ...baseConfig,
  name: "server",
  displayName: "SERVER",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: false,
        tsconfig: "server/tsconfig.json",
      },
    ],
  },
};
