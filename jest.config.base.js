module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/dictionary/words.ts',
    '!src/index.ts',
    '!src/devServer.ts'
  ],
  preset: 'ts-jest'
}
