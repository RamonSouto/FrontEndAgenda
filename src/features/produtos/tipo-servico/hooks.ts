// src/features/produtos/tipo-servico/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TipoServicos } from './api';
import { tipoServicoKeys } from './queryKeys';
import {
    TipoServicoListResponse,
    TipoServicoResponse,
    TipoServicoCreateResponse,
    TipoServicoDeleteResponse,
} from './types';
import { TipoServicoInput } from './schema';

export const useTiposServico = () => {
    return useQuery<TipoServicoListResponse>({
        queryKey: tipoServicoKeys.all,
        queryFn: TipoServicos.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTipoServico = (id: number) => {
    return useQuery<TipoServicoResponse>({
        queryKey: tipoServicoKeys.detail(id),
        queryFn: () => TipoServicos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTipoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoServicoCreateResponse, unknown, TipoServicoInput>({
        mutationFn: (data) => TipoServicos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.all });
        },
    });
};

export const useAtualizarTipoServico = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TipoServicoResponse, unknown, TipoServicoInput>({
        mutationFn: (data) => TipoServicos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.all });
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.detail(id) });
        },
    });
};

export const useDeletarTipoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoServicoDeleteResponse, unknown, number>({
        mutationFn: (id) => TipoServicos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.all });
        },
    });
};
