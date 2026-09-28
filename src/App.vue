<script setup lang="ts">
// Resolves to an empty stub in production builds.
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { TooltipProvider } from '@/components/ui/tooltip';
import SearchPage from '@/features/search/components/SearchPage.vue';
import RootLayout from '@/layouts/RootLayout.vue';
</script>

<template>
    <TooltipProvider>
        <RootLayout>
            <SearchPage />
        </RootLayout>
    </TooltipProvider>
    <VueQueryDevtools button-position="bottom-left" />
</template>
