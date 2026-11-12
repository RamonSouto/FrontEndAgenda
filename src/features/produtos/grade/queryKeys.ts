// src/features/produtos/grade/queryKeys.ts

export const gradeProdutoKeys = {
    all: ['grade-produto'] as const,
    detail: (id: number) => ['grade-produto', id] as const,
};
