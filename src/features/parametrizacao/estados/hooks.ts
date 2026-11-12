//src/features/parametrizacao/estados/hooks.ts

import { useQuery } from '@tanstack/react-query';
import { Estados } from './api';
import { estadoKeys } from './queryKeys';

export function useEstados() {
    return useQuery({
        queryKey: estadoKeys.all,
        queryFn: Estados.listar,
        staleTime: 1000 * 60 * 10, // 10 minutos
    });
}