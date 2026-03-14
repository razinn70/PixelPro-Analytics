import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/types/**',
    '!src/server.ts',
  ],
  coverageThresholds: {
    global: {
      lines:      80,
      functions:  80,
      branches:   75,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov'],
}

export default config
