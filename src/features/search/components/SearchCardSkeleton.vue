<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
</script>

<template>
    <Card aria-hidden="true" class="gap-4 overflow-hidden pt-0">
        <Skeleton class="aspect-video w-full rounded-none bg-accent" />
        <CardHeader class="gap-3 px-5">
            <Skeleton class="h-4 w-1/3 bg-accent" />
            <Skeleton class="h-5 w-3/4 bg-accent" />
        </CardHeader>
        <CardContent class="space-y-2 px-5">
            <Skeleton class="h-3 w-full bg-accent" />
            <Skeleton class="h-3 w-5/6 bg-accent" />
        </CardContent>
    </Card>
</template>
