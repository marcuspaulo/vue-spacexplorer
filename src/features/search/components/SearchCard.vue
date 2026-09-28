<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue';
import { format, isValid, parseISO } from 'date-fns';
import {
    Calendar,
    ExternalLink,
    ImageOff,
    Music,
    PlayCircle,
    Tag,
} from '@lucide/vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { mediaBadgeVariants } from '@/features/search/lib/media-type-variants';
import type { SearchResultItem } from '@/features/search/types/nasa-api';

const { item, class: className } = defineProps<{
    item: SearchResultItem;
    class?: HTMLAttributes['class'];
}>();

const MAX_KEYWORDS = 6;

type ImageStatus = 'loading' | 'loaded' | 'error';

const expanded = ref(false);
const imageStatus = ref<ImageStatus>('loading');

// A preview that fails to load falls back to the "No preview" placeholder.
const showImage = computed(
    () => Boolean(item.previewUrl) && imageStatus.value !== 'error'
);

const date = computed(() => {
    const parsed = parseISO(item.dateCreated);
    return isValid(parsed) ? format(parsed, 'dd MMM yyyy') : null;
});
const detailsUrl = computed(
    () => `https://images.nasa.gov/details/${encodeURIComponent(item.id)}`
);
const keywords = computed(() => item.keywords.slice(0, MAX_KEYWORDS));
</script>

<template>
    <Card
        :class="
            cn(
                'group animate-fade-in-up gap-4 overflow-hidden pt-0 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/20 dark:shadow-black/20',
                className
            )
        "
    >
        <div class="relative aspect-video overflow-hidden bg-muted">
            <template v-if="showImage">
                <Skeleton
                    v-if="imageStatus === 'loading'"
                    aria-hidden="true"
                    class="absolute inset-0 rounded-none bg-accent"
                />
                <img
                    :src="item.previewUrl"
                    :alt="item.title"
                    loading="lazy"
                    decoding="async"
                    :class="
                        cn(
                            'size-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-105',
                            imageStatus === 'loaded'
                                ? 'opacity-100'
                                : 'opacity-0'
                        )
                    "
                    @load="imageStatus = 'loaded'"
                    @error="imageStatus = 'error'"
                />
            </template>
            <div
                v-else
                class="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"
            >
                <Music
                    v-if="item.mediaType === 'audio'"
                    aria-hidden="true"
                    class="size-10"
                />
                <ImageOff v-else aria-hidden="true" class="size-10" />
                <span class="text-xs">No preview available</span>
            </div>
            <PlayCircle
                v-if="item.mediaType === 'video' && imageStatus === 'loaded'"
                aria-hidden="true"
                class="absolute inset-0 m-auto size-14 text-white/90 drop-shadow-lg"
            />
        </div>

        <CardHeader class="gap-2 px-5">
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                    variant="outline"
                    :class="mediaBadgeVariants({ mediaType: item.mediaType })"
                >
                    {{ item.mediaType }}
                </Badge>
                <span v-if="date" class="flex items-center gap-1">
                    <Calendar aria-hidden="true" class="size-3" />
                    <time :datetime="item.dateCreated">{{ date }}</time>
                </span>
                <span v-if="item.center" class="ml-auto">{{
                    item.center
                }}</span>
            </div>
            <h2 class="line-clamp-2 text-lg leading-snug font-semibold">
                {{ item.title }}
            </h2>
        </CardHeader>

        <CardContent v-if="item.description" class="px-5">
            <p
                :class="
                    cn(
                        'text-sm break-words whitespace-pre-line text-muted-foreground',
                        !expanded && 'line-clamp-3'
                    )
                "
            >
                {{ item.description }}
            </p>
        </CardContent>

        <CardContent
            v-if="expanded && keywords.length > 0"
            class="flex flex-wrap items-center gap-1.5 px-5"
        >
            <Tag aria-hidden="true" class="size-3 text-muted-foreground" />
            <Badge
                v-for="keyword in keywords"
                :key="keyword"
                variant="secondary"
            >
                {{ keyword }}
            </Badge>
        </CardContent>

        <CardFooter class="mt-auto justify-between px-5">
            <Button
                variant="ghost"
                size="sm"
                class="-ml-3"
                :aria-expanded="expanded"
                @click="expanded = !expanded"
            >
                {{ expanded ? 'Show less' : 'Show more' }}
            </Button>
            <Button variant="link" size="sm" class="-mr-3" as-child>
                <a :href="detailsUrl" target="_blank" rel="noopener noreferrer">
                    View on NASA
                    <ExternalLink aria-hidden="true" />
                </a>
            </Button>
        </CardFooter>
    </Card>
</template>
