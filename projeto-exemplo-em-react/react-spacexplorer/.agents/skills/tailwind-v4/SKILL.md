---
name: tailwind-v4
description: Configuração e uso do Tailwind CSS v4 com o plugin @tailwindcss/vite
---

# Tailwind CSS v4

## Setup (Vite)

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### src/index.css
```css
@import "tailwindcss";

/* Tema customizado — SpaceXplorer */
@theme {
  --color-space-950: #0B1120;
  --color-space-900: #0F172A;
  --color-space-800: #1E293B;
  --color-accent-cyan: #22D3EE;
  --color-accent-blue: #3B82F6;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

> No Tailwind v4, NÃO há `tailwind.config.js` — a configuração é feita via CSS.

## Classes Mais Usadas

### Layout
```html
<div class="flex flex-col min-h-screen">
<div class="container mx-auto px-4 max-w-6xl">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Dark Mode (class strategy)
```html
<html class="dark">
<div class="bg-slate-950 dark:bg-slate-950 text-slate-50">
```

### Glassmorphism (cards)
```html
<div class="
  bg-slate-800/50
  backdrop-blur-sm
  border border-slate-700/50
  rounded-xl
  shadow-lg shadow-black/20
">
```

### Animações hover
```html
<div class="
  transition-all duration-300
  hover:scale-[1.02]
  hover:shadow-cyan-500/20
  hover:border-cyan-500/30
  cursor-pointer
">
```

### Skeleton Loading
```html
<div class="animate-pulse bg-slate-700/50 rounded-lg h-48 w-full" />
```

## Responsividade

```
xs  → sem prefixo (mobile first)
sm  → sm:   640px+
md  → md:   768px+
lg  → lg:   1024px+
xl  → xl:   1280px+
2xl → 2xl:  1536px+
```

## Utilitário cn()

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Tailwind v4 vs v3 — Diferenças

| v3 | v4 |
|---|---|
| `tailwind.config.js` | `@theme {}` no CSS |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| PostCSS plugin | Vite plugin `@tailwindcss/vite` |
| `content: [...]` no config | Detecção automática |
