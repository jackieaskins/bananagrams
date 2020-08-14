module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    // Both
    'src/**/*.{ts,tsx}',
    '!src/index.{ts,tsx}',

    // Server
    '!src/dictionary/words.ts',
    '!src/devServer.ts',

    // Client
    '!src/socket/index.ts',
    '!src/**/*.stories.tsx',
    '!src/testUtils.tsx'
  ],
  preset: 'ts-jest',
}
