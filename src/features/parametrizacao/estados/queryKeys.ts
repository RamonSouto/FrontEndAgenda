//src/features/parametrizacao/estados/queryKeys.ts

export const estadoKeys = {
    all: ['estados'] as const,
    detail: (id: number) => ['estado', id] as const,
};