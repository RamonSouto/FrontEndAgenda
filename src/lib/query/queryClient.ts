//src/lib/query/queryClient.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { ApiError } from '../http/errors'

export function createQueryClient() {
    return new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => {
                if (error instanceof ApiError && !error.isUnauthorized) {
                    // toast.error(error.message);
                }
            }
        }),
        mutationCache: new MutationCache({
            onError: (error) => {
                if (error instanceof ApiError) {
                    // toast.error(error.message)
                }
            }
        }),
    })
}