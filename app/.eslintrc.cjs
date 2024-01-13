module.exports = {
  extends: [
    "plugin:@dword-design/import-alias/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jest-dom/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "bananagrams",
  ],
  // TODO: Revisit after getting rid of enzyme tests
  overrides: [
    {
      files: [
        "./src/**/*.test.tsx",
        "./src/**/*.test.ts",
        "./src/**/__mocks__/**/*",
      ],
      rules: {
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/unbound-method": "off",
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    project: true,
  },
  plugins: ["react-refresh"],
  rules: {
    "@dword-design/import-alias/prefer-alias": [
      "error",
      { alias: { "@": "./src" } },
    ],
    "jest/expect-expect": [
      "error",
      { assertFunctionNames: ["expect", "assert*"] },
    ],
    "react/self-closing-comp": "error",
    "react-refresh/only-export-components": "error",
    "testing-library/prefer-user-event": "error",
  },
  settings: {
    react: { version: "detect" },
  },
};
