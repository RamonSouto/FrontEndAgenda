//src/features/parametrizacao/cidades/types.ts

export interface Cidade {
    id: number;
    nom_cidade: string;
    cod_municipio_ibge: string;
    id_estado: number;
    nom_estado: string;
    sgl_estado: string;

}

export interface CidadeResponse {
    sucesso: boolean;
    cidades?: number;
    dados: Cidade[];
}