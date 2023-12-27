module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jest-dom/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.test.ts", "*.test.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["import", "react-refresh"],
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
    "jest/expect-expect": [
      "error",
      { assertFunctionNames: ["expect", "assert*"] },
    ],
    "no-debugger": "error",
    "no-useless-rename": "error",
    "object-shorthand": "error",
    "react/self-closing-comp": "error",
    "react-refresh/only-export-components": "error",
    "require-await": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
