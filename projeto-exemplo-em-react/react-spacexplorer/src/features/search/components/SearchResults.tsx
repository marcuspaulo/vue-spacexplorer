import { AlertCircle, Loader2, SearchX, Telescope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { SearchCard } from '@/features/search/components/SearchCard';
import { SearchCardSkeleton } from '@/features/search/components/SearchCardSkeleton';
import { useSearchInfinite } from '@/features/search/hooks/useSearchInfinite';

const SUGGESTIONS = [
    'Earth',
    'Mars',
    'Saturn',
    'Nebula',
    'Apollo 11',
    'Hubble',
];
const SKELETON_COUNT = 6;

const numberFormat = new Intl.NumberFormat();

interface SearchResultsProps {
    query: string;
    onSuggestionSelect: (suggestion: string) => void;
}

export function SearchResults({
    query,
    onSuggestionSelect,
}: SearchResultsProps) {
    const {
        data,
        error,
        isLoading,
        isError,
        isPlaceholderData,
        hasNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        fetchNextPage,
        refetch,
    } = useSearchInfinite(query);

    const sentinelRef = useIntersectionObserver({
        onIntersect: () => void fetchNextPage(),
        enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
        rootMargin: '600px',
    });

    const suggestions = (
        <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((suggestion) => (
                <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => onSuggestionSelect(suggestion)}
                >
                    {suggestion}
                </Button>
            ))}
        </div>
    );

    if (!query.trim()) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground">
                <Telescope className="size-12" />
                <p>
                    Start typing to explore NASA&apos;s image and video library.
                </p>
                {suggestions}
            </div>
        );
    }

    // Previous results are kept while a new query loads (no blink), but an
    // empty previous result would read as "no results" for the new query.
    if (isLoading || (isPlaceholderData && data?.items.length === 0)) {
        return (
            <div
                role="status"
                aria-label="Loading results"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <SearchCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError && !data) {
        return (
            <Alert variant="destructive" className="mx-auto max-w-xl">
                <AlertCircle />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription className="gap-3">
                    <p>
                        We couldn&apos;t reach the NASA library: {error.message}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void refetch()}
                    >
                        Try again
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (!data) return null;

    if (data.items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
                <Alert className="max-w-xl text-left">
                    <SearchX />
                    <AlertTitle>No results for “{query}”</AlertTitle>
                    <AlertDescription>
                        Try one of these searches instead:
                    </AlertDescription>
                </Alert>
                {suggestions}
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <p className="text-sm text-muted-foreground" aria-live="polite">
                {isPlaceholderData ? (
                    <>Searching for “{query}”…</>
                ) : (
                    <>
                        <span className="font-semibold text-foreground">
                            {numberFormat.format(data.totalHits)}
                        </span>{' '}
                        results for “{query}”
                    </>
                )}
            </p>

            <ul
                aria-label="Search results"
                aria-busy={isPlaceholderData}
                className={cn(
                    'grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3',
                    isPlaceholderData && 'opacity-50'
                )}
            >
                {data.items.map((item) => (
                    <li key={item.id} className="flex">
                        <SearchCard item={item} className="w-full" />
                    </li>
                ))}
            </ul>

            <div ref={sentinelRef} aria-hidden className="h-px" />

            {isFetchingNextPage && (
                <div
                    role="status"
                    className="flex items-center justify-center gap-3 py-8 text-muted-foreground"
                >
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <span className="text-sm">Loading more…</span>
                </div>
            )}

            {isFetchNextPageError && (
                <div className="flex flex-col items-center gap-3 py-8 text-sm">
                    <p className="text-destructive">
                        Couldn&apos;t load more results.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void fetchNextPage()}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {!hasNextPage && !isPlaceholderData && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    You&apos;ve reached the edge of the known universe. 🚀
                </p>
            )}
        </section>
    );
}
