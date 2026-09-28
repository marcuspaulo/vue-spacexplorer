---
name: tailwind-v4
description: Configuração e uso do Tailwind CSS v4 com @tailwindcss/vite em projeto Vue — tokens via CSS, dark mode por classe, cn(), classes dinâmicas em templates. Usar ao escrever classes ou CSS.
---

# Tailwind CSS v4 (Vue)

## Setup

```ts
// vite.config.ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
});
```

```ts
// src/main.ts
import '@/assets/main.css';
```

```css
/* src/assets/main.css */
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

:root {
    /* tokens light */
}
.dark {
    /* tokens dark (padrão) */
}

@theme inline {
    --color-background: var(--background);
    /* ... ver skill design-system para a lista completa */
}
```

> Não existe `tailwind.config.js` no v4 — tudo em CSS. Detecção de classes automática
> (inclui `.vue`).

## Classes em templates Vue

```vue
<!-- Estáticas -->
<div class="flex items-center gap-2" />

<!-- Dinâmicas: sempre via cn() quando há merge/condição -->
<ul
    :class="
        cn(
            'grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3',
            isPlaceholderData && 'opacity-50'
        )
    "
/>

<!-- Classe recebida por prop -->
<Card :class="cn('group overflow-hidden', className)" />
```

- ❌ Nunca montar nomes de classe por concatenação (`'text-' + color + '-400'`) — o Tailwind
  não detecta. Use um mapa/`cva` com classes completas.
- `class` e `:class` podem coexistir no mesmo elemento, mas com `cn()` prefira só `:class`.
- Atributos `class` passados a um componente caem no elemento raiz (fallthrough); componentes
  shadcn-vue recebem `class` como **prop** e fazem o merge com `cn()`.

## `cn()`

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

## Variantes com `cva`

```ts
import { cva } from 'class-variance-authority';

const mediaBadgeVariants = cva('capitalize', {
    variants: {
        mediaType: {
            image: 'border-cyan-500/50 text-cyan-600 dark:text-cyan-400',
            video: 'border-violet-500/50 text-violet-600 dark:text-violet-400',
            audio: 'border-amber-500/50 text-amber-600 dark:text-amber-400',
        },
    },
});
```

## Sintaxe v4 que difere do v3

| v3                           | v4                            |
| ---------------------------- | ----------------------------- |
| `bg-gradient-to-r`           | `bg-linear-to-r`              |
| `!text-lg`                   | `text-lg!` (important no fim) |
| `@tailwind base; ...`        | `@import 'tailwindcss'`       |
| plugin PostCSS               | `@tailwindcss/vite`           |
| `theme.extend` no JS         | `@theme { --color-x: … }`     |
| utilitário custom via plugin | `@utility nome { … }`         |
| `origin-[var(--x)]`          | `origin-(--x)`                |

## Responsividade (mobile-first)

`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Nada de scroll horizontal no mobile
(coberto pelo E2E `layout.spec.ts`).

## Prettier

`prettier-plugin-tailwindcss` ordena classes (inclusive dentro de `cn()`/`cva()` via
`tailwindFunctions`) — rodar `npm run format`, não ordenar à mão.
