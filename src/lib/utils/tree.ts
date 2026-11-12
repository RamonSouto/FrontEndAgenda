// src/lib/utils/tree.ts

export interface ComHierarquia {
    id: number;
    id_pai: number | null;
}

export function montarArvore<T extends ComHierarquia>(
    itens: T[]
): (T & { subRows?: (T & { subRows?: any[] })[] })[] {
    const mapa = new Map<number, T & { subRows: any[] }>();

    // 1ª passada: cria uma cópia de cada item já com subRows: []
    itens.forEach((item) => {
        mapa.set(item.id, { ...item, subRows: [] });
    });

    const raizes: (T & { subRows: any[] })[] = [];

    // 2ª passada: encaixa cada item dentro do array subRows do seu pai
    mapa.forEach((item) => {
        if (item.id_pai !== null && mapa.has(item.id_pai)) {
            mapa.get(item.id_pai)!.subRows.push(item);
        } else {
            // sem pai, ou pai não encontrado na lista (órfão) -> vira raiz
            raizes.push(item);
        }
    });

    return raizes;
}
