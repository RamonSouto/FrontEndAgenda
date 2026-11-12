//src/features/produtos/produto/queryKeys.ts

export const produtoKeys = {
    all: ['produtos'] as const,
    detail: (id: number) => ['produtos', id] as const,
};
