import js from '@eslint/js'
import globals from 'globals'
import security from 'eslint-plugin-security'

export default [
  js.configs.recommended,
  security.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // High false-positive rate for validated lookup-table access; silence below error
      'security/detect-object-injection': 'warn',
    },
  },
]
