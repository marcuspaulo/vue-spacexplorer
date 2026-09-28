---
name: vue3
description: Boas práticas Vue 3.5 (script setup, Composition API, defineModel, useTemplateRef, useId, composables, error boundary) para o SpaceXplorer. Usar ao criar ou editar qualquer arquivo .vue ou composable.
---

# Vue 3.5 — Boas Práticas

## Estrutura de um SFC

```vue
<script setup lang="ts">
// 1. imports (tipos com `import type`)
// 2. props / emits / model
// 3. composables e estado
// 4. computed
// 5. watchers (só efeitos colaterais)
// 6. funções de handler
</script>

<template>
    <!-- markup -->
</template>
```

- **Sempre** `<script setup lang="ts">`. ❌ Options API, mixins, `this`, filters, event bus.
- Um componente por arquivo, nome **PascalCase multi-palavra** (`SearchCard.vue`, `AppHeader.vue`).
- Sem `<style>` — estilização via Tailwind. Se inevitável, `<style scoped>`.

## Props (Vue 3.5 — destructure reativo)

```ts
import type { HTMLAttributes } from 'vue';

const {
    item,
    isSearching = false, // default direto no destructure
    class: className, // `class` é palavra reservada → renomear
} = defineProps<{
    item: SearchResultItem;
    isSearching?: boolean;
    class?: HTMLAttributes['class'];
}>();
```

- Variáveis desestruturadas **continuam reativas** dentro do template e de `computed`.
- Para passá-las a um composable/`watch`, use getter: `watch(() => item, …)`,
  `useFoo(() => isSearching)`. ❌ `watch(item, …)` (perde reatividade — erro de compilação).

## v-model → `defineModel`

```vue
<!-- SearchInput.vue -->
<script setup lang="ts">
const model = defineModel<string>({ required: true });
const inputId = useId();
</script>

<template>
    <label :for="inputId" class="sr-only">Search the NASA image library</label>
    <Input :id="inputId" v-model="model" type="search" />
</template>

<!-- Uso -->
<SearchInput v-model="input" :is-searching="isDebouncing" />
```

## Emits — sintaxe de tupla

```ts
const emit = defineEmits<{ select: [suggestion: string] }>();
emit('select', 'Mars');
```

No template do pai: `@select="(value) => (input = value)"` ou `@select="input = $event"`.

## Reatividade

| Precisa de                            | Use                 |
| ------------------------------------- | ------------------- |
| Valor primitivo / substituído inteiro | `ref()`             |
| Objeto grande tratado como imutável   | `shallowRef()`      |
| Derivado de outro estado              | `computed()`        |
| Efeito colateral ao mudar             | `watch(source, cb)` |
| Ler `MaybeRefOrGetter`                | `toValue()`         |

```ts
// ✅ derivado
const isDebouncing = computed(() => input.value.trim() !== query.value);

// ❌ watch para sincronizar estado derivado
watch(input, (v) => {
    isDebouncing.value = v.trim() !== query.value;
});
```

- Evite `reactive()` para estado local; se usar, **não desestruture** (use `toRefs`).
- No template, refs de nível superior são desembrulhados automaticamente.

## Template refs e IDs

```ts
const sentinel = useTemplateRef<HTMLDivElement>('sentinel'); // Vue 3.5
const id = useId(); // estável, único por instância
```

```vue
<div ref="sentinel" aria-hidden="true" class="h-px" />
```

`useTemplateRef` retorna `null` enquanto o elemento não existe (ex.: dentro de `v-if`) e
atualiza sozinho — composables que recebem esse ref reagem quando ele monta.

## Listas e condicionais

```vue
<li v-for="item in results.items" :key="item.id">…</li>
<!-- ✅ ID do domínio -->
<li v-for="(item, i) in items" :key="i">…</li>
<!-- ❌ index -->
```

- ❌ `v-if` e `v-for` no mesmo elemento — envolva com `<template v-if>` ou filtre num `computed`.
- Estados mutuamente exclusivos → cadeia `v-if` / `v-else-if` / `v-else` (ver `SearchResults`).
- Listas estáticas de repetição (skeletons): `v-for="n in 6" :key="n"` é aceitável.

## Composables

```ts
// src/composables/useXxx.ts
import { toValue, type MaybeRefOrGetter } from 'vue';

export function useXxx(source: MaybeRefOrGetter<string>) {
    const result = computed(() => toValue(source).trim());
    return { result }; // retornar refs, não reactive
}
```

- Sempre chamados de forma **síncrona** no `setup` (ou dentro de `effectScope`).
- Estado compartilhado entre componentes → `createSharedComposable` (VueUse) ou
  `provide/inject` com `InjectionKey` tipada. Não criar `ref` em escopo de módulo sem motivo.
- Limpeza de efeitos manuais com `onScopeDispose` / `onWatcherCleanup` (3.5).

## Error Boundary

Vue não tem componente pronto; o projeto usa `src/components/ErrorBoundary.vue`:

```vue
<script setup lang="ts">
import { onErrorCaptured, shallowRef, watch } from 'vue';

const { resetKey } = defineProps<{ resetKey?: unknown }>();
const error = shallowRef<Error | null>(null);

function reset() {
    error.value = null;
}

onErrorCaptured((err) => {
    error.value = err instanceof Error ? err : new Error(String(err));
    return false; // não propaga
});

// Equivalente ao `resetKeys` do react-error-boundary
watch(() => resetKey, reset);
</script>

<template>
    <slot v-if="error" name="fallback" :error="error" :reset="reset" />
    <slot v-else />
</template>
```

```vue
<ErrorBoundary :reset-key="query">
    <SearchResults :query="query" @select="input = $event" />
    <template #fallback="{ reset }">
        <SearchErrorFallback @retry="reset" />
    </template>
</ErrorBoundary>
```

## Título do documento

Use `useTitle` da VueUse com `computed` — não manipular `document.title` em `watch`.

## TypeScript

- `interface` para objetos, `type` para unions. `import type` para tipos.
- Tipar env em `src/env.d.ts` (`ImportMetaEnv`).
- ❌ `any`; ❌ `!` (exceto `document.getElementById` em `main.ts`, se necessário).

## Anti-padrões

- ❌ Mutar props (use `defineModel` ou emita evento)
- ❌ `watch` + atribuição para derivar estado
- ❌ `v-html` com dados da API
- ❌ Arrow functions inline pesadas no template — extraia para função no script
- ❌ Importar `ref`/`computed` automaticamente sem import explícito (sem auto-import no projeto)
