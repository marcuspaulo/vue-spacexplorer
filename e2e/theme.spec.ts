import { expect, test } from './support/test';

test.describe('Theme', () => {
    test('defaults to dark mode', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('html')).toHaveClass(/\bdark\b/);
        await expect(
            page.getByRole('button', { name: 'Switch to light mode' })
        ).toBeVisible();
    });

    test('toggles between themes and remembers the choice', async ({
        page,
    }) => {
        await page.goto('/');

        await page
            .getByRole('button', { name: 'Switch to light mode' })
            .click();
        await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

        await page.reload();
        await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

        await page.getByRole('button', { name: 'Switch to dark mode' }).click();
        await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    });

    test('applies the saved theme before Vue mounts (no flash)', async ({
        page,
    }) => {
        await page.addInitScript(() => localStorage.setItem('theme', 'light'));
        // Block the app bundle: only index.html's inline script can set the class.
        await page.route('**/*.js', (route) => route.abort());

        await page.goto('/');

        await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    });
});
