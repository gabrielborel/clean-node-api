export default {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/**/*-protocols.ts",
    "!<rootDir>/src/**/test/**",
    "!<rootDir>/src/**/protocols/**",
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    ".+\\.ts$": "@swc/jest",
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  preset: "@shelf/jest-mongodb",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
