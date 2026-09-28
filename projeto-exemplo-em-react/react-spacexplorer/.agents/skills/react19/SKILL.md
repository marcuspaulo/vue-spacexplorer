---
name: react19
description: Boas práticas, hooks e patterns do React 19 para o projeto SpaceXplorer
---

# React 19 — Boas Práticas

## Hooks

### useEffect — Sempre com dependências
```tsx
// ✅ Correto
useEffect(() => {
  document.title = title;
}, [title]); // ← array de deps obrigatório

// ❌ Errado — roda a cada render
useEffect(() => {
  document.title = title;
});
```

### Hooks Customizados — Sempre top-level
```tsx
// ✅ Arquivo separado: src/features/search/hooks/useSearchInfinite.ts
export function useSearchInfinite(query: string) { ... }

// ❌ Nunca dentro de componentes
export default function Search() {
  function useSearch() { ... } // ← PROIBIDO
}
```

### useState — Inicialização lazy quando caro
```tsx
// ✅ Função de inicialização (roda só uma vez)
const [theme, setTheme] = useState<Theme>(getInitialTheme);
```

> O tema inicial é aplicado por um script inline no `index.html` (antes do
> primeiro paint, sem flash). O `ThemeProvider` lê a classe `dark` do `<html>`.

### useCallback — Usar quando callback é passado como dep
```tsx
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query);
}, []); // stable reference
```

### useEffectEvent — Callbacks usados dentro de efeitos
```tsx
// ✅ Lê sempre o callback mais recente sem recriar o efeito
const handleIntersect = useEffectEvent(onIntersect);
```

### Callback ref — Para elementos renderizados condicionalmente
```tsx
// ✅ O efeito roda de novo quando o elemento monta/desmonta
const [element, setElement] = useState<Element | null>(null);
return setElement; // usado como ref={...}
```
Ver `src/hooks/useIntersectionObserver.ts`.

## Patterns

### QueryClient fora do componente
```tsx
// ✅ Fora de qualquer componente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000 },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Keys únicas em listas
```tsx
// ✅ Usar ID único do domínio
{items.map((item) => (
  <SearchCard key={item.data[0].nasa_id} item={item} />
))}

// ❌ Nunca usar index
{items.map((item, index) => (
  <SearchCard key={index} ... />
))}
```

### Composição sobre herança
```tsx
// ✅ App só compõe; providers e página ficam em arquivos próprios
<AppProviders>
  <RootLayout>
    <SearchPage />
  </RootLayout>
</AppProviders>
```

### Contexto + hook em arquivos separados
O Fast Refresh exige que arquivos `.tsx` exportem só componentes. Por isso:
`providers/theme-context.ts` (contexto e tipos), `providers/ThemeProvider.tsx`
(componente) e `hooks/useTheme.ts` (hook).

### Imports
```tsx
// ✅ Usar path alias
import { cn } from '@/lib/utils';
import { SearchCard } from '@/features/search/components/SearchCard';

// ❌ Evitar imports relativos longos
import { cn } from '../../../lib/utils';
```

## React 19 — Novidades Relevantes

- **`use()` hook** — Para leitura de Promises e Context diretamente no render (ver `useTheme`)
- **`<Context value>`** — Substitui `<Context.Provider value>`
- **`<title>` no JSX** — React move para o `<head>`; não usar `useEffect` + `document.title`
- **`useEffectEvent`** — Callback estável para uso em efeitos
- **`<ViewTransition>`** — Animações de transição entre páginas (API estável no 19.3)
- **Compilador React (experimental)** — Memoização automática
- **`ref` como prop** — Não precisa mais de `forwardRef`

```tsx
// React 19: ref como prop direto
function SearchInput({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```
