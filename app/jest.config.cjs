const baseConfig = require("./jest.config.base.cjs");
const clientConfig = require("./jest.client.config.cjs");
const serverConfig = require("./jest.server.config.cjs");

module.exports = {
  ...baseConfig,
  projects: [clientConfig, serverConfig],
};
