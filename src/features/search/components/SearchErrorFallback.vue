<script setup lang="ts">
import { AlertCircle } from '@lucide/vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const emit = defineEmits<{ retry: [] }>();
</script>

<template>
    <Alert variant="destructive" class="mx-auto max-w-xl">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Something went wrong displaying the results</AlertTitle>
        <AlertDescription class="gap-3">
            <p>Try again, or search for something else.</p>
            <Button variant="outline" size="sm" @click="emit('retry')">
                Try again
            </Button>
        </AlertDescription>
    </Alert>
</template>
