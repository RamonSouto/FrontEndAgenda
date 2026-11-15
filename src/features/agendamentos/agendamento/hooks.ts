// src/features/agendamentos/agendamento/hooks.ts

import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import { Agendamentos } from './api';
import { agendamentoKeys } from './queryKeys';
import {
    AgendamentoListParams,
    AgendamentoListResponse,
    AgendamentoResponse,
    AgendamentoCreateResponse,
    AgendamentoUpdateResponse,
    AgendamentoDeleteResponse,
} from './types';
import { AgendamentoInput, AgendamentoUpdateInput } from './schema';

export const useAgendamentos = (params: AgendamentoListParams = {}) => {
    return useQuery<AgendamentoListResponse>({
        queryKey: agendamentoKeys.list(params),
        queryFn: () => Agendamentos.listar(params),
        placeholderData: keepPreviousData, // evita "piscar" ao trocar filtros
        staleTime: 1000 * 30,
    });
};

export const useAgendamento = (id: number) => {
    return useQuery<AgendamentoResponse>({
        queryKey: agendamentoKeys.detail(id),
        queryFn: () => Agendamentos.buscar(id),
        staleTime: 1000 * 60,
        enabled: !!id,
    });
};

export const useCriarAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoCreateResponse, unknown, AgendamentoInput>({
        mutationFn: (data) => Agendamentos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.lists() });
        },
    });
};

// O id vai nas variáveis (e não no hook) porque o drag-and-drop do Scheduler
// atualiza agendamentos diferentes com a mesma instância do hook.
export interface AtualizarAgendamentoVars {
    id: number;
    data: AgendamentoUpdateInput;
}

export const useAtualizarAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoUpdateResponse, unknown, AtualizarAgendamentoVars>({
        mutationFn: ({ id, data }) => Agendamentos.atualizar(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.detail(id) });
        },
    });
};

export const useDeletarAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoDeleteResponse, unknown, number>({
        mutationFn: (id) => Agendamentos.deletar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.lists() });
            queryClient.removeQueries({ queryKey: agendamentoKeys.detail(id) });
        },
    });
};
