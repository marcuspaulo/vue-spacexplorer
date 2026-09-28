---
name: design-system
description: Design system SpaceXplorer — paleta, tipografia, animações e padrões visuais
---

# Design System — SpaceXplorer

## Filosofia

**Dark-first** com estética espacial. Interface que remete ao cosmos: fundos profundos,
acentos em cyan/azul elétrico, glassmorphism nos cards, e micro-animações suaves.

## Paleta de Cores

```
Backgrounds
  space-950:  #0B1120  (fundo principal — quase preto)
  space-900:  #0F172A  (fundo secundário)
  space-800:  #1E293B  (superfícies, cards)

Acentos
  cyan-400:   #22D3EE  (acento primário, links, highlights)
  blue-500:   #3B82F6  (acento secundário, botões)
  violet-500: #8B5CF6  (acento terciário, badges especiais)

Texto
  slate-50:   #F8FAFC  (texto primário)
  slate-300:  #CBD5E1  (texto secundário)
  slate-400:  #94A3B8  (texto muted / placeholder)

Bordas
  slate-700:  #334155  (borda padrão)
  slate-700/50          (borda translúcida)
  cyan-500/30           (borda hover accent)

Status
  red-400:    #F87171  (erro)
  amber-400:  #FBBF24  (aviso)
  emerald-400:#34D399  (sucesso)
```

## Tipografia

```css
/* Google Fonts — adicionar no index.html */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Uso */
font-family: 'Inter', system-ui, sans-serif;
```

### Escala tipográfica
```
text-xs   → 12px  (metadados, datas)
text-sm   → 14px  (corpo, labels)
text-base → 16px  (parágrafo principal)
text-lg   → 18px  (subtítulos de card)
text-xl   → 20px  (títulos menores)
text-2xl  → 24px  (títulos de seção)
text-3xl  → 30px  (headline principal)
text-5xl  → 48px  (hero headline)
```

## Componentes Visuais

### Card de Resultado (SpaceCard)
```tsx
// Glassmorphism card
className="
  group
  relative overflow-hidden
  bg-slate-800/50 backdrop-blur-sm
  border border-slate-700/50
  rounded-xl
  shadow-lg shadow-black/20
  transition-all duration-300 ease-out
  hover:scale-[1.02]
  hover:border-cyan-500/30
  hover:shadow-cyan-500/10
  hover:shadow-xl
  cursor-pointer
"
```

### Search Input
```tsx
className="
  w-full
  bg-slate-800/60 backdrop-blur-sm
  border-2 border-slate-700
  text-slate-50 placeholder:text-slate-500
  rounded-xl
  px-5 py-4 text-lg
  focus:outline-none focus:border-cyan-500
  transition-colors duration-200
"
```

### Header
```tsx
// Navbar com blur
className="
  fixed top-0 inset-x-0 z-50
  bg-slate-950/80 backdrop-blur-md
  border-b border-slate-800/50
  shadow-lg shadow-black/20
"
```

### Botão primário
```tsx
className="
  bg-gradient-to-r from-cyan-500 to-blue-600
  text-white font-semibold
  px-6 py-2.5 rounded-lg
  hover:from-cyan-400 hover:to-blue-500
  transition-all duration-200
  shadow-lg shadow-cyan-500/20
"
```

### Badge de media type
```
image  → border-cyan-500/50 text-cyan-400
video  → border-violet-500/50 text-violet-400
audio  → border-amber-500/50 text-amber-400
```

## Animações e Transições

### Fade-in de cards (entrada na viewport)
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: fadeInUp 0.4s ease-out forwards;
}
```

### Loading infinite scroll
```tsx
// Spinner animado na parte inferior
<div className="flex items-center justify-center py-8 gap-3 text-slate-400">
  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
  <span className="text-sm">Carregando mais...</span>
</div>
```

### Stars background (decorativo)
```css
/* Pontos aleatórios no fundo para efeito espacial */
.stars-bg {
  background-image: radial-gradient(
    1px 1px at var(--star-x) var(--star-y),
    rgba(255,255,255,0.3) 0%,
    transparent 100%
  );
}
```

## Layout

### Grid de Cards
```tsx
// Responsivo: 1 col mobile, 2 tablet, 3 desktop
className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
```

### Container principal
```tsx
className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
```

### Espaçamento vertical entre seções
```
py-8  → padding interno seções
gap-6 → gap entre cards
mb-12 → margem entre seções
```

## Ícones (lucide-react)

```tsx
import {
  Rocket,           // Logo / branding
  Search,           // Busca
  Loader2,          // Loading (com animate-spin)
  AlertCircle,      // Erro
  Image,            // Placeholder sem imagem
  Calendar,         // Data de criação
  Tag,              // Keywords
  ExternalLink,     // Link externo
  Moon, Sun,        // Toggle dark/light
  ChevronDown,      // Expand
} from 'lucide-react';
```

## Dark Mode

O app usa dark mode permanente (sem toggle — simplificado).
A classe `dark` é aplicada no `<html>` via Tailwind.

```tsx
// main.tsx ou index.html
document.documentElement.classList.add('dark');
```
