// @ts-check
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
        '@angular-eslint/prefer-standalone': 0,
      "@angular-eslint/directive-selector": 0,
      "@angular-eslint/component-selector": 0,
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
);
