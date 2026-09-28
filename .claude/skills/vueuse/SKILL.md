---
name: vueuse
description: Uso da VueUse no SpaceXplorer — refDebounced (busca), useTitle (título), useColorMode (tema persistido sem flash), useIntersectionObserver com pause/resume (infinite scroll) e createSharedComposable. Usar antes de escrever um composable utilitário.
---

# VueUse (`@vueuse/core`)

Regra: **antes de escrever um composable utilitário, verifique se a VueUse já tem.**
Imports sempre nomeados de `@vueuse/core`.

## Debounce da busca — `refDebounced`

```ts
import { refDebounced } from '@vueuse/core';

const DEFAULT_QUERY = 'Saturn';
const DEBOUNCE_MS = 400;

const input = ref(DEFAULT_QUERY);
const trimmedInput = computed(() => input.value.trim());
const query = refDebounced(trimmedInput, DEBOUNCE_MS); // começa com 'Saturn' (sem atraso)
const isDebouncing = computed(() => trimmedInput.value !== query.value);
```

Debounce sobre o valor **já com `trim()`**: digitar só espaços não dispara nova busca.

## Título do documento — `useTitle`

```ts
import { useTitle } from '@vueuse/core';

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'SpaceXplorer';
useTitle(() => (query.value ? `${query.value} · ${APP_TITLE}` : APP_TITLE));
```

## Tema — `useColorMode` + `createSharedComposable`

```ts
// src/composables/useTheme.ts
import { computed } from 'vue';
import { createSharedComposable, useColorMode } from '@vueuse/core';

export type Theme = 'light' | 'dark';

export const useTheme = createSharedComposable(() => {
    const mode = useColorMode<Theme>({
        storageKey: 'theme', // mesmo key lido pelo script do index.html
        initialValue: 'dark', // dark-first
        attribute: 'class',
        modes: { dark: 'dark', light: '' }, // light = sem classe
    });

    const theme = computed<Theme>(() =>
        mode.value === 'light' ? 'light' : 'dark'
    );

    function toggleTheme() {
        mode.value = theme.value === 'dark' ? 'light' : 'dark';
    }

    return { theme, toggleTheme };
});
```

- ❌ Não usar `useDark`: ele grava `'auto'` quando o valor coincide com a preferência do sistema,
  e o script anti-flash do `index.html` só entende `'light'`/`'dark'`.
- O script inline do `index.html` aplica a classe **antes** do Vue montar; o composable apenas
  mantém sincronizado. O E2E `theme.spec.ts` cobre persistência e ausência de flash.
- `createSharedComposable` garante uma única instância (header e qualquer outro consumidor).

## Infinite scroll — `useIntersectionObserver` com `pause`/`resume`

Ver `src/composables/useInfiniteScroll.ts`:

```ts
export function useInfiniteScroll(
    sentinel: MaybeElementRef,
    { onLoadMore, enabled, rootMargin = '0px' }: UseInfiniteScrollOptions
) {
    const { pause, resume } = useIntersectionObserver(
        sentinel,
        ([entry]) => {
            if (entry?.isIntersecting) onLoadMore();
        },
        { rootMargin, immediate: false }
    );

    watch(
        () => toValue(enabled),
        (isEnabled) => (isEnabled ? resume() : pause()),
        { immediate: true }
    );
}
```

Uso em `SearchResults.vue`:

```ts
const sentinel = useTemplateRef<HTMLDivElement>('sentinel');

useInfiniteScroll(sentinel, {
    onLoadMore: loadMore,
    enabled: () =>
        hasNextPage.value &&
        !isFetchingNextPage.value &&
        !isFetchNextPageError.value,
    rootMargin: '600px',
});
```

- ⚠️ **Não** usar `useElementVisibility` + `watch([isVisible, enabled])`. Quando a página
  termina de carregar, `enabled` volta a `true` no mesmo tick em que `isVisible` ainda guarda a
  medição **antiga** (o sentinel já foi empurrado pelos 20 cards novos, mas o observer ainda não
  reportou). Resultado: busca uma página extra (falhava no E2E mobile, 60 itens em vez de 40).
- `resume()` recria o observer (watch com `flush: 'post'`), e a **primeira** notificação de um
  observer novo reflete o layout atual — igual ao comportamento do projeto React.
- Não confundir com o `useInfiniteScroll` da VueUse (baseado em evento de scroll de container).
- O sentinel fica dentro de `v-if`: `useTemplateRef` + o observer reagem quando ele monta.

## Outros úteis (se necessário)

| Necessidade                 | Composable                                    |
| --------------------------- | --------------------------------------------- |
| localStorage reativo        | `useStorage`                                  |
| Media query                 | `useMediaQuery`, `usePreferredReducedMotion`  |
| Eventos globais com cleanup | `useEventListener`                            |
| Estado compartilhado        | `createSharedComposable`, `createGlobalState` |
