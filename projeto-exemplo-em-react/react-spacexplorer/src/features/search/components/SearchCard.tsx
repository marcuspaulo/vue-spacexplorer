import { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import {
    Calendar,
    ExternalLink,
    ImageOff,
    Music,
    PlayCircle,
    Tag,
} from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SearchResultItem } from '@/features/search/types/nasa-api';

const mediaBadgeVariants = cva('capitalize', {
    variants: {
        mediaType: {
            image: 'border-cyan-500/50 text-cyan-600 dark:text-cyan-400',
            video: 'border-violet-500/50 text-violet-600 dark:text-violet-400',
            audio: 'border-amber-500/50 text-amber-600 dark:text-amber-400',
        },
    },
});

const MAX_KEYWORDS = 6;

function formatDate(value: string) {
    const date = parseISO(value);
    return isValid(date) ? format(date, 'dd MMM yyyy') : null;
}

interface SearchCardProps {
    item: SearchResultItem;
    className?: string;
}

export function SearchCard({ item, className }: SearchCardProps) {
    const [expanded, setExpanded] = useState(false);
    const date = formatDate(item.dateCreated);
    const detailsUrl = `https://images.nasa.gov/details/${encodeURIComponent(item.id)}`;

    return (
        <Card
            className={cn(
                'group animate-fade-in-up gap-4 overflow-hidden pt-0 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/20 dark:shadow-black/20',
                className
            )}
        >
            <div className="relative aspect-video overflow-hidden bg-muted">
                {item.previewUrl ? (
                    <img
                        src={item.previewUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        {item.mediaType === 'audio' ? (
                            <Music className="size-10" />
                        ) : (
                            <ImageOff className="size-10" />
                        )}
                        <span className="text-xs">No preview available</span>
                    </div>
                )}
                {item.mediaType === 'video' && item.previewUrl && (
                    <PlayCircle
                        aria-hidden
                        className="absolute inset-0 m-auto size-14 text-white/90 drop-shadow-lg"
                    />
                )}
            </div>

            <CardHeader className="gap-2 px-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                        variant="outline"
                        className={mediaBadgeVariants({
                            mediaType: item.mediaType,
                        })}
                    >
                        {item.mediaType}
                    </Badge>
                    {date && (
                        <span className="flex items-center gap-1">
                            <Calendar aria-hidden className="size-3" />
                            <time dateTime={item.dateCreated}>{date}</time>
                        </span>
                    )}
                    {item.center && (
                        <span className="ml-auto">{item.center}</span>
                    )}
                </div>
                <CardTitle>
                    <h2 className="line-clamp-2 text-lg leading-snug">
                        {item.title}
                    </h2>
                </CardTitle>
            </CardHeader>

            {item.description && (
                <CardContent className="px-5">
                    <p
                        className={cn(
                            'text-sm break-words whitespace-pre-line text-muted-foreground',
                            !expanded && 'line-clamp-3'
                        )}
                    >
                        {item.description}
                    </p>
                </CardContent>
            )}

            {expanded && item.keywords.length > 0 && (
                <CardContent className="flex flex-wrap items-center gap-1.5 px-5">
                    <Tag aria-hidden className="size-3 text-muted-foreground" />
                    {item.keywords.slice(0, MAX_KEYWORDS).map((keyword) => (
                        <Badge key={keyword} variant="secondary">
                            {keyword}
                        </Badge>
                    ))}
                </CardContent>
            )}

            <CardFooter className="mt-auto justify-between px-5">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    {expanded ? 'Show less' : 'Show more'}
                </Button>
                <Button variant="link" size="sm" className="-mr-3" asChild>
                    <a
                        href={detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on NASA
                        <ExternalLink />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
