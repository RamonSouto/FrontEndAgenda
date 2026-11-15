// src/features/agendamentos/fotos-ajustes/queryKeys.ts

const base = ['agendamento-item-fotos'] as const;

export const agendamentoItemFotoKeys = {
    all: base,
    lista: (idAgendamento: number, idItem: number) =>
        [...base, 'lista', idAgendamento, idItem] as const,
    detail: (id: number) => [...base, 'detail', id] as const,
    arquivo: (id: number) => [...base, 'arquivo', id] as const,
};
