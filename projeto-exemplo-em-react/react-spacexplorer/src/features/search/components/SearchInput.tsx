import { Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    isSearching?: boolean;
}

export function SearchInput({
    value,
    onChange,
    isSearching = false,
}: SearchInputProps) {
    return (
        <form
            role="search"
            className="relative w-full"
            onSubmit={(e) => e.preventDefault()}
        >
            <label htmlFor="search" className="sr-only">
                Search the NASA image library
            </label>
            <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
                id="search"
                type="search"
                autoComplete="off"
                autoFocus
                placeholder="Search the universe — Saturn, nebula, Apollo 11…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-14 rounded-xl border-2 bg-card pr-12 pl-12 text-lg! backdrop-blur-sm focus-visible:border-primary [&::-webkit-search-cancel-button]:hidden"
            />
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                {isSearching ? (
                    <Loader2
                        aria-label="Searching"
                        className="m-2.5 size-5 animate-spin text-primary"
                    />
                ) : (
                    value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Clear search"
                            onClick={() => onChange('')}
                        >
                            <X />
                        </Button>
                    )
                )}
            </div>
        </form>
    );
}
