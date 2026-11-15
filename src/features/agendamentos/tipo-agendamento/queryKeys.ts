// src/features/agendamento/tipo-agendamento/queryKeys.ts

export const tipoAgendamentoKeys = {
    all: ['tipo-agendamento'] as const,
    detail: (id: number) => ['tipo-agendamento', id] as const,
};
