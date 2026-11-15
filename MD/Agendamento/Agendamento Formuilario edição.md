Certo antes de gerar o código me diga de que informações você precisa, para fazer a páginas de edição e que tenha a seção de adicionar produto(itens) e fotos dos itens.

1. Dados os selects do item(principal lacuna):
    1. A relação entre eles: Escolhe o produto, depois a grade, depois o serviço.Filtrar em cascata o Produto(nome_produto - num_sku) → Produto grade(nom_cor_estampa - cod_tamanho) → Tipo de Serviço(des_tipo_ajuste)
2. Regras do item:
    1. A tela só adiciona, remove, edita(PATCH de ajuste, desconto, preço e status.
    2. A definição do preços jé vem de uma tabela que tenho no banco de dados  tab_preco_produto_servico que tem a chave estrangeira da tab_produto_servico
    3. Existe o fluxo de status do item(pendente → producao → concluido), se por algum motivo a cliente desistir de fazer o ajuste de alguma peça o status vai para cancelado, se um item for adicionado erroniamente deve ser excluido.
    4. O item so pode se removido se o statu estiver em pendente
    5. Exibir um total = (preço - desconto)
3. Fotos
    1. O campo do multer é fotos como está na api.
    2. Agrupar em tabs de antes e DecompressionStream, por item.
    3. Um limite de 10 imagens por useItemAgendamento, limite de 2mb
    4. Queri visualizar a foto ampliada ao clicar na imagem
4. Formulário e página
    1. Para editar agendamentos passados, o form deve usar o agendamentoUpdateSchema. Ele valida data futura só se a data for alterada, mas o ehFutura ainda barra datas passadas que o usuário reenvie. Quero enviar dta_agendamento somente se ela mudar.
    2. Quais campos de ciclo de vida o front controla (ind_paciente_compareceu, dta_confirmacao, dta_conclusao quando o agendamento for para status concluido, dta_cancelamento preencher data de cancelamento quando mutar o status para cancelado),
    3. 

```ts
// src/features/agendamentos/agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    AgendamentoListParams,
    AgendamentoListResponse,
    AgendamentoResponse,
    AgendamentoCreateResponse,
    AgendamentoUpdateResponse,
    AgendamentoDeleteResponse,
} from './types';
import { AgendamentoInput, AgendamentoUpdateInput } from './schema';

// GET não tem body: filtros/paginação vão na query string
function toQueryString(params: AgendamentoListParams = {}): string {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== '') {
            qs.set(chave, String(valor));
        }
    });
    const texto = qs.toString();
    return texto ? '?${texto}' : '';
}

export const Agendamentos = {
    listar: (params?: AgendamentoListParams) =>
        httpClient.get<AgendamentoListResponse>('/api/agendamentos${toQueryString(params)}'),

    buscar: (id: number) =>
        httpClient.get<AgendamentoResponse>('/api/agendamentos/${id}'),

    criar: (data: AgendamentoInput) =>
        httpClient.post<AgendamentoCreateResponse>('/api/agendamentos', data),

    atualizar: (id: number, data: AgendamentoUpdateInput) =>
        httpClient.put<AgendamentoUpdateResponse>('/api/agendamentos/${id}', data),

    deletar: (id: number) =>
        httpClient.delete<AgendamentoDeleteResponse>('/api/agendamentos/${id}'),
};
```

    ```tsx
// src/features/agendamentos/agendamento/hooks.ts

import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import { Agendamentos } from './api';
import { agendamentoKeys } from './queryKeys';
import {
    AgendamentoListParams,
    AgendamentoListResponse,
    AgendamentoResponse,
    AgendamentoCreateResponse,
    AgendamentoUpdateResponse,
    AgendamentoDeleteResponse,
} from './types';
import { AgendamentoInput, AgendamentoUpdateInput } from './schema';

export const useAgendamentos = (params: AgendamentoListParams = {}) => {
    return useQuery<AgendamentoListResponse>({
        queryKey: agendamentoKeys.list(params),
        queryFn: () => Agendamentos.listar(params),
        placeholderData: keepPreviousData, // evita "piscar" ao trocar filtros
        staleTime: 1000 * 30,
    });
};

export const useAgendamento = (id: number) => {
    return useQuery<AgendamentoResponse>({
        queryKey: agendamentoKeys.detail(id),
        queryFn: () => Agendamentos.buscar(id),
        staleTime: 1000 * 60,
        enabled: !!id,
    });
};

export const useCriarAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoCreateResponse, unknown, AgendamentoInput>({
        mutationFn: (data) => Agendamentos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.lists() });
        },
    });
};

// O id vai nas variáveis (e não no hook) porque o drag-and-drop do Scheduler
// atualiza agendamentos diferentes com a mesma instância do hook.
export interface AtualizarAgendamentoVars {
    id: number;
    data: AgendamentoUpdateInput;
}

export const useAtualizarAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoUpdateResponse, unknown, AtualizarAgendamentoVars>({
        mutationFn: ({ id, data }) => Agendamentos.atualizar(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.detail(id) });
        },
    });
};

export const useDeletarAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<AgendamentoDeleteResponse, unknown, number>({
        mutationFn: (id) => Agendamentos.deletar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: agendamentoKeys.lists() });
            queryClient.removeQueries({ queryKey: agendamentoKeys.detail(id) });
        },
    });
};
```

    ```tsx
// src/features/agendamentos/agendamento/queryKeys.ts
import { AgendamentoListParams } from './types';

const base = ['agendamentos'] as const;

export const agendamentoKeys = {
    all: base,
    lists: () => [...base, 'list'] as const,
    list: (params: AgendamentoListParams = {}) => [...base, 'list', params] as const,
    detail: (id: number) => [...base, 'detail', id] as const,
};
```

    ```ts
// src/features/agendamentos/agendamento/schema.ts
import { z } from 'zod';

// Formato aceito pela API: "YYYY-MM-DD HH:mm:ss" (horário local)
const DATA_HORA_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const dataHora = (msg = 'Data/hora inválida (yyyy-MM-dd HH:mm:ss)') =>
    z.string().regex(DATA_HORA_REGEX, msg);

// Espelha a CHECK chk_data_futura (dta_agendamento > created_at)
const ehFutura = (valor: string) =>
    new Date(valor.replace(' ', 'T')).getTime() > Date.now();

const MSG_FUTURA = 'O agendamento deve ser em uma data/hora futura';

export const AGENDAMENTO_STATUS = [
    'agendado',
    'confirmado',
    'concluido',
    'cancelado',
    'falta',
] as const;

// Objeto base (sem refine, para permitir .partial())
const agendamentoBase = z.object({
    id_paciente: z
        .number({ error: 'Selecione o paciente' })
        .int()
        .positive('Selecione o paciente'),
    id_costureira: z
        .number({ error: 'Selecione a costureira' })
        .int()
        .positive('Selecione a costureira'),
    id_secretaria: z.number().int().positive().nullable().optional(),
    dta_agendamento: dataHora(),
    des_observacoes_geral: z.string().nullable().optional(),
    des_observacoes_costureira: z.string().nullable().optional(),
});

// POST /api/agendamentos
export const agendamentoSchema = agendamentoBase.refine(
    (d) => ehFutura(d.dta_agendamento),
    { message: MSG_FUTURA, path: ['dta_agendamento'] }
);
export type AgendamentoInput = z.infer<typeof agendamentoSchema>;

// PUT /api/agendamentos/{id} – parcial + campos de ciclo de vida
export const agendamentoUpdateSchema = agendamentoBase
    .partial()
    .extend({
        ind_status: z.enum(AGENDAMENTO_STATUS).optional(),
        ind_paciente_compareceu: z.boolean().nullable().optional(),
        dta_confirmacao: dataHora().nullable().optional(),
        dta_conclusao: dataHora().nullable().optional(),
        dta_cancelamento: dataHora().nullable().optional(),
    })
    .refine((d) => !d.dta_agendamento || ehFutura(d.dta_agendamento), {
        message: MSG_FUTURA,
        path: ['dta_agendamento'],
    });
export type AgendamentoUpdateInput = z.infer<typeof agendamentoUpdateSchema>;
```

    ```ts
// src/features/agendamentos/agendamento/types.ts
import { AgendamentoItem } from '../produto-agendamento/types';

export type AgendamentoStatus =
    | 'agendado'
    | 'confirmado'
    | 'concluido'
    | 'cancelado'
    | 'falta';

// Item da LISTAGEM (payload enxuto)
export interface AgendamentoResumo {
    id: number;
    dta_agendamento: string; // ISO UTC, ex.: "2026-11-11T16:00:00.000Z"
    dta_agendamento_to: string; // ISO UTC, fim do atendimento
    ind_status: AgendamentoStatus;
    des_url_externa: string;
    id_paciente: number;
    id_costureira: number;
    nom_paciente: string;
    nom_costureira: string;
    val_cor_costureira: string | null; // hex SEM '#', ex.: "FF6B6B"
}

// Registro completo (POST) – inclui campos de JOIN
export interface Agendamento {
    id: number;
    des_url_externa: string;
    id_paciente: number;
    id_costureira: number;
    id_secretaria: number | null;
    dta_agendamento: string;
    des_observacoes_geral: string | null;
    des_observacoes_costureira: string | null;
    ind_status: AgendamentoStatus;
    ind_paciente_compareceu: number | null; // tinyint
    dta_confirmacao: string | null;
    dta_conclusao: string | null;
    dta_cancelamento: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    ind_slot_ativo: number | null; // coluna gerada pelo banco

    // JOINs
    nom_paciente: string;
    num_celular_paciente: string | null;
    nom_costureira: string;
    val_cor_costureira: string | null;
    nom_secretaria: string | null;
}

// GET /{id} e PUT /{id} – inclui os itens
export interface AgendamentoDetalhe extends Agendamento {
    itens: AgendamentoItem[];
}

// Filtros aceitos pela listagem (query string)
export interface AgendamentoListParams {
    pagina?: number;
    limite?: number;
    ind_status?: AgendamentoStatus;
    id_costureira?: number;
}

export interface AgendamentoListResponse {
    sucesso: boolean;
    total: number;
    dados: AgendamentoResumo[];
}

export interface AgendamentoResponse {
    sucesso: boolean;
    dados: AgendamentoDetalhe;
}

export interface AgendamentoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Agendamento;
}

export interface AgendamentoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: AgendamentoDetalhe;
}

export interface AgendamentoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
// src/features/agendamentos/fotos-ajustes/api.ts

import { parseCookies } from 'nookies';
import { httpClient } from '@/lib/http/client';
import { ApiError } from '@/lib/http/errors';
import {
    AgendamentoItemFotoListResponse,
    AgendamentoItemFotoResponse,
    AgendamentoItemFotoCreateResponse,
    AgendamentoItemFotoDeleteResponse,
} from './types';
import { FotoUploadInput } from './schema';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Nome do campo de arquivo esperado pelo multer no backend (confirme!)
const CAMPO_ARQUIVOS = 'fotos';

function montarFormData(data: FotoUploadInput): FormData {
    const fd = new FormData();
    // campos de texto ANTES dos arquivos (o multer só enxerga o que já foi lido)
    fd.append('ind_tipo_foto', data.ind_tipo_foto);
    data.arquivos.forEach((arquivo) => fd.append(CAMPO_ARQUIVOS, arquivo));
    return fd;
}

export const AgendamentoItemFotos = {
    listar: (idAgendamento: number, idItem: number) =>
        httpClient.get<AgendamentoItemFotoListResponse>(
            '/api/agendamentos/${idAgendamento}/itens/${idItem}/fotos'
        ),

    buscar: (id: number) =>
        httpClient.get<AgendamentoItemFotoResponse>('/api/agendamentos/fotos/${id}'),

    criar: (idAgendamento: number, idItem: number, data: FotoUploadInput) =>
        httpClient.upload<AgendamentoItemFotoCreateResponse>(
            '/api/agendamentos/${idAgendamento}/itens/${idItem}/fotos',
            montarFormData(data)
        ),

    deletar: (id: number) =>
        httpClient.delete<AgendamentoItemFotoDeleteResponse>('/api/agendamentos/fotos/${id}'),

    // A resposta é binária (imagem) e o httpClient só trata JSON,
    // por isso este método usa fetch direto, com o mesmo token do cookie.
    baixarArquivo: async (id: number): Promise<Blob> => {
        const token = parseCookies()['agenda.token'];
        const response = await fetch('${BASE_URL}/api/agendamentos/fotos/${id}/arquivo', {
            headers: token ? { Authorization: `Bearer ${ token } ` } : {},
        });

        if (!response.ok) {
            throw new ApiError({
                status: response.status,
                message: 'Não foi possível carregar a imagem',
            });
        }
        return response.blob();
    },
};
```

    ```ts
// src/features/agendamentos/fotos-ajustes/hooks.ts

import { useEffect, useMemo } from 'react';
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
    const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);

    useEffect(() => {
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [url]);

    return { url, ...rest };
};
```

    ```ts
// src/features/agendamentos/fotos-ajustes/queryKeys.ts

const base = ['agendamento-item-fotos'] as const;

export const agendamentoItemFotoKeys = {
    all: base,
    lista: (idAgendamento: number, idItem: number) =>
        [...base, 'lista', idAgendamento, idItem] as const,
    detail: (id: number) => [...base, 'detail', id] as const,
    arquivo: (id: number) => [...base, 'arquivo', id] as const,
};
```

    ```ts
// src/features/agendamentos/fotos-ajustes/schema.ts
import { z } from 'zod';

export const FOTO_TIPOS = ['antes', 'depois'] as const;
export const FOTO_TAMANHO_MAX_MB = 5; // ajuste conforme o limite do backend

// Upload = multipart/form-data: tipo + arquivo(s)
export const fotoUploadSchema = z.object({
    ind_tipo_foto: z.enum(FOTO_TIPOS, { error: 'Selecione o tipo da foto' }),
    arquivos: z
        .array(z.instanceof(File))
        .min(1, 'Selecione ao menos uma imagem')
        .refine((files) => files.every((f) => f.type.startsWith('image/')), {
            message: 'Apenas arquivos de imagem são permitidos',
        })
        .refine(
            (files) => files.every((f) => f.size <= FOTO_TAMANHO_MAX_MB * 1024 * 1024),
            { message: `Cada imagem deve ter no máximo ${ FOTO_TAMANHO_MAX_MB } MB` }
        ),
});
export type FotoUploadInput = z.infer<typeof fotoUploadSchema>;
```

    ```ts
// src/features/agendamentos/fotos-ajustes/types.ts

export type FotoTipo = 'antes' | 'depois';

export interface AgendamentoItemFoto {
    id: number;
    id_produto_agendamento: number; // = id do item do agendamento
    des_caminho_arquivo: string;
    nom_original: string;
    num_tamanho_bytes: number;
    ind_tipo_foto: FotoTipo | null;
    created_at: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    url_arquivo: string; // ex.: "/api/agendamentos/fotos/1/arquivo" (exige token)
}

export interface AgendamentoItemFotoListResponse {
    sucesso: boolean;
    total: number;
    dados: AgendamentoItemFoto[];
}

export interface AgendamentoItemFotoResponse {
    sucesso: boolean;
    dados: AgendamentoItemFoto;
}

// O upload devolve apenas os ids criados
export interface AgendamentoItemFotoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: {
        ids: number[];
        total: number;
    };
}

export interface AgendamentoItemFotoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
// src/features/agendamentos/produto-agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    AgendamentoItemListResponse,
    AgendamentoItemResponse,
    AgendamentoItemCreateResponse,
    AgendamentoItemUpdateResponse,
    AgendamentoItemDeleteResponse,
} from './types';
import { AgendamentoItemInput, AgendamentoItemUpdateInput } from './schema';

export const AgendamentoItens = {
    listar: (idAgendamento: number) =>
        httpClient.get<AgendamentoItemListResponse>(
            '/api/agendamentos/${idAgendamento}/itens'
        ),

    buscar: (idAgendamento: number, id: number) =>
        httpClient.get<AgendamentoItemResponse>(
            '/api/agendamentos/${idAgendamento}/itens/${id}'
        ),

    criar: (idAgendamento: number, data: AgendamentoItemInput) =>
        httpClient.post<AgendamentoItemCreateResponse>(
            '/api/agendamentos/${idAgendamento}/itens',
            data
        ),

    atualizar: (idAgendamento: number, id: number, data: AgendamentoItemUpdateInput) =>
        httpClient.patch<AgendamentoItemUpdateResponse>(
            '/api/agendamentos/${idAgendamento}/itens/${id}',
            data
        ),

    deletar: (idAgendamento: number, id: number) =>
        httpClient.delete<AgendamentoItemDeleteResponse>(
            '/api/agendamentos/${idAgendamento}/itens/${id}'
        ),
};
```

    ```ts
// src/features/agendamentos/produto-agendamento/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgendamentoItens } from './api';
import { agendamentoItemKeys } from './queryKeys';
import { agendamentoKeys } from '../agendamento/queryKeys';
import {
    AgendamentoItemListResponse,
    AgendamentoItemResponse,
    AgendamentoItemCreateResponse,
    AgendamentoItemUpdateResponse,
    AgendamentoItemDeleteResponse,
} from './types';
import { AgendamentoItemInput, AgendamentoItemUpdateInput } from './schema';

export const useItensAgendamento = (idAgendamento: number) => {
    return useQuery<AgendamentoItemListResponse>({
        queryKey: agendamentoItemKeys.lista(idAgendamento),
        queryFn: () => AgendamentoItens.listar(idAgendamento),
        enabled: !!idAgendamento,
    });
};

export const useItemAgendamento = (idAgendamento: number, id: number) => {
    return useQuery<AgendamentoItemResponse>({
        queryKey: agendamentoItemKeys.detail(idAgendamento, id),
        queryFn: () => AgendamentoItens.buscar(idAgendamento, id),
        staleTime: 1000 * 60 * 5,
        enabled: !!idAgendamento && !!id,
    });
};

// Todo o CRUD de item invalida também o detalhe do agendamento,
// pois GET /agendamentos/{id} devolve a lista "itens" embutida.
function useInvalidarItens(idAgendamento: number) {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: agendamentoItemKeys.lista(idAgendamento) });
        queryClient.invalidateQueries({ queryKey: agendamentoKeys.detail(idAgendamento) });
    };
}

export const useCriarItemAgendamento = (idAgendamento: number) => {
    const invalidar = useInvalidarItens(idAgendamento);

    return useMutation<AgendamentoItemCreateResponse, unknown, AgendamentoItemInput>({
        mutationFn: (data) => AgendamentoItens.criar(idAgendamento, data),
        onSuccess: invalidar,
    });
};

export interface AtualizarItemVars {
    id: number;
    data: AgendamentoItemUpdateInput;
}

export const useAtualizarItemAgendamento = (idAgendamento: number) => {
    const queryClient = useQueryClient();
    const invalidar = useInvalidarItens(idAgendamento);

    return useMutation<AgendamentoItemUpdateResponse, unknown, AtualizarItemVars>({
        mutationFn: ({ id, data }) => AgendamentoItens.atualizar(idAgendamento, id, data),
        onSuccess: (_, { id }) => {
            invalidar();
            queryClient.invalidateQueries({
                queryKey: agendamentoItemKeys.detail(idAgendamento, id),
            });
        },
    });
};

export const useDeletarItemAgendamento = (idAgendamento: number) => {
    const invalidar = useInvalidarItens(idAgendamento);

    return useMutation<AgendamentoItemDeleteResponse, unknown, number>({
        mutationFn: (id) => AgendamentoItens.deletar(idAgendamento, id),
        onSuccess: invalidar,
    });
};
```

    ```ts
// src/features/agendamentos/produto-agendamento/queryKeys.ts

const base = ['agendamento-itens'] as const;

export const agendamentoItemKeys = {
    all: base,
    lista: (idAgendamento: number) => [...base, 'lista', idAgendamento] as const,
    detail: (idAgendamento: number, id: number) =>
        [...base, 'detail', idAgendamento, id] as const,
};
```

    ```ts
// src/features/agendamentos/produto-agendamento/schema.ts
import { z } from 'zod';

export const AGENDAMENTO_ITEM_STATUS = [
    'pendente',
    'producao',
    'concluido',
    'cancelado',
] as const;

// POST /api/agendamentos/{id}/itens
// id_agendamento vem da URL; preço e status são definidos pelo servidor.
export const agendamentoItemSchema = z.object({
    id_tipo_agendamento: z
        .number({ error: 'Selecione o tipo de agendamento' })
        .int()
        .positive('Selecione o tipo de agendamento'),
    id_produto_grade: z
        .number({ error: 'Selecione o produto (grade)' })
        .int()
        .positive('Selecione o produto (grade)'),
    id_produto_servico: z
        .number({ error: 'Selecione o serviço' })
        .int()
        .positive('Selecione o serviço'),
    des_ajuste_produto: z.string().nullable().optional(),
    val_desconto_servico: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O desconto não pode ser negativo')
        .optional(),
});
export type AgendamentoItemInput = z.infer<typeof agendamentoItemSchema>;

// PATCH /api/agendamentos/{id}/itens/{idItem} – parcial
export const agendamentoItemUpdateSchema = agendamentoItemSchema.partial().extend({
    val_preco_servico: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O preço não pode ser negativo')
        .nullable()
        .optional(),
    ind_status: z.enum(AGENDAMENTO_ITEM_STATUS).optional(),
});
export type AgendamentoItemUpdateInput = z.infer<typeof agendamentoItemUpdateSchema>;
```

    ```ts
// src/features/agendamentos/produto-agendamento/types.ts

export type AgendamentoItemStatus = 'pendente' | 'producao' | 'concluido' | 'cancelado';

export interface AgendamentoItem {
    id: number;
    id_agendamento: number;
    id_tipo_agendamento: number;
    id_produto_grade: number;
    id_produto_servico: number;
    des_ajuste_produto: string | null;
    val_preco_servico: string | null;  // decimal chega como string
    val_desconto_servico: string;      // decimal chega como string
    ind_status: AgendamentoItemStatus;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // JOINs
    num_sku: string | null;
    nom_produto: string;
    des_tipo_ajuste: string;
}

export interface AgendamentoItemListResponse {
    sucesso: boolean;
    total: number;
    dados: AgendamentoItem[];
}

export interface AgendamentoItemResponse {
    sucesso: boolean;
    dados: AgendamentoItem;
}

export interface AgendamentoItemCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: AgendamentoItem;
}

export interface AgendamentoItemUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: AgendamentoItem;
}

export interface AgendamentoItemDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
// src/features/agendamento/tipo-agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    TipoAgendamentoListResponse,
    TipoAgendamentoResponse,
    TipoAgendamentoCreateResponse,
    TipoAgendamentoUpdateResponse,
    TipoAgendamentoDeleteResponse,
} from './types';
import { TipoAgendamentoInput } from './schema';

export const TiposAgendamento = {
    listar: () =>
        httpClient.get<TipoAgendamentoListResponse>('/api/agendamentos/tipo'),

    buscar: (id: number) =>
        httpClient.get<TipoAgendamentoResponse>('/api/agendamentos/tipo/${id}'),

    criar: (data: TipoAgendamentoInput) =>
        httpClient.post<TipoAgendamentoCreateResponse>('/api/agendamentos/tipo', data),

    atualizar: (id: number, data: TipoAgendamentoInput) =>
        httpClient.put<TipoAgendamentoUpdateResponse>('/api/agendamentos/tipo/${id}', data),

    deletar: (id: number) =>
        httpClient.delete<TipoAgendamentoDeleteResponse>('/api/agendamentos/tipo/${id}'),
};
```

    ```ts
// src/features/agendamento/tipo-agendamento/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TiposAgendamento } from './api';
import { tipoAgendamentoKeys } from './queryKeys';
import {
    TipoAgendamentoListResponse,
    TipoAgendamentoResponse,
    TipoAgendamentoCreateResponse,
    TipoAgendamentoUpdateResponse,
    TipoAgendamentoDeleteResponse,
} from './types';
import { TipoAgendamentoInput } from './schema';

export const useTiposAgendamento = () => {
    return useQuery<TipoAgendamentoListResponse>({
        queryKey: tipoAgendamentoKeys.all,
        queryFn: TiposAgendamento.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTipoAgendamento = (id: number) => {
    return useQuery<TipoAgendamentoResponse>({
        queryKey: tipoAgendamentoKeys.detail(id),
        queryFn: () => TiposAgendamento.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTipoAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoCreateResponse, unknown, TipoAgendamentoInput>({
        mutationFn: (data) => TiposAgendamento.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
        },
    });
};

export const useAtualizarTipoAgendamento = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoUpdateResponse, unknown, TipoAgendamentoInput>({
        mutationFn: (data) => TiposAgendamento.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.detail(id) });
        },
    });
};

export const useDeletarTipoAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoDeleteResponse, unknown, number>({
        mutationFn: (id) => TiposAgendamento.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
        },
    });
};
```

    ```ts
// src/features/agendamento/tipo-agendamento/queryKeys.ts

export const tipoAgendamentoKeys = {
    all: ['tipo-agendamento'] as const,
    detail: (id: number) => ['tipo-agendamento', id] as const,
};
```

    ```ts
// src/features/agendamento/tipo-agendamento/schema.ts
import { z } from 'zod';

export const tipoAgendamentoSchema = z.object({
    des_tipo_agendamento: z
        .string()
        .min(1, 'O nome do tipo de agendamento é obrigatório')
        .max(100, 'Máximo de 100 caracteres'),
    ind_ativo: z.boolean(),
});

export type TipoAgendamentoInput = z.infer<typeof tipoAgendamentoSchema>;
```

    ```ts
// src/features/agendamento/tipo-agendamento/types.ts

export interface TipoAgendamento {
    id: number;
    des_tipo_agendamento: string;
    ind_ativo: number; // vem como 0 | 1 do banco (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

// GET /api/agendamentos/tipo
export interface TipoAgendamentoListResponse {
    sucesso: boolean;
    total: number;
    dados: TipoAgendamento[];
}

// GET /api/agendamentos/tipo/{id}
// A API retorna "dados" como array mesmo buscando por 1 registro
export interface TipoAgendamentoResponse {
    sucesso: boolean;
    total: number;
    dados: TipoAgendamento[];
}

// POST /api/agendamentos/tipo
export interface TipoAgendamentoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoAgendamento[];
}

// PUT /api/agendamentos/tipo/{id}
export interface TipoAgendamentoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoAgendamento[];
}

// DELETE /api/agendamentos/tipo/{id}
export interface TipoAgendamentoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
// src/features/produtos/grade/api.ts

import { httpClient } from '@/lib/http/client';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const GradeProduto = {
    listar: () =>
        httpClient.get<GradeProdutoListResponse>('/api/produtos/grade_produto'),

    buscar: (id: number) =>
        httpClient.get<GradeProdutoResponse>('/api/produtos/grade_produto/${id}'),

    criar: (data: GradeProdutoInput) =>
        httpClient.post<GradeProdutoCreateResponse>('/api/produtos/grade_produto', data),

    atualizar: (id: number, data: GradeProdutoUpdateInput) =>
        httpClient.put<GradeProdutoUpdateResponse>('/api/produtos/grade_produto/${id}', data),

    deletar: (id: number) =>
        httpClient.delete<GradeProdutoDeleteResponse>('/api/produtos/grade_produto/${id}'),
};
```

    ```ts
// src/features/produtos/grade/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GradeProduto } from './api';
import { gradeProdutoKeys } from './queryKeys';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const useGradesProduto = () => {
    return useQuery<GradeProdutoListResponse>({
        queryKey: gradeProdutoKeys.all,
        queryFn: GradeProduto.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGradeProduto = (id: number) => {
    return useQuery<GradeProdutoResponse>({
        queryKey: gradeProdutoKeys.detail(id),
        queryFn: () => GradeProduto.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoCreateResponse, unknown, GradeProdutoInput>({
        mutationFn: (data) => GradeProduto.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
    });
};

export const useAtualizarGradeProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoUpdateResponse, unknown, GradeProdutoUpdateInput>({
        mutationFn: (data) => GradeProduto.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.detail(id) });
        },
    });
};

export const useDeletarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => GradeProduto.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
        onError: (error) => {
            console.error('Erro ao deletar grade: ', error)
        }
    });
};
```

    ```ts
// src/features/produtos/grade/queryKeys.ts

export const gradeProdutoKeys = {
    all: ['grade-produto'] as const,
    detail: (id: number) => ['grade-produto', id] as const,
};
```

    ```ts
// src/features/produtos/grade/schema.ts
import { z } from 'zod';

export const gradeProdutoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione o produto' })
        .int()
        .positive('Selecione o produto'),

    id_variacao_cor_estampa: z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    id_tamanho: z
        .number({ error: 'Selecione o tamanho' })
        .int()
        .positive('Selecione o tamanho'),

    num_sku: z
        .string()
        .max(50, 'SKU deve ter no máximo 50 caracteres')
        .nullable()
        .optional(),

    val_preco_variacao: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O preço não pode ser negativo')
        .nullable()
        .optional(),

    ind_ativo: z.boolean().default(true),

    num_codigo_barras: z
        .string()
        .max(100, 'Código de barras deve ter no máximo 100 caracteres')
        .nullable()
        .optional(),
});

export type GradeProdutoInput = z.infer<typeof gradeProdutoSchema>;

// Schema para atualização parcial (ex.: PUT só com num_sku, como no seu exemplo)
export const gradeProdutoUpdateSchema = gradeProdutoSchema.partial();
export type GradeProdutoUpdateInput = z.infer<typeof gradeProdutoUpdateSchema>;
```

    ```ts
// src/features/produtos/grade/types.ts

export interface GradeProduto {
    id: number;
    id_produto: number;
    id_variacao_cor_estampa: number | null;
    id_tamanho: number;
    num_sku: string | null;
    val_preco_variacao: string | null; // decimal vem como string do MySQL
    ind_ativo: number; // tinyint(1): 0 ou 1
    num_codigo_barras: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface GradeProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: GradeProduto[];
}

export interface GradeProdutoResponse {
    sucesso: boolean;
    dados: GradeProduto;
}

export interface GradeProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
//src/features/produtos/produto/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ProdutoListResponse,
    ProdutoResponse,
    ProdutoCreateResponse,
    ProdutoDeleteResponse,
} from './types';
import { ProdutoInput } from './schema';

export const Produtos = {
    listar: () => httpClient.get<ProdutoListResponse>('/api/produtos/produto'),

    buscar: (id: number) => httpClient.get<ProdutoResponse>(`/ api / produtos / produto / ${ id } `),

    criar: (data: ProdutoInput) =>
        httpClient.post<ProdutoCreateResponse>('/api/produtos/produto', data),

    atualizar: (id: number, data: ProdutoInput) =>
        httpClient.put<ProdutoResponse>(`/ api / produtos / produto / ${ id } `, data),

    deletar: (id: number) =>
        httpClient.delete<ProdutoDeleteResponse>(`/ api / produtos / produto / ${ id } `),
};
```

    ```ts
//src/features/produtos/produto/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Produtos } from './api';
import { produtoKeys } from './queryKeys';
import {
    ProdutoListResponse,
    ProdutoResponse,
    ProdutoCreateResponse,
    ProdutoDeleteResponse,
} from './types';
import { ProdutoInput } from './schema';

export const useProdutos = () => {
    return useQuery<ProdutoListResponse>({
        queryKey: produtoKeys.all,
        queryFn: Produtos.listar,
    });
};

export const useProduto = (id: number) => {
    return useQuery<ProdutoResponse>({
        queryKey: produtoKeys.detail(id),
        queryFn: () => Produtos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoCreateResponse, unknown, ProdutoInput>({
        mutationFn: (data) => Produtos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoKeys.all });
        },
    });
};

export const useAtualizarProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoResponse, unknown, ProdutoInput>({
        mutationFn: (data) => Produtos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoKeys.all });
            queryClient.invalidateQueries({ queryKey: produtoKeys.detail(id) });
        },
    });
};

export const useDeletarProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => Produtos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoKeys.all });
        },
    });
};
```

    ```ts
//src/features/produtos/produto/queryKeys.ts

export const produtoKeys = {
    all: ['produtos'] as const,
    detail: (id: number) => ['produtos', id] as const,
};
```

    ```ts
//src/features/produtos/produto/schema.ts
import { z } from 'zod';

export const produtoSchema = z.object({
    id_categoria: z.number().nullable(),
    nom_produto: z.string().min(1, 'Nome do produto é obrigatório').max(200),
    num_sku: z.string().max(50).nullable().optional(),
    des_produto: z.string().nullable().optional(),
    ref_produto: z.string().max(50).nullable().optional(),
    val_preco_base: z
        .number({ error: 'Preço base é obrigatório' })
        .nonnegative('Preço não pode ser negativo'),
    ind_ativo: z.boolean(),
});

export type ProdutoInput = z.infer<typeof produtoSchema>;
```

    ```ts
//src/features/produtos/produto/types.ts

export interface Produto {
    id: number;
    id_categoria: number | null;
    nom_produto: string;
    num_sku: string | null;
    des_produto: string | null;
    ref_produto: string | null;
    val_preco_base: string;
    ind_ativo: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface ProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: Produto[];
}

export interface ProdutoResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: Produto;
}

export interface ProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Produto;
}

export interface ProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
//src/features/produtos/cor-estampa/api.ts

import { httpClient } from '@/lib/http/client';
import {
    CorEstampaListResponse,
    CorEstampaResponse,
    CorEstampaCreateResponse,
    CorEstampaDeleteResponse,
} from './types';
import { CorEstampaInput, CorEstampaUpdateInput } from './schema';

export const CorEstampa = {
    listar: () =>
        httpClient.get<CorEstampaListResponse>('/api/produtos/cor_estampa'),

    buscar: (id: number) =>
        httpClient.get<CorEstampaResponse>(`/ api / produtos / cor_estampa / ${ id } `),

    criar: (data: CorEstampaInput) =>
        httpClient.post<CorEstampaCreateResponse>('/api/produtos/cor_estampa', data),

    atualizar: (id: number, data: CorEstampaUpdateInput) =>
        httpClient.put<CorEstampaResponse>(`/ api / produtos / cor_estampa / ${ id } `, data),

    deletar: (id: number) =>
        httpClient.delete<CorEstampaDeleteResponse>(`/ api / produtos / cor_estampa / ${ id } `),
};
```

    ```ts
//src/features/produtos/cor-estampa/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CorEstampa } from './api';
import { corEstampaKeys } from './queryKeys';
import {
    CorEstampaListResponse,
    CorEstampaResponse,
    CorEstampaCreateResponse,
    CorEstampaDeleteResponse,
} from './types';
import { CorEstampaInput, CorEstampaUpdateInput } from './schema';

export const useCorEstampas = () => {
    return useQuery<CorEstampaListResponse>({
        queryKey: corEstampaKeys.all,
        queryFn: CorEstampa.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useCorEstampaDetalhe = (id: number) => {
    return useQuery<CorEstampaResponse>({
        queryKey: corEstampaKeys.detail(id),
        queryFn: () => CorEstampa.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarCorEstampa = () => {
    const queryClient = useQueryClient();

    return useMutation<CorEstampaCreateResponse, unknown, CorEstampaInput>({
        mutationFn: (data) => CorEstampa.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.all });
        },
    });
};

export const useAtualizarCorEstampa = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<CorEstampaResponse, unknown, CorEstampaUpdateInput>({
        mutationFn: (data) => CorEstampa.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.all });
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.detail(id) });
        },
    });
};

export const useDeletarCorEstampa = () => {
    const queryClient = useQueryClient();

    return useMutation<CorEstampaDeleteResponse, unknown, number>({
        mutationFn: (id) => CorEstampa.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: corEstampaKeys.all });
        },
    });
};
```

    ```ts
//src/features/produtos/cor-estampa/queryKeys.ts

export const corEstampaKeys = {
    all: ['cor-estampa'] as const,
    detail: (id: number) => ['cor-estampa', id] as const,
};
```

    ```ts
//src/features/produtos/cor-estampa/schema.ts
import { z } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// Objeto base — reutilizado tanto no schema de criação quanto no de atualização
const corEstampaBaseSchema = z.object({
    nom_cor_estampa: z
        .string()
        .min(1, 'Nome é obrigatório')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    ind_tipo: z.enum(['cor', 'estampa'], {
        message: 'Selecione um tipo válido (cor ou estampa)',
    }),
    val_codigo_hex: z
        .string()
        .regex(hexColorRegex, 'Código hexadecimal inválido (ex: #000000)')
        .nullable()
        .optional(),
    des_imagem_url: z
        .string()
        .url('URL da imagem inválida')
        .max(500, 'URL deve ter no máximo 500 caracteres')
        .nullable()
        .optional(),
    num_ordem_exibicao: z.coerce
        .number({ message: 'Ordem de exibição deve ser um número' })
        .int('Ordem de exibição deve ser um número inteiro')
        .min(0, 'Ordem de exibição não pode ser negativa'),
});

// Schema completo (criação) — com regra de negócio condicional
export const corEstampaSchema = corEstampaBaseSchema.superRefine((data, ctx) => {
    if (data.ind_tipo === 'cor' && !data.val_codigo_hex) {
        ctx.addIssue({
            code: 'custom',
            path: ['val_codigo_hex'],
            message: 'Código hexadecimal é obrigatório quando o tipo for "cor"',
        });
    }
    if (data.ind_tipo === 'estampa' && !data.des_imagem_url) {
        ctx.addIssue({
            code: 'custom',
            path: ['des_imagem_url'],
            message: 'URL da imagem é obrigatória quando o tipo for "estampa"',
        });
    }
});

// Schema para atualização parcial (PUT permite enviar apenas os campos alterados)
export const corEstampaUpdateSchema = corEstampaBaseSchema.partial();

export type CorEstampaInput = z.infer<typeof corEstampaSchema>;
export type CorEstampaUpdateInput = z.infer<typeof corEstampaUpdateSchema>;
```

    ```ts
//src/features/produtos/cor-estampa/types.ts

export type TipoCorEstampa = 'cor' | 'estampa';

export interface CorEstampa {
    id: number;
    nom_cor_estampa: string;
    ind_tipo: TipoCorEstampa;
    val_codigo_hex: string | null;
    des_imagem_url: string | null;
    num_ordem_exibicao: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface CorEstampaListResponse {
    sucesso: boolean;
    total?: number;
    dados: CorEstampa[];
}

export interface CorEstampaResponse {
    sucesso: boolean;
    dados: CorEstampa;
}

export interface CorEstampaCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: CorEstampa;
}

export interface CorEstampaDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

    ```ts
// src/features/produtos/grade/api.ts

import { httpClient } from '@/lib/http/client';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const GradeProduto = {
    listar: () =>
        httpClient.get<GradeProdutoListResponse>('/api/produtos/grade_produto'),

    buscar: (id: number) =>
        httpClient.get<GradeProdutoResponse>(`/ api / produtos / grade_produto / ${ id } `),

    criar: (data: GradeProdutoInput) =>
        httpClient.post<GradeProdutoCreateResponse>('/api/produtos/grade_produto', data),

    atualizar: (id: number, data: GradeProdutoUpdateInput) =>
        httpClient.put<GradeProdutoUpdateResponse>(`/ api / produtos / grade_produto / ${ id } `, data),

    deletar: (id: number) =>
        httpClient.delete<GradeProdutoDeleteResponse>(`/ api / produtos / grade_produto / ${ id } `),
};
```

    ```ts
// src/features/produtos/grade/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GradeProduto } from './api';
import { gradeProdutoKeys } from './queryKeys';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const useGradesProduto = () => {
    return useQuery<GradeProdutoListResponse>({
        queryKey: gradeProdutoKeys.all,
        queryFn: GradeProduto.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGradeProduto = (id: number) => {
    return useQuery<GradeProdutoResponse>({
        queryKey: gradeProdutoKeys.detail(id),
        queryFn: () => GradeProduto.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoCreateResponse, unknown, GradeProdutoInput>({
        mutationFn: (data) => GradeProduto.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
    });
};

export const useAtualizarGradeProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoUpdateResponse, unknown, GradeProdutoUpdateInput>({
        mutationFn: (data) => GradeProduto.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.detail(id) });
        },
    });
};

export const useDeletarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => GradeProduto.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
        onError: (error) => {
            console.error('Erro ao deletar grade: ', error)
        }
    });
};
```

    ```ts
