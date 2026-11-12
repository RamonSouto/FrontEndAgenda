// src/features/produtos/preco-produto-servico/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PrecoProdutoServicos } from './api';
import { precoProdutoServicoKeys } from './queryKeys';
import {
    PrecoProdutoServicoListResponse,
    PrecoProdutoServicoResponse,
    PrecoProdutoServicoCreateResponse,
    PrecoProdutoServicoDeleteResponse,
} from './types';
import { PrecoProdutoServicoInput, PrecoProdutoServicoUpdateInput } from './schema';

export const usePrecoProdutoServicos = () => {
    return useQuery<PrecoProdutoServicoListResponse>({
        queryKey: precoProdutoServicoKeys.all,
        queryFn: PrecoProdutoServicos.listar,
    });
};

export const usePrecoProdutoServico = (id: number) => {
    return useQuery<PrecoProdutoServicoResponse>({
        queryKey: precoProdutoServicoKeys.detail(id),
        queryFn: () => PrecoProdutoServicos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarPrecoProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<PrecoProdutoServicoCreateResponse, unknown, PrecoProdutoServicoInput>({
        mutationFn: (data) => PrecoProdutoServicos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.all });
        },
    });
};

export const useAtualizarPrecoProdutoServico = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<PrecoProdutoServicoResponse, unknown, PrecoProdutoServicoUpdateInput>({
        mutationFn: (data) => PrecoProdutoServicos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.all });
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.detail(id) });
        },
    });
};

export const useDeletarPrecoProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<PrecoProdutoServicoDeleteResponse, unknown, number>({
        mutationFn: (id) => PrecoProdutoServicos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.all });
        },
    });
};
