import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    ignores: ['node_modules', 'dist'],
  },

  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'error',
      'no-unreachable': 'error',
      'no-empty': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
];
