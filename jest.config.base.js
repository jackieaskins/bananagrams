module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/dictionary/words.ts'
  ],
  preset: 'ts-jest'
}
