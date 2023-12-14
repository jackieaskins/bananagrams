const baseConfig = require("./jest.config.base.cjs");

module.exports = {
  ...baseConfig,
  projects: ["<rootDir>/src/client", "<rootDir>/src/server"],
};
