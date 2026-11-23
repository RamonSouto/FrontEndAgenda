//src/features/parametrizacao/template/types.ts

export type EventoTemplate =
    | 'agendamento_cadastrado'
    | 'agendamento_concluido'
    | 'agendamento_cancelado';

export const EVENTOS_TEMPLATE: EventoTemplate[] = [
    'agendamento_cadastrado',
    'agendamento_concluido',
    'agendamento_cancelado',
];

export const EVENTOS_TEMPLATE_LABEL: Record<EventoTemplate, string> = {
    agendamento_cadastrado: 'Agendamento cadastrado',
    agendamento_concluido: 'Agendamento concluído',
    agendamento_cancelado: 'Agendamento cancelado',
};
