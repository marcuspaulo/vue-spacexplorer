import { globalIgnores } from 'eslint/config';
import {
    defineConfigWithVueTs,
    vueTsConfigs,
} from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginVitest from '@vitest/eslint-plugin';
import pluginPlaywright from 'eslint-plugin-playwright';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,vue}'],
    },

    globalIgnores([
        '**/dist/**',
        'src/components/ui/**',
        'test-results/**',
        'playwright-report/**',
        'blob-report/**',
        'projeto-exemplo-em-react/**',
    ]),

    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommendedTypeChecked,
    pluginQuery.configs['flat/recommended'],

    {
        name: 'app/rules',
        rules: {
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'vue/block-order': [
                'error',
                { order: ['script', 'template', 'style'] },
            ],
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/define-macros-order': [
                'error',
                { order: ['defineProps', 'defineEmits', 'defineModel'] },
            ],
            'vue/define-props-destructuring': 'error',
            // Destructured optional props default to `undefined` (Vue 3.5).
            'vue/require-default-prop': 'off',
            'vue/no-unused-refs': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/prefer-use-template-ref': 'error',
            'vue/require-macro-variable-name': 'error',
        },
    },

    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/*.test.ts'],
    },

    {
        ...pluginPlaywright.configs['flat/recommended'],
        files: ['e2e/**/*.ts'],
    },

    skipFormatting
);
