const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'client',
  displayName: 'CLIENT',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'client/tsconfig.json',
    },
  },
};
