// src/features/produtos/produto-servico/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProdutoServicos } from './api';
import { produtoServicoKeys } from './queryKeys';
import {
    ProdutoServicoListResponse,
    ProdutoServicoResponse,
    ProdutoServicoCreateResponse,
    ProdutoServicoDeleteResponse,
} from './types';
import { ProdutoServicoInput } from './schema';

export const useProdutoServicos = () => {
    return useQuery<ProdutoServicoListResponse>({
        queryKey: produtoServicoKeys.all,
        queryFn: ProdutoServicos.listar,
    });
};

export const useProdutoServico = (id: number) => {
    return useQuery<ProdutoServicoResponse>({
        queryKey: produtoServicoKeys.detail(id),
        queryFn: () => ProdutoServicos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoServicoCreateResponse, unknown, ProdutoServicoInput>({
        mutationFn: (data) => ProdutoServicos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.all });
        },
    });
};

export const useAtualizarProdutoServico = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoServicoResponse, unknown, ProdutoServicoInput>({
        mutationFn: (data) => ProdutoServicos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.all });
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.detail(id) });
        },
    });
};

export const useDeletarProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoServicoDeleteResponse, unknown, number>({
        mutationFn: (id) => ProdutoServicos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.all });
        },
    });
};
