module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'api/**/*.js',
    '!src/cli.js',
    '!**/node_modules/**',
    '!**/examples/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'html',
    'lcov'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  verbose: true
};