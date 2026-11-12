//src/features/parametrizacao/estados/types.ts

export interface Estado {
    id: number;
    nom_estado: string;
    sgl_estado: string;
}

export interface EstadoResponse {
    sucesso: boolean;
    estados?: number;
    dados: Estado[];
}