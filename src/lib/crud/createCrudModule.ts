//src/lib/crud/createCrudModule.ts
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { httpClient } from "../http/client";
import { string, z } from "zod";

interface CrudModuleConfig<TEntity, TCreateInput, TUpdateInput> {
    resourceKey: string,
    endpoint: string
    entitySchema: z.ZodType<TEntity>
}

export function createCrudModule<TEntity, TCreateInput, TUpdateInput = Partial<TCreateInput>>(
    config: CrudModuleConfig<TEntity, TCreateInput, TUpdateInput>
) {
    const { resourceKey, endpoint, entitySchema } = config;
    const listSchema = z.array(entitySchema);

    const queryKeys = {
        all: [resourceKey] as const,
        list: (filters?: Record<string, unknown>) => [resourceKey, 'list', filters] as const,
        detail: (id: number | string) => [resourceKey, 'detail', id] as const,
    };

    const api = {
        list: async (filters?: Record<string, unknown>): Promise<TEntity[]> => {
            const query = filters ? `?${new URLSearchParams(filters as Record<string, string>)}` : '';
            const data = await httpClient.get<unknown>(`${endpoint}${query}`);
            return listSchema.parse(data);
        },
        getById: async (id: number | string): Promise<TEntity> => {
            const data = await httpClient.get<unknown>(`${endpoint}/${id}`);
            return entitySchema.parse(data);
        },
        create: (payload: TCreateInput) => httpClient.post<TEntity>(endpoint, payload),
        update: (id: number | string, payload: TUpdateInput) => httpClient.put<TEntity>(`${endpoint}/${id}`, payload),
        remove: (id: number | string) => httpClient.delete<void>(`${endpoint}/${id}`),
    };

    function useList(filters?: Record<string, unknown>, options?: Partial<UseQueryOptions<TEntity[]>>) {
        return useQuery({
            queryKey: queryKeys.list(filters),
            queryFn: () => api.list(filters),
            staleTime: 5 * 60 * 1000,
            ...options
        });
    }

    function useDetail(id: number | string | undefined) {
        return useQuery({
            queryKey: queryKeys.detail(id as string),
            queryFn: () => api.getById(id as string),
            enabled: !!id,
        })
    }

    function useCreate() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: TCreateInput) => api.create(payload),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
        });
    }

    function useUpdate() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, payload }: { id: number | string; payload: TUpdateInput }) => api.update(id, payload),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
        })
    }

    function useRemove() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: number | string) => api.remove(id),
            onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.all })
        });
    }

    return { api, queryKeys, useList, useDetail, useCreate, useUpdate, useRemove };
}