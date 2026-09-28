---
name: testing
description: Testes do SpaceXplorer — Playwright E2E com API NASA mockada (fixture nasaApi, builders, seletores acessíveis) e Vitest + @vue/test-utils para funções puras e componentes. Usar ao escrever ou rodar testes.
---

# Testes

## Pirâmide

| Tipo       | Ferramenta                       | O que cobre                                                                       |
| ---------- | -------------------------------- | --------------------------------------------------------------------------------- |
| Unit       | Vitest                           | Funções puras (`select-results.ts`: mapeamento, dedupe, preview, audio sem links) |
| Componente | Vitest + @vue/test-utils (jsdom) | Só se houver lógica que o E2E não cubra bem                                       |
| E2E        | Playwright                       | Paridade funcional completa com a especificação do `PLANNING.md`                  |

## Vitest

```ts
// vitest.config.ts
import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root: fileURLToPath(new URL('./', import.meta.url)),
        },
    })
);
```

- Arquivos `*.test.ts` ao lado do código. Specs Playwright são `*.spec.ts` em `e2e/` — não misturar.
- Reutilize os builders de `e2e/support/nasa-fixtures.ts` para montar respostas da API nos
  testes unitários.

## Playwright — configuração

- `playwright.config.ts`: `testDir: './e2e'`, porta **5174**, `webServer` roda
  `npm run build && npm run preview -- --port 5174 --strictPort` (testa o **build de produção**).
- Projetos `desktop` (Desktop Chrome) e `mobile` (Pixel 7).
- `locale: 'en-US'`, `timezoneId: 'UTC'` → datas/números estáveis.
- CI: `forbidOnly`, 2 retries, 1 worker, reporter `github` + `html`.

## Fixture `nasaApi` (`e2e/support/test.ts`)

- **Sempre** importar `test`/`expect` de `./support/test`, nunca de `@playwright/test`
  (exceto `live.spec.ts`).
- Fixture `auto`: todo teste tem a API mockada (`images-api.nasa.gov/search`), imagens de
  `images-assets.nasa.gov` respondidas com PNG 1×1 e Google Fonts abortadas.
- Padrão: toda query tem **2 páginas** de 20 itens (`total_hits` 40).
- `nasaApi.respondWith(({ query, page }) => reply)` onde `reply` é:
    - `NasaSearchResponse` → 200
    - `{ status: 503 }` → erro
    - `{ body, delayMs }` → latência
- `nasaApi.requests` → lista de `{ query, page }` pedidos, em ordem.

Builders (`e2e/support/nasa-fixtures.ts`):

- `buildSearchPage({ query, page, totalPages, items? })` — itens `"{query} result {n}"`,
  `nasa_id` `{slug}-p{page}-{i}`, link `next` exceto na última página.
- `buildItem({ nasa_id, previewUrl?, ...data })` — `previewUrl: null` = sem links (áudio).
  Padrões: center `JPL`, media `image`, data `2020-01-15T12:00:00Z` (`FIXTURE_DATE_LABEL`
  = `15 Jan 2020`), keywords `['Space', 'Test']`.
- `buildEmptyResponse(query)`.

Helpers: `resultItems(page)` (listitems da lista "Search results"),
`resultCard(page, title)` (item que contém o heading com o título).

## Regras de seletores

- Só por papel/nome acessível: `getByRole('searchbox')`, `getByRole('button', { name: 'Clear search' })`,
  `getByRole('status', { name: 'Loading results' })`, `getByRole('banner'|'contentinfo')`.
- ❌ Classes CSS, `data-slot`, estrutura DOM.
- Se um teste precisa de um seletor que não existe, a correção é **melhorar a acessibilidade**
  do componente, não o seletor.

## Tempos

- Erros 5xx só aparecem após 2 retries com backoff (~3s): `{ timeout: 15_000 }`.
- Evite `waitForTimeout`, exceto para provar que algo **não** aconteceu (ex.: não pediu página 3).

## Specs de paridade (devem passar sem alterar asserções)

| Spec                      | Cobre                                                                          |
| ------------------------- | ------------------------------------------------------------------------------ |
| `search.spec.ts`          | query padrão, debounce, limpar, whitespace, sugestões, vazio, placeholder, dim |
| `search-card.spec.ts`     | metadados, link NASA, expandir/recolher keywords, media types, sem preview     |
| `infinite-scroll.spec.ts` | próximas páginas, fim da lista, dedupe, retry do "load more"                   |
| `errors.spec.ts`          | 5xx com retry (3 requests) e "Try again"; 4xx sem retry                        |
| `theme.spec.ts`           | dark padrão, toggle persistido, sem flash (JS bloqueado)                       |
| `layout.spec.ts`          | sem scroll horizontal, header/footer                                           |
| `live.spec.ts`            | smoke contra API real (`E2E_LIVE=1`)                                           |

## Comandos

```bash
npm run test:unit
npm run test:e2e
npm run test:e2e -- e2e/search.spec.ts --project=desktop
npm run test:e2e:ui
E2E_LIVE=1 npm run test:e2e
```
