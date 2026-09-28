import {
    keepPreviousData,
    useInfiniteQuery,
    type InfiniteData,
} from '@tanstack/react-query';
import { searchNasaImages } from '@/features/search/api/nasa-api';
import type {
    NasaItem,
    NasaSearchResponse,
    SearchResultItem,
    SearchResults,
} from '@/features/search/types/nasa-api';

export const searchKeys = {
    all: ['search'] as const,
    query: (q: string) => [...searchKeys.all, q] as const,
};

function toResultItem(item: NasaItem): SearchResultItem | null {
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

function selectResults(
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

export function useSearchInfinite(query: string) {
    const trimmed = query.trim();

    return useInfiniteQuery({
        queryKey: searchKeys.query(trimmed),
        queryFn: ({ pageParam, signal }) =>
            searchNasaImages(trimmed, pageParam, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
            lastPage.collection.links?.some((link) => link.rel === 'next')
                ? lastPageParam + 1
                : undefined,
        select: selectResults,
        enabled: trimmed.length > 0,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
