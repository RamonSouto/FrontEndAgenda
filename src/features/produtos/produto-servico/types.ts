// src/features/produtos/produto-servico/types.ts

export interface ProdutoServico {
    id: number;
    id_produto: number;
    id_tipo_servico: number;
    ind_ativo: number; // 0 ou 1, como retornado pelo MySQL (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface ProdutoServicoListResponse {
    sucesso: boolean;
    total?: number;
    dados: ProdutoServico[];
}

export interface ProdutoServicoResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: ProdutoServico;
}

export interface ProdutoServicoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: ProdutoServico;
}

export interface ProdutoServicoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
