// src/features/agendamento/tipo-agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    TipoAgendamentoListResponse,
    TipoAgendamentoResponse,
    TipoAgendamentoCreateResponse,
    TipoAgendamentoUpdateResponse,
    TipoAgendamentoDeleteResponse,
} from './types';
import { TipoAgendamentoInput } from './schema';

export const TiposAgendamento = {
    listar: () =>
        httpClient.get<TipoAgendamentoListResponse>('/api/agendamentos/tipo'),

    buscar: (id: number) =>
        httpClient.get<TipoAgendamentoResponse>(`/api/agendamentos/tipo/${id}`),

    criar: (data: TipoAgendamentoInput) =>
        httpClient.post<TipoAgendamentoCreateResponse>('/api/agendamentos/tipo', data),

    atualizar: (id: number, data: TipoAgendamentoInput) =>
        httpClient.put<TipoAgendamentoUpdateResponse>(`/api/agendamentos/tipo/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<TipoAgendamentoDeleteResponse>(`/api/agendamentos/tipo/${id}`),
};
