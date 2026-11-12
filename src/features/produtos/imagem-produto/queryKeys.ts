//src/features/produtos/imagem-produto/queryKeys.ts

export const imagemProdutoKeys = {
    all: ['imagemProduto'] as const,
    porProduto: (idProduto: number) => ['imagemProduto', 'produto', idProduto] as const,
    porGrade: (idGrade: number) => ['imagemProduto', 'grade', idGrade] as const,
};
