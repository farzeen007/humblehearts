import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import { ESLint } from 'eslint';

export default tseslint.config(
  {
    ignores: ['dist'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      'plugin:@typescript-eslint/recommended', // TypeScript specific recommended rules
      'plugin:react/recommended', // React recommended settings
    ],
    files: ['**/*.{ts,tsx}'],
    parser: '@typescript-eslint/parser', // Use TypeScript parser
    parserOptions: {
      project: './tsconfig.json', // Point to your TypeScript config if you have one
      tsconfigRootDir: __dirname, // Ensure ESLint can find your tsconfig.json
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint, // Add TypeScript ESLint plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Disable TypeScript errors completely
      '@typescript-eslint/no-explicit-any': 'off', // Allow `any` type
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable required return types on functions
      '@typescript-eslint/no-unused-vars': 'off', // Ignore unused variables
      '@typescript-eslint/ban-ts-comment': 'off', // Disable warning on `ts-ignore`
      '@typescript-eslint/explicit-function-return-type': 'off', // Disable return type checks
      'no-undef': 'off', // Disable undefined variable check (useful if you want to ignore missing types)
    },
  },
);
