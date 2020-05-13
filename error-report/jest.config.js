// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testRegex: ['__tests__/.*(\\.|-)test\\.(t|j)s$'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
};
