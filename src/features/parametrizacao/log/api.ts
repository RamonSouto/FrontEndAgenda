//src/features/parametrizacao/log/api.ts
import { httpClient } from '@/lib/http/client';
import { LogListResponse, LogFiltros } from './types';

const montarQuery = (filtros: LogFiltros = {}): string => {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor === undefined || valor === null || valor === '') return;
        params.append(chave, String(valor));
    });

    const query = params.toString();
    return query ? `?${query}` : '';
};

export const Logs = {
    listar: (filtros?: LogFiltros, signal?: AbortSignal) =>
        httpClient.get<LogListResponse>(
            `/api/relatorios/auditoria${montarQuery(filtros)}`,
            { signal }
        ),
};
