// src/features/agendamentos/produto-agendamento/types.ts

export type AgendamentoItemStatus = 'pendente' | 'producao' | 'concluido' | 'cancelado';

export interface AgendamentoItem {
    id: number;
    id_agendamento: number;
    id_tipo_agendamento: number;
    id_produto_grade: number;
    id_produto_servico: number;
    des_ajuste_produto: string | null;
    val_preco_servico: string | null;  // decimal chega como string
    val_desconto_servico: string;      // decimal chega como string
    ind_status: AgendamentoItemStatus;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // JOINs
    num_sku: string | null;
    nom_produto: string;
    des_tipo_ajuste: string;
}

export interface AgendamentoItemListResponse {
    sucesso: boolean;
    total: number;
    dados: AgendamentoItem[];
}

export interface AgendamentoItemResponse {
    sucesso: boolean;
    dados: AgendamentoItem;
}

export interface AgendamentoItemCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: AgendamentoItem;
}

export interface AgendamentoItemUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: AgendamentoItem;
}

export interface AgendamentoItemDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
