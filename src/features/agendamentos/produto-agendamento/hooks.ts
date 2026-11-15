// src/features/agendamentos/produto-agendamento/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgendamentoItens } from './api';
import { agendamentoItemKeys } from './queryKeys';
import { agendamentoKeys } from '../agendamento/queryKeys';
import {
    AgendamentoItemListResponse,
    AgendamentoItemResponse,
    AgendamentoItemCreateResponse,
    AgendamentoItemUpdateResponse,
    AgendamentoItemDeleteResponse,
} from './types';
import { AgendamentoItemInput, AgendamentoItemUpdateInput } from './schema';

export const useItensAgendamento = (idAgendamento: number) => {
    return useQuery<AgendamentoItemListResponse>({
        queryKey: agendamentoItemKeys.lista(idAgendamento),
        queryFn: () => AgendamentoItens.listar(idAgendamento),
        enabled: !!idAgendamento,
    });
};

export const useItemAgendamento = (idAgendamento: number, id: number) => {
    return useQuery<AgendamentoItemResponse>({
        queryKey: agendamentoItemKeys.detail(idAgendamento, id),
        queryFn: () => AgendamentoItens.buscar(idAgendamento, id),
        staleTime: 1000 * 60 * 5,
        enabled: !!idAgendamento && !!id,
    });
};

// Todo o CRUD de item invalida também o detalhe do agendamento,
// pois GET /agendamentos/{id} devolve a lista "itens" embutida.
function useInvalidarItens(idAgendamento: number) {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: agendamentoItemKeys.lista(idAgendamento) });
        queryClient.invalidateQueries({ queryKey: agendamentoKeys.detail(idAgendamento) });
    };
}

export const useCriarItemAgendamento = (idAgendamento: number) => {
    const invalidar = useInvalidarItens(idAgendamento);

    return useMutation<AgendamentoItemCreateResponse, unknown, AgendamentoItemInput>({
        mutationFn: (data) => AgendamentoItens.criar(idAgendamento, data),
        onSuccess: invalidar,
    });
};

export interface AtualizarItemVars {
    id: number;
    data: AgendamentoItemUpdateInput;
}

export const useAtualizarItemAgendamento = (idAgendamento: number) => {
    const queryClient = useQueryClient();
    const invalidar = useInvalidarItens(idAgendamento);

    return useMutation<AgendamentoItemUpdateResponse, unknown, AtualizarItemVars>({
        mutationFn: ({ id, data }) => AgendamentoItens.atualizar(idAgendamento, id, data),
        onSuccess: (_, { id }) => {
            invalidar();
            queryClient.invalidateQueries({
                queryKey: agendamentoItemKeys.detail(idAgendamento, id),
            });
        },
    });
};

export const useDeletarItemAgendamento = (idAgendamento: number) => {
    const invalidar = useInvalidarItens(idAgendamento);

    return useMutation<AgendamentoItemDeleteResponse, unknown, number>({
        mutationFn: (id) => AgendamentoItens.deletar(idAgendamento, id),
        onSuccess: invalidar,
    });
};
