import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Client errors (4xx) won't succeed on retry; network/5xx might.
            retry: (failureCount, error) => {
                const status = isAxiosError(error)
                    ? error.response?.status
                    : undefined;
                if (status !== undefined && status >= 400 && status < 500)
                    return false;
                return failureCount < MAX_RETRIES;
            },
            refetchOnWindowFocus: false,
        },
    },
});
