import { Rocket } from 'lucide-react';

const API_DOCS_URL =
    'https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf';

export function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
                <span>
                    Powered by the{' '}
                    <a
                        href={API_DOCS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        NASA Images API
                    </a>
                </span>
                <span aria-hidden className="hidden sm:inline">
                    ·
                </span>
                <span className="flex items-center gap-1.5">
                    Developed by Marcus Melo{' '}
                    <Rocket aria-hidden className="size-4" />
                </span>
            </div>
        </footer>
    );
}
