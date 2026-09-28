# CLAUDE.md — SpaceXplorer

Guia de convenções e padrões para agentes de IA que trabalham neste projeto.

## Visão Geral do Projeto

**SpaceXplorer** é uma aplicação web React + TypeScript que consome a [NASA Images and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf) para buscar e exibir imagens e vídeos do espaço.

- **API Base:** `https://images-api.nasa.gov`
- **Endpoint principal:** `GET /search?q={query}&page={page}&page_size={size}`
- **Autenticação:** Nenhuma (API pública)

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | React | 19.x |
| Bundler | Vite | 8.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 4.x |
| Componentes UI | shadcn/ui | latest |
| Ícones | lucide-react | latest |
| Data Fetching | TanStack Query | 5.x |
| HTTP Client | Axios | latest |
| Formatação de datas | date-fns | 4.x |
| Error boundary | react-error-boundary | latest |
| Testes E2E | Playwright | latest |

## Estrutura de Pastas

```
src/
├── components/
│   └── ui/              # Componentes shadcn gerados (NÃO editar manualmente)
├── features/
│   └── search/
│       ├── api/
│       │   └── nasa-api.ts         # Funções de chamada à API NASA
│       ├── components/
│       │   ├── SearchPage.tsx      # Hero + estado da busca (debounce) + ErrorBoundary
│       │   ├── SearchErrorFallback.tsx
│       │   ├── SearchInput.tsx     # Campo de busca
│       │   ├── SearchResults.tsx   # Grid de resultados + estados + sentinel
│       │   ├── SearchCard.tsx      # Card de cada item
│       │   └── SearchCardSkeleton.tsx
│       ├── hooks/
│       │   └── useSearchInfinite.ts  # Hook de infinite query
│       └── types/
│           └── nasa-api.ts         # Tipos/interfaces da API
├── hooks/
│   ├── useIntersectionObserver.ts  # Hook genérico de scroll detection
│   ├── useDebouncedValue.ts        # Debounce da busca
│   └── useTheme.ts                 # Acesso ao ThemeContext
├── layouts/
│   ├── RootLayout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── utils.ts          # cn() e utilitários globais
│   └── query-client.ts   # Instância única do QueryClient (retry/defaults)
├── providers/
│   ├── AppProviders.tsx   # Theme + Query + Tooltip providers
│   ├── QueryProvider.tsx  # QueryClientProvider + Devtools
│   ├── ThemeProvider.tsx  # Dark (padrão) / light, persistido em localStorage
│   └── theme-context.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Convenções de Código

### Componentes React

```tsx
// ✅ CORRETO — Componente funcional com tipagem explícita
interface SearchCardProps {
  item: NasaItem;
}

export function SearchCard({ item }: SearchCardProps) {
  return <div>...</div>;
}

// ❌ ERRADO — export default sem nome legível
export default function({ item }) { ... }
```

### Hooks Customizados

- **Sempre** em arquivos separados dentro de `src/hooks/` ou `src/features/*/hooks/`
- **Nunca** definir hooks dentro de componentes
- Nome começa com `use` (ex: `useSearchInfinite`, `useIntersectionObserver`)

### TanStack Query v5

```typescript
// ✅ QueryClient fora do componente (instância estável)
const queryClient = new QueryClient({ ... });

// ✅ useInfiniteQuery com initialPageParam obrigatório
useInfiniteQuery({
  queryKey: ['search', query],
  queryFn: ({ pageParam }) => fetchData(query, pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage, _all, lastPageParam) => { ... },
  enabled: query.trim().length > 0,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

// ❌ NÃO usar cacheTime (v4) — usar gcTime (v5)
// ❌ NÃO usar onSuccess/onError no useQuery (removidos no v5)
```

### Query Key Factories

```typescript
// ✅ Centralizar chaves em um objeto
export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};
```

### Estilização

```tsx
// ✅ Usar a função cn() para merge de classes Tailwind
import { cn } from '@/lib/utils';

<div className={cn('base-classes', condition && 'conditional-class', className)} />

// ✅ Usar variantes do CVA para componentes com variações
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base', {
  variants: { size: { sm: 'text-sm', lg: 'text-lg' } }
});
```

### Tipagem

```typescript
// ✅ Usar interfaces para objetos de domínio
export interface NasaItem {
  href: string;
  data: NasaItemData[];
  links: NasaItemLink[];
}

// ✅ Usar type para unions e aliases
type MediaType = 'image' | 'video' | 'audio';

// ❌ Nunca usar `any`
// ❌ Nunca deixar referências circulares (interface X { x: X })
```

### Arquivo Extensions

- `.tsx` — somente arquivos com JSX
- `.ts` — hooks, utilitários, tipos, services (sem JSX)

## Design System

### Paleta de Cores (dark-first)

- **Background primário:** `slate-950` / `#0B1120`
- **Background secundário:** `slate-900` / `#0F172A`
- **Superfície (cards):** `slate-800/50` com `backdrop-blur`
- **Acento primário:** `cyan-400` / `#22D3EE`
- **Acento secundário:** `blue-500` / `#3B82F6`
- **Texto primário:** `slate-50`
- **Texto secundário:** `slate-400`

### Componentes shadcn Disponíveis

`button`, `input`, `card`, `skeleton`, `alert`, `badge`, `separator`, `tooltip`

### Animações

- Hover nos cards: `transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/20`
- Loading: componente `Skeleton` do shadcn
- Infinite scroll: fade-in ao entrar na viewport

## Regras Importantes

1. **NÃO importar nada de `@mui/material` ou `@emotion`** — stack removida
2. **Sempre** usar path alias `@/` para imports (ex: `import { cn } from '@/lib/utils'`)
3. **QueryClient** deve ser instanciado **fora** de componentes React
4. **Não** commitar `console.log` em código de produção
5. **Sempre** adicionar array de dependências em `useEffect`
6. **Sempre** usar IDs únicos como `key` em listas (ex: `nasa_id` do item)
7. Arquivos de componentes shadcn em `src/components/ui/` são **gerados automaticamente** — não editar
8. Para adicionar novo componente shadcn: `npx shadcn@latest add <component>`

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Linting
npm run lint

# Adicionar componente shadcn
npx shadcn@latest add <component>

# Type check
npm run typecheck

# Testes E2E (build de produção + API mockada)
npm run test:e2e
npm run test:e2e:ui              # modo interativo
E2E_LIVE=1 npm run test:e2e      # inclui smoke test contra a API real

# Formatação (Prettier + ordenação de classes Tailwind)
npm run format
```

## Testes E2E (Playwright)

- Specs em `e2e/*.spec.ts`; helpers em `e2e/support/`.
- **Sempre** importar `test`/`expect` de `./support/test` (não de `@playwright/test`):
  o fixture `nasaApi` é `auto` e mocka a API da NASA, as imagens e as fontes em todo teste.
- Customizar respostas com `nasaApi.respondWith(({ query, page }) => ...)` usando
  `buildSearchPage`, `buildItem`, `buildEmptyResponse`. Erros: `{ status: 503 }`;
  latência: `{ body, delayMs }`.
- Selecionar por papel acessível (`getByRole`, `resultItems`, `resultCard`), nunca por
  classe CSS ou `data-slot`.
- Os testes rodam contra o **build de produção** (`vite preview`), em desktop e mobile,
  com `locale: en-US` e `timezoneId: UTC`.
- Erros 5xx levam ~3s para aparecer (2 retries com backoff): use `{ timeout: 15_000 }`.

## Variáveis de Ambiente

```bash
# .env
VITE_BASE_URL=https://images-api.nasa.gov
VITE_APP_TITLE=SpaceXplorer
```
