module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["import"],
  reportUnusedDisableDirectives: true,
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "arrow-body-style": ["error", "as-needed"],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [["builtin", "external"], "parent", "sibling", "index"],
        "newlines-between": "never",
      },
    ],
    "no-console": "error",
    "no-debugger": "error",
    "no-useless-rename": "error",
    "object-shorthand": "error",
    "require-await": "error",
  },
};
