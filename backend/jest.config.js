module.exports = {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  forceExit: true,
  detectOpenHandles: true,
  setupFilesAfterEnv: ['./tests/setup.js']
};

