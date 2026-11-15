// src/features/agendamentos/produto-agendamento/queryKeys.ts

const base = ['agendamento-itens'] as const;

export const agendamentoItemKeys = {
    all: base,
    lista: (idAgendamento: number) => [...base, 'lista', idAgendamento] as const,
    detail: (idAgendamento: number, id: number) =>
        [...base, 'detail', idAgendamento, id] as const,
};
