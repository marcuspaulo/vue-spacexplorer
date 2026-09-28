---
name: tanstack-vue-query-v5
description: TanStack Vue Query v5 — setup do VueQueryPlugin, useInfiniteQuery reativo, select/dedupe, placeholderData, retry e tratamento de erros no SpaceXplorer. Usar ao mexer em busca de dados, cache ou infinite scroll.
---

# TanStack Vue Query v5

## Setup

```ts
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/vue-query';
import { isAxiosError } from 'axios';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 4xx não melhora com retry; rede/5xx pode melhorar.
            retry: (failureCount, error) => {
                const status = isAxiosError(error)
                    ? error.response?.status
                    : undefined;
                if (status !== undefined && status >= 400 && status < 500)
                    return false;
                return failureCount < MAX_RETRIES;
            },
            refetchOnWindowFocus: false,
        },
    },
});
```

```ts
// src/main.ts
import { VueQueryPlugin } from '@tanstack/vue-query';
createApp(App).use(VueQueryPlugin, { queryClient }).mount('#app');
```

Devtools: `<VueQueryDevtools />` de `@tanstack/vue-query-devtools`, renderizado **só em dev**
(`v-if` com `import.meta.env.DEV` + `defineAsyncComponent` para ficar fora do bundle de produção).
Conferir no build (`dist/assets`) que não há código de devtools.

## Reatividade — opções como getter

`useQuery`/`useInfiniteQuery` aceitam `MaybeRefOrGetter<options>`. **Padrão do projeto: getter.**

```ts
useInfiniteQuery(() => ({
    queryKey: searchKeys.query(trimmed.value),
    enabled: trimmed.value.length > 0,
    ...
}));
```

Qualquer ref lido dentro do getter recria as opções quando muda. ❌ Não passe
`queryKey: ['search', query.value]` num objeto literal simples — congela o valor.

## `useSearchInfinite` — padrão do projeto

```ts
// src/features/search/composables/useSearchInfinite.ts
import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/vue-query';
import { searchNasaImages } from '@/features/search/api/nasa-api';
import { selectResults } from '@/features/search/lib/select-results';

export const searchKeys = {
    all: ['search'] as const,
    query: (q: string) => [...searchKeys.all, q] as const,
};

export function useSearchInfinite(query: MaybeRefOrGetter<string>) {
    const trimmed = computed(() => toValue(query).trim());

    return useInfiniteQuery(() => ({
        queryKey: searchKeys.query(trimmed.value),
        // Lê a query da key (não da closure) e repassa o signal → cancela ao trocar de busca.
        queryFn: ({ queryKey: [, q], pageParam, signal }) =>
            searchNasaImages(q, pageParam, signal),
        initialPageParam: 1,
        // ✅ Usar o link `rel: "next"` da API — NÃO calcular por total_hits.
        // A NASA para de paginar em ~10k itens, mas total_hits passa disso.
        getNextPageParam: (lastPage, _all, lastPageParam) =>
            lastPage.collection.links?.some((l) => l.rel === 'next')
                ? lastPageParam + 1
                : undefined,
        select: selectResults, // função pura, fora do composable
        enabled: trimmed.value.length > 0,
        placeholderData: keepPreviousData, // evita "piscar" ao trocar de busca
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    }));
}
```

`selectResults` (em `features/search/lib/select-results.ts`, com testes Vitest):
achata `data.pages`, converte cada item com `toResultItem`, **deduplica por `nasa_id`**
(a API repete itens entre páginas) e retorna `{ items, totalHits }`.

## Consumo no componente

```ts
const {
    data,
    error,
    isLoading,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
} = useSearchInfinite(() => query);
```

- Cada campo retornado é um **`Ref`** — desestruturar é seguro; no script use `.value`,
  no template não.
- `fetchNextPage()` / `refetch()` retornam Promise: em handlers, `void fetchNextPage()`
  (regra `no-floating-promises`).

## Estados e armadilhas

| v4 / React                        | v5 / Vue                                   |
| --------------------------------- | ------------------------------------------ |
| `cacheTime`                       | `gcTime`                                   |
| `keepPreviousData: true`          | `placeholderData: keepPreviousData`        |
| `onSuccess`/`onError` no useQuery | removidos — tratar no template (`isError`) |
| `initialPageParam` opcional       | obrigatório                                |

- ⚠️ Com `enabled: false` (busca vazia) `isPending` fica `true` para sempre → para skeleton
  use **`isLoading`** (`isPending && isFetching`).
- ⚠️ Enquanto `isPlaceholderData` é `true`, `data` é da busca **anterior**. Nunca rotular com a
  query nova: mostrar "Searching for “{query}”…", `aria-busy`, `opacity-50`. Se o dado anterior
  estava vazio, mostrar skeleton (senão aparece "No results" para a query nova).

## Erros

- Primeira página falhou: `isError && !data` → Alert com `error.message` e botão "Try again"
  (`refetch`).
- Próxima página falhou: `isFetchNextPageError` → botão "Retry" (`fetchNextPage`) e o
  infinite scroll fica **desabilitado** para não entrar em loop.
- Erros de render → `ErrorBoundary` resetado pela `query`.
- Com a política de retry, erros 5xx aparecem após ~3s (2 retries com backoff).
