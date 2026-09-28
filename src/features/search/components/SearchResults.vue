<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { AlertCircle, SearchX, Telescope } from '@lucide/vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import { cn } from '@/lib/utils';
import SearchCard from '@/features/search/components/SearchCard.vue';
import SearchCardSkeleton from '@/features/search/components/SearchCardSkeleton.vue';
import SearchSuggestions from '@/features/search/components/SearchSuggestions.vue';
import { useSearchInfinite } from '@/features/search/composables/useSearchInfinite';

const { query } = defineProps<{ query: string }>();

const emit = defineEmits<{ select: [suggestion: string] }>();

const SKELETON_COUNT = 6;

const numberFormat = new Intl.NumberFormat();

const {
    data,
    error,
    isLoading,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
} = useSearchInfinite(() => query);

const sentinel = useTemplateRef<HTMLDivElement>('sentinel');

useInfiniteScroll(sentinel, {
    onLoadMore: loadMore,
    enabled: () =>
        hasNextPage.value &&
        !isFetchingNextPage.value &&
        !isFetchNextPageError.value,
    rootMargin: '600px',
});

const isEmptyQuery = computed(() => query.trim().length === 0);

// Previous results are kept while a new query loads (no blink), but an
// empty previous result would read as "no results" for the new query.
const showSkeleton = computed(
    () =>
        isLoading.value ||
        (isPlaceholderData.value && data.value?.items.length === 0)
);

function loadMore() {
    void fetchNextPage();
}

function retry() {
    void refetch();
}

function selectSuggestion(suggestion: string) {
    emit('select', suggestion);
}
</script>

<template>
    <div
        v-if="isEmptyQuery"
        class="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground"
    >
        <Telescope aria-hidden="true" class="size-12" />
        <p>Start typing to explore NASA's image and video library.</p>
        <SearchSuggestions @select="selectSuggestion" />
    </div>

    <div
        v-else-if="showSkeleton"
        role="status"
        aria-label="Loading results"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
        <SearchCardSkeleton v-for="n in SKELETON_COUNT" :key="n" />
    </div>

    <Alert
        v-else-if="isError && !data"
        variant="destructive"
        class="mx-auto max-w-xl"
    >
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription class="gap-3">
            <p>We couldn't reach the NASA library: {{ error?.message }}</p>
            <Button variant="outline" size="sm" @click="retry">
                Try again
            </Button>
        </AlertDescription>
    </Alert>

    <div
        v-else-if="data && data.items.length === 0"
        class="flex flex-col items-center gap-4 py-12 text-center"
    >
        <Alert class="max-w-xl text-left">
            <SearchX aria-hidden="true" />
            <AlertTitle>No results for “{{ query }}”</AlertTitle>
            <AlertDescription
                >Try one of these searches instead:</AlertDescription
            >
        </Alert>
        <SearchSuggestions @select="selectSuggestion" />
    </div>

    <section v-else-if="data" class="space-y-6">
        <p class="text-sm text-muted-foreground" aria-live="polite">
            <template v-if="isPlaceholderData">
                Searching for “{{ query }}”…
            </template>
            <template v-else>
                <span class="font-semibold text-foreground">{{
                    numberFormat.format(data.totalHits)
                }}</span>
                results for “{{ query }}”
            </template>
        </p>

        <ul
            aria-label="Search results"
            :aria-busy="isPlaceholderData"
            :class="
                cn(
                    'grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3',
                    isPlaceholderData && 'opacity-50'
                )
            "
        >
            <li v-for="item in data.items" :key="item.id" class="flex">
                <SearchCard :item="item" class="w-full" />
            </li>
        </ul>

        <div ref="sentinel" aria-hidden="true" class="h-px" />

        <!-- One row of placeholders: 1 card on mobile, 2 on md, 3 on xl.
             Outside the results list so they never count as results. -->
        <div
            v-if="isFetchingNextPage"
            role="status"
            aria-label="Loading more results"
            class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
            <span class="sr-only">Loading more…</span>
            <SearchCardSkeleton />
            <SearchCardSkeleton class="hidden md:flex" />
            <SearchCardSkeleton class="hidden xl:flex" />
        </div>

        <div
            v-if="isFetchNextPageError"
            class="flex flex-col items-center gap-3 py-8 text-sm"
        >
            <p class="text-destructive">Couldn't load more results.</p>
            <Button variant="outline" size="sm" @click="loadMore">Retry</Button>
        </div>

        <p
            v-if="!hasNextPage && !isPlaceholderData"
            class="py-8 text-center text-sm text-muted-foreground"
        >
            You've reached the edge of the known universe. 🚀
        </p>
    </section>
</template>
