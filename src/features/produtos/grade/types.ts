// src/features/produtos/grade/types.ts

export interface GradeProduto {
    id: number;
    id_produto: number;
    id_variacao_cor_estampa: number | null;
    id_tamanho: number;
    num_sku: string | null;
    val_preco_variacao: string | null; // decimal vem como string do MySQL
    ind_ativo: number; // tinyint(1): 0 ou 1
    num_codigo_barras: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface GradeProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: GradeProduto[];
}

export interface GradeProdutoResponse {
    sucesso: boolean;
    dados: GradeProduto;
}

export interface GradeProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
