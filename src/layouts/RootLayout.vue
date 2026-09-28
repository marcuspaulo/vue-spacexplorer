<script setup lang="ts">
import AppFooter from '@/layouts/AppFooter.vue';
import AppHeader from '@/layouts/AppHeader.vue';
</script>

<template>
    <div class="flex min-h-dvh flex-col stars-bg">
        <AppHeader />
        <main
            class="container mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
        >
            <slot />
        </main>
        <AppFooter />
    </div>
</template>
