// @ts-ignore: No exported 'Config' type from 'jest', so use any or import from 'jest-config'
const config = {
  verbose: true,
  testMatch: [
    "**/components/**/*.test.(ts|tsx)",
    "**/lib/**/*.test.(ts|tsx)"
  ],
};

export default config;