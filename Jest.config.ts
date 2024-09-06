import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',              // Use ts-jest for TypeScript files
  testEnvironment: 'jsdom',        // Suitable for React, if you're testing components
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // For custom matchers like jest-dom
};

export default config;
