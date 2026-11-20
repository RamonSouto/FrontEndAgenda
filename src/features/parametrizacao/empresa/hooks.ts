// features/parametrizacao/empresa/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaApi } from './api';
import { empresaKeys } from './queryKeys';
import type { EmpresaFormValues } from './schema';
import type {
    EmpresaListResponse,
    EmpresaResponse,
    EmpresaCreateResponse,
    EmpresaDeleteResponse,
    ParametrizacaoListResponse,
} from './types';

const STALE_5_MIN = 1000 * 60 * 5;

export function useEmpresas() {
    return useQuery<EmpresaListResponse>({
        queryKey: empresaKeys.list(),
        queryFn: empresaApi.listar,
        staleTime: STALE_5_MIN,
    });
}

export function useEmpresa(id: number | null) {
    return useQuery<EmpresaResponse>({
        queryKey: empresaKeys.detail(id ?? 0),
        queryFn: () => empresaApi.buscarPorId(id as number),
        staleTime: STALE_5_MIN,
        enabled: !!id,
    });
}

export function useHorariosEmpresa(idEmpresa: number | null) {
    return useQuery<ParametrizacaoListResponse>({
        queryKey: empresaKeys.horarios(idEmpresa ?? 0),
        queryFn: () => empresaApi.listarHorarios(idEmpresa as number),
        staleTime: STALE_5_MIN,
        enabled: !!idEmpresa,
    });
}

export function useCriarEmpresa() {
    const qc = useQueryClient();
    return useMutation<EmpresaCreateResponse, unknown, EmpresaFormValues>({
        mutationFn: (payload) => empresaApi.criar(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.lists() }),
    });
}

export function useAtualizarEmpresa() {
    const qc = useQueryClient();
    return useMutation<
        EmpresaResponse,
        unknown,
        { id: number; payload: Partial<EmpresaFormValues> }
    >({
        mutationFn: ({ id, payload }) => empresaApi.atualizar(id, payload),
        onSuccess: (_res, { id }) => {
            qc.invalidateQueries({ queryKey: empresaKeys.lists() });
            qc.invalidateQueries({ queryKey: empresaKeys.detail(id) });
        },
    });
}

export function useDeletarEmpresa() {
    const qc = useQueryClient();
    return useMutation<EmpresaDeleteResponse, unknown, number>({
        mutationFn: (id) => empresaApi.deletar(id),
        onSuccess: (_res, id) => {
            qc.removeQueries({ queryKey: empresaKeys.detail(id) });
            qc.invalidateQueries({ queryKey: empresaKeys.lists() });
        },
    });
}