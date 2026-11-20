// src/features/agendamentos/agendamento/types.ts
import { AgendamentoItem } from '../produto-agendamento/types';

export type AgendamentoStatus =
    | 'agendado'
    | 'confirmado'
    | 'concluido'
    | 'cancelado'
    | 'falta';

// Item da LISTAGEM (payload enxuto)
export interface AgendamentoResumo {
    id: number;
    dta_agendamento: string; // ISO UTC, ex.: "2026-11-11T16:00:00.000Z"
    dta_agendamento_to: string; // ISO UTC, fim do atendimento
    ind_status: AgendamentoStatus;
    des_url_externa: string;
    id_paciente: number;
    id_costureira: number;
    nom_paciente: string;
    nom_costureira: string;
    val_cor_costureira: string | null; // hex SEM '#', ex.: "FF6B6B"
}

// Registro completo (POST) – inclui campos de JOIN
export interface Agendamento {
    id: number;
    des_url_externa: string;
    id_paciente: number;
    id_costureira: number;
    id_secretaria: number | null;
    id_medico: number | null;
    dta_agendamento: string;
    des_observacoes_geral: string | null;
    des_observacoes_costureira: string | null;
    ind_status: AgendamentoStatus;
    ind_paciente_compareceu: number | null; // tinyint
    dta_confirmacao: string | null;
    dta_conclusao: string | null;
    dta_cancelamento: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    ind_slot_ativo: number | null; // coluna gerada pelo banco

    // JOINs
    nom_paciente: string;
    num_celular_paciente: string | null;
    nom_medico: string | null;
    nom_costureira: string;
    val_cor_costureira: string | null;
    nom_secretaria: string | null;
}

// GET /{id} e PUT /{id} – inclui os itens
export interface AgendamentoDetalhe extends Agendamento {
    itens: AgendamentoItem[];
}

// Filtros aceitos pela listagem (query string)
export interface AgendamentoListParams {
    pagina?: number;
    limite?: number;
    ind_status?: AgendamentoStatus;
    id_costureira?: number;
}

export interface AgendamentoListResponse {
    sucesso: boolean;
    total: number;
    dados: AgendamentoResumo[];
}

export interface AgendamentoResponse {
    sucesso: boolean;
    dados: AgendamentoDetalhe;
}

export interface AgendamentoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Agendamento;
}

export interface AgendamentoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: AgendamentoDetalhe;
}

export interface AgendamentoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
