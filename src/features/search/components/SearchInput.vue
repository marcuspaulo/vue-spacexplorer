<script setup lang="ts">
import { useId } from 'vue';
import { Loader2, Search, X } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const { isSearching = false } = defineProps<{ isSearching?: boolean }>();

const model = defineModel<string>({ required: true });

const inputId = useId();
</script>

<template>
    <form role="search" class="relative w-full" @submit.prevent>
        <label :for="inputId" class="sr-only">
            Search the NASA image library
        </label>
        <Search
            aria-hidden="true"
            class="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
            :id="inputId"
            v-model="model"
            type="search"
            autocomplete="off"
            autofocus
            placeholder="Search the universe — Saturn, nebula, Apollo 11…"
            class="h-14 rounded-xl border-2 bg-card pr-12 pl-12 text-lg! backdrop-blur-sm focus-visible:border-primary [&::-webkit-search-cancel-button]:hidden"
        />
        <div class="absolute top-1/2 right-2 -translate-y-1/2">
            <Loader2
                v-if="isSearching"
                aria-label="Searching"
                class="m-2.5 size-5 animate-spin text-primary"
            />
            <Button
                v-else-if="model"
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                @click="model = ''"
            >
                <X aria-hidden="true" />
            </Button>
        </div>
    </form>
</template>
