//src/features/produtos/imagem-produto/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagensProduto } from './api';
import { imagemProdutoKeys } from './queryKeys';
import {
    ImagemProdutoListResponse,
    ImagemProdutoConsultaResponse,
    ImagemProdutoCreateResponse,
    ImagemProdutoUpdateResponse,
    ImagemProdutoDeleteResponse,
} from './types';
import { ImagemProdutoCreateInput, ImagemProdutoUpdateInput } from './schema';
import { toast } from 'sonner';

export const useImagensProduto = () => {
    return useQuery<ImagemProdutoListResponse>({
        queryKey: imagemProdutoKeys.all,
        queryFn: ImagensProduto.listar,
        staleTime: 0,
    });
};

export const useImagensPorProduto = (idProduto: number) => {
    return useQuery<ImagemProdutoConsultaResponse>({
        queryKey: imagemProdutoKeys.porProduto(idProduto),
        queryFn: () => ImagensProduto.buscarPorProduto(idProduto),
        staleTime: 0,
        enabled: !!idProduto,
    });
};

export const useImagensPorGrade = (idGrade: number) => {
    return useQuery<ImagemProdutoConsultaResponse>({
        queryKey: imagemProdutoKeys.porGrade(idGrade),
        queryFn: () => ImagensProduto.buscarPorGrade(idGrade),
        staleTime: 0,
        enabled: !!idGrade,
    });
};

export const useCriarImagemProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<ImagemProdutoCreateResponse, unknown, ImagemProdutoCreateInput>({
        mutationFn: (data) => ImagensProduto.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: imagemProdutoKeys.all });
        }
    });
};

export const useAtualizarImagemProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<ImagemProdutoUpdateResponse, unknown, ImagemProdutoUpdateInput>({
        mutationFn: (data) => ImagensProduto.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: imagemProdutoKeys.all });
        },
    });
};

export const useDeletarImagemProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<ImagemProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => ImagensProduto.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: imagemProdutoKeys.all });
        },
    });
};
