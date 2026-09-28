---
name: shadcn-ui
description: Uso e customização de componentes shadcn/ui no projeto SpaceXplorer
---

# shadcn/ui

## Inicialização

```bash
npx shadcn@latest init
# Escolher: style=default, base-color=slate, CSS variables=yes
```

## Adicionar Componentes

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add badge
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add tooltip
```

> Componentes são copiados para `src/components/ui/`. São **seus** — pode customizar.

## Imports

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
```

## Padrões de Uso

### Card com Glassmorphism
```tsx
<Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
  <CardHeader>
    <CardTitle className="text-slate-50">{title}</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Input de busca estilizado
```tsx
<Input
  className="bg-slate-800/50 border-slate-700 text-slate-50 placeholder:text-slate-400 focus:border-cyan-500 h-12 text-lg"
  placeholder="Buscar no universo..."
  value={value}
  onChange={(e) => onChange(e.target.value)}
/>
```

### Skeleton Loading
```tsx
function CardSkeleton() {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <Skeleton className="h-48 w-full rounded-t-xl" />
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
```

### Badge para media type
```tsx
<Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
  {mediaType}
</Badge>
```

### Alert de erro
```tsx
<Alert variant="destructive" className="bg-red-950/50 border-red-800">
  <AlertDescription>Erro ao buscar resultados. Tente novamente.</AlertDescription>
</Alert>
```

### Alert de resultado vazio
```tsx
<Alert className="bg-slate-800/50 border-slate-700">
  <AlertDescription className="text-slate-400">
    Nenhum resultado encontrado. Tente: Earth, Mars, Saturn...
  </AlertDescription>
</Alert>
```

## Customização do Tema

O tema é definido em `src/index.css` via CSS variables:

```css
@layer base {
  :root {
    --background: 222 84% 5%;        /* slate-950 */
    --foreground: 210 40% 98%;       /* slate-50 */
    --card: 217 33% 10%;             /* slate-900 */
    --border: 217 33% 20%;           /* slate-800 */
    --primary: 189 94% 43%;          /* cyan-500 */
    --primary-foreground: 0 0% 100%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%; /* slate-400 */
    --ring: 189 94% 43%;
  }
}
```

## Regras

- Componentes em `src/components/ui/` são gerados — OK editar para o projeto
- Sempre usar o alias `@/` nos imports
- Para customizar variantes, usar `className` prop
- Não instalar componentes que não serão usados
