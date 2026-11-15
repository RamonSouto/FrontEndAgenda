// src/features/agendamento/tipo-agendamento/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TiposAgendamento } from './api';
import { tipoAgendamentoKeys } from './queryKeys';
import {
    TipoAgendamentoListResponse,
    TipoAgendamentoResponse,
    TipoAgendamentoCreateResponse,
    TipoAgendamentoUpdateResponse,
    TipoAgendamentoDeleteResponse,
} from './types';
import { TipoAgendamentoInput } from './schema';

export const useTiposAgendamento = () => {
    return useQuery<TipoAgendamentoListResponse>({
        queryKey: tipoAgendamentoKeys.all,
        queryFn: TiposAgendamento.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTipoAgendamento = (id: number) => {
    return useQuery<TipoAgendamentoResponse>({
        queryKey: tipoAgendamentoKeys.detail(id),
        queryFn: () => TiposAgendamento.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTipoAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoCreateResponse, unknown, TipoAgendamentoInput>({
        mutationFn: (data) => TiposAgendamento.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
        },
    });
};

export const useAtualizarTipoAgendamento = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoUpdateResponse, unknown, TipoAgendamentoInput>({
        mutationFn: (data) => TiposAgendamento.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.detail(id) });
        },
    });
};

export const useDeletarTipoAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoDeleteResponse, unknown, number>({
        mutationFn: (id) => TiposAgendamento.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
        },
    });
};
