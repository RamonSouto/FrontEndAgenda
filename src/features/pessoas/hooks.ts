//src/features/pessoas/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pessoas } from './api';
import { pessoasKeys } from './queryKeys';
import {
    PessoaListResponse,
    PessoaResponse,
    PessoaCreateResponse,
    PessoaUpdateResponse,
    PessoaDeleteResponse,
    PessoaAtivarResponse,
    PessoaDesativarResponse,
    TipoPapelPessoa,
} from './types';
import { PessoaInput } from './schema';

export const usePessoas = () => {
    return useQuery<PessoaListResponse>({
        queryKey: pessoasKeys.all,
        queryFn: Pessoas.listar,
    });
};

export const usePessoa = (id: number) => {
    return useQuery<PessoaResponse>({
        queryKey: pessoasKeys.detail(id),
        queryFn: () => Pessoas.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaCreateResponse, unknown, PessoaInput>({
        mutationFn: (data) => Pessoas.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
        },
    });
};

export const useAtualizarPessoa = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<PessoaUpdateResponse, unknown, PessoaInput>({
        mutationFn: (data) => Pessoas.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const useDeletarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaDeleteResponse, unknown, number>({
        mutationFn: (id) => Pessoas.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
        },
    });
};

export const useAtivarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaAtivarResponse, unknown, number>({
        mutationFn: (id) => Pessoas.ativar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const useDesativarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaDesativarResponse, unknown, number>({
        mutationFn: (id) => Pessoas.desativar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const usePessoasPorPapel = (tipo: TipoPapelPessoa) => {
    return useQuery<PessoaListResponse>({
        queryKey: pessoasKeys.porPapel(tipo),
        queryFn: () => Pessoas.listarPorPapel(tipo),
    });
};