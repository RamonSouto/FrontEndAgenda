//src/features/produtos/produto/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Produtos } from './api';
import { produtoKeys } from './queryKeys';
import {
    ProdutoListResponse,
    ProdutoResponse,
    ProdutoCreateResponse,
    ProdutoDeleteResponse,
} from './types';
import { ProdutoInput } from './schema';

export const useProdutos = () => {
    return useQuery<ProdutoListResponse>({
        queryKey: produtoKeys.all,
        queryFn: Produtos.listar,
    });
};

export const useProduto = (id: number) => {
    return useQuery<ProdutoResponse>({
        queryKey: produtoKeys.detail(id),
        queryFn: () => Produtos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoCreateResponse, unknown, ProdutoInput>({
        mutationFn: (data) => Produtos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoKeys.all });
        },
    });
};

export const useAtualizarProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoResponse, unknown, ProdutoInput>({
        mutationFn: (data) => Produtos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoKeys.all });
            queryClient.invalidateQueries({ queryKey: produtoKeys.detail(id) });
        },
    });
};

export const useDeletarProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => Produtos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoKeys.all });
        },
    });
};
