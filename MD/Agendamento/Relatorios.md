No relatório vou precisar dos seguintes campos abaixo, antes de gerar o código quais informações você precisa para gerar o relatório:
- "Atedimento agendado para 16/11/2026 as 10:00"
- Logo da empresa,
- CPF do paciente,
- Nome do Paciente,
- Telefone do Paciente,
- WhastApp Paciente,
- Tipo de Agendamento,
- Nome Costureira,
- Nome Médico,
- E-mail Paciente,
- Endereço Completo Paciente,
- Itens Agendamento
    - Tipo de Serviço Item
    - Tipo Agendamento Item
    - Nome Produto Agendamento Item
    - Cor e Estampa e Tamanho Item
    - Preço Serviço Item
    - Valor Desconto Item
    - Total Preço Item
- Assinatura do Cliente
- Assinatura da Secretaria
- Assinatura da Costureira
_______

1. Dados do paciente
```ts
//src/features/pessoas/api.ts

import { httpClient } from '@/lib/http/client';
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

export const Pessoas = {
    listar: () => httpClient.get<PessoaListResponse>('/api/pessoas'),

    listarPorPapel: (tipo: TipoPapelPessoa) => httpClient.get<PessoaListResponse>(`/api/pessoas/papel/${tipo}`),

    buscar: (id: number) => httpClient.get<PessoaResponse>(`/api/pessoas/${id}`),

    criar: (data: PessoaInput) => httpClient.post<PessoaCreateResponse>('/api/pessoas', data),

    atualizar: (id: number, data: PessoaInput) => httpClient.put<PessoaUpdateResponse>(`/api/pessoas/${id}`, data),

    deletar: (id: number) => httpClient.delete<PessoaDeleteResponse>(`/api/pessoas/${id}`),

    ativar: (id: number) => httpClient.patch<PessoaAtivarResponse>(`/api/pessoas/${id}/ativar`),

    desativar: (id: number) => httpClient.patch<PessoaDesativarResponse>(`/api/pessoas/${id}/desativar`),
};
```
```ts
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
```
```ts
//src/features/pessoas/queryKeys.ts
import { TipoPapelPessoa } from './types';

export const pessoasKeys = {
    all: ['pessoas'] as const,
    detail: (id: number) => ['pessoas', id] as const,
    porPapel: (tipo: TipoPapelPessoa) => ['pessoas', 'papel', tipo] as const,
};
```
```ts
//src/features/pessoas/schema.ts
import { z } from 'zod';

// Normaliza valores que podem vir como boolean OU como 0/1 (number/string)
const booleanFlexivel = z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (val === 1 || val === '1') return true;
    if (val === 0 || val === '0') return false;
    return val;
}, z.boolean());

const stringOpcionalNullable = (schema: z.ZodString) =>
    z.preprocess((val) => (val === '' || val === undefined ? null : val), schema.nullable());

export const pessoaSchema = z
    .object({
        id_cidade: z.number({ message: 'Cidade é obrigatória' }).int().positive(),

        ind_status: z.enum(['ativo', 'inativo']).default('ativo'),

        nom_completo: z
            .string()
            .min(3, 'Nome completo deve ter ao menos 3 caracteres')
            .max(255),

        num_cpf: z
            .string()
            .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos'),

        num_rg: z.string().min(1, 'RG é obrigatório').max(20),

        dta_nascimento: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (yyyy-MM-dd)'),

        des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(255),
        num_endereco: z.string().min(1, 'Número é obrigatório').max(10),
        des_complemento: z.string().max(100).optional().nullable(),

        num_cep: z
            .string()
            .regex(/^\d{8}$/, 'CEP deve conter exatamente 8 dígitos'),

        nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),

        num_celular_1: z
            .string()
            .regex(/^\d{10,11}$/, 'Celular inválido'),
        ind_whatsapp_1: booleanFlexivel.default(true),

        num_celular_2: stringOpcionalNullable(
            z.string().regex(/^\d{10,11}$/, 'Celular inválido')),
        ind_whatsapp_2: booleanFlexivel.default(true),

        des_email_1: z.string().email('E-mail inválido').max(255),
        des_email_2: stringOpcionalNullable(
            z.string().email('E-mail inválido').max(255)
        ),

        // Opcional: na edição, se vazio, o backend deve manter a senha atual
        des_senha: z
            .string()
            .min(6, 'Senha deve ter ao menos 6 caracteres')
            .optional()
            .or(z.literal('')),

        ind_medico: booleanFlexivel.default(false),
        ind_secretaria: booleanFlexivel.default(false),
        ind_costureira: booleanFlexivel.default(false),
        ind_paciente: booleanFlexivel.default(false),
        ind_administrador: booleanFlexivel.default(false),

        val_cor_hex: stringOpcionalNullable(
            z.string().regex(/^[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (ex: FFFFFF)')),
    })
    // Reflete a CHECK constraint chk_tab_pessoas_ao_menos_um_papel do banco
    .refine(
        (data) =>
            data.ind_medico ||
            data.ind_secretaria ||
            data.ind_costureira ||
            data.ind_paciente ||
            data.ind_administrador,
        {
            message: 'Selecione ao menos um papel (médico, secretária, costureira, paciente ou administrador)',
            path: ['ind_medico'],
        }
    );

export type PessoaInput = z.infer<typeof pessoaSchema>;
```
```ts
//src/features/pessoas/types.ts

export type StatusPessoa = 'ativo' | 'inativo';

export type TipoPapelPessoa = 'administrador' | 'medico' | 'paciente' | 'costureira' | 'secretaria';

export interface Pessoa {
    id: number;
    id_cidade: number;
    ind_status: StatusPessoa;
    nom_completo: string;
    num_cpf: string;
    num_rg: string;
    dta_nascimento: string;
    des_logradouro: string;
    num_endereco: string;
    des_complemento: string | null;
    num_cep: string;
    nom_bairro: string;
    num_celular_1: string;
    ind_whatsapp_1: number;
    num_celular_2: string | null;
    ind_whatsapp_2: number;
    des_email_1: string;
    des_email_2: string | null;
    // des_senha nunca deveria voltar em respostas de listagem/detalhe,
    // mas deixamos tipado como opcional por segurança/contrato.
    des_senha?: string;
    num_tentativas_login: number;
    dta_ultimo_login: string | null;
    dta_bloqueio_login: string | null;
    ind_medico: number;
    ind_secretaria: number;
    ind_costureira: number;
    ind_paciente: number;
    ind_administrador: number;
    val_cor_hex: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // Campos vindos de JOIN com tab_cidade / tab_estado
    nom_cidade?: string;
    nom_estado?: string;
    sgl_estado?: string;
}

export interface PessoaListResponse {
    sucesso: boolean;
    total: number;
    dados: Pessoa[];
}

export interface PessoaResponse {
    sucesso: boolean;
    dados: Pessoa;
}

export interface PessoaCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Pessoa;
}

export interface PessoaUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Pessoa;
}

export interface PessoaDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}

export interface PessoaAtivarResponse {
    sucesso: boolean;
    mensagem: string;
}

export interface PessoaDesativarResponse {
    sucesso: boolean;
    mensagem: string;
}
```
- Endereço = des_logradouro, num_endereco, des_complemento, nom_bairro, nom_cidade('tab_cidade'), sgl_estado(tab_estado), num_cep
```ts
//src/features/parametrizacao/cidades/api.ts

import { httpClient } from '@/lib/http/client';
import { CidadeResponse } from './types';

export const Cidades = {
    listar: () => httpClient.get<CidadeResponse>('/api/sistema/cidades'),
}
```
```ts
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
```
```ts
//src/features/parametrizacao/cidades/queryKeys.ts

export const cidadeKeys = {
    all: ['cidades'] as const,
    // detail: (id: number) => ['cidade', id] as const,
    // byNome: (nome: string) => ['cidades', 'nome', nome] as const,
    // byEstado: (estadoId: number) => ['cidades', 'estado', estadoId] as const,
};
```
```ts
//src/features/parametrizacao/cidades/schema.ts
import { z } from 'zod';

export const cidadeSchema = z.object({
    id: z.int(),
    id_estado: z.int(),
    nom_cidade: z.string(),
    cod_municipio_ibge: z.string()
})

export type CidadeInput = z.infer<typeof cidadeSchema>;
```
```ts
//src/features/parametrizacao/cidades/types.ts
export interface Cidade {
    id: number;
    nom_cidade: string;
    cod_municipio_ibge: string;
    id_estado: number;
    nom_estado: string;
    sgl_estado: string;

}

export interface CidadeResponse {
    sucesso: boolean;
    cidades?: number;
    dados: Cidade[];
}
```


