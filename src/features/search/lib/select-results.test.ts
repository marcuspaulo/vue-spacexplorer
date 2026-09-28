import { describe, expect, it } from 'vitest';
import type { InfiniteData } from '@tanstack/vue-query';
import type { NasaSearchResponse } from '@/features/search/types/nasa-api';
import {
    buildItem,
    buildSearchPage,
    FIXTURE_DATE,
} from '../../../../e2e/support/nasa-fixtures';
import { selectResults, toResultItem } from './select-results';

function infinite(
    ...pages: NasaSearchResponse[]
): InfiniteData<NasaSearchResponse, number> {
    return { pages, pageParams: pages.map((_, i) => i + 1) };
}

describe('toResultItem', () => {
    it('flattens the first data entry and the image preview', () => {
        const item = buildItem({
            nasa_id: 'PIA01973',
            title: 'Saturn Atmosphere',
            keywords: ['Saturn'],
        });

        expect(toResultItem(item)).toEqual({
            id: 'PIA01973',
            title: 'Saturn Atmosphere',
            description: 'Description for PIA01973',
            mediaType: 'image',
            dateCreated: FIXTURE_DATE,
            center: 'JPL',
            keywords: ['Saturn'],
            previewUrl:
                'https://images-assets.nasa.gov/image/PIA01973/PIA01973~thumb.jpg',
        });
    });

    it('has no preview when the item has no links (audio)', () => {
        const item = buildItem({
            nasa_id: 'sounds',
            media_type: 'audio',
            previewUrl: null,
        });

        expect(toResultItem(item)?.previewUrl).toBeUndefined();
    });

    it('ignores previews that are not rendered as images', () => {
        const item = buildItem({ nasa_id: 'caption' });
        item.links = [{ href: 'https://x/captions.srt', rel: 'captions' }];

        expect(toResultItem(item)?.previewUrl).toBeUndefined();
    });

    it('defaults missing keywords to an empty list', () => {
        const item = buildItem({ nasa_id: 'no-keywords', keywords: undefined });

        expect(toResultItem(item)?.keywords).toEqual([]);
    });

    it('drops items without data', () => {
        const item = buildItem({ nasa_id: 'empty' });
        item.data = [];

        expect(toResultItem(item)).toBeNull();
    });
});

describe('selectResults', () => {
    it('concatenates pages and reads total hits from the first page', () => {
        const result = selectResults(
            infinite(
                buildSearchPage({ query: 'Mars', page: 1, totalPages: 2 }),
                buildSearchPage({ query: 'Mars', page: 2, totalPages: 2 })
            )
        );

        expect(result.items).toHaveLength(40);
        expect(result.items[20]?.title).toBe('Mars result 21');
        expect(result.totalHits).toBe(40);
    });

    it('removes items repeated across pages', () => {
        const first = buildSearchPage({
            query: 'Mars',
            page: 1,
            totalPages: 2,
        });
        const second = buildSearchPage({
            query: 'Mars',
            page: 2,
            totalPages: 2,
        });
        second.collection.items[0] = first.collection.items[19]!;

        const result = selectResults(infinite(first, second));

        expect(result.items).toHaveLength(39);
        expect(new Set(result.items.map((i) => i.id)).size).toBe(39);
    });

    it('handles no pages', () => {
        expect(selectResults(infinite())).toEqual({ items: [], totalHits: 0 });
    });
});
