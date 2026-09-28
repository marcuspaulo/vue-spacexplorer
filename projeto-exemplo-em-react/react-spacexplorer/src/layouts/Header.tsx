import { Moon, Rocket, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const label =
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <a
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold tracking-tight"
                >
                    <Rocket className="size-6 text-primary" aria-hidden />
                    <span>
                        Space<span className="text-primary">X</span>plorer
                    </span>
                </a>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={label}
                            onClick={toggleTheme}
                        >
                            {theme === 'dark' ? <Sun /> : <Moon />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                </Tooltip>
            </div>
        </header>
    );
}
