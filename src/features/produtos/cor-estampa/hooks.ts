//src/features/produtos/cor-estampa/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CorEstampa } from './api';
import { corEstampaKeys } from './queryKeys';
import {
    CorEstampaListResponse,
    CorEstampaResponse,
    CorEstampaCreateResponse,
    CorEstampaDeleteResponse,
} from './types';
import { CorEstampaInput, CorEstampaUpdateInput } from './schema';

export const useCorEstampas = () => {
    return useQuery<CorEstampaListResponse>({
        queryKey: corEstampaKeys.all,
        queryFn: CorEstampa.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useCorEstampaDetalhe = (id: number) => {
    return useQuery<CorEstampaResponse>({
        queryKey: corEstampaKeys.detail(id),
        queryFn: () => CorEstampa.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarCorEstampa = () => {
    const queryClient = useQueryClient();

    return useMutation<CorEstampaCreateResponse, unknown, CorEstampaInput>({
        mutationFn: (data) => CorEstampa.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.all });
        },
    });
};

export const useAtualizarCorEstampa = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<CorEstampaResponse, unknown, CorEstampaUpdateInput>({
        mutationFn: (data) => CorEstampa.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.all });
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.detail(id) });
        },
    });
};

export const useDeletarCorEstampa = () => {
    const queryClient = useQueryClient();

    return useMutation<CorEstampaDeleteResponse, unknown, number>({
        mutationFn: (id) => CorEstampa.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.all });
        },
    });
};
