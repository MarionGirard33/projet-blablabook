import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',

  // alias src/*
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // transpilation TS
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};

export default config;
