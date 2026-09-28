---
name: design-system
description: Design system do SpaceXplorer — tokens light/dark (CSS completo), paleta espacial, tipografia Inter, glassmorphism, animações e padrões visuais de header, cards, input e estados. Usar ao criar ou ajustar qualquer UI.
---

# Design System — SpaceXplorer

## Filosofia

**Dark-first** com estética espacial: fundos profundos, acentos cyan/azul elétrico,
glassmorphism nos cards, fundo de estrelas e micro-animações suaves. Há toggle para light mode
(tema secundário, também caprichado).

## Tokens — `src/assets/main.css` (fonte da verdade)

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* Light — secundário */
:root {
    --radius: 0.75rem;
    --background: oklch(0.984 0.003 247.858); /* slate-50 */
    --foreground: oklch(0.208 0.042 265.755); /* slate-900 */
    --card: oklch(1 0 0 / 70%);
    --card-foreground: oklch(0.208 0.042 265.755);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.208 0.042 265.755);
    --primary: oklch(0.609 0.126 221.723); /* cyan-600 */
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.929 0.013 255.508); /* slate-200 */
    --secondary-foreground: oklch(0.208 0.042 265.755);
    --muted: oklch(0.929 0.013 255.508);
    --muted-foreground: oklch(0.446 0.043 257.281); /* slate-600 */
    --accent: oklch(0.956 0.045 203.388); /* cyan-50 */
    --accent-foreground: oklch(0.398 0.07 227.392);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.869 0.022 252.894); /* slate-300 */
    --input: oklch(0.869 0.022 252.894);
    --ring: oklch(0.609 0.126 221.723);
    --glow: oklch(0.609 0.126 221.723 / 15%);
    --star: oklch(0.446 0.043 257.281 / 25%);
}

/* Dark — padrão */
.dark {
    --background: #0b1120; /* space-950 */
    --foreground: oklch(0.984 0.003 247.858); /* slate-50 */
    --card: oklch(0.279 0.041 260.031 / 50%); /* slate-800/50 */
    --card-foreground: oklch(0.984 0.003 247.858);
    --popover: oklch(0.208 0.042 265.755); /* slate-900 */
    --popover-foreground: oklch(0.984 0.003 247.858);
    --primary: oklch(0.789 0.154 211.53); /* cyan-400 */
    --primary-foreground: #0b1120;
    --secondary: oklch(0.279 0.041 260.031); /* slate-800 */
    --secondary-foreground: oklch(0.984 0.003 247.858);
    --muted: oklch(0.279 0.041 260.031);
    --muted-foreground: oklch(0.704 0.04 256.788); /* slate-400 */
    --accent: oklch(0.279 0.041 260.031);
    --accent-foreground: oklch(0.789 0.154 211.53);
    --destructive: oklch(0.704 0.191 22.216); /* red-400 */
    --border: oklch(0.372 0.044 257.287 / 50%); /* slate-700/50 */
    --input: oklch(0.372 0.044 257.287); /* slate-700 */
    --ring: oklch(0.789 0.154 211.53);
    --glow: oklch(0.715 0.143 215.221 / 20%); /* cyan-500/20 */
    --star: oklch(1 0 0 / 35%);
}

@theme inline {
    --font-sans: 'Inter', system-ui, sans-serif;

    --color-space-950: #0b1120;
    --color-space-900: #0f172a;
    --color-space-800: #1e293b;

    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-glow: var(--glow);

    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);

    --animate-fade-in-up: fade-in-up 0.4s ease-out both;

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
}

@layer base {
    * {
        @apply border-border outline-ring/50;
    }
    html {
        color-scheme: light;
    }
    html.dark {
        color-scheme: dark;
    }
    body {
        @apply min-h-dvh bg-background font-sans text-foreground antialiased;
    }
}