```ts
//src/features/parametrizacao/estados/api.tsimport { EstadoResponse, Estado } from './types';

import { httpClient } from "@/lib/http/client";
import { EstadoResponse } from "./types";


export const Estados = {
    listar: () => httpClient.get<EstadoResponse>('/api/sistema/estados'),
}
```
```ts
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
```
```ts
//src/features/parametrizacao/estados/queryKeys.ts

export const estadoKeys = {
    all: ['estados'] as const,
    detail: (id: number) => ['estado', id] as const,
};
```
```ts
//src/features/parametrizacao/estados/schema.ts
import { z } from 'zod';

export const EstadoSchema = z.object({
    id: z.number(),
    nom_estado: z.string(),
    sgl_estado: z.string(),
});

export type Estado = z.infer<typeof EstadoSchema>;
```
```ts
//src/features/parametrizacao/estados/types.ts
export interface Estado {
    id: number;
    nom_estado: string;
    sgl_estado: string;
}

export interface EstadoResponse {
    sucesso: boolean;
    estados?: number;
    dados: Estado[];
}
```
- Telefone = num_celular_1 e WhatsApp = num_celular_1 são campos distintos

2. Tipo de agendamento
- id_tipo_agendamento
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
3. Cor, estampa e tamanho do item
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
        httpClient.get<GradeProdutoResponse>(`/api/produtos/grade_produto/${id}`),

    criar: (data: GradeProdutoInput) =>
        httpClient.post<GradeProdutoCreateResponse>('/api/produtos/grade_produto', data),

    atualizar: (id: number, data: GradeProdutoUpdateInput) =>
        httpClient.put<GradeProdutoUpdateResponse>(`/api/produtos/grade_produto/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<GradeProdutoDeleteResponse>(`/api/produtos/grade_produto/${id}`),
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
        httpClient.get<CorEstampaResponse>(`/api/produtos/cor_estampa/${id}`),

    criar: (data: CorEstampaInput) =>
        httpClient.post<CorEstampaCreateResponse>('/api/produtos/cor_estampa', data),

    atualizar: (id: number, data: CorEstampaUpdateInput) =>
        httpClient.put<CorEstampaResponse>(`/api/produtos/cor_estampa/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<CorEstampaDeleteResponse>(`/api/produtos/cor_estampa/${id}`),
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
// src/features/produtos/tamanho/api.ts

import { httpClient } from '@/lib/http/client';
import {
    TamanhoListResponse,
    TamanhoResponse,
    TamanhoCreateResponse,
    TamanhoUpdateResponse,
    TamanhoDeleteResponse,
} from './types';
import { TamanhoInput, TamanhoUpdateInput } from './schema';

export const Tamanhos = {
    listar: () => httpClient.get<TamanhoListResponse>('/api/produtos/tamanho'),

    buscar: (id: number) => httpClient.get<TamanhoResponse>(`/api/produtos/tamanho/${id}`),

    criar: (data: TamanhoInput) =>
        httpClient.post<TamanhoCreateResponse>('/api/produtos/tamanho', data),

    atualizar: (id: number, data: TamanhoUpdateInput) =>
        httpClient.put<TamanhoUpdateResponse>(`/api/produtos/tamanho/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<TamanhoDeleteResponse>(`/api/produtos/tamanho/${id}`),
};
```
```ts
// src/features/produtos/tamanho/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tamanhos } from './api';
import { tamanhoKeys } from './queryKeys';
import {
    TamanhoListResponse,
    TamanhoResponse,
    TamanhoCreateResponse,
    TamanhoUpdateResponse,
    TamanhoDeleteResponse,
} from './types';
import { TamanhoInput, TamanhoUpdateInput } from './schema';

export const useTamanhos = () => {
    return useQuery<TamanhoListResponse>({
        queryKey: tamanhoKeys.all,
        queryFn: Tamanhos.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTamanho = (id: number) => {
    return useQuery<TamanhoResponse>({
        queryKey: tamanhoKeys.detail(id),
        queryFn: () => Tamanhos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTamanho = () => {
    const queryClient = useQueryClient();

    return useMutation<TamanhoCreateResponse, unknown, TamanhoInput>({
        mutationFn: (data) => Tamanhos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.all });
        },
    });
};

export const useAtualizarTamanho = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TamanhoUpdateResponse, unknown, TamanhoUpdateInput>({
        mutationFn: (data) => Tamanhos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.all });
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.detail(id) });
        },
    });
};

export const useDeletarTamanho = () => {
    const queryClient = useQueryClient();

    return useMutation<TamanhoDeleteResponse, unknown, number>({
        mutationFn: (id) => Tamanhos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tamanhoKeys.all });
        },
    });
};
```
```ts
// src/features/produtos/tamanho/queryKeys.ts

export const tamanhoKeys = {
    all: ['tamanhos'] as const,
    detail: (id: number) => ['tamanhos', id] as const,
};
```
```ts
// src/features/produtos/tamanho/schema.ts
import { z } from 'zod';

const categoriasTamanho = ['vestuario', 'calcados', 'acessorios', 'outros'] as const;

export const tamanhoSchema = z.object({
    cod_tamanho: z
        .string()
        .min(1, 'Código é obrigatório')
        .max(10, 'Código deve ter no máximo 10 caracteres'),
    des_tamanho: z
        .string()
        .max(50, 'Descrição deve ter no máximo 50 caracteres')
        .nullable()
        .optional(),
    des_categoria_tamanho: z.enum(categoriasTamanho).nullable().optional(),
    num_ordem_exibicao: z.number().int('Ordem deve ser um número inteiro'),
});

export type TamanhoInput = z.infer<typeof tamanhoSchema>;

// Schema para atualização parcial (permite enviar apenas alguns campos, ex.: só num_ordem_exibicao)
export const tamanhoUpdateSchema = tamanhoSchema.partial();

export type TamanhoUpdateInput = z.infer<typeof tamanhoUpdateSchema>;
```
```ts
// src/features/produtos/tamanho/types.ts

export type CategoriaTamanho = 'vestuario' | 'calcados' | 'acessorios' | 'outros';

export interface Tamanho {
    id: number;
    cod_tamanho: string;
    des_tamanho: string | null;
    des_categoria_tamanho: CategoriaTamanho | null;
    num_ordem_exibicao: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface TamanhoListResponse {
    sucesso: boolean;
    total?: number;
    dados: Tamanho[];
}

export interface TamanhoResponse {
    sucesso: boolean;
    dados: Tamanho;
}

// A API retorna um objeto aninhado incomum no create: dados.id contém o registro completo.
export interface TamanhoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: {
        id: Tamanho;
    };
}

export interface TamanhoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Tamanho;
}

export interface TamanhoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```
4. Logo
```ts
// features/parametrizacao/empresa/api.ts
import { httpClient } from '@/lib/http/client';
import { Empresa, EmpresaListResponse, ParametrizacaoListResponse } from './types';
import { EmpresaFormValues } from './schema';

const CAMPOS_IMAGEM = [
    'des_url_logo_vertical',
    'des_url_logo_horizontal',
    'des_url_logo_vertical_negativa',
    'des_url_logo_horizontal_negativa',
] as const;

const CAMPOS_VIRTUAIS = ['nom_estado'] as const;

function removerCamposVirtuais(payload: Record<string, any>): Record<string, any> {
    const resultado = { ...payload };
    CAMPOS_VIRTUAIS.forEach((campo) => delete resultado[campo]);
    return resultado;
}

function normalizarCorPrincipal(payload: Record<string, any>): Record<string, any> {
    const resultado = { ...payload };
    if (typeof resultado.val_cor_principal === 'string') {
        resultado.val_cor_principal = resultado.val_cor_principal.replace('#', '');
    }
    return resultado;
}

function montarFormData(payload: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (CAMPOS_IMAGEM.includes(key as any)) {
            // Só envia se for um File novo. Se for string (url existente), não reenvia.
            if (value instanceof File) {
                formData.append(key, value);
            }
            return;
        }

        if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
}

function possuiNovaImagem(payload: Record<string, any>): boolean {
    return CAMPOS_IMAGEM.some((campo) => payload[campo] instanceof File);
}

export const empresaApi = {
    listar: () => httpClient.get<EmpresaListResponse>('/api/sistema/empresa'),
    buscarPorId: (id: number) => httpClient.get<{ dados: Empresa }>(`/api/sistema/empresa/${id}`),
    criar: (payload: EmpresaFormValues) => {

        const dadosLimpos = normalizarCorPrincipal(removerCamposVirtuais(payload));

        if (possuiNovaImagem(dadosLimpos)) {
            return httpClient.post<Empresa>('/api/sistema/empresa', montarFormData(dadosLimpos));
        }

        return httpClient.post<Empresa>('/api/sistema/empresa', dadosLimpos);
    },
    atualizar: (id: number, payload: Partial<EmpresaFormValues>) => {

        const dadosLimpos = normalizarCorPrincipal(removerCamposVirtuais(payload));

        if (possuiNovaImagem(dadosLimpos)) {
            return httpClient.put<Empresa>(`/api/sistema/empresa/${id}`, montarFormData(payload));
        }

        return httpClient.put<Empresa>(`/api/sistema/empresa/${id}`, dadosLimpos);
    },
    deletar: (id: number) => httpClient.delete(`/api/sistema/empresa/${id}`),
    listarHorarios: (idEmpresa: number) => httpClient.get<ParametrizacaoListResponse>(`/api/sistema/parametrizacao`),
};
```
```ts
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
```
```ts
// features/parametrizacao/empresa/queryKeys.ts

export const empresaKeys = {
    all: ['empresas'] as const,
    list: (params?: Record<string, unknown>) => ['empresas', 'list', params] as const,
    detail: (id: number) => ['empresas', 'detail', id] as const,
    horarios: (idEmpresa: number) => ['empresas', idEmpresa, 'horarios'] as const,
};
```
```ts
// features/parametrizacao/empresa/schema.ts
import { z } from 'zod';

const somenteDigitos = (v: string) => v.replace(/\D/g, '');

const imagemField = z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional();

export const empresaSchema = z.object({
    nom_fantasia: z.string().min(1, 'Nome Fantasia é obrigatório').max(100),
    nom_razao_social: z.string().min(1, 'Razão Social é obrigatória').max(100),
    num_cnpj: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos'),
    num_inscricao_estadual: z.string().max(20).optional().nullable().transform((v) => v === '' ? null : v),
    dta_abertura: z.string().min(1, 'Data de abertura é obrigatória'),
    num_cep: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 8, 'CEP deve ter 8 dígitos'),
    des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(45),
    num_endereco: z.string().max(255).optional().nullable(),
    des_complemento: z.string().max(100).optional().nullable(),
    nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),
    num_celular_1: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length >= 10, 'Celular inválido'),
    ind_whatsapp_1: z.boolean().default(false),
    num_celular_2: z.string().optional().nullable(),
    ind_whatsapp_2: z.boolean().default(false),
    des_email_1: z.string().email('E-mail inválido'),
    des_email_2: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
    val_cor_principal: z.string().optional().nullable().transform((v) => (v ? v.replace('#', '') : v)),
    nom_estado: z.string().min(1, 'Estado é obrigatório'),
    id_cidade: z.coerce.number({ invalid_type_error: 'Cidade é obrigatória' }).min(1, 'Cidade é obrigatória'),
    ind_ativo: z.boolean().default(true),
    des_url_logo_vertical: imagemField,
    des_url_logo_horizontal: imagemField,
    des_url_logo_vertical_negativa: imagemField,
    des_url_logo_horizontal_negativa: imagemField,
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
```
```ts
// features/parametrizacao/empresa/types.ts

export interface Empresa {
    id: number;
    id_cidade: number;
    nom_fantasia: string;
    nom_razao_social: string;
    num_cnpj: string;
    num_inscricao_estadual: string | null;
    dta_abertura: string; // ISO date
    des_logradouro: string;
    num_endereco: string | null;
    des_complemento: string | null;
    num_cep: string;
    nom_bairro: string;
    num_celular_1: string;
    ind_whatsapp_1: 0 | 1;
    num_celular_2: string | null;
    ind_whatsapp_2: 0 | 1;
    des_email_1: string;
    des_email_2: string | null;
    val_cor_principal: string | null;
    des_url_logo_vertical: string | null;
    des_url_logo_horizontal: string | null;
    des_url_logo_vertical_negativa: string | null;
    des_url_logo_horizontal_negativa: string | null;
    ind_ativo: 0 | 1;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // Campos derivados vindos do JOIN com cidade/estado (somente leitura na listagem)
    nom_cidade?: string;
    nom_estado?: string;
    sgl_estado?: string;
}

export interface EmpresaListResponse {
    dados: Empresa[];
    total?: number;
}

export interface ParametrizacaoHorario {
    id: number;
    id_empresa: number; // assunção - ver nota no topo da resposta
    des_tipo_dia: 'UTIL' | 'SABADO';
    hra_inicio: string; // HH:mm:ss
    hra_fim: string; // HH:mm:ss
    qtd_minutos_intervalo: string; // HH:mm:ss
    ind_ativo: 0 | 1;
    created_at: string;
    updated_at: string | null;
}

export interface ParametrizacaoListResponse {
    dados: ParametrizacaoHorario[];
}
```
5. Assinaturas
- Serão linhas em branco com o nome embaixo para assinar à mão (cliente, secretaria e costureira)

6. Layout e dados
Preferência de layout: A4 retrato, com cabeçalho (logo e título), blocos de paciente, equipe e itens em tabela, total geral no final e assinaturas por último
______


```json
{
    "sucesso": true,
    "dados": {
        "id": 22,
        "des_url_externa": "fe99c14c-593e-48a3-aaa2-b293e65775ae",
        "id_paciente": 9,
        "id_costureira": 3,
        "id_secretaria": null,
        "id_medico": 7,
        "dta_agendamento": "2026-11-16T11:30:00.000Z",
        "des_observacoes_geral": "Agendamento 16/11/2026",
        "des_observacoes_costureira": "Agendamento 16/11/2026",
        "ind_status": "agendado",
        "ind_paciente_compareceu": null,
        "dta_confirmacao": "2026-11-14T05:57:00.000Z",
        "dta_conclusao": null,
        "dta_cancelamento": null,
        "created_at": "2026-11-14T05:14:58.000Z",
        "updated_at": "2026-11-15T08:26:47.000Z",
        "deleted_at": null,
        "ind_slot_ativo": 1,
        "nom_paciente": "Paciente 1",
        "num_celular_paciente": "62789456123",
        "nom_costureira": "Costureira 1",
        "val_cor_costureira": "FF6B6B",
        "nom_secretaria": null,
        "nom_medico": "Médico 1",
        "itens": [
            {
                "id": 6,
                "id_agendamento": 22,
                "id_tipo_agendamento": 1,
                "id_produto_grade": 2,
                "id_produto_servico": 1,
                "des_ajuste_produto": null,
                "val_preco_servico": "100.01",
                "val_desconto_servico": "0.00",
                "ind_status": "concluido",
                "created_at": "2026-11-14T05:15:08.000Z",
                "updated_at": "2026-11-14T05:53:41.000Z",
                "deleted_at": null,
                "num_sku": "BOOD109PB",
                "nom_produto": "Cintura alta com colchetes",
                "des_tipo_ajuste": "Ajuste pc grande 3º"
            }
        ]
    }
}
```
```json
{
    "sucesso": true,
    "mensagem": 1,
    "dados": [
        {
            "id": 1,
            "id_cidade": 5418,
            "ind_ativo": 1,
            "nom_fantasia": "Bood Accessoria",
            "nom_razao_social": "Bood Accessoria",
            "num_cnpj": "34374667000176",
            "num_inscricao_estadual": "205461964",
            "dta_abertura": "2020-08-19T03:00:00.000Z",
            "des_logradouro": "Rua C13",
            "num_endereco": "0",
            "des_complemento": "QD 58 LT 15",
            "num_cep": "74365690",
            "nom_bairro": "Setor Novo Horizonte",
            "num_celular_1": "62999999999",
            "ind_whatsapp_1": 1,
            "num_celular_2": "62988888888",
            "ind_whatsapp_2": 1,
            "des_email_1": "contato@boodacessoria.com.br",
            "des_email_2": "",
            "val_cor_principal": "6e2aa7",
            "des_url_logo_vertical": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429176-155775182.jpg",
            "des_url_logo_horizontal": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429171-973289006.jpg",
            "des_url_logo_vertical_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429179-322982734.jpg",
            "des_url_logo_horizontal_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429182-480855710.jpg",
            "created_at": "2026-08-01T21:57:09.000Z",
            "updated_at": "2026-11-10T14:23:11.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 2,
    "dados": [
        {
            "id": 3,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Costureira 1",
            "num_cpf": "64002558185",
            "num_rg": "987654321",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62123456789",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "costureira1@bood.com",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 1,
            "ind_paciente": 0,
            "ind_administrador": 0,
            "val_cor_hex": "FF6B6B",
            "created_at": "2026-11-11T04:31:13.000Z",
            "updated_at": "2026-11-11T04:31:13.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 4,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Costureira 2",
            "num_cpf": "06011045103",
            "num_rg": "654897321",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62123456789",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "costureira2@bood.com",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 1,
            "ind_paciente": 0,
            "ind_administrador": 0,
            "val_cor_hex": "FF9F68",
            "created_at": "2026-11-11T04:33:24.000Z",
            "updated_at": "2026-11-11T04:33:24.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 6,
    "dados": [
        {
            "id": 9,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Paciente 1",
            "num_cpf": "30134978153",
            "num_rg": "987654132",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62789456123",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "jennifer.crooks43@ethereal.email",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 1,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:45:27.000Z",
            "updated_at": "2026-11-12T18:48:12.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 10,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Paciente 2",
            "num_cpf": "67034694150",
            "num_rg": "456879213",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62987651235",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "jennifer.crooks43@ethereal.email",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 1,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:46:14.000Z",
            "updated_at": "2026-11-12T18:48:12.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 11,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Paciente 3",
            "num_cpf": "23217068130",
            "num_rg": "467913852",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62987546213",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "jennifer.crooks43@ethereal.email",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 1,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:47:26.000Z",
            "updated_at": "2026-11-12T18:48:12.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 12,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Paciente 4",
            "num_cpf": "20977160165",
            "num_rg": "852649731",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62985263147",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "jennifer.crooks43@ethereal.email",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 1,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:48:22.000Z",
            "updated_at": "2026-11-12T18:48:12.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 13,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Paciente 5",
            "num_cpf": "95358118195",
            "num_rg": "134652987",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62956432187",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "jennifer.crooks43@ethereal.email",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 1,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:49:39.000Z",
            "updated_at": "2026-11-12T18:48:12.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 14,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Paciente 6",
            "num_cpf": "02228307190",
            "num_rg": "698741235",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62456789123",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "jennifer.crooks43@ethereal.email",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 0,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 1,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:51:15.000Z",
            "updated_at": "2026-11-12T18:48:12.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 2,
    "dados": [
        {
            "id": 7,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Médico 1",
            "num_cpf": "33110566125",
            "num_rg": "963852741",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62456789123",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "medico1@bood.com",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 1,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 0,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:42:45.000Z",
            "updated_at": "2026-11-11T04:42:45.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        },
        {
            "id": 8,
            "id_cidade": 5418,
            "ind_status": "ativo",
            "nom_completo": "Médico 2",
            "num_cpf": "30289255163",
            "num_rg": "789123963",
            "dta_nascimento": "1999-12-31T02:00:00.000Z",
            "des_logradouro": "Avenida Ipanema",
            "num_endereco": "0",
            "des_complemento": null,
            "num_cep": "74350575",
            "nom_bairro": "Setor Faiçalville",
            "num_celular_1": "62456789123",
            "ind_whatsapp_1": 1,
            "num_celular_2": null,
            "ind_whatsapp_2": 1,
            "des_email_1": "medico2@bood.com",
            "des_email_2": null,
            "num_tentativas_login": 0,
            "dta_ultimo_login": null,
            "dta_bloqueio_login": null,
            "ind_medico": 1,
            "ind_secretaria": 0,
            "ind_costureira": 0,
            "ind_paciente": 0,
            "ind_administrador": 0,
            "val_cor_hex": null,
            "created_at": "2026-11-11T04:44:02.000Z",
            "updated_at": "2026-11-11T04:44:02.000Z",
            "deleted_at": null,
            "nom_cidade": "Goiânia",
            "nom_estado": "Goiás",
            "sgl_estado": "GO"
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 3,
    "dados": [
        {
            "id": 1,
            "des_tipo_agendamento": "24 HORAS",
            "ind_ativo": 1,
            "created_at": "2026-11-10T04:12:13.000Z",
            "updated_at": "2026-11-10T04:12:13.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "des_tipo_agendamento": "Primeiro Ajuste",
            "ind_ativo": 1,
            "created_at": "2026-11-10T04:13:07.000Z",
            "updated_at": "2026-11-10T04:13:07.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "des_tipo_agendamento": "Reajuste",
            "ind_ativo": 1,
            "created_at": "2026-11-10T04:13:18.000Z",
            "updated_at": "2026-11-10T04:13:18.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 15,
    "dados": [
        {
            "id": 1,
            "id_produto": 1,
            "id_variacao_cor_estampa": 1,
            "id_tamanho": 1,
            "num_sku": "BOOD109PPB",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:49:02.000Z",
            "updated_at": "2026-11-09T05:49:02.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "id_produto": 1,
            "id_variacao_cor_estampa": 1,
            "id_tamanho": 2,
            "num_sku": "BOOD109PB",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:49:27.000Z",
            "updated_at": "2026-11-09T05:49:27.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "id_produto": 1,
            "id_variacao_cor_estampa": 1,
            "id_tamanho": 3,
            "num_sku": "BOOD109MB",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:49:50.000Z",
            "updated_at": "2026-11-09T05:49:50.000Z",
            "deleted_at": null
        },
        {
            "id": 4,
            "id_produto": 1,
            "id_variacao_cor_estampa": 1,
            "id_tamanho": 4,
            "num_sku": "BOOD109GB",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:50:12.000Z",
            "updated_at": "2026-11-09T05:50:12.000Z",
            "deleted_at": null
        },
        {
            "id": 5,
            "id_produto": 1,
            "id_variacao_cor_estampa": 1,
            "id_tamanho": 5,
            "num_sku": "BOOD109GGB",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:50:29.000Z",
            "updated_at": "2026-11-09T05:50:29.000Z",
            "deleted_at": null
        },
        {
            "id": 6,
            "id_produto": 1,
            "id_variacao_cor_estampa": 2,
            "id_tamanho": 1,
            "num_sku": "BOOD109PPP",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:54:17.000Z",
            "updated_at": "2026-11-09T05:54:17.000Z",
            "deleted_at": null
        },
        {
            "id": 7,
            "id_produto": 1,
            "id_variacao_cor_estampa": 2,
            "id_tamanho": 2,
            "num_sku": "BOOD109PP",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:54:32.000Z",
            "updated_at": "2026-11-09T05:54:32.000Z",
            "deleted_at": null
        },
        {
            "id": 8,
            "id_produto": 1,
            "id_variacao_cor_estampa": 2,
            "id_tamanho": 3,
            "num_sku": "BOOD109MP",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:54:50.000Z",
            "updated_at": "2026-11-09T05:54:50.000Z",
            "deleted_at": null
        },
        {
            "id": 9,
            "id_produto": 1,
            "id_variacao_cor_estampa": 2,
            "id_tamanho": 4,
            "num_sku": "BOOD109GP",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:55:33.000Z",
            "updated_at": "2026-11-09T05:55:33.000Z",
            "deleted_at": null
        },
        {
            "id": 10,
            "id_produto": 1,
            "id_variacao_cor_estampa": 2,
            "id_tamanho": 5,
            "num_sku": "BOOD109GGP",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:55:52.000Z",
            "updated_at": "2026-11-09T05:55:52.000Z",
            "deleted_at": null
        },
        {
            "id": 11,
            "id_produto": 1,
            "id_variacao_cor_estampa": 3,
            "id_tamanho": 1,
            "num_sku": "BOOD109PPO",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:56:38.000Z",
            "updated_at": "2026-11-09T05:56:38.000Z",
            "deleted_at": null
        },
        {
            "id": 12,
            "id_produto": 1,
            "id_variacao_cor_estampa": 3,
            "id_tamanho": 2,
            "num_sku": "BOOD109PO",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:57:06.000Z",
            "updated_at": "2026-11-09T05:57:06.000Z",
            "deleted_at": null
        },
        {
            "id": 13,
            "id_produto": 1,
            "id_variacao_cor_estampa": 3,
            "id_tamanho": 3,
            "num_sku": "BOOD109MO",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:57:29.000Z",
            "updated_at": "2026-11-09T05:57:29.000Z",
            "deleted_at": null
        },
        {
            "id": 14,
            "id_produto": 1,
            "id_variacao_cor_estampa": 3,
            "id_tamanho": 4,
            "num_sku": "BOOD109GO",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:57:53.000Z",
            "updated_at": "2026-11-09T05:57:53.000Z",
            "deleted_at": null
        },
        {
            "id": 15,
            "id_produto": 1,
            "id_variacao_cor_estampa": 3,
            "id_tamanho": 5,
            "num_sku": "BOOD109GGO",
            "val_preco_variacao": "100.00",
            "ind_ativo": 1,
            "num_codigo_barras": "",
            "created_at": "2026-11-09T05:58:23.000Z",
            "updated_at": "2026-11-09T05:58:23.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 3,
    "dados": [
        {
            "id": 1,
            "nom_cor_estampa": "Branco",
            "ind_tipo": "cor",
            "val_codigo_hex": "#ffffff",
            "des_imagem_url": null,
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T04:59:59.000Z",
            "updated_at": "2026-11-09T04:59:59.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "nom_cor_estampa": "Preto",
            "ind_tipo": "cor",
            "val_codigo_hex": "#000000",
            "des_imagem_url": null,
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T05:00:18.000Z",
            "updated_at": "2026-11-09T05:00:18.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "nom_cor_estampa": "Onça",
            "ind_tipo": "estampa",
            "val_codigo_hex": null,
            "des_imagem_url": "https://www.avimortecidos.com.br/static/6370/sku/tecido-misto-sintetico-estampado-onca-pintada-brilhante-208016gt-1687890884258.png",
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T05:01:50.000Z",
            "updated_at": "2026-11-09T05:01:50.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "tamanho": 5,
    "dados": [
        {
            "id": 1,
            "cod_tamanho": "PP",
            "des_tamanho": "Tamanho PP",
            "des_categoria_tamanho": "vestuario",
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T04:54:41.000Z",
            "updated_at": "2026-11-09T04:54:41.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "cod_tamanho": "P",
            "des_tamanho": "Tamanho P",
            "des_categoria_tamanho": "vestuario",
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T04:55:09.000Z",
            "updated_at": "2026-11-09T04:55:09.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "cod_tamanho": "M",
            "des_tamanho": "Tamanho M",
            "des_categoria_tamanho": "vestuario",
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T04:55:22.000Z",
            "updated_at": "2026-11-09T04:55:22.000Z",
            "deleted_at": null
        },
        {
            "id": 4,
            "cod_tamanho": "G",
            "des_tamanho": "Tamanho G",
            "des_categoria_tamanho": "vestuario",
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T04:55:31.000Z",
            "updated_at": "2026-11-09T04:55:31.000Z",
            "deleted_at": null
        },
        {
            "id": 5,
            "cod_tamanho": "GG",
            "des_tamanho": "Tamanho GG",
            "des_categoria_tamanho": "vestuario",
            "num_ordem_exibicao": 0,
            "created_at": "2026-11-09T04:55:51.000Z",
            "updated_at": "2026-11-09T04:55:51.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 5,
    "dados": [
        {
            "id": 1,
            "id_categoria": 1,
            "nom_produto": "Cintura alta com colchetes",
            "num_sku": "BOOD109",
            "des_produto": "Bermuda de cintura alta com colchetes",
            "ref_produto": "BOOD109",
            "val_preco_base": "0.00",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:21:28.000Z",
            "updated_at": "2026-11-09T05:26:19.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "id_categoria": 1,
            "nom_produto": "Cintura baixa com colchetes",
            "num_sku": "BOOD111",
            "des_produto": "Bermuda de cintura baixa com colchetes",
            "ref_produto": "BOOD111",
            "val_preco_base": "0.00",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:23:00.000Z",
            "updated_at": "2026-11-09T05:23:00.000Z",
            "deleted_at": null
        },
        {
            "id": 4,
            "id_categoria": 2,
            "nom_produto": "Cintura alta com colchetes",
            "num_sku": "BOOD109ABJ",
            "des_produto": "Calça de cintura alta com colchetes",
            "ref_produto": "BOOD109ABJ",
            "val_preco_base": "0.00",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:30:30.000Z",
            "updated_at": "2026-11-09T05:30:30.000Z",
            "deleted_at": null
        },
        {
            "id": 5,
            "id_categoria": 3,
            "nom_produto": "Corpete com bojo (com elástico interno)",
            "num_sku": "BOOD213",
            "des_produto": "Corpete com bojo (com elástico interno)",
            "ref_produto": "BOOD213",
            "val_preco_base": "0.00",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:31:43.000Z",
            "updated_at": "2026-11-09T05:31:43.000Z",
            "deleted_at": null
        },
        {
            "id": 6,
            "id_categoria": 3,
            "nom_produto": "Corselet",
            "num_sku": "BOOD211",
            "des_produto": "Corpete corselet",
            "ref_produto": "BOOD211",
            "val_preco_base": "0.00",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:33:34.000Z",
            "updated_at": "2026-11-09T05:33:34.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 16,
    "dados": [
        {
            "id": 1,
            "id_produto": 1,
            "id_tipo_servico": 1,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:43:32.000Z",
            "updated_at": "2026-11-09T06:43:32.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "id_produto": 1,
            "id_tipo_servico": 2,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:43:38.000Z",
            "updated_at": "2026-11-09T06:43:38.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "id_produto": 1,
            "id_tipo_servico": 3,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:43:44.000Z",
            "updated_at": "2026-11-09T06:43:44.000Z",
            "deleted_at": null
        },
        {
            "id": 4,
            "id_produto": 1,
            "id_tipo_servico": 4,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:43:49.000Z",
            "updated_at": "2026-11-09T06:43:49.000Z",
            "deleted_at": null
        },
        {
            "id": 5,
            "id_produto": 3,
            "id_tipo_servico": 1,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:43:57.000Z",
            "updated_at": "2026-11-09T06:43:57.000Z",
            "deleted_at": null
        },
        {
            "id": 6,
            "id_produto": 3,
            "id_tipo_servico": 2,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:03.000Z",
            "updated_at": "2026-11-09T06:44:03.000Z",
            "deleted_at": null
        },
        {
            "id": 7,
            "id_produto": 3,
            "id_tipo_servico": 3,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:08.000Z",
            "updated_at": "2026-11-09T06:44:08.000Z",
            "deleted_at": null
        },
        {
            "id": 8,
            "id_produto": 3,
            "id_tipo_servico": 4,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:13.000Z",
            "updated_at": "2026-11-09T06:44:13.000Z",
            "deleted_at": null
        },
        {
            "id": 9,
            "id_produto": 5,
            "id_tipo_servico": 1,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:37.000Z",
            "updated_at": "2026-11-09T06:44:37.000Z",
            "deleted_at": null
        },
        {
            "id": 10,
            "id_produto": 5,
            "id_tipo_servico": 2,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:46.000Z",
            "updated_at": "2026-11-09T06:44:46.000Z",
            "deleted_at": null
        },
        {
            "id": 11,
            "id_produto": 5,
            "id_tipo_servico": 3,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:52.000Z",
            "updated_at": "2026-11-09T06:44:52.000Z",
            "deleted_at": null
        },
        {
            "id": 12,
            "id_produto": 5,
            "id_tipo_servico": 4,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:44:58.000Z",
            "updated_at": "2026-11-09T06:44:58.000Z",
            "deleted_at": null
        },
        {
            "id": 13,
            "id_produto": 6,
            "id_tipo_servico": 1,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:45:07.000Z",
            "updated_at": "2026-11-09T06:45:07.000Z",
            "deleted_at": null
        },
        {
            "id": 14,
            "id_produto": 6,
            "id_tipo_servico": 2,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:45:15.000Z",
            "updated_at": "2026-11-09T06:45:15.000Z",
            "deleted_at": null
        },
        {
            "id": 15,
            "id_produto": 6,
            "id_tipo_servico": 3,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:45:24.000Z",
            "updated_at": "2026-11-09T06:45:24.000Z",
            "deleted_at": null
        },
        {
            "id": 16,
            "id_produto": 6,
            "id_tipo_servico": 4,
            "ind_ativo": 1,
            "created_at": "2026-11-09T06:45:32.000Z",
            "updated_at": "2026-11-09T06:45:32.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
{
    "sucesso": true,
    "total": 4,
    "dados": [
        {
            "id": 1,
            "des_tipo_ajuste": "Ajuste pc grande 3º",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:45:10.000Z",
            "updated_at": "2026-11-09T05:45:10.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "des_tipo_ajuste": "Ajuste pc pequena 3º",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:45:20.000Z",
            "updated_at": "2026-11-09T05:45:20.000Z",
            "deleted_at": null
        },
        {
            "id": 3,
            "des_tipo_ajuste": "Ajuste na largura de pç pequena Bood",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:45:37.000Z",
            "updated_at": "2026-11-09T05:45:59.000Z",
            "deleted_at": null
        },
        {
            "id": 4,
            "des_tipo_ajuste": "Ajuste na largura de pç grande Bood",
            "ind_ativo": 1,
            "created_at": "2026-11-09T05:45:45.000Z",
            "updated_at": "2026-11-09T05:45:45.000Z",
            "deleted_at": null
        }
    ]
}
```
```json
```