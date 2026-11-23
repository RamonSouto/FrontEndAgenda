Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Preciso implementar uma feature dos layout de Email em um projeto Next.js V16.2.10 com React Query e um cliente HTTP customizado no layout estou utilizado Shadcn V4.16.0, para icones estou utilizando lucide-react V1.24.0. Estou trabalhando nos tamanhos de tela Mobile First, MD - medium e LG - larguer.Os requisitos são:

* **Endpoints da API**:
  * Listar E-mails
    * **Método HTTP**: GET
    * **URL**: /api/sistema/email-outbox
    * **Campos**: id, id_empresa, id_agendamento, ind_evento, des_chave_idempotencia, des_destinatario, des_assunto, des_corpo_html, des_corpo_texto, ind_status, num_tentativas, dta_proxima_tentativa, des_lock_token, dta_lock, des_ultimo_erro, des_message_id, dta_envio, created_at, updated_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: emailOutbocKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado) Query Params**:
    ```
    ind_status=enviado
    id_agendamento=42
    pagina=1
    limite=2
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "total": 1,
        "dados": [
            {
                "id": 5,
                "id_agendamento": 42,
                "ind_evento": "agendamento_cadastrado",
                "des_destinatario": "joaofirmino872@gmail.com",
                "des_assunto": "Agendamento Cadastrado",
                "ind_status": "enviado",
                "num_tentativas": 1,
                "dta_proxima_tentativa": "2026-11-20T04:17:52.000Z",
                "des_ultimo_erro": null,
                "dta_envio": "2026-11-20T04:17:59.000Z",
                "created_at": "2026-11-20T00:28:02.000Z"
            }
        ]
    }
    ```
  * Reprocessar e-mail:
    * **Método HTTP**: POST
    * **URL**: /api/sistema//email-outbox/{id}/reprocessar
    * **Campos**: id, id_empresa, id_agendamento, ind_evento, des_chave_idempotencia, des_destinatario, des_assunto, des_corpo_html, des_corpo_texto, ind_status, num_tentativas, dta_proxima_tentativa, des_lock_token, dta_lock, des_ultimo_erro, des_message_id, dta_envio, created_at, updated_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: emailOutbocKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "mensagem": "Mensagem recolocada na fila"
    }
    ```
  
    
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE `tab_email_outbox` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_agendamento` int DEFAULT NULL,
  `ind_evento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_chave_idempotencia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_destinatario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_assunto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_corpo_html` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_corpo_texto` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ind_status` enum('pendente','processando','enviado','falha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  `num_tentativas` tinyint unsigned NOT NULL DEFAULT '0',
  `dta_proxima_tentativa` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `des_lock_token` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dta_lock` datetime DEFAULT NULL,
  `des_ultimo_erro` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_message_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dta_envio` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_outbox_idempotencia` (`des_chave_idempotencia`),
  KEY `idx_outbox_fila` (`ind_status`,`dta_proxima_tentativa`),
  KEY `idx_outbox_lock` (`des_lock_token`),
  KEY `idx_outbox_agendamento` (`id_agendamento`),
  KEY `fk_outbox_empresa` (`id_empresa`),
  CONSTRAINT `fk_outbox_agendamento` FOREIGN KEY (`id_agendamento`) REFERENCES `tab_agendamento` (`id`),
  CONSTRAINT `fk_outbox_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `tab_empresa` (`id`)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── parametros
│   │   │   ├── OutBox
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── parametrizacao
│   │   ├── outbox
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...
```

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
    return texto ? `?${texto}` : '';
}

export const Agendamentos = {
    listar: (params?: AgendamentoListParams) =>
        httpClient.get<AgendamentoListResponse>(`/api/agendamentos${toQueryString(params)}`),

    buscar: (id: number) =>
        httpClient.get<AgendamentoResponse>(`/api/agendamentos/${id}`),

    criar: (data: AgendamentoInput) =>
        httpClient.post<AgendamentoCreateResponse>('/api/agendamentos', data),

    atualizar: (id: number, data: AgendamentoUpdateInput) =>
        httpClient.put<AgendamentoUpdateResponse>(`/api/agendamentos/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<AgendamentoDeleteResponse>(`/api/agendamentos/${id}`),
};
```
```ts
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
```ts
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
    id_medico: z.number().int().positive().nullable().optional(),
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

// Formulário de EDIÇÃO: só exige data futura se a data foi ALTERADA
// (permite editar observações/costureira de agendamentos passados)
export const agendamentoEdicaoSchema = (dataOriginal: string) =>
    agendamentoBase.refine(
        (d) => d.dta_agendamento === dataOriginal || ehFutura(d.dta_agendamento),
        { message: MSG_FUTURA, path: ['dta_agendamento'] }
    );
```
```ts
// src/features/agendamentos/agendamento/slots.ts
import type { Horario, TipoDia } from '@/features/parametrizacao/horario/types';

const p2 = (n: number) => String(n).padStart(2, '0');

export const paraMinutos = (hms: string) => {
    const [h, m] = hms.split(':').map(Number);
    return h * 60 + m;
};
export const deMinutos = (min: number) => `${p2(Math.floor(min / 60))}:${p2(min % 60)}`;

/** "YYYY-MM-DD" -> tipo do dia (null = domingo ou data inválida) */
export function tipoDiaDe(data: string): TipoDia | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return null;
    const [y, m, d] = data.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay(); // local, evita bug de UTC
    if (dow === 0) return null;
    return dow === 6 ? 'SABADO' : 'UTIL';
}

export function hojeLocal(): string {
    const n = new Date();
    return `${n.getFullYear()}-${p2(n.getMonth() + 1)}-${p2(n.getDate())}`;
}

/** Horários "HH:mm" permitidos para a data, conforme tab_parametrizacao */
export function gerarHorarios(data: string, parametros: Horario[]): string[] {
    const tipo = tipoDiaDe(data);
    if (!tipo) return [];

    const param = parametros.find(
        (x) => x.des_tipo_dia === tipo && Number(x.ind_ativo) === 1 && x.deleted_at === null
    );
    if (!param) return [];

    const passo = Number(param.qtd_minutos_intervalo);
    if (!passo) return [];

    const fim = paraMinutos(param.hra_fim);
    const lista: string[] = [];
    for (let t = paraMinutos(param.hra_inicio); t + passo <= fim; t += passo) {
        lista.push(deMinutos(t));
    }
    return lista;
}
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
    id_medico: number | null;
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
    nom_medico: string | null;
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


Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "smtp":
api.ts (métodos de requisição)
hooks.ts (hooks customizados com useQuery/useMutation)
queryKeys.ts (chaves de cache)
schema.ts (validação Zod)
types.ts (interfaces TypeScript)
columns.tsx
page.tsx
Obs.: Mantenha a organização em pastas src/features/parametros/[outboxemail] e utilize o httpClient já existente em src/lib/http/client.ts