import { test as base, expect, type Page } from '@playwright/test';
import type { NasaSearchResponse } from '@/features/search/types/nasa-api';
import { buildSearchPage } from './nasa-fixtures';

export interface SearchRequest {
    query: string;
    page: number;
}

export type MockReply =
    | NasaSearchResponse
    | { status: number; delayMs?: number }
    | { body: NasaSearchResponse; delayMs: number };

export type SearchHandler = (request: SearchRequest) => MockReply;

export interface NasaApiMock {
    /** Replaces how the mocked /search endpoint answers. */
    respondWith(handler: SearchHandler): void;
    /** Every /search request the app made, in order. */
    readonly requests: SearchRequest[];
}

/** Default: every query has 2 pages of results. */
const defaultHandler: SearchHandler = ({ query, page }) =>
    buildSearchPage({ query, page, totalPages: 2 });

// 1x1 transparent PNG, served for every NASA image so tests never hit the network.
const PIXEL = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
);

async function installNasaMock(page: Page): Promise<NasaApiMock> {
    let handler = defaultHandler;
    const requests: SearchRequest[] = [];

    await page.route(
        (url) =>
            url.hostname === 'images-api.nasa.gov' &&
            url.pathname === '/search',
        async (route) => {
            const url = new URL(route.request().url());
            const request = {
                query: url.searchParams.get('q') ?? '',
                page: Number(url.searchParams.get('page') ?? '1'),
            };
            requests.push(request);

            const reply = handler(request);
            if ('delayMs' in reply && reply.delayMs) {
                await new Promise((resolve) =>
                    setTimeout(resolve, reply.delayMs)
                );
            }

            if ('status' in reply) {
                await route.fulfill({
                    status: reply.status,
                    json: { reason: 'Mocked error' },
                });
            } else {
                await route.fulfill({
                    json: 'body' in reply ? reply.body : reply,
                });
            }
        }
    );

    await page.route('https://images-assets.nasa.gov/**', (route) =>
        route.fulfill({ contentType: 'image/png', body: PIXEL })
    );
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
        route.abort()
    );

    return {
        respondWith(next) {
            handler = next;
        },
        requests,
    };
}

export const test = base.extend<{ nasaApi: NasaApiMock }>({
    // `auto`: every test is mocked, even ones that don't destructure `nasaApi`,
    // so no test can accidentally hit the real API.
    nasaApi: [
        async ({ page }, use) => {
            await use(await installNasaMock(page));
        },
        { auto: true },
    ],
});

export { expect };

/** Result cards, located by their accessible list semantics. */
export function resultItems(page: Page) {
    return page
        .getByRole('list', { name: 'Search results' })
        .getByRole('listitem');
}

export function resultCard(page: Page, title: string) {
    return resultItems(page).filter({
        has: page.getByRole('heading', { name: title, exact: true }),
    });
}
