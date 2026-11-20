//src/features/parametrizacao/log/hooks.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Logs } from './api';
import { logKeys } from './queryKeys';
import { LogListResponse, LogFiltros } from './types';

export const useLogs = (filtros: LogFiltros = {}) => {
    return useQuery<LogListResponse>({
        queryKey: logKeys.list(filtros),
        queryFn: ({ signal }) => Logs.listar(filtros, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30, // 30 segundos
    });
};
