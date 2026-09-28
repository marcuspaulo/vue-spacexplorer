# CLAUDE.md — SpaceXplorer (Vue)

Guia de convenções para agentes de IA que trabalham neste projeto.
Documentação em **português**; código, commits e textos da UI em **inglês**.

## Visão Geral

**SpaceXplorer** é uma SPA Vue 3 + TypeScript que consome a
[NASA Images and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
para buscar imagens, vídeos e áudios, com debounce, infinite scroll e tema dark/light.

- **API:** `GET https://images-api.nasa.gov/search?q={q}&page={page}&page_size=20` (pública, sem auth)
- **Plano e especificação funcional:** [`PLANNING.md`](./PLANNING.md) — fonte da verdade para
  textos, estados e comportamentos. Em caso de dúvida, siga o `PLANNING.md`.
- `projeto-exemplo-em-react/` é só referência temporária e será removida — **nunca** importe
  nada de lá nem crie dependência dela.

## Stack

| Camada      | Tecnologia                                                                   |
| ----------- | ---------------------------------------------------------------------------- |
| Framework   | Vue **3.5** (`<script setup lang="ts">`, Composition API)                    |
| Bundler     | Vite 8 + `@vitejs/plugin-vue`                                                |
| Linguagem   | TypeScript **6.0** + `vue-tsc` (❌ não usar TS 7 — incompatível com vue-tsc) |
| Estilo      | Tailwind CSS 4 (`@tailwindcss/vite`)                                         |
| UI          | shadcn-vue (Reka UI) + `@lucide/vue`                                         |
| Dados       | `@tanstack/vue-query` 5 + Axios                                              |
| Utilitários | `@vueuse/core`, date-fns 4, cva + clsx + tailwind-merge                      |
| Testes      | Vitest + @vue/test-utils (unit), Playwright (E2E)                            |

Sem Vue Router, sem Pinia (ver justificativa no `PLANNING.md`).

## Skills do Projeto

Carregue a skill relevante **antes** de escrever código na área:

| Skill                   | Quando usar                                       |
| ----------------------- | ------------------------------------------------- |
| `vue3`                  | Qualquer `.vue` ou composable                     |
| `tanstack-vue-query-v5` | Queries, cache, infinite scroll, erros de API     |
| `vueuse`                | Debounce, título, tema, visibilidade de elementos |
| `tailwind-v4`           | Classes, tokens, CSS                              |
| `shadcn-vue`            | Adicionar/usar componentes de `src/components/ui` |
| `design-system`         | Cores, tipografia, animações, padrões visuais     |
| `testing`               | Specs Playwright e testes Vitest                  |

## Estrutura

```
src/
├── assets/main.css              # Tailwind + tokens (light/dark)
├── components/
│   ├── ui/                      # shadcn-vue gerado — NÃO editar à mão
│   └── ErrorBoundary.vue
├── composables/                 # Composables genéricos (useTheme, useInfiniteScroll)
├── features/search/
│   ├── api/                     # Chamadas HTTP (Axios)
│   ├── components/              # SearchPage, SearchInput, SearchResults, SearchCard…
│   ├── composables/             # useSearchInfinite
│   ├── lib/                     # Funções puras (select-results) + testes
│   └── types/                   # Tipos da API NASA
├── layouts/                     # RootLayout, AppHeader, AppFooter
├── lib/                         # cn(), queryClient
├── App.vue
└── main.ts
e2e/                             # Playwright (+ support/)
```

- Código de uma feature fica em `features/<feature>/`; só sobe para `src/composables` ou
  `src/components` quando é genérico.
- Testes unitários ficam ao lado do arquivo testado: `*.test.ts`.

## Convenções de Código

### Componentes

```vue
<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import type { SearchResultItem } from '@/features/search/types/nasa-api';

const { item, class: className } = defineProps<{
    item: SearchResultItem;
    class?: HTMLAttributes['class'];
}>();

const emit = defineEmits<{ select: [value: string] }>();
</script>

<template>
    <article :class="cn('base-classes', className)">…</article>
</template>
```

- **Sempre** `<script setup lang="ts">`; ordem dos blocos: `script` → `template` (→ `style`, raro).
- ❌ Options API, mixins, `defineComponent({ ... })` com objeto, event bus, `this`.
- Nomes de componentes em **PascalCase multi-palavra** (`AppHeader`, não `Header`).
- Props com tipagem por tipo (`defineProps<{...}>()`) e **destructure reativo** (Vue 3.5)
  para defaults: `const { size = 'md' } = defineProps<…>()`.
- `v-model` em componentes → `defineModel()`; eventos → `defineEmits` com sintaxe de tupla.
- Template refs → `useTemplateRef('name')`; IDs acessíveis → `useId()`.
- Estado derivado → `computed`. `watch` só para **efeitos colaterais**.
- `v-for` sempre com `:key` de ID do domínio (`item.id`); nunca `index`; nunca `v-if` no
  mesmo elemento que `v-for`.
- Ícones Lucide decorativos com `aria-hidden="true"`.

### Composables

- Arquivo próprio, nome `useXxx`, em `src/composables/` ou `features/*/composables/`.
- Entradas `MaybeRefOrGetter<T>` lidas com `toValue()`; retornar `ref`s (não `reactive`).
- Prefira um composable da **VueUse** a reimplementar (debounce, storage, observers…).

### TanStack Vue Query

- `queryClient` instanciado **uma vez** em `src/lib/query-client.ts`, instalado via `VueQueryPlugin`.
- Opções passadas como **getter**: `useInfiniteQuery(() => ({ ... }))` para reatividade.
- Query keys via factory (`searchKeys`). `gcTime` (não `cacheTime`); sem `onSuccess`/`onError`.
- Transformação de dados no `select` com função pura definida fora do composable.

### Estilização

- Tailwind utility-first; mesclar classes com `cn()`; variações com `cva`.
- Usar tokens semânticos (`bg-background`, `text-muted-foreground`, `text-primary`) em vez de
  cores cruas, exceto nos acentos definidos no design system.

### TypeScript

- `interface` para objetos de domínio; `type` para unions/aliases; imports de tipo com `import type`.
- ❌ `any`, ❌ non-null `!` fora de `main.ts`, ❌ referências circulares.

## Regras Importantes

1. **Sempre** usar o alias `@/` nos imports (nunca `../../..`). Única exceção: testes Vitest
   importando os builders de `e2e/support/nasa-fixtures.ts` (fora de `src/`).
2. **Não** commitar `console.log` (ESLint bloqueia; `warn`/`error` permitidos).
3. `src/components/ui/` é gerado pelo shadcn-vue: adicionar com `npx shadcn-vue@latest add <c>`.
4. Textos da UI, `aria-label`s e roles devem seguir **exatamente** o `PLANNING.md` — os testes
   E2E dependem deles.
5. Acessibilidade: `role="search"`, `role="status"`, `aria-live`, `aria-busy`, `aria-expanded`,
   labels em botões só com ícone.
6. Ao terminar uma tarefa, rodar `npm run typecheck && npm run lint` (e os testes afetados) e
   atualizar os checkboxes do `PLANNING.md`.

## Comandos

```bash
npm run dev               # http://localhost:5173
npm run build             # vue-tsc --build && vite build
npm run typecheck
npm run lint
npm run format            # Prettier + ordenação de classes Tailwind
npm run test:unit         # Vitest
npm run test:e2e          # Playwright (build de produção + API mockada)
npm run test:e2e:ui
E2E_LIVE=1 npm run test:e2e   # inclui smoke test contra a API real
npx shadcn-vue@latest add <component>
```

## Variáveis de Ambiente

```bash
VITE_BASE_URL=https://images-api.nasa.gov
VITE_APP_TITLE=SpaceXplorer
```
