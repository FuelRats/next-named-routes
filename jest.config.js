module.exports = {
  setupFilesAfterEnv: ['jest-extended'],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
}
