import { useQuery } from '@tanstack/react-query';
import { Cidades } from './api';
import { cidadeKeys } from './queryKeys';
import { Cidade } from './types';

export const useCidades = () => {
    return useQuery<Cidade[]>({
        queryKey: cidadeKeys.all,
        queryFn: Cidades.listar,
        staleTime: 1000 * 60 * 60 * 24, // 10 minutos
    });
};