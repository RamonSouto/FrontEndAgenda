// src/features/produtos/tipo-servico/types.ts

export interface TipoServico {
    id: number;
    des_tipo_ajuste: string;
    ind_ativo: number; // 0 ou 1, como retornado pelo MySQL (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface TipoServicoListResponse {
    sucesso: boolean;
    total?: number;
    dados: TipoServico[];
}

export interface TipoServicoResponse {
    sucesso: boolean;
    dados: TipoServico;
}

export interface TipoServicoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoServico;
}

export interface TipoServicoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
