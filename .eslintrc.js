module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
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
  plugins: ["import"],
  reportUnusedDisableDirectives: true,
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "arrow-body-style": ["error", "as-needed"],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [["builtin", "external"], "parent", "sibling", "index"],
        "newlines-between": "never",
      },
    ],
    "no-debugger": "error",
    "no-empty-pattern": "off",
    "no-useless-rename": "error",
    "object-shorthand": "error",
    "react/prop-types": "off",
    "react/self-closing-comp": "error",
    "require-await": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
