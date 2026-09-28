import type { ReactNode } from 'react';
import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';

interface RootLayoutProps {
    children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-dvh flex-col stars-bg">
            <Header />
            <main className="container mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
