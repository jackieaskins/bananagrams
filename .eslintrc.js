module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  reportUnusedDisableDirectives: true,
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