// src/features/produtos/grade/queryKeys.ts

export const gradeProdutoKeys = {
    all: ['grade-produto'] as const,
    detail: (id: number) => ['grade-produto', id] as const,
};
```

    ```ts
// src/features/produtos/grade/schema.ts
import { z } from 'zod';

export const gradeProdutoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione o produto' })
        .int()
        .positive('Selecione o produto'),

    id_variacao_cor_estampa: z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    id_tamanho: z
        .number({ error: 'Selecione o tamanho' })
        .int()
        .positive('Selecione o tamanho'),

    num_sku: z
        .string()
        .max(50, 'SKU deve ter no máximo 50 caracteres')
        .nullable()
        .optional(),

    val_preco_variacao: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O preço não pode ser negativo')
        .nullable()
        .optional(),

    ind_ativo: z.boolean().default(true),

    num_codigo_barras: z
        .string()
        .max(100, 'Código de barras deve ter no máximo 100 caracteres')
        .nullable()
        .optional(),
});

export type GradeProdutoInput = z.infer<typeof gradeProdutoSchema>;

// Schema para atualização parcial (ex.: PUT só com num_sku, como no seu exemplo)
export const gradeProdutoUpdateSchema = gradeProdutoSchema.partial();
export type GradeProdutoUpdateInput = z.infer<typeof gradeProdutoUpdateSchema>;
```

    ```ts
