// src/features/produtos/grade/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GradeProduto } from './api';
import { gradeProdutoKeys } from './queryKeys';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const useGradesProduto = () => {
    return useQuery<GradeProdutoListResponse>({
        queryKey: gradeProdutoKeys.all,
        queryFn: GradeProduto.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGradeProduto = (id: number) => {
    return useQuery<GradeProdutoResponse>({
        queryKey: gradeProdutoKeys.detail(id),
        queryFn: () => GradeProduto.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoCreateResponse, unknown, GradeProdutoInput>({
        mutationFn: (data) => GradeProduto.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
    });
};

export const useAtualizarGradeProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoUpdateResponse, unknown, GradeProdutoUpdateInput>({
        mutationFn: (data) => GradeProduto.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.detail(id) });
        },
    });
};

export const useDeletarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => GradeProduto.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
        onError: (error) => {
            console.error('Erro ao deletar grade: ', error)
        }
    });
};
