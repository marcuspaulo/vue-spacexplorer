import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginQuery from '@tanstack/eslint-plugin-query';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores([
        'dist',
        'src/components/ui',
        'test-results',
        'playwright-report',
    ]),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            reactHooks.configs.flat['recommended-latest'],
            reactRefresh.configs.vite,
            pluginQuery.configs['flat/recommended'],
        ],
        languageOptions: { globals: globals.browser },
        rules: {
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    {
        files: ['e2e/**/*.ts', 'playwright.config.ts'],
        languageOptions: { globals: globals.node },
    },
]);
