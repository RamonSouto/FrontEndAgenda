//src/features/parametrizacao/horario/types.ts

export type TipoDia = 'UTIL' | 'SABADO';

export interface Horario {
    id: number;
    des_tipo_dia: TipoDia;
    hra_inicio: string;
    hra_fim: string;
    qtd_minutos_intervalo: number;
    ind_ativo: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface HorarioListResponse {
    sucesso: boolean;
    parametro?: number;
    dados: Horario[];
}

export interface HorarioResponse {
    sucesso: boolean;
    dados: Horario;
}

export interface HorarioCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: number;
}

export interface HorarioDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
