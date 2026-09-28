<script setup lang="ts">
import { computed } from 'vue';
import { Moon, Rocket, Sun } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/composables/useTheme';

const { theme, toggleTheme } = useTheme();

const label = computed(() =>
    theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
);
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b bg-background/80 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20"
    >
        <div
            class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
            <a
                href="/"
                class="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
                <Rocket class="size-6 text-primary" aria-hidden="true" />
                <span>Space<span class="text-primary">X</span>plorer</span>
            </a>

            <Tooltip>
                <TooltipTrigger as-child>
                    <Button
                        variant="ghost"
                        size="icon"
                        :aria-label="label"
                        @click="toggleTheme"
                    >
                        <Sun v-if="theme === 'dark'" aria-hidden="true" />
                        <Moon v-else aria-hidden="true" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{{ label }}</TooltipContent>
            </Tooltip>
        </div>
    </header>
</template>
