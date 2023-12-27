module.exports = {
  extends: [
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
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react-refresh"],
  rules: {
    "jest/expect-expect": [
      "error",
      { assertFunctionNames: ["expect", "assert*"] },
    ],
    "react/self-closing-comp": "error",
    "react-refresh/only-export-components": "error",
  },
  settings: {
    react: { version: "detect" },
  },
};
