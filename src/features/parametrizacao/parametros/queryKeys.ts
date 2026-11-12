// src/features/parametrizacao/parametros/queryKeys.ts

export const parametroKeys = {
    all: ['parametros'] as const,
    lists: () => [...parametroKeys.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
        [...parametroKeys.lists(), { filters }] as const,
    details: () => [...parametroKeys.all, 'detail'] as const,
    detail: (id: number) => [...parametroKeys.details(), id] as const,
};