// src/features/agendamentos/fotos-ajustes/types.ts

export type FotoTipo = 'antes' | 'depois';

export interface AgendamentoItemFoto {
    id: number;
    id_produto_agendamento: number; // = id do item do agendamento
    des_caminho_arquivo: string;
    nom_original: string;
    num_tamanho_bytes: number;
    ind_tipo_foto: FotoTipo | null;
    created_at: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    url_arquivo: string; // ex.: "/api/agendamentos/fotos/1/arquivo" (exige token)
}

export interface AgendamentoItemFotoListResponse {
    sucesso: boolean;
    total: number;
    dados: AgendamentoItemFoto[];
}

export interface AgendamentoItemFotoResponse {
    sucesso: boolean;
    dados: AgendamentoItemFoto;
}

// O upload devolve apenas os ids criados
export interface AgendamentoItemFotoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: {
        ids: number[];
        total: number;
    };
}

export interface AgendamentoItemFotoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
