// features/parametrizacao/empresa/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaApi } from './api';
import { empresaKeys } from './queryKeys';
import { EmpresaFormValues } from './schema';

export function useEmpresas() {
    return useQuery({
        queryKey: empresaKeys.list(),
        queryFn: empresaApi.listar,
    });
}

export function useEmpresa(id: number | null) {
    return useQuery({
        queryKey: empresaKeys.detail(id ?? 0),
        queryFn: () => empresaApi.buscarPorId(id as number),
        enabled: !!id,
    });
}

export function useHorariosEmpresa(idEmpresa: number | null) {
    return useQuery({
        queryKey: empresaKeys.horarios(idEmpresa ?? 0),
        queryFn: () => empresaApi.listarHorarios(idEmpresa as number),
        enabled: !!idEmpresa,
    });
}

export function useCriarEmpresa() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: EmpresaFormValues) => empresaApi.criar(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
    });
}

export function useAtualizarEmpresa() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<EmpresaFormValues> }) =>
            empresaApi.atualizar(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
    });
}

export function useDeletarEmpresa() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => empresaApi.deletar(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
    });
}
