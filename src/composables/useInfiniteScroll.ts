import { toValue, watch, type MaybeRefOrGetter } from 'vue';
import { useIntersectionObserver, type MaybeElementRef } from '@vueuse/core';

interface UseInfiniteScrollOptions {
    onLoadMore: () => void;
    enabled: MaybeRefOrGetter<boolean>;
    rootMargin?: string;
}

/**
 * Calls `onLoadMore` when the sentinel enters the viewport while enabled.
 *
 * The observer is recreated each time `enabled` turns back on, so its first
 * report reflects the updated layout: a sentinel still visible after a page
 * loads triggers the next one, while one pushed away by new items does not.
 * (Reusing a cached "is visible" flag would be stale at that moment.)
 */
export function useInfiniteScroll(
    sentinel: MaybeElementRef,
    { onLoadMore, enabled, rootMargin = '0px' }: UseInfiniteScrollOptions
) {
    const { pause, resume } = useIntersectionObserver(
        sentinel,
        ([entry]) => {
            if (entry?.isIntersecting) onLoadMore();
        },
        { rootMargin, immediate: false }
    );

    watch(
        () => toValue(enabled),
        (isEnabled) => (isEnabled ? resume() : pause()),
        { immediate: true }
    );
}
