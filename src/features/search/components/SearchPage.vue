<script setup lang="ts">
import { computed, ref } from 'vue';
import { refDebounced, useTitle } from '@vueuse/core';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
import SearchErrorFallback from '@/features/search/components/SearchErrorFallback.vue';
import SearchInput from '@/features/search/components/SearchInput.vue';
import SearchResults from '@/features/search/components/SearchResults.vue';

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'SpaceXplorer';
const DEFAULT_QUERY = 'Saturn';
const DEBOUNCE_MS = 400;

const input = ref(DEFAULT_QUERY);
const trimmedInput = computed(() => input.value.trim());
const query = refDebounced(trimmedInput, DEBOUNCE_MS);
const isDebouncing = computed(() => trimmedInput.value !== query.value);

useTitle(() => (query.value ? `${query.value} · ${APP_TITLE}` : APP_TITLE));

function selectSuggestion(suggestion: string) {
    input.value = suggestion;
}
</script>

<template>
    <section
        class="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-6 pt-8 text-center sm:pt-16"
    >
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Explore the
            <span
                class="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                >cosmos</span
            >
        </h1>
        <p class="text-lg text-muted-foreground">
            Search decades of images and videos from NASA's missions.
        </p>
        <SearchInput v-model="input" :is-searching="isDebouncing" />
    </section>

    <!-- A new query clears a render error, so the user can recover by searching again. -->
    <ErrorBoundary :reset-key="query">
        <SearchResults :query="query" @select="selectSuggestion" />
        <template #fallback="{ reset }">
            <SearchErrorFallback @retry="reset" />
        </template>
    </ErrorBoundary>
</template>
