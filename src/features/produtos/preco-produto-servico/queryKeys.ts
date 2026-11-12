// src/features/produtos/preco-produto-servico/queryKeys.ts

export const precoProdutoServicoKeys = {
    all: ['precoProdutoServico'] as const,
    detail: (id: number) => ['precoProdutoServico', id] as const,
};