@utility stars-bg {
    background-image:
        radial-gradient(1px 1px at 20% 30%, var(--star), transparent),
        radial-gradient(1px 1px at 70% 15%, var(--star), transparent),
        radial-gradient(1.5px 1.5px at 40% 80%, var(--star), transparent),
        radial-gradient(1px 1px at 85% 60%, var(--star), transparent),
        radial-gradient(1px 1px at 10% 90%, var(--star), transparent),
        radial-gradient(1.5px 1.5px at 55% 45%, var(--star), transparent);
    background-size: 400px 400px;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Paleta de referência

| Papel             | Dark                                                                                  | Light                       |
| ----------------- | ------------------------------------------------------------------------------------- | --------------------------- |
| Fundo             | `#0B1120` (space-950)                                                                 | slate-50                    |
| Superfície / card | slate-800/50 + `backdrop-blur`                                                        | branco 70%                  |
| Acento primário   | cyan-400                                                                              | cyan-600                    |
| Acento secundário | blue-500                                                                              | blue-500                    |
| Texto             | slate-50 / muted slate-400                                                            | slate-900 / muted slate-600 |
| Badges de mídia   | image cyan · video violet · audio amber (`-400` dark / `-600` light, borda `-500/50`) |

Use os **tokens semânticos** (`bg-background`, `bg-card`, `text-muted-foreground`,
`text-primary`, `border`) — eles já trocam com o tema.

## Tipografia

Inter (Google Fonts, 400/500/600/700/800) carregada no `index.html`.
Hero `text-3xl sm:text-5xl font-extrabold tracking-tight`; título de card `text-lg`;
metadados `text-xs`; corpo `text-sm`.

## Padrões de componentes

| Elemento             | Classes-chave                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wrapper raiz         | `flex min-h-dvh flex-col stars-bg`                                                                                                                                                                                                    |
| Header               | `sticky top-0 z-50 border-b bg-background/80 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20`; inner `container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8`                         |
| Logo                 | `Rocket size-6 text-primary` + `text-xl font-bold tracking-tight`, "X" em `text-primary`                                                                                                                                              |
| Main                 | `container mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8`                                                                                                                                                                 |
| Footer               | `border-t`; inner `flex flex-col sm:flex-row items-center justify-center gap-2 py-6 text-sm text-muted-foreground`                                                                                                                    |
| Hero                 | `mx-auto mb-12 flex max-w-3xl flex-col items-center gap-6 pt-8 text-center sm:pt-16`                                                                                                                                                  |
| Gradiente "cosmos"   | `bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`                                                                                                                                                              |
| Input de busca       | `h-14 rounded-xl border-2 bg-card pr-12 pl-12 text-lg! backdrop-blur-sm focus-visible:border-primary`                                                                                                                                 |
| Card                 | `group animate-fade-in-up gap-4 overflow-hidden pt-0 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/20 dark:shadow-black/20` |
| Imagem do card       | wrapper `relative aspect-video overflow-hidden bg-muted`; img `size-full object-cover transition-transform duration-500 group-hover:scale-105`                                                                                        |
| Grid                 | `grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3`; `<li class="flex">` + card `w-full`                                                                                                                                           |
| Sugestões            | `Button variant="outline" size="sm" class="rounded-full"` em `flex flex-wrap justify-center gap-2`                                                                                                                                    |
| Estado vazio/inicial | `flex flex-col items-center gap-4 py-16 text-center text-muted-foreground`, ícone `size-12`                                                                                                                                           |
| Loading more         | `flex items-center justify-center gap-3 py-8 text-muted-foreground` + `Loader2 size-5 animate-spin text-primary`                                                                                                                      |

## Ícones (`@lucide/vue`)

`Rocket` (marca), `Search`, `X`, `Loader2`, `Sun`/`Moon`, `Telescope` (estado inicial),
`SearchX` (sem resultados), `AlertCircle` (erro), `Calendar`, `Tag`, `ExternalLink`,
`ImageOff`, `Music`, `PlayCircle`.

## Animações

- Cards entram com `animate-fade-in-up`.
- Hover: escala 1.02 + borda/sombra cyan; imagem 1.05.
- Loading: `Skeleton` (pulse) e `Loader2` com `animate-spin`.
- Tudo respeita `prefers-reduced-motion` (regra global no CSS).