// src/features/produtos/grade/types.ts

export interface GradeProduto {
    id: number;
    id_produto: number;
    id_variacao_cor_estampa: number | null;
    id_tamanho: number;
    num_sku: string | null;
    val_preco_variacao: string | null; // decimal vem como string do MySQL
    ind_ativo: number; // tinyint(1): 0 ou 1
    num_codigo_barras: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface GradeProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: GradeProduto[];
}

export interface GradeProdutoResponse {
    sucesso: boolean;
    dados: GradeProduto;
}

export interface GradeProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

formulário tem os seguintes campos no banco de dados:
```sql
CREATE TABLE tab_agendamento (
  id int NOT NULL AUTO_INCREMENT,
  des_url_externa char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  id_paciente int NOT NULL,
  id_costureira int NOT NULL,
  id_secretaria int DEFAULT NULL,
  dta_agendamento datetime NOT NULL,
  des_observacoes_geral text COLLATE utf8mb4_unicode_ci,
  des_observacoes_costureira text COLLATE utf8mb4_unicode_ci,
  ind_status enum('agendado','confirmado','concluido','cancelado','falta') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'agendado',
  ind_paciente_compareceu tinyint(1) DEFAULT NULL,
  dta_confirmacao datetime DEFAULT NULL,
  dta_conclusao datetime DEFAULT NULL,
  dta_cancelamento datetime DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  ind_slot_ativo tinyint GENERATED ALWAYS AS (if(((ind_status <> _utf8mb4'cancelado') and (deleted_at is null)),1,NULL)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_agendamento_uuid (des_url_externa),
  UNIQUE KEY uq_agenda_costureira_slot (id_costureira,dta_agendamento,ind_slot_ativo),
  KEY idx_paciente (id_paciente),
  KEY idx_costureira (id_costureira),
  KEY idx_secretaria (id_secretaria),
  KEY idx_data (dta_agendamento),
  KEY idx_status (ind_status),
  KEY idx_costureira_ativa (id_costureira,ind_status,deleted_at),
  KEY idx_agenda_data_status (dta_agendamento,ind_status),
  CONSTRAINT tab_agendamento_ibfk_1 FOREIGN KEY (id_paciente) REFERENCES tab_pessoas (id),
  CONSTRAINT tab_agendamento_ibfk_2 FOREIGN KEY (id_costureira) REFERENCES tab_pessoas (id),
  CONSTRAINT tab_agendamento_ibfk_3 FOREIGN KEY (id_secretaria) REFERENCES tab_pessoas (id),
  CONSTRAINT chk_data_futura CHECK ((dta_agendamento > created_at))
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_agendamento_item (
  id int NOT NULL AUTO_INCREMENT,
  id_agendamento int NOT NULL,
  id_tipo_agendamento int NOT NULL,
  id_produto_grade int NOT NULL,
  id_produto_servico int NOT NULL,
  des_ajuste_produto text COLLATE utf8mb4_unicode_ci,
  val_preco_servico decimal(10,2) DEFAULT NULL,
  val_desconto_servico decimal(10,2) NOT NULL DEFAULT '0.00',
  ind_status enum('pendente','producao','concluido','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_agendamento (id_agendamento),
  KEY idx_produto_grade (id_produto_grade),
  KEY idx_status (ind_status),
  KEY tab_produto_agendamento_tab_produto_servico_FK (id_produto_servico),
  KEY tab_produto_agendamento_tab_tipo_agendamento_FK (id_tipo_agendamento),
  CONSTRAINT tab_agendamento_item_ibfk_1 FOREIGN KEY (id_agendamento) REFERENCES tab_agendamento (id),
  CONSTRAINT tab_agendamento_item_ibfk_2 FOREIGN KEY (id_produto_grade) REFERENCES tab_produto_grade (id),
  CONSTRAINT tab_produto_agendamento_tab_produto_servico_FK FOREIGN KEY (id_produto_servico) REFERENCES tab_produto_servico (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT tab_produto_agendamento_tab_tipo_agendamento_FK FOREIGN KEY (id_tipo_agendamento) REFERENCES tab_tipo_agendamento (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_agendamento_item_fotos (
  id int NOT NULL AUTO_INCREMENT,
  id_produto_agendamento int NOT NULL,
  des_caminho_arquivo varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  nom_original varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_tamanho_bytes int NOT NULL,
  ind_tipo_foto enum('antes','depois') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_produto_agendamento (id_produto_agendamento),
  CONSTRAINT tab_agendamento_item_fotos_ibfk_1 FOREIGN KEY (id_produto_agendamento) REFERENCES tab_agendamento_item (id) ON DELETE CASCADE
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_pessoas (
  id int NOT NULL AUTO_INCREMENT,
  id_cidade int NOT NULL,
  ind_status enum('ativo','inativo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativo',
  nom_completo varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_cpf varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_rg varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  dta_nascimento date NOT NULL,
  des_logradouro varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_endereco varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  des_complemento varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  num_cep varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  nom_bairro varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_celular_1 varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  ind_whatsapp_1 tinyint(1) NOT NULL DEFAULT (true),
  num_celular_2 varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  ind_whatsapp_2 tinyint(1) NOT NULL DEFAULT (true),
  des_email_1 varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  des_email_2 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_senha varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  num_tentativas_login int DEFAULT '0',
  dta_ultimo_login datetime DEFAULT NULL,
  dta_bloqueio_login datetime DEFAULT NULL,
  ind_medico tinyint(1) NOT NULL DEFAULT '0',
  ind_secretaria tinyint(1) NOT NULL DEFAULT '0',
  ind_costureira tinyint(1) NOT NULL DEFAULT '0',
  ind_paciente tinyint(1) NOT NULL DEFAULT '0',
  ind_administrador tinyint(1) NOT NULL DEFAULT '0',
  val_cor_hex varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Valor em hexadecimal da cor atribuida a uma costureira',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY num_cpf (num_cpf),
  KEY id_cidade (id_cidade),
  KEY idx_status (ind_status),
  KEY idx_tab_pessoas_ind_medico (ind_medico),
  KEY idx_tab_pessoas_ind_secretaria (ind_secretaria),
  KEY idx_tab_pessoas_ind_costureira (ind_costureira),
  KEY idx_tab_pessoas_ind_paciente (ind_paciente),
  KEY idx_tab_pessoas_ind_administrador (ind_administrador),
  CONSTRAINT tab_pessoas_ibfk_1 FOREIGN KEY (id_cidade) REFERENCES tab_cidade (id),
  CONSTRAINT chk_cep_length CHECK ((length(num_cep) = 8)),
  CONSTRAINT chk_cpf_length CHECK ((length(num_cpf) = 11)),
  CONSTRAINT chk_tab_pessoas_ao_menos_um_papel CHECK (((ind_medico = 1) or (ind_secretaria = 1) or (ind_costureira = 1) or (ind_paciente = 1) or (ind_administrador = 1)))
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_produto_grade (
  id int NOT NULL AUTO_INCREMENT,
  id_produto int NOT NULL,
  id_variacao_cor_estampa int DEFAULT NULL,
  id_tamanho int NOT NULL,
  num_sku varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  val_preco_variacao decimal(10,2) DEFAULT NULL,
  ind_ativo tinyint(1) DEFAULT '1',
  num_codigo_barras varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  id_cor_unq int GENERATED ALWAYS AS (ifnull(id_variacao_cor_estampa,0)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY num_sku (num_sku),
  UNIQUE KEY uniq_combinacao (id_produto,id_cor_unq,id_tamanho),
  KEY idx_produto (id_produto),
  KEY idx_sku (num_sku),
  KEY id_variacao_cor_estampa (id_variacao_cor_estampa),
  KEY id_tamanho (id_tamanho),
  CONSTRAINT tab_produto_grade_ibfk_1 FOREIGN KEY (id_produto) REFERENCES tab_produtos (id) ON DELETE CASCADE,
  CONSTRAINT tab_produto_grade_ibfk_2 FOREIGN KEY (id_variacao_cor_estampa) REFERENCES tab_variacoes_cor_estampa (id),
  CONSTRAINT tab_produto_grade_ibfk_3 FOREIGN KEY (id_tamanho) REFERENCES tab_tamanhos (id)
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_produto_servico (
  id int NOT NULL AUTO_INCREMENT,
  id_produto int NOT NULL,
  id_tipo_servico int NOT NULL,
  ind_ativo tinyint(1) NOT NULL DEFAULT '1',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_tab_produto_servico_tab_produtos1_idx (id_produto),
  KEY fk_tab_produto_servico_tab_tipo_servico1_idx (id_tipo_servico),
  CONSTRAINT fk_tab_produto_servico_tab_produtos1 FOREIGN KEY (id_produto) REFERENCES tab_produtos (id),
  CONSTRAINT fk_tab_produto_servico_tab_tipo_servico1 FOREIGN KEY (id_tipo_servico) REFERENCES tab_tipo_servico (id)
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_tipo_agendamento (
  id int NOT NULL AUTO_INCREMENT,
  des_tipo_agendamento varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  ind_ativo tinyint(1) DEFAULT '1',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB
```
    ```sql
CREATE TABLE tab_produto_servico (
  id int NOT NULL AUTO_INCREMENT,
  id_produto int NOT NULL,
  id_tipo_servico int NOT NULL,
  ind_ativo tinyint(1) NOT NULL DEFAULT '1',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_tab_produto_servico_tab_produtos1_idx (id_produto),
  KEY fk_tab_produto_servico_tab_tipo_servico1_idx (id_tipo_servico),
  CONSTRAINT fk_tab_produto_servico_tab_produtos1 FOREIGN KEY (id_produto) REFERENCES tab_produtos (id),
  CONSTRAINT fk_tab_produto_servico_tab_tipo_servico1 FOREIGN KEY (id_tipo_servico) REFERENCES tab_tipo_servico (id)
) ENGINE=InnoDB
```

    ```tsx
// src/app/(private)/agendamento/agendamento-form.tsx

'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

import { agendamentoSchema, AgendamentoInput } from '@/features/agendamentos/agendamento/schema';
import type { Pessoa } from '@/features/pessoas/types';

interface AgendamentoFormProps {
    defaultValues: AgendamentoInput;
    onSubmit: (values: AgendamentoInput) => void;
    submitting?: boolean;
    opcoesPacientes: Pessoa[];
    opcoesCostureiras: Pessoa[];
}

// API: "YYYY-MM-DD HH:mm:ss"  <->  input datetime-local: "YYYY-MM-DDTHH:mm"
const paraInput = (v: string) => (v ? v.replace(' ', 'T').slice(0, 16) : '');
const daInput = (v: string) => (v ? `${ v.replace('T', ' ') }:00` : '');

function Campo({ label, erro, children }: { label: string; erro?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {erro && <p className="text-xs text-destructive">{erro}</p>}
        </div>
    );
}

export function AgendamentoForm({
    defaultValues,
    onSubmit,
    submitting,
    opcoesPacientes,
    opcoesCostureiras,
}: AgendamentoFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AgendamentoInput>({
        resolver: zodResolver(agendamentoSchema),
        defaultValues,
    });

    // O dialog reaproveita o componente: ressincroniza quando data/costureira vêm do clique na agenda
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Campo label="Paciente" erro={errors.id_paciente?.message}>
                <Controller
                    control={control}
                    name="id_paciente"
                    render={({ field }) => (
                        <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(v) => field.onChange(v ? Number(v) : 0)}
                        >
                            <SelectTrigger className="w-full">
                                {opcoesPacientes.find((p) => p.id === field.value)?.nom_completo ??
                                    'Selecione o paciente'}
                            </SelectTrigger>
                            <SelectContent>
                                {opcoesPacientes.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.nom_completo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Campo>

            <Campo label="Costureira" erro={errors.id_costureira?.message}>
                <Controller
                    control={control}
                    name="id_costureira"
                    render={({ field }) => (
                        <Select
                            value={field.value ? String(field.value) : ''}
                            onValueChange={(v) => field.onChange(v ? Number(v) : 0)}
                        >
                            <SelectTrigger className="w-full">
                                {opcoesCostureiras.find((c) => c.id === field.value)?.nom_completo ??
                                    'Selecione a costureira'}
                            </SelectTrigger>
                            <SelectContent>
                                {opcoesCostureiras.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.nom_completo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </Campo>

            <Campo label="Data e hora" erro={errors.dta_agendamento?.message}>
                <Controller
                    control={control}
                    name="dta_agendamento"
                    render={({ field }) => (
                        <Input
                            type="datetime-local"
                            step={1800} // passos de 30 min, igual à duração do slot
                            value={paraInput(field.value)}
                            onChange={(e) => field.onChange(daInput(e.target.value))}
                        />
                    )}
                />
            </Campo>

            <Campo label="Observações gerais" erro={errors.des_observacoes_geral?.message}>
                <textarea
                    {...register('des_observacoes_geral')}
                    rows={3}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                />
            </Campo>

            <Campo label="Observações da costureira" erro={errors.des_observacoes_costureira?.message}>
                <textarea
                    {...register('des_observacoes_costureira')}
                    rows={3}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                />
            </Campo>

            <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
```

