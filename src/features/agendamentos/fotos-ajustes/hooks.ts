// src/features/agendamentos/fotos-ajustes/hooks.ts

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgendamentoItemFotos } from './api';
import { agendamentoItemFotoKeys } from './queryKeys';
import {
    AgendamentoItemFotoListResponse,
    AgendamentoItemFotoResponse,
    AgendamentoItemFotoCreateResponse,
    AgendamentoItemFotoDeleteResponse,
} from './types';
import { FotoUploadInput } from './schema';

export const useFotosItem = (idAgendamento: number, idItem: number) => {
    return useQuery<AgendamentoItemFotoListResponse>({
        queryKey: agendamentoItemFotoKeys.lista(idAgendamento, idItem),
        queryFn: () => AgendamentoItemFotos.listar(idAgendamento, idItem),
        enabled: !!idAgendamento && !!idItem,
    });
};

export const useFoto = (id: number) => {
    return useQuery<AgendamentoItemFotoResponse>({
        queryKey: agendamentoItemFotoKeys.detail(id),
        queryFn: () => AgendamentoItemFotos.buscar(id),
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });
};

export const useUploadFotos = (idAgendamento: number, idItem: number) => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoItemFotoCreateResponse, unknown, FotoUploadInput>({
        mutationFn: (data) => AgendamentoItemFotos.criar(idAgendamento, idItem, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: agendamentoItemFotoKeys.lista(idAgendamento, idItem),
            });
        },
    });
};

export const useDeletarFoto = (idAgendamento: number, idItem: number) => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoItemFotoDeleteResponse, unknown, number>({
        mutationFn: (id) => AgendamentoItemFotos.deletar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: agendamentoItemFotoKeys.lista(idAgendamento, idItem),
            });
            queryClient.removeQueries({ queryKey: agendamentoItemFotoKeys.arquivo(id) });
        },
    });
};

// Baixa o binário (com token) e o mantém em cache como Blob
export const useFotoArquivo = (id: number) => {
    return useQuery<Blob>({
        queryKey: agendamentoItemFotoKeys.arquivo(id),
        queryFn: () => AgendamentoItemFotos.baixarArquivo(id),
        staleTime: 1000 * 60 * 30,
        enabled: !!id,
    });
};

// Converte o Blob em URL utilizável em <img src>, liberando a memória ao desmontar
export const useFotoObjectUrl = (id: number) => {
    const { data: blob, ...rest } = useFotoArquivo(id);
    const [url, setUrl] = useState<string | null>(null);

    // Criar/revogar dentro do mesmo effect evita URL revogada no StrictMode
    useEffect(() => {
        if (!blob) {
            setUrl(null);
            return;
        }
        const novaUrl = URL.createObjectURL(blob);
        setUrl(novaUrl);
        return () => URL.revokeObjectURL(novaUrl);
    }, [blob]);

    return { url, ...rest };
};
