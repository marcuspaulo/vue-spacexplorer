---
name: shadcn-vue
description: Instalação e uso dos componentes shadcn-vue (Reka UI) no SpaceXplorer — CLI, imports, as-child, props class, tooltip, ícones @lucide/vue. Usar ao adicionar ou consumir componentes de src/components/ui.
---

# shadcn-vue (Reka UI)

## Inicialização e componentes

```bash
npx shadcn-vue@latest init     # style new-york, base color slate, CSS variables
npx shadcn-vue@latest add button input card skeleton alert badge separator tooltip
```

`components.json` esperado (conferir após o init):

```json
{
    "$schema": "https://shadcn-vue.com/schema.json",
    "style": "new-york",
    "typescript": true,
    "tailwind": {
        "config": "",
        "css": "src/assets/main.css",
        "baseColor": "slate",
        "cssVariables": true,
        "prefix": ""
    },
    "iconLibrary": "lucide",
    "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "composables": "@/composables"
    }
}
```

- Cada componente vira uma pasta: `src/components/ui/button/{Button.vue,index.ts}`.
- `src/components/ui/` é **gerado**: não editar à mão, ignorado por ESLint e Prettier.
  Customize no ponto de uso via `class`, ou envolvendo num componente da feature.
- Não instalar componentes sem uso. Se o `init` sobrescrever `main.css`, restaurar os tokens do
  design system.

## Imports

```ts
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Rocket, Search, X } from '@lucide/vue';
```

## Padrões de uso

### `class` como prop (merge com `cn`)

```vue
<Card :class="cn('gap-4 overflow-hidden pt-0', className)">
```

### `as-child` — botão que é link

```vue
<Button variant="link" size="sm" class="-mr-3" as-child>
    <a :href="detailsUrl" target="_blank" rel="noopener noreferrer">
        View on NASA
        <ExternalLink />
    </a>
</Button>
```

### Input com `v-model`

```vue
<Input
    :id="inputId"
    v-model="model"
    type="search"
    autocomplete="off"
    autofocus
    class="h-14 rounded-xl border-2 bg-card pr-12 pl-12 text-lg! backdrop-blur-sm focus-visible:border-primary [&::-webkit-search-cancel-button]:hidden"
/>
```

### Tooltip (precisa de `TooltipProvider` em `App.vue`)

```vue
<Tooltip>
    <TooltipTrigger as-child>
        <Button variant="ghost" size="icon" :aria-label="label" @click="toggleTheme">
            <Sun v-if="theme === 'dark'" />
            <Moon v-else />
        </Button>
    </TooltipTrigger>
    <TooltipContent>{{ label }}</TooltipContent>
</Tooltip>
```

### Alert

```vue
<Alert variant="destructive" class="mx-auto max-w-xl">
    <AlertCircle />
    <AlertTitle>Something went wrong</AlertTitle>
    <AlertDescription class="gap-3">
        <p>We couldn't reach the NASA library: {{ error.message }}</p>
        <Button variant="outline" size="sm" @click="retry">Try again</Button>
    </AlertDescription>
</Alert>
```

### Título do card — não usar `CardTitle`

O `CardTitle` gerado renderiza `<h3>`. O título do resultado precisa ser `<h2>` (o E2E busca
por heading), e aninhar `h2` dentro de `h3` é HTML inválido. Use o heading direto:

```vue
<CardHeader class="gap-2 px-5">
    <h2 class="line-clamp-2 text-lg leading-snug font-semibold">{{ item.title }}</h2>
</CardHeader>
```

### Skeleton

O `Skeleton` gerado usa `bg-primary/10`; o design do projeto usa `bg-accent` (passar via `class`).

## Ícones — `@lucide/vue`

- Componentes Vue: `<Loader2 class="size-5 animate-spin" />`.
- Decorativos → `aria-hidden="true"`; significativos → `aria-label`.
- Dentro de `Button`, o tamanho padrão `size-4` já é aplicado pelo componente.
- ❌ `lucide-vue-next` (descontinuado).

## Regras

- Seletores de teste nunca usam `data-slot` nem classes do shadcn — sempre roles acessíveis.
- Variantes novas → `cva` no componente da feature, não editando `ui/`.