```ts
// src/lib/utils/formatters.ts
// Formatação de dados para exibição e manipulação

export const formatarCNPJ = (cnpj: string): string => {
    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) return cnpj;
    return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const formatarCPF = (cpf: string): string => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return cpf;
    return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

export const formatarCEP = (cep: string): string => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return cep;
    return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export const formatarTelefone = (telefone: string): string => {
    const clean = telefone.replace(/\D/g, '');
    if (clean.length === 10) {
        return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (clean.length === 11) {
        return clean.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
    }
    return telefone;
};

export const toDate = (data?: string | Date | null): Date | null => {
    if (!data) return null;
    const d = data instanceof Date ? data : new Date(data);
    return isNaN(d.getTime()) ? null : d;
};

export const formatarData = (data: string | Date): string => {
    const d = toDate(data);
    if (!d) return '-';
    return `${d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })} ${d.toLocaleTimeString('pt-BR', { timeZone: 'UTC' })}`;
};

export const formatarDataInput = (data?: string | Date | null): string => {
    const d = toDate(data);
    if (!d) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const minutosParaHHMM = (minutos: string | number): string => {
    const total = Number(minutos) || 0;
    const h = Math.floor(total / 60).toString().padStart(2, '0');
    const m = (total % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};

export const hhmmParaMinutos = (hhmm: string): string => {
    const [h, m] = hhmm.split(':').map(Number);
    return String((h || 0) * 60 + (m || 0));
};

export const formatarDataBR = (data?: string | Date | null): string => {
    const d = toDate(data);
    return d ? d.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
};


// Formata um número para string monetária de exibição (ex: 1234.5 -> "1.234,50")
export function formatarMoedaInput(valor: number): string {
    if (isNaN(valor)) return '';
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Converte a string digitada (com máscara) para number puro
// Estratégia: mantém apenas dígitos e trata os 2 últimos como centavos
export function parseMoedaInput(texto: string): number {
    const somenteDigitos = texto.replace(/\D/g, '');
    if (!somenteDigitos) return 0;
    return Number(somenteDigitos) / 100;
};

export const somenteDigitos = (valor: string): string => valor.replace(/\D/g, '');

export function formatarDataParaAPI(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${ano}-${mes}-${dia}`;
}
```