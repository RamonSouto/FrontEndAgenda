// src/features/produtos/tamanho/queryKeys.ts

export const tamanhoKeys = {
    all: ['tamanhos'] as const,
    detail: (id: number) => ['tamanhos', id] as const,
};
