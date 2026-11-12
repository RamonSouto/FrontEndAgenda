//src/features/parametrizacao/horario/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Horarios } from './api';
import { horarioKeys } from './queryKeys';
import { HorarioListResponse, HorarioResponse, HorarioCreateResponse, HorarioDeleteResponse } from './types';
import { HorarioInput } from './schema';

export const useHorarios = () => {
    return useQuery<HorarioListResponse>({
        queryKey: horarioKeys.all,
        queryFn: Horarios.listar,
        // staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useHorario = (id: number) => {
    return useQuery<HorarioResponse>({
        queryKey: horarioKeys.detail(id),
        queryFn: () => Horarios.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarHorario = () => {
    const queryClient = useQueryClient();

    return useMutation<HorarioCreateResponse, unknown, HorarioInput>({
        mutationFn: (data) => Horarios.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: horarioKeys.all });
        },
    });
};

export const useAtualizarHorario = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<HorarioResponse, unknown, HorarioInput>({
        mutationFn: (data) => Horarios.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: horarioKeys.all });
            queryClient.invalidateQueries({ queryKey: horarioKeys.detail(id) });
        },
    });
};

export const useDeletarHorario = () => {
    const queryClient = useQueryClient();

    return useMutation<HorarioDeleteResponse, unknown, number>({
        mutationFn: (id) => Horarios.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: horarioKeys.all });
        }
    });
};
