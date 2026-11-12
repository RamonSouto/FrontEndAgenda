// src/lib/constants/breadcrumb-labels.ts

export const breadcrumbLabels: Record<string, string> = {
    produtos: "Produtos",
    categoria: "Categoria",
    "cor-estampa": "Cor e Estampa",
    grade: "Grade",
    "imagem-produto": "Imagem do Produto",
    "preco-produto-servico": "Preço do Serviço por Produto",
    tamanho: "Tamanho",
    "tipo-servico": "Tipo de Serviço",
    "produto-servico": "Produto/Serviço",
    produto: "Produto",
};

export function getBreadcrumbLabel(segment: string): string {
    return (
        breadcrumbLabels[segment] ??
        segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
    );
}
