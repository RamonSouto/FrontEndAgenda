// src/features/produtos/tipo-servico/queryKeys.ts

export const tipoServicoKeys = {
    all: ['tipoServico'] as const,
    detail: (id: number) => ['tipoServico', id] as const,
};
