// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
    { ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'] },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        languageOptions: {
            globals: globals.node,
        },
        rules: {},
    },

    eslintConfigPrettier,
)
