// src/features/agendamento/tipo-agendamento/types.ts

export interface TipoAgendamento {
    id: number;
    des_tipo_agendamento: string;
    ind_ativo: number; // vem como 0 | 1 do banco (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

// GET /api/agendamentos/tipo
export interface TipoAgendamentoListResponse {
    sucesso: boolean;
    total: number;
    dados: TipoAgendamento[];
}

// GET /api/agendamentos/tipo/{id}
// A API retorna "dados" como array mesmo buscando por 1 registro
export interface TipoAgendamentoResponse {
    sucesso: boolean;
    total: number;
    dados: TipoAgendamento[];
}

// POST /api/agendamentos/tipo
export interface TipoAgendamentoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoAgendamento[];
}

// PUT /api/agendamentos/tipo/{id}
export interface TipoAgendamentoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoAgendamento[];
}

// DELETE /api/agendamentos/tipo/{id}
export interface TipoAgendamentoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
