module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  reporters: [
    "default",
    ["jest-junit", {
      outputDirectory: "./backend/coverage", // Chemin absolu ou relatif à partir du répertoire où Jest s'exécute
      outputName: "test-report.xml"
    }]
  ]
};
