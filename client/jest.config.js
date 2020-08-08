const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'client',
  displayName: 'CLIENT',
  globals: {
    'ts-jest': {
      tsConfig: 'client/tsconfig.json',
    },
  },
};
