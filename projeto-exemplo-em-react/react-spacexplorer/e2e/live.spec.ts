import { expect, test } from '@playwright/test';

// Smoke test against the real NASA API. Opt-in: E2E_LIVE=1 npm run test:e2e
test.describe('Live NASA API', () => {
    test.skip(
        !process.env.E2E_LIVE,
        'Set E2E_LIVE=1 to run against the real API'
    );

    test('searches and paginates real results', async ({ page }) => {
        await page.goto('/');
        const items = page
            .getByRole('list', { name: 'Search results' })
            .getByRole('listitem');

        await expect(
            page.getByText(/[\d,]+ results for “Saturn”/)
        ).toBeVisible();
        await expect(items).toHaveCount(20);

        await items.last().scrollIntoViewIfNeeded();
        await expect(items).toHaveCount(40);
    });
});
