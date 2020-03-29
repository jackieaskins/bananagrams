module.exports = {
  clearMocks: true,
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  preset: 'ts-jest',
  resetModules: true,
  testEnvironment: 'node',
};
