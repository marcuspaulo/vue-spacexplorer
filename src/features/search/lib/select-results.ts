import type { InfiniteData } from '@tanstack/vue-query';
import type {
    NasaItem,
    NasaSearchResponse,
    SearchResultItem,
    SearchResults,
} from '@/features/search/types/nasa-api';

export function toResultItem(item: NasaItem): SearchResultItem | null {
    const data = item.data[0];
    if (!data) return null;

    const preview =
        item.links?.find((link) => link.rel === 'preview') ?? item.links?.[0];

    return {
        id: data.nasa_id,
        title: data.title,
        description: data.description,
        mediaType: data.media_type,
        dateCreated: data.date_created,
        center: data.center,
        keywords: data.keywords ?? [],
        previewUrl: preview?.render === 'image' ? preview.href : undefined,
    };
}

export function selectResults(
    data: InfiniteData<NasaSearchResponse, number>
): SearchResults {
    // Deduplicate by nasa_id: the API can repeat items across page boundaries.
    const items = new Map<string, SearchResultItem>();
    for (const page of data.pages) {
        for (const raw of page.collection.items) {
            const item = toResultItem(raw);
            if (item && !items.has(item.id)) items.set(item.id, item);
        }
    }

    return {
        items: [...items.values()],
        totalHits: data.pages[0]?.collection.metadata.total_hits ?? 0,
    };
}
