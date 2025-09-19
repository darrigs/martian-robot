module.exports = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'node', // Specify the test environment
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'], // Specify the test file patterns
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // File extensions Jest will look for
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  coverageDirectory: 'coverage', // Directory for coverage reports
  collectCoverage: true, // Enable coverage collection
};