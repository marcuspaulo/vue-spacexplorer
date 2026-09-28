import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchErrorFallback } from '@/features/search/components/SearchErrorFallback';
import { SearchInput } from '@/features/search/components/SearchInput';
import { SearchResults } from '@/features/search/components/SearchResults';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'SpaceXplorer';
const DEFAULT_QUERY = 'Saturn';
const DEBOUNCE_MS = 400;

export function SearchPage() {
    const [input, setInput] = useState(DEFAULT_QUERY);
    const query = useDebouncedValue(input.trim(), DEBOUNCE_MS);
    const isDebouncing = input.trim() !== query;

    return (
        <>
            <title>{query ? `${query} · ${APP_TITLE}` : APP_TITLE}</title>

            <section className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-6 pt-8 text-center sm:pt-16">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                    Explore the{' '}
                    <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        cosmos
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Search decades of images and videos from NASA&apos;s
                    missions.
                </p>
                <SearchInput
                    value={input}
                    onChange={setInput}
                    isSearching={isDebouncing}
                />
            </section>

            {/* A new query clears a render error, so the user can recover by searching again. */}
            <ErrorBoundary
                FallbackComponent={SearchErrorFallback}
                resetKeys={[query]}
            >
                <SearchResults query={query} onSuggestionSelect={setInput} />
            </ErrorBoundary>
        </>
    );
}
