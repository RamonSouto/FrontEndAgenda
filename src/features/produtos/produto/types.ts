//src/features/produtos/produto/types.ts

export interface Produto {
    id: number;
    id_categoria: number | null;
    nom_produto: string;
    num_sku: string | null;
    des_produto: string | null;
    ref_produto: string | null;
    val_preco_base: string;
    ind_ativo: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface ProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: Produto[];
}

export interface ProdutoResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: Produto;
}

export interface ProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Produto;
}

export interface ProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
