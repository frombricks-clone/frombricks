const baseConfig = require("./packages/config-prettier/prettier-preset");

module.exports = {
  ...baseConfig,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-sort-json",
    "prettier-plugin-organize-imports",
    "prettier-plugin-embed",
    "prettier-plugin-next"
  ],
  jsonRecursiveSort: true,
};
