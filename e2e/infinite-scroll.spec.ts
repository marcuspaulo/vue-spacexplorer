import { buildSearchPage } from './support/nasa-fixtures';
import { expect, resultItems, test } from './support/test';

// Covers the default retry policy (2 retries with backoff ≈ 3s) before an error shows.
const AFTER_RETRIES = { timeout: 15_000 };

test.describe('Infinite scroll', () => {
    test('loads the next page when scrolling to the end', async ({
        page,
        nasaApi,
    }) => {
        nasaApi.respondWith(({ query, page: pageNumber }) =>
            buildSearchPage({ query, page: pageNumber, totalPages: 3 })
        );
        await page.goto('/');
        await expect(resultItems(page)).toHaveCount(20);
        expect(nasaApi.requests.some((r) => r.page === 2)).toBe(false);

        await resultItems(page).last().scrollIntoViewIfNeeded();
        await expect(resultItems(page)).toHaveCount(40);
        await expect(resultItems(page).nth(20)).toContainText(
            'Saturn result 21'
        );

        await resultItems(page).last().scrollIntoViewIfNeeded();
        await expect(resultItems(page)).toHaveCount(60);
        await expect(
            page.getByText(/reached the edge of the known universe/)
        ).toBeVisible();
    });

    test('stops requesting once there is no next page', async ({
        page,
        nasaApi,
    }) => {
        await page.goto('/');
        await resultItems(page).last().scrollIntoViewIfNeeded();
        await expect(resultItems(page)).toHaveCount(40);
        await expect(
            page.getByText(/reached the edge of the known universe/)
        ).toBeVisible();

        await page.mouse.wheel(0, 10_000);
        // Proving a request does NOT happen needs a fixed wait.
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(500);

        expect(nasaApi.requests.some((r) => r.page === 3)).toBe(false);
    });

    test('does not show duplicate items repeated across pages', async ({
        page,
        nasaApi,
    }) => {
        nasaApi.respondWith(({ query, page: pageNumber }) => {
            const response = buildSearchPage({
                query,
                page: pageNumber,
                totalPages: 2,
            });
            if (pageNumber === 2) {
                // The API sometimes repeats the last item of the previous page.
                const [firstPageLast] = buildSearchPage({
                    query,
                    page: 1,
                    totalPages: 2,
                }).collection.items.slice(-1);
                response.collection.items[0] = firstPageLast!;
            }
            return response;
        });
        await page.goto('/');

        await resultItems(page).last().scrollIntoViewIfNeeded();

        await expect(resultItems(page)).toHaveCount(39);
    });

    test('shows skeleton cards while the next page loads', async ({
        page,
        nasaApi,
    }) => {
        nasaApi.respondWith(({ query, page: pageNumber }) => {
            const body = buildSearchPage({
                query,
                page: pageNumber,
                totalPages: 2,
            });
            return pageNumber === 2 ? { body, delayMs: 1_500 } : body;
        });
        await page.goto('/');
        await expect(resultItems(page)).toHaveCount(20);

        await resultItems(page).last().scrollIntoViewIfNeeded();

        const loadingMore = page.getByRole('status', {
            name: 'Loading more results',
        });
        await expect(loadingMore).toBeVisible();
        // Placeholders are not results.
        await expect(resultItems(page)).toHaveCount(20);

        await expect(resultItems(page)).toHaveCount(40);
        await expect(loadingMore).toBeHidden();
    });

    test('offers a retry when loading more fails', async ({
        page,
        nasaApi,
    }) => {
        let failNextPage = true;
        nasaApi.respondWith(({ query, page: pageNumber }) =>
            pageNumber === 2 && failNextPage
                ? { status: 503 }
                : buildSearchPage({ query, page: pageNumber, totalPages: 2 })
        );
        await page.goto('/');

        await resultItems(page).last().scrollIntoViewIfNeeded();
        await expect(page.getByText("Couldn't load more results.")).toBeVisible(
            AFTER_RETRIES
        );
        await expect(resultItems(page)).toHaveCount(20);

        failNextPage = false;
        await page.getByRole('button', { name: 'Retry' }).click();

        await expect(resultItems(page)).toHaveCount(40);
        await expect(
            page.getByText("Couldn't load more results.")
        ).toBeHidden();
    });
});
