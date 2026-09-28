import type {
    NasaItem,
    NasaItemData,
    NasaSearchResponse,
} from '@/features/search/types/nasa-api';

export const PAGE_SIZE = 20;

export const FIXTURE_DATE = '2020-01-15T12:00:00Z';
export const FIXTURE_DATE_LABEL = '15 Jan 2020';

interface ItemOptions extends Partial<NasaItemData> {
    nasa_id: string;
    /** `null` produces an item without preview links (typical of audio). */
    previewUrl?: string | null;
}

export function buildItem({ previewUrl, ...data }: ItemOptions): NasaItem {
    const preview =
        previewUrl === null
            ? undefined
            : (previewUrl ??
              `https://images-assets.nasa.gov/image/${data.nasa_id}/${data.nasa_id}~thumb.jpg`);

    return {
        href: `https://images-assets.nasa.gov/image/${data.nasa_id}/collection.json`,
        data: [
            {
                center: 'JPL',
                title: `Item ${data.nasa_id}`,
                media_type: 'image',
                date_created: FIXTURE_DATE,
                description: `Description for ${data.nasa_id}`,
                keywords: ['Space', 'Test'],
                ...data,
            },
        ],
        links: preview
            ? [{ href: preview, rel: 'preview', render: 'image' }]
            : undefined,
    };
}

interface SearchPageOptions {
    query: string;
    page: number;
    totalPages: number;
    items?: NasaItem[];
}

/** One page of results; includes a `next` link unless it is the last page. */
export function buildSearchPage({
    query,
    page,
    totalPages,
    items,
}: SearchPageOptions): NasaSearchResponse {
    const slug = query.toLowerCase().replace(/\W+/g, '-');
    const pageItems =
        items ??
        Array.from({ length: PAGE_SIZE }, (_, i) =>
            buildItem({
                nasa_id: `${slug}-p${page}-${i + 1}`,
                title: `${query} result ${(page - 1) * PAGE_SIZE + i + 1}`,
            })
        );

    const nextUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&page=${page + 1}`;

    return {
        collection: {
            version: '1.1',
            href: `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&page=${page}`,
            items: pageItems,
            metadata: { total_hits: totalPages * PAGE_SIZE },
            links:
                page < totalPages
                    ? [{ rel: 'next', prompt: 'Next', href: nextUrl }]
                    : undefined,
        },
    };
}

export function buildEmptyResponse(query: string): NasaSearchResponse {
    return {
        collection: {
            version: '1.1',
            href: `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`,
            items: [],
            metadata: { total_hits: 0 },
        },
    };
}
