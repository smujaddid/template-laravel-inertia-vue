/* eslint-disable n/no-extraneous-import */
import globals from 'globals'
import js from '@eslint/js'

// @ts-expect-error missing type
import nodePlugin from 'eslint-plugin-n'
// @ts-expect-error missing type
import * as importPlugin from 'eslint-plugin-import'

// @ts-expect-error missing type
import promisePlugin from 'eslint-plugin-promise'
import standard from 'eslint-config-standard'

import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

import { fileURLToPath, URL } from 'node:url'

const jsExtensions = ['.js', '.cjs', '.mjs', '.jsx']
const typeScriptExtensions = ['.ts', '.cts', '.mts', '.tsx']
const allExtensions = [...typeScriptExtensions, ...jsExtensions]

const nodePluginConfigFlatRecommended = nodePlugin.configs['flat/recommended']

/** @type { import("eslint").Linter.FlatConfig } */
export default [
  {
    ignores: [
      '**/.vscode',
      '**/app',
      '**/bootstrap',
      '**/config',
      '**/database',
      '**/dist',
      '**/node_modules',
      '**/package.json',
      '**/package-lock.json',
      '**/public',
      '**/routes',
      '**/storage',
      '**/tests',
      '**/vendor'
    ]
  },
  {
    files: ['**/*.{js,cjs,mjs,ts,vue}']
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...nodePluginConfigFlatRecommended.languageOptions.globals,
        // @ts-expect-error @types/eslint seems to be incomplete
        document: 'readonly',
        // @ts-expect-error @types/eslint seems to be incomplete
        navigator: 'readonly',
        // @ts-expect-error @types/eslint seems to be incomplete
        window: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      import: importPlugin,
      n: nodePlugin,
      promise: promisePlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...nodePluginConfigFlatRecommended.rules,
      // ...promisePlugin.configs.recommended.rules,
      ...standard.rules
    },
    settings: {
      'import/extensions': allExtensions,
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
        '@typescript-eslint/parser': typeScriptExtensions
      },
      'import/resolver': {
        node: {
          extensions: allExtensions
        },
        typescript: true,
        'eslint-import-resolver-custom-alias': {
          alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url))
          },
          extensions: ['.js', '.vue']
        }
      }
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        route: 'readonly',
        axios: 'readonly'
      },
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue']
      }
    },
    processor: vuePlugin.processors['.vue'],
    plugins: {
      vue: vuePlugin
    },
    rules: {
      ...vuePlugin.configs['vue3-recommended'].rules
    }
  },
  {
    // Override rules
    rules: {
      // False error
      'n/no-missing-import': 0,
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
  }
]
