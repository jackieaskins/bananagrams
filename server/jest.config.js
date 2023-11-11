const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'server',
  displayName: 'SERVER',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: 'server/tsconfig.json',
    },
  },
};
