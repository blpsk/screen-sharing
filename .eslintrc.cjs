/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  rules: {
    semi: "error",
    indent: ["error", 2],
    quotes: ["error", "double"]
  }
};
