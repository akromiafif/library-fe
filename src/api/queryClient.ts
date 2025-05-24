// queryClient.ts - TanStack Query configuration
import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: (failureCount: number, error: unknown) => {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;

        // If status is defined and in the 4xx range (but allow 408, 429), don’t retry
        if (status !== undefined && status >= 400 && status < 500) {
          if (status === 408 || status === 429) {
            return failureCount < 2;
          }
          return false;
        }

        // Otherwise (network errors or 5xx), retry up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30_000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1_000,
    },
  },
});
