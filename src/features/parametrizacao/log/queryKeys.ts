//src/features/parametrizacao/log/queryKeys.ts
import { LogFiltros } from './types';

export const logKeys = {
    all: ['logs'] as const,
    list: (filtros: LogFiltros) => ['logs', 'list', filtros] as const,
};
