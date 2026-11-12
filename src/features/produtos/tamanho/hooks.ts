// src/features/produtos/tamanho/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tamanhos } from './api';
import { tamanhoKeys } from './queryKeys';
import {
    TamanhoListResponse,
    TamanhoResponse,
    TamanhoCreateResponse,
    TamanhoUpdateResponse,
    TamanhoDeleteResponse,
} from './types';
import { TamanhoInput, TamanhoUpdateInput } from './schema';

export const useTamanhos = () => {
    return useQuery<TamanhoListResponse>({
        queryKey: tamanhoKeys.all,
        queryFn: Tamanhos.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTamanho = (id: number) => {
    return useQuery<TamanhoResponse>({
        queryKey: tamanhoKeys.detail(id),
        queryFn: () => Tamanhos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTamanho = () => {
    const queryClient = useQueryClient();

    return useMutation<TamanhoCreateResponse, unknown, TamanhoInput>({
        mutationFn: (data) => Tamanhos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.all });
        },
    });
};

export const useAtualizarTamanho = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TamanhoUpdateResponse, unknown, TamanhoUpdateInput>({
        mutationFn: (data) => Tamanhos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.all });
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.detail(id) });
        },
    });
};

export const useDeletarTamanho = () => {
    const queryClient = useQueryClient();

    return useMutation<TamanhoDeleteResponse, unknown, number>({
        mutationFn: (id) => Tamanhos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.all });
        },
    });
};
