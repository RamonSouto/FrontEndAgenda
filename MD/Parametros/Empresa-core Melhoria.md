Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso atualizar uma feature de Empresa em um projeto Next.js com React Query e um cliente HTTP customizado. Os requisitos são:

* **Endpoints da API**:
  * Criar empresa
    * **Método HTTP**: POST
    * **URL**: /api/empresa
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | id_cidade | text | 5418 |
      | ind_ativo | text | true |
      | nom_fantasia | text | Bood Accessoria 2 |
      | nom_razao_social | text | Bood Accessoria 2 |
      | num_cnpj | text | 89308985000120 |
      | num_inscricao_estadual | text | 205461964 |
      | dta_abertura | text | 2020-08-20 |
      | des_logradouro | text | Rua C Treze |
      | num_endereco | text | 0 |
      | des_complemento | text | QD 58 LT 15 |
      | num_cep | text | 74365690 |
      | nom_bairro | text | Setor Novo Horizonte |
      | ind_whatsapp_1 | text | true |
      | num_celular_1 | text | 62999999999 |
      | ind_whatsapp_2 | text | false |
      | num_celular_2 | text | 62999999999 |
      | des_email_1 | text | contato@boodacessoria.com.br |
      | val_cor_principal | text | faf6fe |
      | des_url_logo_horizontal | file | arquivo.png(binário) |
      | des_url_logo_vertical | file | arquivo.png(binário) |
      | des_url_logo_vertical_negativa | file | arquivo.png(binário) |
      | des_url_logo_horizontal_negativa | file | arquivo.png(binário) |
    * **Estrutura de dados (resposta)**:
    ```json
      {
          "sucesso": true,
          "mensagem": "Registro criado com sucesso",
          "dados": 4
      }
    ```
  * Listar empresa:
    * **Método HTTP**: GET
    * **URL**: /api/empresa
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 1,
          "id_cidade": 5418,
          "ind_ativo": 1,
          "nom_fantasia": "Bood Accessoria",
          "nom_razao_social": "Bood Accessoria",
          "num_cnpj": "34374667000176",
          "num_inscricao_estadual": "205461964",
          "dta_abertura": "2020-08-19T03:00:00.000Z",
          "des_logradouro": "Rua C Treze",
          "num_endereco": "0",
          "des_complemento": "QD 58 LT 15",
          "num_cep": "74365690",
          "nom_bairro": "Setor Novo Horizonte",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": "62988888888",
          "ind_whatsapp_2": 1,
          "des_email_1": "contato@boodacessoria.com.br",
          "des_email_2": null,
          "val_cor_principal": "faf6fe",
          "des_url_logo_vertical": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429176-155775182.jpg",
          "des_url_logo_horizontal": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429171-973289006.jpg",
          "des_url_logo_vertical_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429179-322982734.jpg",
          "des_url_logo_horizontal_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429182-480855710.jpg",
          "created_at": "2026-08-01T21:57:09.000Z",
          "updated_ad": "2026-08-02T16:19:01.000Z",
          "deleted_at": null
      }
    }
    ```
  * Buscar empresa: 
    * **Método HTTP**: GET
    * **URL**: /api/empresa/{id}
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 1,
          "id_cidade": 5418,
          "ind_ativo": 1,
          "nom_fantasia": "Bood Accessoria",
          "nom_razao_social": "Bood Accessoria",
          "num_cnpj": "34374667000176",
          "num_inscricao_estadual": "205461964",
          "dta_abertura": "2020-08-19T03:00:00.000Z",
          "des_logradouro": "Rua C Treze",
          "num_endereco": "0",
          "des_complemento": "QD 58 LT 15",
          "num_cep": "74365690",
          "nom_bairro": "Setor Novo Horizonte",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": "62988888888",
          "ind_whatsapp_2": 1,
          "des_email_1": "contato@boodacessoria.com.br",
          "des_email_2": null,
          "val_cor_principal": "faf6fe",
          "des_url_logo_vertical": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429176-155775182.jpg",
          "des_url_logo_horizontal": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429171-973289006.jpg",
          "des_url_logo_vertical_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429179-322982734.jpg",
          "des_url_logo_horizontal_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429182-480855710.jpg",
          "created_at": "2026-08-01T21:57:09.000Z",
          "updated_ad": "2026-08-02T16:19:01.000Z",
          "deleted_at": null
      }
    }
    ```
  * Atualizar empresa:
    * **Método HTTP**: PUT
    * **URL**: /api/empresa/{id}
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | ind_ativo | text | false |
      | num_celular_2 | text | 62988888888 |
      | des_url_logo_horizontal | file | arquivo.png(binário) |
      | des_url_logo_vertical | file | arquivo.png(binário) |
      | des_url_logo_vertical_negativa | file | arquivo.png(binário) |
      | des_url_logo_horizontal_negativa | file | arquivo.png(binário) |
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 3,
          "id_cidade": 5418,
          "ind_ativo": 1,
          "nom_fantasia": "Bood Accessoria 2",
          "nom_razao_social": "Bood Accessoria 2",
          "num_cnpj": "89308985000120",
          "num_inscricao_estadual": "205461964",
          "dta_abertura": "2020-08-19T03:00:00.000Z",
          "des_logradouro": "Rua C Treze",
          "num_endereco": "0",
          "des_complemento": "QD 58 LT 15",
          "num_cep": "74365690",
          "nom_bairro": "Setor Novo Horizonte",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": "62988888888",
          "ind_whatsapp_2": 1,
          "des_email_1": "contato@boodacessoria.com.br",
          "des_email_2": null,
          "val_cor_principal": "faf6fe",
          "des_url_logo_vertical": null,
          "des_url_logo_horizontal": null,
          "des_url_logo_vertical_negativa": null,
          "des_url_logo_horizontal_negativa": null,
          "created_at": "2026-08-07T17:01:35.000Z",
          "updated_ad": "2026-08-07T17:21:50.000Z",
          "deleted_at": null
    }
  }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/empresa/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```


  * Criar e atualizar SMTP
    * **Método HTTP**: PUT
    * **URL**: /api/sistema/empresa/{id}/smtp
    * **Campos**: ind_smtp_ativo, des_smtp_host, num_smtp_porta, ind_smtp_seguro, des_smtp_usuario, des_smtp_senha, des_smtp_email_remetente, nom_smtp_remetente, des_smtp_senha_enc
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "ind_smtp_ativo": true,
      "des_smtp_host":"smtp.ethereal.email",
      "num_smtp_porta": 587,
      "ind_smtp_seguro": false,
      "des_smtp_usuario": "jennifer.crooks43@ethereal.email",
      "des_smtp_senha": "ZE71m9y8sX5Y4bmUHt",
      "des_smtp_email_remetente": "agenda@bood.com.br",
      "nom_smtp_remetente": "Agenda Bood",
      "des_smtp_senha_enc": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 1,
        "nom_fantasia": "Bood Accessoria",
        "num_celular_1": "62999999999",
        "ind_smtp_ativo": 1,
        "des_smtp_host": "smtp.ethereal.email",
        "num_smtp_porta": 587,
        "ind_smtp_seguro": 0,
        "des_smtp_usuario": "jennifer.crooks43@ethereal.email",
        "des_smtp_email_remetente": "agenda@bood.com.br",
        "nom_smtp_remetente": "Agenda Bood",
        "ind_senha_configurada": true
      }
    }
    ```
  * Listar SMTP:
    * **Método HTTP**: GET
    * **URL**: /api/sistema/empresa/{id}/smtp
    * **Campos**: ind_smtp_ativo, des_smtp_host, num_smtp_porta, ind_smtp_seguro, des_smtp_usuario, des_smtp_senha, des_smtp_email_remetente, nom_smtp_remetente, des_smtp_senha_enc
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "nom_fantasia": "Bood Accessoria",
        "num_celular_1": "62999999999",
        "ind_smtp_ativo": 1,
        "des_smtp_host": "smtp.ethereal.email",
        "num_smtp_porta": 587,
        "ind_smtp_seguro": 0,
        "des_smtp_usuario": "jennifer.crooks43@ethereal.email",
        "des_smtp_email_remetente": "agenda@bood.com.br",
        "nom_smtp_remetente": "Agenda Bood",
        "ind_senha_configurada": true
      }
    }
    ```
  * Testar SMTP
    * **Método HTTP**: POST
    * **URL**: /api/sistema/empresa/{id}/smtp/teste
    * **Campos**: ind_smtp_ativo, des_smtp_host, num_smtp_porta, ind_smtp_seguro, des_smtp_usuario, des_smtp_senha, des_smtp_email_remetente, nom_smtp_remetente, des_smtp_senha_enc
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "des_destinatario": "jennifer.crooks43@ethereal.email"
    }
    ```
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "E-mail de teste enviado",
      "dados": {
        "messageId": "<7ee7bd91-d15c-80f0-029c-f620b8a2dcd3@bood.com.br>"
      }
    }
    ``` 
    
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE `tab_empresa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cidade` int NOT NULL,
  `ind_ativo` tinyint NOT NULL DEFAULT '1',
  `nom_fantasia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_razao_social` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_cnpj` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_inscricao_estadual` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dta_abertura` date NOT NULL,
  `des_logradouro` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_complemento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_cep` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_bairro` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_celular_1` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ind_whatsapp_1` tinyint NOT NULL,
  `num_celular_2` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ind_whatsapp_2` tinyint NOT NULL,
  `des_email_1` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_email_2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `val_cor_principal` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_url_logo_vertical` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_url_logo_horizontal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_url_logo_vertical_negativa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_url_logo_horizontal_negativa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ind_smtp_ativo` tinyint(1) NOT NULL DEFAULT '0',
  `des_smtp_host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_smtp_porta` smallint unsigned DEFAULT NULL,
  `ind_smtp_seguro` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=TLS implícito (465) | 0=STARTTLS (587)',
  `des_smtp_usuario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_smtp_senha_enc` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'AES-256-GCM formato v1:iv:tag:ct (base64)',
  `des_smtp_email_remetente` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom_smtp_remetente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tab_empresa_tab_cidade1_idx` (`id_cidade`),
  CONSTRAINT `fk_tab_empresa_tab_cidade1` FOREIGN KEY (`id_cidade`) REFERENCES `tab_cidade` (`id`)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── parametros
