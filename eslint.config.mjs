import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,

  {
    ignores: ['node_modules/', '.next/', 'out/', 'dist/', 'coverage/'],
  },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        vi: 'readonly',
      },
    },
  },

  {
    files: ['**/*.{js,mjs}'],
    rules: {
      'no-console': 'warn',
    },
  },
)
