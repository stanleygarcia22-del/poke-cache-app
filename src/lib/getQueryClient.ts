import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { cache } from 'react';

// cache() de React asegura que la instancia se mantenga en cada request del servidor
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 24 * 60 * 60 * 1000,
          gcTime: 24 * 60 * 60 * 1000,
        },
        dehydrate: {
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        },
      },
    })
);