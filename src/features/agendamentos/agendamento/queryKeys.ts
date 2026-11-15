// src/features/agendamentos/agendamento/queryKeys.ts
import { AgendamentoListParams } from './types';

const base = ['agendamentos'] as const;

export const agendamentoKeys = {
    all: base,
    lists: () => [...base, 'list'] as const,
    list: (params: AgendamentoListParams = {}) => [...base, 'list', params] as const,
    detail: (id: number) => [...base, 'detail', id] as const,
};
