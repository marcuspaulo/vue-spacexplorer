import { expect, resultItems, test } from './support/test';

test.describe('Layout', () => {
    test('has no horizontal scroll', async ({ page }) => {
        await page.goto('/');
        await expect(resultItems(page)).toHaveCount(20);

        const overflows = await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth
        );
        expect(overflows).toBe(false);
    });

    test('header and footer are present', async ({ page }) => {
        await page.goto('/');

        await expect(
            page.getByRole('banner').getByRole('link', { name: 'SpaceXplorer' })
        ).toBeVisible();
        await expect(
            page
                .getByRole('contentinfo')
                .getByRole('link', { name: 'NASA Images API' })
        ).toHaveAttribute('href', /images\.nasa\.gov\/docs/);
    });
});
