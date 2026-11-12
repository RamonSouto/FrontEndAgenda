//src/features/produtos/imagem-produto/types.ts

export interface ImagemProduto {
    id: number;
    id_produto_grade: number | null;
    id_produto: number | null;
    des_titulo_imagem: string | null;
    des_imagem: string | null;
    des_url_imagem: string;
    num_ordem: number;
    ind_principal: number; // 0 ou 1 (vem assim do backend)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

// GET /api/produtos/imagemProduto
export interface ImagemProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: ImagemProduto[];
}

// GET /api/produtos/imagemProduto/{id} e /imagemProdutoGrade/{id}
export interface ImagemProdutoConsultaResponse {
    sucesso: boolean;
    dados: ImagemProduto[];
}

// POST /api/produtos/imagemProduto
export interface ImagemProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: { id: ImagemProduto[] };
}

// PUT /api/produtos/imagemProduto/{id}
export interface ImagemProdutoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: unknown[];
}

// DELETE /api/produtos/imagemProduto/{id}
export interface ImagemProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
