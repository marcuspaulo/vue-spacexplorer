import { SearchPage } from '@/features/search/components/SearchPage';
import { RootLayout } from '@/layouts/RootLayout';
import { AppProviders } from '@/providers/AppProviders';

export function App() {
    return (
        <AppProviders>
            <RootLayout>
                <SearchPage />
            </RootLayout>
        </AppProviders>
    );
}
