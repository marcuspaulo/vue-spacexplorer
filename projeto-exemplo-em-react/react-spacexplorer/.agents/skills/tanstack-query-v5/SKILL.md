---
name: tanstack-query-v5
description: TanStack Query v5 — infinite queries, cache, boas práticas para o SpaceXplorer
---

# TanStack Query v5

## Mudanças v4 → v5

| v4 | v5 |
|---|---|
| `cacheTime` | `gcTime` |
| `isLoading` (sem data) | `isPending` = sem data; `isLoading` = `isPending && isFetching` |
| `onSuccess`/`onError` no useQuery | removidos — tratar erro no render (`isError`) ou error boundary |
| `useInfiniteQuery` sem `initialPageParam` | `initialPageParam` obrigatório |
| `pageParam` pode ser undefined | `pageParam` sempre tipado |
| `keepPreviousData: true` | `placeholderData: keepPreviousData` |

> ⚠️ Com `enabled: false` (busca vazia), `isPending` fica `true` para sempre.
> Para mostrar skeleton, use **`isLoading`**.

## Setup

- `QueryClient` é instanciado **uma vez** em `src/lib/query-client.ts` (fora de componentes).
- `retry` global: não repete erros 4xx; repete até 2x erros de rede/5xx.
- `src/providers/QueryProvider.tsx` só monta `QueryClientProvider` + Devtools
  (Devtools são removidos automaticamente do build de produção).

## useInfiniteQuery — Padrão do Projeto

Ver `src/features/search/hooks/useSearchInfinite.ts`. Pontos obrigatórios:

```typescript
export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

useInfiniteQuery({
  queryKey: searchKeys.query(trimmed),
  // ✅ Repassar o signal: a request é cancelada ao trocar de query
  queryFn: ({ pageParam, signal }) => searchNasaImages(trimmed, pageParam, signal),
  initialPageParam: 1,

  // ✅ Usar o link `rel: "next"` da API — NÃO calcular por total_hits.
  // A NASA para de paginar em ~10k resultados, mas total_hits passa disso
  // (ex.: "Mars" = 28.590). A conta `page * size < total_hits` pediria páginas
  // inexistentes.
  getNextPageParam: (lastPage, _all, lastPageParam) =>
    lastPage.collection.links?.some((l) => l.rel === 'next')
      ? lastPageParam + 1
      : undefined,

  // ✅ Achatamento + deduplicação por nasa_id no `select` (função fora do hook,
  // referência estável), não no componente.
  select: selectResults,

  enabled: trimmed.length > 0,
  placeholderData: keepPreviousData, // evita "piscar" ao trocar de busca
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});
```

### Cuidado com `placeholderData`

Enquanto `isPlaceholderData` é `true`, os dados exibidos são da busca **anterior**.
Não rotule esses dados com a query nova (ex.: "0 resultados para X"). Ver
`SearchResults.tsx`: mostra "Searching for…" e esmaece o grid.

## Intersection Observer para Infinite Scroll

Ver `src/hooks/useIntersectionObserver.ts`. Regras:

- Retorna um **callback ref** (`useState<Element | null>`), não `useRef` — o sentinel
  é renderizado condicionalmente, e `useRef` não re-executa o efeito quando ele monta.
- O callback é envolvido com **`useEffectEvent`** — o observer não é recriado a cada
  render. (`useCallback(fn, [fn])` não estabiliza nada.)
- `enabled` nas deps: ao terminar de carregar uma página, o observer é recriado e,
  se o sentinel ainda estiver visível, dispara a próxima.

```tsx
const sentinelRef = useIntersectionObserver({
  onIntersect: () => void fetchNextPage(),
  enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
  rootMargin: '600px',
});

<div ref={sentinelRef} aria-hidden className="h-px" />
```

## Error Handling

- Erro da primeira página: `isError && !data` → Alert com botão `refetch()`.
- Erro ao carregar mais: `isFetchNextPageError` → botão "Retry" (e o observer é
  desabilitado para não entrar em loop).
- Erros de render: `ErrorBoundary` (react-error-boundary) em `SearchPage.tsx`,
  com `resetKeys={[query]}`.
- ❌ Não usar `useEffect` + `console.error` para reagir a erros.
