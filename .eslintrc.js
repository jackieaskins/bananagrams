module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
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
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true }
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          ['sibling', 'parent'],
          'index',
          'object',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: [
          'assert*',
          'expect',
          'validate*'
        ]
      }
    ],
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
  },
  settings: {
    'import/extensions': ['.ts', '.tsx'],
    react: {
      version: 'detect',
    },
  },
};
