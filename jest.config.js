const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  projects: ['<rootDir>/client', '<rootDir>/server'],
};
