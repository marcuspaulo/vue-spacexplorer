import type { FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function SearchErrorFallback({ resetErrorBoundary }: FallbackProps) {
    return (
        <Alert variant="destructive" className="mx-auto max-w-xl">
            <AlertCircle />
            <AlertTitle>Something went wrong displaying the results</AlertTitle>
            <AlertDescription className="gap-3">
                <p>Try again, or search for something else.</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetErrorBoundary}
                >
                    Try again
                </Button>
            </AlertDescription>
        </Alert>
    );
}
