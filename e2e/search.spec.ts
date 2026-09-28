import { buildEmptyResponse, buildSearchPage } from './support/nasa-fixtures';
import { expect, resultItems, test } from './support/test';

test.describe('Search', () => {
    test('loads results for the default query on first visit', async ({
        page,
        nasaApi,
    }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            'Explore the cosmos'
        );
        await expect(page.getByRole('searchbox')).toHaveValue('Saturn');
        await expect(resultItems(page)).toHaveCount(20);
        await expect(page.getByText('40 results for “Saturn”')).toBeVisible();
        await expect(page).toHaveTitle('Saturn · SpaceXplorer');
        expect(nasaApi.requests).toContainEqual({ query: 'Saturn', page: 1 });
    });

    test('debounces typing and only searches the final term', async ({
        page,
        nasaApi,
    }) => {
        await page.goto('/');
        await expect(resultItems(page)).toHaveCount(20);

        const searchbox = page.getByRole('searchbox');
        await searchbox.clear();
        await searchbox.pressSequentially('Jupiter', { delay: 50 });

        await expect(page.getByText('40 results for “Jupiter”')).toBeVisible();
        await expect(resultItems(page).first()).toContainText(
            'Jupiter result 1'
        );
        await expect(page).toHaveTitle('Jupiter · SpaceXplorer');

        const queries = new Set(nasaApi.requests.map((r) => r.query));
        expect([...queries]).toEqual(['Saturn', 'Jupiter']);
    });

    test('clearing the search shows suggestions without calling the API', async ({
        page,
        nasaApi,
    }) => {
        await page.goto('/');
        await expect(resultItems(page)).toHaveCount(20);
        const requestsBefore = nasaApi.requests.length;

        await page.getByRole('button', { name: 'Clear search' }).click();

        await expect(page.getByRole('searchbox')).toHaveValue('');
        await expect(page.getByText(/Start typing to explore/)).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Hubble' })
        ).toBeVisible();
        await expect(page).toHaveTitle('SpaceXplorer');
        expect(nasaApi.requests).toHaveLength(requestsBefore);
    });

    test('whitespace-only input is treated as empty', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('searchbox').fill('   ');

        await expect(page.getByText(/Start typing to explore/)).toBeVisible();
        await expect(
            page.getByRole('list', { name: 'Search results' })
        ).toBeHidden();
    });

    test('selecting a suggestion runs that search', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Clear search' }).click();

        await page.getByRole('button', { name: 'Apollo 11' }).click();

        await expect(page.getByRole('searchbox')).toHaveValue('Apollo 11');
        await expect(
            page.getByText('40 results for “Apollo 11”')
        ).toBeVisible();
    });

    test('shows an empty state with suggestions when nothing matches', async ({
        page,
        nasaApi,
    }) => {
        nasaApi.respondWith(({ query, page: pageNumber }) =>
            query === 'zzqqxx'
                ? buildEmptyResponse(query)
                : buildSearchPage({ query, page: pageNumber, totalPages: 1 })
        );
        await page.goto('/');

        await page.getByRole('searchbox').fill('zzqqxx');

        await expect(page.getByText('No results for “zzqqxx”')).toBeVisible();
        await page.getByRole('button', { name: 'Mars' }).click();
        await expect(page.getByText('20 results for “Mars”')).toBeVisible();
    });

    test('never labels the previous empty result with the new query', async ({
        page,
        nasaApi,
    }) => {
        nasaApi.respondWith(({ query, page: pageNumber }) =>
            query === 'Mars'
                ? {
                      body: buildSearchPage({
                          query,
                          page: pageNumber,
                          totalPages: 1,
                      }),
                      delayMs: 1_500,
                  }
                : buildEmptyResponse(query)
        );
        await page.goto('/');
        await expect(page.getByText('No results for “Saturn”')).toBeVisible();

        await page.getByRole('button', { name: 'Mars' }).click();

        await expect(
            page.getByRole('status', { name: 'Loading results' })
        ).toBeVisible();
        await expect(page.getByText('No results for “Mars”')).toBeHidden();
        await expect(page.getByText('20 results for “Mars”')).toBeVisible();
    });

    test('dims previous results while a new search loads', async ({
        page,
        nasaApi,
    }) => {
        await page.goto('/');
        await expect(resultItems(page)).toHaveCount(20);
        nasaApi.respondWith(({ query, page: pageNumber }) => ({
            body: buildSearchPage({ query, page: pageNumber, totalPages: 2 }),
            delayMs: 1_500,
        }));

        await page.getByRole('searchbox').fill('Venus');

        await expect(page.getByText('Searching for “Venus”…')).toBeVisible();
        await expect(
            page.getByRole('list', { name: 'Search results' })
        ).toHaveAttribute('aria-busy', 'true');
        await expect(page.getByText('40 results for “Venus”')).toBeVisible();
    });
});
