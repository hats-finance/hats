module.exports = {
  automock: false,
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/test/__mocks__/fileMock.ts"
  },
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  globals: {
    NODE_ENV: "test"
  },
  verbose: true,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./test/jest.setup.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text-summary"],
  coverageThreshold: {
    global: {
      statements: 41,
      branches: 10,
      functions: 16,
      lines: 46
    }
  }
};
