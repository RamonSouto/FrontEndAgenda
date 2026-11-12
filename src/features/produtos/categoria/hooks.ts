//src/features/produtos/categoria/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Categorias } from './api';
import { categoriaKeys } from './queryKeys';
import {
    CategoriaListResponse,
    CategoriaResponse,
    CategoriaCreateResponse,
    CategoriaUpdateResponse,
    CategoriaDeleteResponse,
} from './types';
import { CategoriaInput } from './schema';

export const useCategorias = () => {
    return useQuery<CategoriaListResponse>({
        queryKey: categoriaKeys.all,
        queryFn: Categorias.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useCategoria = (id: number) => {
    return useQuery<CategoriaResponse>({
        queryKey: categoriaKeys.detail(id),
        queryFn: () => Categorias.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation<CategoriaCreateResponse, unknown, CategoriaInput>({
        mutationFn: (data) => Categorias.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriaKeys.all });
        },
    });
};

export const useAtualizarCategoria = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<CategoriaUpdateResponse, unknown, CategoriaInput>({
        mutationFn: (data) => Categorias.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriaKeys.all });
            queryClient.invalidateQueries({ queryKey: categoriaKeys.detail(id) });
        },
    });
};

export const useDeletarCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation<CategoriaDeleteResponse, unknown, number>({
        mutationFn: (id) => Categorias.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriaKeys.all });
        },
    });
};
