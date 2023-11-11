/** @type {import('jest').Config} */
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
    '!src/fixtures/**/*.{ts,tsx}',
  ],
  preset: 'ts-jest',
};
