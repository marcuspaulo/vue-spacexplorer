import { buildSearchPage } from './support/nasa-fixtures';
import { expect, resultItems, test } from './support/test';

const AFTER_RETRIES = { timeout: 15_000 };

test.describe('API errors', () => {
    test('shows an error with a working retry after server errors', async ({
        page,
        nasaApi,
    }) => {
        let failing = true;
        nasaApi.respondWith(({ query, page: pageNumber }) =>
            failing
                ? { status: 503 }
                : buildSearchPage({ query, page: pageNumber, totalPages: 1 })
        );
        await page.goto('/');

        const alert = page
            .getByRole('alert')
            .filter({ hasText: 'Something went wrong' });
        await expect(alert).toBeVisible(AFTER_RETRIES);
        await expect(alert).toContainText('status code 503');
        // Initial attempt + 2 retries.
        expect(
            nasaApi.requests.filter((r) => r.query === 'Saturn')
        ).toHaveLength(3);

        failing = false;
        await alert.getByRole('button', { name: 'Try again' }).click();

        await expect(resultItems(page)).toHaveCount(20);
        await expect(alert).toBeHidden();
    });

    test('does not retry client errors', async ({ page, nasaApi }) => {
        nasaApi.respondWith(() => ({ status: 400 }));
        await page.goto('/');

        await expect(
            page.getByRole('alert').filter({ hasText: 'status code 400' })
        ).toBeVisible();
        expect(
            nasaApi.requests.filter((r) => r.query === 'Saturn')
        ).toHaveLength(1);
    });
});