│   │   │   ├── Empresa
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── parametrizacao
│   │   ├── empresa
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
//src/features/parametrizacao/horario/api.ts

import { httpClient } from '@/lib/http/client';
import {
    HorarioListResponse,
    HorarioResponse,
    HorarioCreateResponse,
    HorarioDeleteResponse,
} from './types';
import { HorarioInput } from './schema';

export const Horarios = {
    listar: () => httpClient.get<HorarioListResponse>('/api/sistema/parametrizacao/'),

    buscar: (id: number) => httpClient.get<HorarioResponse>(`/api/sistema/parametrizacao/${id}`),

    criar: (data: HorarioInput) => {
        httpClient.post<HorarioCreateResponse>('/api/sistema/parametrizacao/', data);
    },
    atualizar: (id: number, data: HorarioInput) =>
        httpClient.put<HorarioResponse>(`/api/sistema/parametrizacao/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<HorarioDeleteResponse>(`/api/sistema/parametrizacao/${id}`),
};
```

```ts
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
        staleTime: 1000 * 60 * 1, // 1 minutos
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
```

```ts
//src/features/parametrizacao/horario/queryKeys.ts

export const horarioKeys = {
    all: ['horarios'] as const,
    detail: (id: number) => ['horarios', id] as const,
};
```

```ts
//src/features/parametrizacao/horario/schema.ts
import { z } from 'zod';

export const horarioSchema = z.object({
    des_tipo_dia: z.enum(['UTIL', 'SABADO']),
    hra_inicio: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Hora inválida (HH:mm:ss)'),
    hra_fim: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Hora inválida (HH:mm:ss)'),
    qtd_minutos_intervalo: z.coerce.number().int().min(0),
    ind_ativo: z.boolean(),
});

export type HorarioInput = z.infer<typeof horarioSchema>;
```

```ts
//src/features/parametrizacao/horario/types.ts

export type TipoDia = 'UTIL' | 'SABADO';

export interface Horario {
    id: number;
    des_tipo_dia: TipoDia;
    hra_inicio: string;
    hra_fim: string;
    qtd_minutos_intervalo: number;
    ind_ativo: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface HorarioListResponse {
    sucesso: boolean;
    parametro?: number;
    dados: Horario[];
}

export interface HorarioResponse {
    sucesso: boolean;
    dados: Horario;
}

export interface HorarioCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: number;
}

export interface HorarioDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

```tsx
// app/(private)/parametros/empresa/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatarCNPJ, formatarData } from '@/lib/utils/formatters';

function sortableHeader(label: string) {
  return ({ column }: any) => (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

interface EmpresaColumnsProps {
  onView: (empresa: Empresa) => void;
  onEdit: (empresa: Empresa) => void;
  onDelete: (empresa: Empresa) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export function getEmpresaColumns({ onView, onEdit, onDelete }: EmpresaColumnsProps): ColumnDef<Empresa>[] {
  return [
    {
      accessorKey: 'id',
      header: sortableHeader('ID'),
      meta: { label: 'ID' },
    },
    {
      accessorKey: 'nom_razao_social',
      header: sortableHeader('Razão Social'),
      meta: { label: 'Razão Social' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'nom_fantasia',
      header: sortableHeader('Nome Fantasia'),
      meta: { label: 'Nome Fantasia' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'des_url_logo_horizontal',
      header: sortableHeader('Logo'),
      cell: ({ row }) => {
        const url = row.original.des_url_logo_horizontal

        if (!url) {
          return (
            <div className="h-12 w-12 rounded border bg-muted/30 flex items-center justify-center text-muted-foreground text-xs">
              N/A
            </div>
          );
        }

        return (
          <img
            src={`${BASE_URL}/${url}`}
            alt="Imagem do produto"
            className="h-12 w-12 rounded object-cover border"
          />
        )
      },
      meta: { label: 'logo' },
    },
    {
      accessorKey: 'num_cnpj',
      header: sortableHeader('CNPJ'),
      meta: { label: 'CNPJ' },
      filterFn: 'includesString',
      cell: ({ row }) => formatarCNPJ(row.original.num_cnpj),
    },
    {
      accessorKey: 'num_inscricao_estadual',
      header: sortableHeader('I.E.'),
      meta: { label: 'I.E.' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'nom_cidade',
      header: sortableHeader('Cidade'),
      meta: { label: 'Cidade' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'nom_estado',
      header: sortableHeader('Estado'),
      meta: { label: 'Estado' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'sgl_estado',
      header: sortableHeader('UF'),
      meta: { label: 'UF' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'ind_ativo',
      header: sortableHeader('Status'),
      meta: { label: 'Status' },
      cell: ({ row }) => (
        <Badge variant={row.original.ind_ativo === 1 ? 'default' : 'destructive'}>
          {row.original.ind_ativo === 1 ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: sortableHeader('Criado'),
      meta: { label: 'Criado' },
      cell: ({ row }) => formatarData(row.original.created_at),
    },
    {
      accessorKey: 'updated_at',
      header: sortableHeader('Editado'),
      meta: { label: 'Editado' },
      cell: ({ row }) => (row.original.updated_at ? formatarData(row.original.updated_at) : '-'),
    },
    {
      id: 'acoes',
      header: 'Ação',
      meta: { label: 'Ação' },
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={(
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )} />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Eye className="mr-2 h-4 w-4" /> Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
              <Trash2 className="mr-2 h-4 w-4" /> Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

// Colunas visíveis por padrão: ID, Razão Social, Nome Fantasia, CNPJ, Ação
export const empresaDefaultVisibility: Record<string, boolean> = {
  id: true,
  nom_razao_social: true,
  nom_fantasia: true,
  num_cnpj: true,
  num_inscricao_estadual: false,
  nom_cidade: false,
  nom_estado: false,
  sgl_estado: false,
  ind_ativo: false,
  created_at: false,
  updated_at: false,
  acoes: true,
};
```

```tsx
// app/(private)/parametros/empresa/EmpresaFormDialog.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { empresaSchema, EmpresaFormValues } from '@/features/parametrizacao/empresa/schema';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { useCriarEmpresa, useAtualizarEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { useEstados } from '@/features/parametrizacao/estados/hooks';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { buscarCep } from '@/lib/utils/cepService';
import { buscarCnpj } from '@/lib/utils/cnpjService';
import { formatarCNPJ, formatarCEP, formatarTelefone, formatarDataInput, somenteDigitos, formatarData } from '@/lib/utils/formatters';
import { HorariosEmpresaTable } from '@/app/(private)/parametros/empresa/HorariosEmpresaTable';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';

interface EmpresaFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    empresa?: Empresa | null;
    onOpenChange: (open: boolean) => void;
}

export function EmpresaFormDialog({ open, mode, empresa, onOpenChange }: EmpresaFormDialogProps) {
    const { data: estadosRaw } = useEstados();
    const { data: cidadesRaw } = useCidades();
    const estados = useMemo(() => (Array.isArray(estadosRaw?.dados) ? estadosRaw.dados : []), [estadosRaw]);
    const cidades = useMemo(() => (Array.isArray(cidadesRaw?.dados) ? cidadesRaw.dados : []), [cidadesRaw]);

    const criarEmpresa = useCriarEmpresa();
    const atualizarEmpresa = useAtualizarEmpresa();

    const [buscandoCep, setBuscandoCep] = useState(false);
    const [buscandoCnpj, setBuscandoCnpj] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EmpresaFormValues>({
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            // ind_whatsapp_1: false,
            // ind_whatsapp_2: false,
            ind_ativo: true,
        },
    });

    const estadoSelecionado = watch('nom_estado');
    const cidadesFiltradas = useMemo(
        () => cidades.filter((c: any) => c.nom_estado === estadoSelecionado),
        [cidades, estadoSelecionado]
    );

    useEffect(() => {
        if (mode === 'edit' && empresa && cidades.length > 0) {
            const cidadeAtual = cidades.find((c: any) => c.id === empresa.id_cidade);
            reset({
                nom_fantasia: empresa.nom_fantasia,
                nom_razao_social: empresa.nom_razao_social,
                num_cnpj: empresa.num_cnpj,
                num_inscricao_estadual: empresa.num_inscricao_estadual ?? '',
                dta_abertura: formatarDataInput(empresa.dta_abertura),
                num_cep: empresa.num_cep,
                des_logradouro: empresa.des_logradouro,
                num_endereco: empresa.num_endereco ?? '',
                des_complemento: empresa.des_complemento ?? '',
                nom_bairro: empresa.nom_bairro,
                num_celular_1: empresa.num_celular_1,
                ind_whatsapp_1: !!empresa.ind_whatsapp_1,
                num_celular_2: empresa.num_celular_2 ?? '',
                ind_whatsapp_2: !!empresa.ind_whatsapp_2,
                des_email_1: empresa.des_email_1,
                des_email_2: empresa.des_email_2 ?? '',
                val_cor_principal: empresa.val_cor_principal ?? '#999999',
                nom_estado: empresa.nom_estado ?? '',
                id_cidade: empresa.id_cidade,
                ind_ativo: !!empresa.ind_ativo,
                des_url_logo_vertical: empresa.des_url_logo_vertical ?? null,
                des_url_logo_horizontal: empresa.des_url_logo_horizontal ?? null,
                des_url_logo_vertical_negativa: empresa.des_url_logo_vertical_negativa ?? null,
                des_url_logo_horizontal_negativa: empresa.des_url_logo_horizontal_negativa ?? null,
            } as EmpresaFormValues);
        } else if (mode === 'create') {
            reset({
                ind_whatsapp_1: false,
                ind_whatsapp_2: false,
                ind_ativo: true,
                val_cor_principal: '#ffffff',
                des_url_logo_vertical: null,
                des_url_logo_horizontal: null,
                des_url_logo_vertical_negativa: null,
                des_url_logo_horizontal_negativa: null,
            } as EmpresaFormValues);
        }
    }, [mode, empresa, cidades, reset]);

    // Busca CEP
    const handleCepBlur = async (cepValue: string) => {
        const digits = somenteDigitos(cepValue);
        if (digits.length !== 8) return;
        setBuscandoCep(true);
        try {
            const resultado = await buscarCep(digits);
            if (resultado) {
                setValue('des_logradouro', resultado.logradouro);
                setValue('des_complemento', resultado.complemento);
                setValue('nom_bairro', resultado.bairro);
                setValue('nom_estado', resultado.estado || resultado.uf);
                // pequena espera para a lista de cidades filtrar antes de setar
                setTimeout(() => {
                    const cidadeEncontrada = cidades.find(
                        (c: any) => c.nom_cidade?.toLowerCase() === resultado.cidade.toLowerCase()
                    );
                    if (cidadeEncontrada) setValue('id_cidade', cidadeEncontrada.id);
                }, 0);
            }
        } finally {
            setBuscandoCep(false);
        }
    };

    // Busca CNPJ
    const handleCnpjBlur = async (cnpjValue: string) => {
        const digits = somenteDigitos(cnpjValue);
        if (digits.length !== 14) return;
        setBuscandoCnpj(true);
        try {
            const resultado = await buscarCnpj(digits);
            if (resultado) {
                setValue('nom_razao_social', resultado.razao_social);
                setValue('nom_fantasia', resultado.nome_fantasia);
                setValue('dta_abertura', resultado.dta_abertura);
                if (resultado.cep) {
                    setValue('num_cep', resultado.cep);
                    await handleCepBlur(resultado.cep);
                }
                setValue('num_endereco', resultado.numero);
                setValue('des_email_1', resultado.email ?? '');
                if (resultado.telefone_1) setValue('num_celular_1', resultado.telefone_1);
            }
        } finally {
            setBuscandoCnpj(false);
        }
    };

    const onSubmit = async (values: EmpresaFormValues) => {
        try {
            if (mode === 'create') {
                await criarEmpresa.mutateAsync(values);
                toast.success('Empresa cadastrado com sucesso!')
            } else if (empresa) {
                await atualizarEmpresa.mutateAsync({ id: empresa.id, payload: values });
                toast.success('Cadastrado de empresa atualizado com sucesso!')
            }
            onOpenChange(false);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.isValidation && error.details) {
                    // Exibe cada erro de campo retornado pelo backend
                    Object.entries(error.details).forEach(([campo, mensagens]) => {
                        mensagens.forEach((msg) => toast.error(`${campo}: ${msg}`));
                    });
                } else {
                    toast.error({ title: 'Error', description: error.message, variant: 'destructive' });
                }
            } else {
                toast.error('Erro inesperado ao salvar a empresa.');
            }
        }

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xs md:max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary">
                <DialogHeader>
                    <DialogTitle>Empresa</DialogTitle>
                    <DialogDescription>
                        Preenchas os campos corretamente para cadastrar uma nova empresa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {mode === 'edit' && empresa && (
                        <div>
                            <Label>ID</Label>
                            <Input disabled value={empresa.id} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>CNPJ {buscandoCnpj && '(buscando...)'}</Label>
                            <Controller
                                control={control}
                                name="num_cnpj"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={formatarCNPJ(field.value ?? '')}
                                        onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            handleCnpjBlur(e.target.value);
                                        }}
                                        maxLength={18}
                                        placeholder="99.999.999/9999-99"
                                    />
                                )}
                            />
                            {errors.num_cnpj && <p className="text-sm text-destructive">{errors.num_cnpj.message}</p>}
                        </div>

                        <div>
                            <Label>I.E.</Label>
                            <Input {...register('num_inscricao_estadual')} />
                        </div>

                        <div>
                            <Label>Nome Fantasia</Label>
                            <Input {...register('nom_fantasia')} />
                            {errors.nom_fantasia && <p className="text-sm text-destructive">{errors.nom_fantasia.message}</p>}
                        </div>
                        <div>
                            <Label>Razão Social</Label>
                            <Input {...register('nom_razao_social')} />
                            {errors.nom_razao_social && <p className="text-sm text-destructive">{errors.nom_razao_social.message}</p>}
                        </div>

                        <div>
                            <Label>Data de Abertura</Label>
                            <Input type="date" {...register('dta_abertura')} />
                            {errors.dta_abertura && <p className="text-sm text-destructive">{errors.dta_abertura.message}</p>}
                        </div>

                        <div>
                            <Label>CEP {buscandoCep && '(buscando...)'}</Label>
                            <Controller
                                control={control}
                                name="num_cep"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={formatarCEP(field.value ?? '')}
                                        onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            handleCepBlur(e.target.value);
                                        }}
                                        maxLength={9}
                                        placeholder="99999-999"
                                    />
                                )}
                            />
                            {errors.num_cep && <p className="text-sm text-destructive">{errors.num_cep.message}</p>}
                        </div>

                        <div>
                            <Label>Logradouro</Label>
                            <Input {...register('des_logradouro')} />
                        </div>
                        <div>
                            <Label>Número</Label>
                            <Input {...register('num_endereco')} />
                        </div>
                        <div>
                            <Label>Complemento</Label>
                            <Input {...register('des_complemento')} />
                        </div>
                        <div>
                            <Label>Bairro</Label>
                            <Input {...register('nom_bairro')} />
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <Label>Celular 1</Label>
                                <Controller
                                    control={control}
                                    name="num_celular_1"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={formatarTelefone(field.value ?? '')}
                                            onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                            placeholder="(99) 9 9999-9999"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Controller
                                    control={control}
                                    name="ind_whatsapp_1"
                                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label>WhatsApp</Label>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <Label>Celular 2</Label>
                                <Controller
                                    control={control}
                                    name="num_celular_2"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={formatarTelefone(field.value ?? '')}
                                            onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                            placeholder="(99) 9 9999-9999"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Controller
                                    control={control}
                                    name="ind_whatsapp_2"
                                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label>WhatsApp</Label>
                            </div>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" {...register('des_email_1')} placeholder="contato@empresa.com.br" />
                            {errors.des_email_1 && <p className="text-sm text-destructive">{errors.des_email_1.message}</p>}
                        </div>
                        <div>
                            <Label>Email 2</Label>
                            <Input type="email" {...register('des_email_2')} placeholder="contato@empresa.com.br" />
                        </div>

                        <div>
                            <Label>Estado</Label>
                            <Controller
                                control={control}
                                name="nom_estado"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue('id_cidade', undefined as any); }}>
                                        <SelectTrigger className="w-full">
                                            {field.value || 'Selecione o estado'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {estados.map((estado: any) => (
                                                <SelectItem key={estado.id} value={estado.nom_estado}>
                                                    {estado.nom_estado}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.nom_estado && <p className="text-sm text-destructive">{errors.nom_estado.message}</p>}
                        </div>

                        <div>
                            <Label>Cidade</Label>
                            <Controller
                                control={control}
                                name="id_cidade"
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        disabled={!estadoSelecionado}
                                    >
                                        <SelectTrigger className="w-full">
                                            {cidadesFiltradas.find((c: any) => c.id === field.value)?.nom_cidade || 'Selecione a cidade'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cidadesFiltradas.map((cidade: any) => (
                                                <SelectItem key={cidade.id} value={String(cidade.id)}>
                                                    {cidade.nom_cidade}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.id_cidade && <p className="text-sm text-destructive">{errors.id_cidade.message as string}</p>}
                        </div>

                        <div>
                            <Label>Cor principal logo</Label>
                            <Controller
                                control={control}
                                name="val_cor_principal"
                                render={({ field }) => (
                                    <Input
                                        type="color"
                                        value={`#${(field.value ?? '999999').replace('#', '')}`}
                                        onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <Controller
                                control={control}
                                name="ind_ativo"
                                render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label>Status</Label>
                        </div>
                        {/* NOVOS CAMPOS DE IMAGEM */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={control}
                                name="des_url_logo_vertical"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Vertical"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="square"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="des_url_logo_vertical_negativa"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Vertical Negativa"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="square"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="des_url_logo_horizontal"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Horizontal"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="wide"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="des_url_logo_horizontal_negativa"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Horizontal Negativa"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="wide"
                                    />
                                )}
                            />
                        </div>

                        {mode === 'edit' && empresa && (
                            <>
                                <div>
                                    <Label>Criado</Label>
                                    <Input disabled value={formatarData(empresa.created_at)} />
                                </div>
                                <div>
                                    <Label>Editado</Label>
                                    <Input disabled value={empresa.updated_ad ? formatarData(empresa.updated_ad) : ''} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* {mode === 'edit' && empresa && (
                        <div className="pt-4">
                            <HorariosEmpresaTable idEmpresa={empresa.id} />
                        </div>
                    )} */}

                    <DialogFooter>
                        <DialogClose variant="outline">Fechar</DialogClose>
                        <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
```

```tsx
// app/(private)/parametros/empresa/HorariosEmpresaTable.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useHorariosEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { formatarData } from '@/lib/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';

export function HorariosEmpresaTable({ idEmpresa }: { idEmpresa: number }) {
    const { data, isLoading } = useHorariosEmpresa(idEmpresa);
    const horarios = data?.dados ?? [];

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
            <div className="border rounded-md overflow-auto max-h-[300px]">
                <Card className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 max-h-[55vh]'}`}>
                    <CardContent className="p-0">
                        <div className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary '}`}>
                            <Table>
                                <TableHeader className="top-0 bg-background">
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Tipo de Dia</TableHead>
                                        <TableHead>Início</TableHead>
                                        <TableHead>Fim</TableHead>
                                        <TableHead>Intervalo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Criado</TableHead>
                                        <TableHead>Editado</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={9} className="text-center py-4">Carregando...</TableCell></TableRow>
                                    ) : horarios.length === 0 ? (
                                        <TableRow><TableCell colSpan={9} className="text-center py-4">Nenhum horário cadastrado.</TableCell></TableRow>
                                    ) : (
                                        horarios.map((h) => (
                                            <TableRow key={h.id}>
                                                <TableCell>{h.id}</TableCell>
                                                <TableCell>{h.des_tipo_dia}</TableCell>
                                                <TableCell>{h.hra_inicio}</TableCell>
                                                <TableCell>{h.hra_fim}</TableCell>
                                                <TableCell>{h.qtd_minutos_intervalo}</TableCell>
                                                <TableCell>
                                                    <Badge variant={h.ind_ativo ? 'default' : 'secondary'}>
                                                        {h.ind_ativo ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatarData(h.created_at)}</TableCell>
                                                <TableCell>{h.updated_at ? formatarData(h.updated_at) : '-'}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger render={(
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        )} />
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Visualizar</DropdownMenuItem>
                                                            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Deletar</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
```

```tsx
// src/app/(private)/parametros/cidades/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Empresa",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
```

```ts
// app/(private)/parametros/empresa/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEmpresas, useDeletarEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { getEmpresaColumns, empresaDefaultVisibility } from './columns';
import { EmpresaFormDialog } from './EmpresaFormDialog';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { useEstados } from '@/features/parametrizacao/estados/hooks';

export default function EmpresaPage() {
    const { data: empresasRaw, isLoading, error } = useEmpresas();
    const { data: cidadesRaw } = useCidades();
    const { data: estadosRaw } = useEstados();

    const deletarEmpresa = useDeletarEmpresa();

    const cidades = useMemo(() => (Array.isArray(cidadesRaw?.dados) ? cidadesRaw?.dados : []), [cidadesRaw]);
    const estados = useMemo(() => (Array.isArray(estadosRaw?.dados) ? estadosRaw?.dados : []), [estadosRaw]);

    const cidadesMap = useMemo(() => {
        const map = new Map<number, any>();
        cidades.forEach((c: any) => map.set(c.id, c));
        return map;
    }, [cidades]);

    const empresas = useMemo(() => {
        const lista = (Array.isArray(empresasRaw?.dados) ? empresasRaw.dados : []).filter(empresas => empresas.deleted_at === null);
        return lista.map((empresa) => {
            const cidade = cidadesMap.get(empresa.id_cidade);
            return {
                ...empresa,
                nom_cidade: cidade?.nom_cidade ?? '',
                nom_estado: cidade?.nom_estado ?? '',
                sgl_estado: cidade?.sgl_estado ?? '',
            };
        });
    }, [empresasRaw, cidadesMap]);

    // Estados da tabela
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(empresaDefaultVisibility);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    // Dialogs
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Empresa | null>(null);

    const columns = useMemo(
        () =>
            getEmpresaColumns({
                onView: (empresa) => {
                    setSelectedEmpresa(empresa);
                    setFormMode('edit');
                    setFormOpen(true);
                },
                onEdit: (empresa) => {
                    setSelectedEmpresa(empresa);
                    setFormMode('edit');
                    setFormOpen(true);
                },
                onDelete: (empresa) => setDeleteTarget(empresa),
            }),
        []
    );

    // Opções do dropdown de filtro (exclui ID e Ação)
    const filterOptions = useMemo(() => {
        const permitidos = ['nom_razao_social', 'nom_fantasia', 'num_cnpj', 'num_inscricao_estadual', 'nom_cidade', 'nom_estado', 'sgl_estado'];
        return columns
            .filter((col: any) => col.accessorKey && permitidos.includes(col.accessorKey))
            .map((col: any) => ({
                value: col.accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));
    }, [columns]);

    const [filterField, setFilterField] = useState(filterOptions[0]?.value || '');
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        if (filterField && value) {
            setColumnFilters([{ id: filterField, value }]);
        } else {
            setColumnFilters([]);
        }
    };

    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    const table = useReactTable({
        data: empresas,
        columns,
        state: {
            columnFilters,
            sorting,
            pagination,
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    if (error) return <div>Erro ao carregar empresas.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Empresas</div>

            {/* Botões de ação */}
            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                        setSelectedEmpresa(null);
                        setFormMode('create');
                        setFormOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Nova Empresa
                </Button>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-1"
                    >
                        <Funnel className="h-4 w-4" />
                        Filtros
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger render={(
                            <Button variant="outline" size="sm" className="gap-1">
                                <Columns className="h-4 w-4" />
                                Colunas
                            </Button>
                        )} />
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.columnDef.meta?.label ?? column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Filtro avançado (toggle) */}
            {showFilters && (
                <div className="flex flex-wrap items-end gap-2 mb-4 p-4 border rounded-md bg-muted/20">
                    <div className="flex-1 min-w-[150px]">
                        <Select value={filterField} onValueChange={setFilterField}>
                            <SelectTrigger className="w-full">
                                {filterOptions.find((opt) => opt.value === filterField)?.label || 'Campo'}
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Input
                            placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'}`}
                            value={filterValue}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar
                    </Button>
                </div>
            )}

            {/* Card com tabela */}
            <Card className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 ${showFilters ? 'max-h-[55vh] sm:max-h-[60vh]' : 'max-h-[75vh] sm:max-h-[75vh]'}`}>
                <CardContent className="p-0">
                    <div className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary ${showFilters ? 'max-h-[calc(55vh-105px)] sm:max-h-[calc(60vh-65px)]' : 'max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]'}`}>
                        <Table className="overflow-x-auto">
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton columnsCount={columns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-4">
                                            Nenhuma empresa encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            <EmpresaFormDialog
                open={formOpen}
                mode={formMode}
                empresa={selectedEmpresa}
                onOpenChange={setFormOpen}
            />

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir empresa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a empresa "{deleteTarget?.nom_fantasia}"? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (deleteTarget) {
                                    await deletarEmpresa.mutateAsync(deleteTarget.id);
                                    setDeleteTarget(null);
                                }
                            }}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
```