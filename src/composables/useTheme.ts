import { computed } from 'vue';
import { createSharedComposable, useColorMode } from '@vueuse/core';

export type Theme = 'light' | 'dark';

/**
 * Dark (default) / light theme, persisted in localStorage under `theme`.
 * index.html applies the saved class before first paint to avoid a flash;
 * this composable keeps it in sync afterwards.
 */
export const useTheme = createSharedComposable(() => {
    const mode = useColorMode<Theme>({
        storageKey: 'theme',
        initialValue: 'dark',
        attribute: 'class',
        modes: { dark: 'dark', light: '' },
    });

    const theme = computed<Theme>(() =>
        mode.value === 'light' ? 'light' : 'dark'
    );

    function toggleTheme() {
        mode.value = theme.value === 'dark' ? 'light' : 'dark';
    }

    return { theme, toggleTheme };
});
