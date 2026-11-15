// src/features/agendamentos/produto-agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    AgendamentoItemListResponse,
    AgendamentoItemResponse,
    AgendamentoItemCreateResponse,
    AgendamentoItemUpdateResponse,
    AgendamentoItemDeleteResponse,
} from './types';
import { AgendamentoItemInput, AgendamentoItemUpdateInput } from './schema';

export const AgendamentoItens = {
    listar: (idAgendamento: number) =>
        httpClient.get<AgendamentoItemListResponse>(
            `/api/agendamentos/${idAgendamento}/itens`
        ),

    buscar: (idAgendamento: number, id: number) =>
        httpClient.get<AgendamentoItemResponse>(
            `/api/agendamentos/${idAgendamento}/itens/${id}`
        ),

    criar: (idAgendamento: number, data: AgendamentoItemInput) =>
        httpClient.post<AgendamentoItemCreateResponse>(
            `/api/agendamentos/${idAgendamento}/itens`,
            data
        ),

    atualizar: (idAgendamento: number, id: number, data: AgendamentoItemUpdateInput) =>
        httpClient.patch<AgendamentoItemUpdateResponse>(
            `/api/agendamentos/${idAgendamento}/itens/${id}`,
            data
        ),

    deletar: (idAgendamento: number, id: number) =>
        httpClient.delete<AgendamentoItemDeleteResponse>(
            `/api/agendamentos/${idAgendamento}/itens/${id}`
        ),
};
