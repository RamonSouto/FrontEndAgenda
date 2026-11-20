// src/features/agendamentos/agendamento/slots.ts
import type { Horario, TipoDia } from '@/features/parametrizacao/horario/types';

const p2 = (n: number) => String(n).padStart(2, '0');

export const paraMinutos = (hms: string) => {
    const [h, m] = hms.split(':').map(Number);
    return h * 60 + m;
};
export const deMinutos = (min: number) => `${p2(Math.floor(min / 60))}:${p2(min % 60)}`;

/** "YYYY-MM-DD" -> tipo do dia (null = domingo ou data inválida) */
export function tipoDiaDe(data: string): TipoDia | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return null;
    const [y, m, d] = data.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay(); // local, evita bug de UTC
    if (dow === 0) return null;
    return dow === 6 ? 'SABADO' : 'UTIL';
}

export function hojeLocal(): string {
    const n = new Date();
    return `${n.getFullYear()}-${p2(n.getMonth() + 1)}-${p2(n.getDate())}`;
}

/** Horários "HH:mm" permitidos para a data, conforme tab_parametrizacao */
export function gerarHorarios(data: string, parametros: Horario[]): string[] {
    const tipo = tipoDiaDe(data);
    if (!tipo) return [];

    const param = parametros.find(
        (x) => x.des_tipo_dia === tipo && Number(x.ind_ativo) === 1 && x.deleted_at === null
    );
    if (!param) return [];

    const passo = Number(param.qtd_minutos_intervalo);
    if (!passo) return [];

    const fim = paraMinutos(param.hra_fim);
    const lista: string[] = [];
    for (let t = paraMinutos(param.hra_inicio); t + passo <= fim; t += passo) {
        lista.push(deMinutos(t));
    }
    return lista;
}
