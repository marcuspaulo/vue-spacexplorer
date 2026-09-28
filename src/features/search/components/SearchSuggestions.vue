<script setup lang="ts">
import { Button } from '@/components/ui/button';

const emit = defineEmits<{ select: [suggestion: string] }>();

const SUGGESTIONS = [
    'Earth',
    'Mars',
    'Saturn',
    'Nebula',
    'Apollo 11',
    'Hubble',
];
</script>

<template>
    <div class="flex flex-wrap justify-center gap-2">
        <Button
            v-for="suggestion in SUGGESTIONS"
            :key="suggestion"
            variant="outline"
            size="sm"
            class="rounded-full"
            @click="emit('select', suggestion)"
        >
            {{ suggestion }}
        </Button>
    </div>
</template>
