module.exports = {
  transform: {
    '^.+\\.m?js$': 'babel-jest'
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/'
  ]
}
