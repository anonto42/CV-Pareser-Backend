/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Where tests live
  roots: ['<rootDir>/src'],

  // Match test files
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],

  // Transform TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Ignore build output & deps
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Module resolution
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Clear mocks between tests
  clearMocks: true,

  // Coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/infrastructure/**',
    '!src/**/adapters/**',
    '!src/**/index.ts',
  ],

  coverageDirectory: 'coverage',
};
