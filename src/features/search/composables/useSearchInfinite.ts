import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/vue-query';
import { searchNasaImages } from '@/features/search/api/nasa-api';
import { selectResults } from '@/features/search/lib/select-results';

export const searchKeys = {
    all: ['search'] as const,
    query: (q: string) => [...searchKeys.all, q] as const,
};

export function useSearchInfinite(query: MaybeRefOrGetter<string>) {
    const trimmed = computed(() => toValue(query).trim());

    return useInfiniteQuery(() => ({
        queryKey: searchKeys.query(trimmed.value),
        queryFn: ({ queryKey: [, q], pageParam, signal }) =>
            searchNasaImages(q, pageParam, signal),
        initialPageParam: 1,
        // Follow the API's `next` link: it stops paginating (~10k items)
        // well before total_hits, so counting pages would overshoot.
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
            lastPage.collection.links?.some((link) => link.rel === 'next')
                ? lastPageParam + 1
                : undefined,
        select: selectResults,
        enabled: trimmed.value.length > 0,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    }));
}
