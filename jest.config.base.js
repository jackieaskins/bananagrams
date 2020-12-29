module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    // Both
    'src/**/*.{ts,tsx}',
    '!src/index.{ts,tsx}',
    '!src/**/constants.ts',

    // Server
    '!src/dictionary/words.ts',
    '!src/devServer.ts',

    // Client
    '!src/**/*.stories.tsx',
    '!src/testUtils.tsx',
    '!src/fixtures/**/*.{ts,tsx}'
  ],
  preset: 'ts-jest',
}
