module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json",
      },
    ],
  },

  testMatch: [
    "**/src/tests/**/*.test.ts",
    "**/src/tests/**/*.test.tsx",
  ],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  clearMocks: true,
};