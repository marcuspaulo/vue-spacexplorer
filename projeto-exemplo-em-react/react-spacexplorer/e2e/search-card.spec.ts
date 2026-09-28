import {
    buildItem,
    buildSearchPage,
    FIXTURE_DATE_LABEL,
} from './support/nasa-fixtures';
import { expect, resultCard, test } from './support/test';

test.describe('Search card', () => {
    test.beforeEach(async ({ page, nasaApi }) => {
        nasaApi.respondWith(({ query }) =>
            buildSearchPage({
                query,
                page: 1,
                totalPages: 1,
                items: [
                    buildItem({
                        nasa_id: 'PIA01973',
                        title: 'Saturn Atmosphere',
                        description: 'Bands of clouds in Saturn’s atmosphere.',
                        keywords: ['Saturn', 'Voyager', 'Atmosphere'],
                    }),
                    buildItem({
                        nasa_id: 'orion-moon',
                        title: 'Orion Sees the Moon',
                        media_type: 'video',
                        center: 'JSC',
                    }),
                    buildItem({
                        nasa_id: 'saturn-sounds',
                        title: 'Sounds of Saturn',
                        media_type: 'audio',
                        previewUrl: null,
                    }),
                ],
            })
        );
        await page.goto('/');
    });

    test('shows the item metadata', async ({ page }) => {
        const card = resultCard(page, 'Saturn Atmosphere');

        await expect(
            card.getByRole('img', { name: 'Saturn Atmosphere' })
        ).toBeVisible();
        await expect(card.getByText('image', { exact: true })).toBeVisible();
        await expect(card.getByText(FIXTURE_DATE_LABEL)).toBeVisible();
        await expect(card.getByText('JPL')).toBeVisible();
        await expect(
            card.getByText('Bands of clouds in Saturn’s atmosphere.')
        ).toBeVisible();
    });

    test('links to the item on the NASA website in a new tab', async ({
        page,
    }) => {
        const link = resultCard(page, 'Saturn Atmosphere').getByRole('link', {
            name: 'View on NASA',
        });

        await expect(link).toHaveAttribute(
            'href',
            'https://images.nasa.gov/details/PIA01973'
        );
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noopener/);
    });

    test('expands to reveal keywords and collapses again', async ({ page }) => {
        const card = resultCard(page, 'Saturn Atmosphere');
        const toggle = card.getByRole('button', { name: 'Show more' });

        await expect(card.getByText('Voyager')).toBeHidden();
        await toggle.click();

        await expect(
            card.getByRole('button', { name: 'Show less' })
        ).toHaveAttribute('aria-expanded', 'true');
        for (const keyword of ['Saturn', 'Voyager', 'Atmosphere']) {
            await expect(
                card.getByText(keyword, { exact: true })
            ).toBeVisible();
        }

        await card.getByRole('button', { name: 'Show less' }).click();
        await expect(card.getByText('Voyager')).toBeHidden();
    });

    test('labels each media type', async ({ page }) => {
        await expect(
            resultCard(page, 'Orion Sees the Moon').getByText('video', {
                exact: true,
            })
        ).toBeVisible();
        await expect(
            resultCard(page, 'Orion Sees the Moon').getByText('JSC')
        ).toBeVisible();
        await expect(
            resultCard(page, 'Sounds of Saturn').getByText('audio', {
                exact: true,
            })
        ).toBeVisible();
    });

    test('shows a placeholder when there is no preview image', async ({
        page,
    }) => {
        const card = resultCard(page, 'Sounds of Saturn');

        await expect(card.getByText('No preview available')).toBeVisible();
        await expect(card.getByRole('img')).toHaveCount(0);
    });
});
