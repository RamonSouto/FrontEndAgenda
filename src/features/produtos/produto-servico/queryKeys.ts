// src/features/produtos/produto-servico/queryKeys.ts

export const produtoServicoKeys = {
    all: ['produto-servico'] as const,
    detail: (id: number) => ['produto-servico', id] as const,
};
