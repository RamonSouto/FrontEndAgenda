// src/features/parametrizacao/parametros/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Parametros } from './api';
import { parametroKeys } from './queryKeys';
import {
    ParametroListResponse,
    ParametroDetailResponse,
    ParametroPayload,
} from './types';

// ---------------------- LISTAGEM ----------------------
export const useParametros = () => {
    return useQuery({
        queryKey: parametroKeys.lists(),
        queryFn: Parametros.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
        select: (data: ParametroListResponse) => data.dados,
    });
};

// ---------------------- BUSCA POR ID ----------------------
export const useParametro = (id: number) => {
    return useQuery({
        queryKey: parametroKeys.detail(id),
        queryFn: () => Parametros.buscar(id),
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
        select: (data: ParametroDetailResponse) => data.dados,
    });
};

// ---------------------- CRIAÇÃO ----------------------
export const useCreateParametro = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ParametroPayload) => Parametros.criar(data),
        onSuccess: () => {
            // Invalida a listagem para forçar refetch
            queryClient.invalidateQueries({ queryKey: parametroKeys.lists() });
        },
    });
};

// ---------------------- ATUALIZAÇÃO ----------------------
export const useUpdateParametro = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ParametroPayload> }) =>
            Parametros.atualizar(id, data),
        onSuccess: (_, variables) => {
            // Invalida listagem e o detalhe do registro atualizado
            queryClient.invalidateQueries({ queryKey: parametroKeys.lists() });
            queryClient.invalidateQueries({ queryKey: parametroKeys.detail(variables.id) });
        },
    });
};

// ---------------------- DELEÇÃO ----------------------
export const useDeleteParametro = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => Parametros.deletar(id),
        onSuccess: () => {
            // Invalida a listagem
            queryClient.invalidateQueries({ queryKey: parametroKeys.lists() });
        },
    });
};