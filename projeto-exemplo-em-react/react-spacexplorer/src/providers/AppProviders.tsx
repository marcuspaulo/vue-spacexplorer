import type { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider>
            <QueryProvider>
                <TooltipProvider>{children}</TooltipProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
