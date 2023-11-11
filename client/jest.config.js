const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  name: 'client',
  displayName: 'CLIENT',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: 'client/tsconfig.json',
    },
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
