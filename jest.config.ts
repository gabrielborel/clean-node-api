export default {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
