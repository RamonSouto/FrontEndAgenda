Preciso que se comporte como um engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, realizei a implementação uma feature de Produto em um projeto utilizando Next.js 16.2.10 com tanstack/react-query 5.101.2 e um cliente HTTP customizado. Foi realizado o cadastro de produto atraves de um formulário, gostaria de fazer a seguinte alteração, após realizar o cadastro do produto deve ser redirecionado para uma tela de formulário de edição onde contém o cadastro realizado e liberando as seguinte seções para ser acrescentado diretamento do cadastro de produto, seção: Grade, produto/serviço e produto/serviço/preço:

Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar categoria
    * **Método HTTP**: POST
    * **URL**: /api/produtos/produto
    * **Campos**: id_categoria, nom_produto, num_sku, des_produto, ref_produto, val_preco_base, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_categoria": 1,
      "nom_produto": "Cintura teste",
      "num_sku": "BOOD110",
      "des_produto": "Bermuda de cintura teste BOOD",
      "ref_produto": "Bermuda de cintura teste BOOD",
      "val_preco_base": 190.00,
      "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
        "id": {
          "id": 7,
          "id_categoria": 1,
          "nom_produto": "Cintura teste",
          "num_sku": "BOOD110",
          "des_produto": "Bermuda de cintura teste BOOD",
          "ref_produto": "Bermuda de cintura teste BOOD",
          "val_preco_base": "190.00",
          "ind_ativo": 1,
          "created_at": "2026-08-16T03:24:10.000Z",
          "updated_at": "2026-08-16T03:24:10.000Z",
          "deleted_at": null
        }
      }
    }
    ```
  * Listar categoria:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/produto
    * **Campos**: id_categoria, nom_produto, num_sku, des_produto, ref_produto, val_preco_base, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 4,
      "dados": [
        {
          "id": 1,
          "id_categoria": 1,
          "nom_produto": "Cintura alta com colchetes",
          "num_sku": "CON109",
          "des_produto": "Bermuda de cintura alta com colchetes",
          "ref_produto": "Bermuda",
          "val_preco_base": "200.00",
          "ind_ativo": 1,
          "created_at": "2026-03-08T20:11:24.000Z",
          "updated_at": "2026-07-13T19:05:28.000Z",
          "deleted_at": null
        },
        {
          "id": 3,
          "id_categoria": 1,
          "nom_produto": "Cintura baixa com colchetes",
          "num_sku": "BOOD111",
          "des_produto": "Bermuda de cintura baixa com colchetes",
          "ref_produto": "Bermuda de cintura baixa com colchetes",
          "val_preco_base": "190.00",
          "ind_ativo": 1,
          "created_at": "2026-03-08T23:47:07.000Z",
          "updated_at": "2026-07-06T12:40:49.000Z",
          "deleted_at": null
        },
        {
          "id": 4,
          "id_categoria": 1,
          "nom_produto": "Cintura teste",
          "num_sku": "BOOD110",
          "des_produto": "Bermuda de cintura teste",
          "ref_produto": "Bermuda de cintura teste",
          "val_preco_base": "190.00",
          "ind_ativo": 1,
          "created_at": "2026-03-08T23:47:59.000Z",
          "updated_at": "2026-07-13T19:05:42.000Z",
          "deleted_at": "2026-07-13T19:05:42.000Z"
        },
        {
          "id": 7,
          "id_categoria": 1,
          "nom_produto": "Cintura teste",
          "num_sku": "BOOD110",
          "des_produto": "Bermuda de cintura teste BOOD",
          "ref_produto": "Bermuda de cintura teste BOOD",
          "val_preco_base": "190.00",
          "ind_ativo": 1,
          "created_at": "2026-08-16T03:24:10.000Z",
          "updated_at": "2026-08-16T03:24:10.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Buscar categoria: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/produto/{id}
    * **Campos**: id_categoria, nom_produto, num_sku, des_produto, ref_produto, val_preco_base, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "id_categoria": 1,
        "nom_produto": "Cintura alta com colchetes",
        "num_sku": "CON109",
        "des_produto": "Bermuda de cintura alta com colchetes",
        "ref_produto": "Bermuda",
        "val_preco_base": "200.00",
        "ind_ativo": 1,
        "created_at": "2026-03-08T20:11:24.000Z",
        "updated_at": "2026-07-13T19:05:28.000Z",
        "deleted_at": null
      }
    }
    ```
  * Atualizar categoria:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/produto/{id}
    * **Campos**: id_categoria, nom_produto, num_sku, des_produto, ref_produto, val_preco_base, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id": 1,
      "id_categoria": 1,
      "nom_produto": "Cintura alta com colchetes",
      "num_sku": "CON109",
      "des_produto": "Bermuda de cintura alta com colchetes",
      "ref_produto": "Bermuda",
      "val_preco_base": "200.00",
      "ind_ativo": 1
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 1,
        "id_categoria": 1,
        "nom_produto": "Cintura alta com colchetes",
        "num_sku": "CON109",
        "des_produto": "Bermuda de cintura alta com colchetes",
        "ref_produto": "Bermuda",
        "val_preco_base": "200.00",
        "ind_ativo": 1,
        "created_at": "2026-03-08T20:11:24.000Z",
        "updated_at": "2026-07-13T19:05:28.000Z",
        "deleted_at": null
      }
    }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/produto/{id}
    * **Chaves**: produtoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_produtos (
  id int NOT NULL AUTO_INCREMENT,
  id_categoria int DEFAULT NULL,
  nom_produto varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_sku varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_produto text COLLATE utf8mb4_unicode_ci,
  ref_produto varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  val_preco_base decimal(10,2) DEFAULT NULL,
  ind_ativo tinyint(1) DEFAULT '1',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ref_produto (ref_produto),
  KEY idx_categoria (id_categoria),
  KEY idx_sku (num_sku),
  KEY idx_ref (ref_produto),
  CONSTRAINT tab_produtos_ibfk_1 FOREIGN KEY (id_categoria) REFERENCES tab_categorias_produtos (id)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── produtos
│   │   │   ├── produto
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── produto
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...
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
  PRIMARY KEY (id),
  UNIQUE KEY num_sku (num_sku),
  UNIQUE KEY uniq_combinacao (id_produto,id_variacao_cor_estampa,id_tamanho),
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
CREATE TABLE tab_preco_produto_servico (
  id int NOT NULL AUTO_INCREMENT,
  id_produto_servico int NOT NULL,
  val_preco decimal(7,2) unsigned NOT NULL,
  dta_inicio date NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY val_preco_UNIQUE (id_produto_servico, dta_inicio),
  KEY fk_tab_Preco_produto_servico_tab_produto_servico1_idx (id_produto_servico),
  CONSTRAINT fk_tab_Preco_produto_servico_tab_produto_servico1 FOREIGN KEY (id_produto_servico) REFERENCES tab_produto_servico (id)
) ENGINE=InnoDB
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
// src/features/produtos/grade/queryKeys.ts

export const gradeProdutoKeys = {
    all: ['grade-produto'] as const,
    detail: (id: number) => ['grade-produto', id] as const,
};
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
    });
};
```

```ts
// src/features/produtos/produto-servico/types.ts

export interface ProdutoServico {
    id: number;
    id_produto: number;
    id_tipo_servico: number;
    ind_ativo: number; // 0 ou 1, como retornado pelo MySQL (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface ProdutoServicoListResponse {
    sucesso: boolean;
    total?: number;
    dados: ProdutoServico[];
}

export interface ProdutoServicoResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: ProdutoServico;
}

export interface ProdutoServicoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: ProdutoServico;
}

export interface ProdutoServicoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

```ts
// src/features/produtos/produto-servico/schema.ts
import { z } from 'zod';

export const produtoServicoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione um produto' })
        .int()
        .positive('Selecione um produto'),
    id_tipo_servico: z
        .number({ error: 'Selecione um tipo de serviço' })
        .int()
        .positive('Selecione um tipo de serviço'),
    ind_ativo: z.boolean(),
});

export type ProdutoServicoInput = z.infer<typeof produtoServicoSchema>;
```

```ts
// src/features/produtos/produto-servico/queryKeys.ts

export const produtoServicoKeys = {
    all: ['produto-servico'] as const,
    detail: (id: number) => ['produto-servico', id] as const,
};
```

```ts
// src/features/produtos/produto-servico/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ProdutoServicoListResponse,
    ProdutoServicoResponse,
    ProdutoServicoCreateResponse,
    ProdutoServicoDeleteResponse,
} from './types';
import { ProdutoServicoInput } from './schema';

export const ProdutoServicos = {
    listar: () =>
        httpClient.get<ProdutoServicoListResponse>('/api/produtos/produtoServico'),

    buscar: (id: number) =>
        httpClient.get<ProdutoServicoResponse>(`/api/produtos/produtoServico/${id}`),

    criar: (data: ProdutoServicoInput) =>
        httpClient.post<ProdutoServicoCreateResponse>('/api/produtos/produtoServico', data),

    atualizar: (id: number, data: ProdutoServicoInput) =>
        httpClient.put<ProdutoServicoResponse>(`/api/produtos/produtoServico/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<ProdutoServicoDeleteResponse>(`/api/produtos/produtoServico/${id}`),
};
```

```ts
// src/features/produtos/produto-servico/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProdutoServicos } from './api';
import { produtoServicoKeys } from './queryKeys';
import {
    ProdutoServicoListResponse,
    ProdutoServicoResponse,
    ProdutoServicoCreateResponse,
    ProdutoServicoDeleteResponse,
} from './types';
import { ProdutoServicoInput } from './schema';

export const useProdutoServicos = () => {
    return useQuery<ProdutoServicoListResponse>({
        queryKey: produtoServicoKeys.all,
        queryFn: ProdutoServicos.listar,
    });
};

export const useProdutoServico = (id: number) => {
    return useQuery<ProdutoServicoResponse>({
        queryKey: produtoServicoKeys.detail(id),
        queryFn: () => ProdutoServicos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoServicoCreateResponse, unknown, ProdutoServicoInput>({
        mutationFn: (data) => ProdutoServicos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.all });
        },
    });
};

export const useAtualizarProdutoServico = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoServicoResponse, unknown, ProdutoServicoInput>({
        mutationFn: (data) => ProdutoServicos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.all });
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.detail(id) });
        },
    });
};

export const useDeletarProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<ProdutoServicoDeleteResponse, unknown, number>({
        mutationFn: (id) => ProdutoServicos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: produtoServicoKeys.all });
        },
    });
};
```

```ts
// src/features/produtos/preco-produto-servico/types.ts

export interface PrecoProdutoServico {
    id: number;
    id_produto_servico: number;
    val_preco: string;          // decimal(7,2) unsigned -> vem como string
    dta_inicio: string;         // date -> vem como ISO datetime (com hora zerada em UTC)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface PrecoProdutoServicoListResponse {
    sucesso: boolean;
    total?: number;
    dados: PrecoProdutoServico[];
}

export interface PrecoProdutoServicoResponse {
    sucesso: boolean;
    mensagem?: string;
    dados: PrecoProdutoServico;
}

// A criação retorna só o { id }, diferente do padrão de horario (que retorna o objeto todo)
export interface PrecoProdutoServicoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: { id: number };
}

export interface PrecoProdutoServicoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

```ts
// src/features/produtos/preco-produto-servico/schema.ts
import { z } from 'zod';

const REGEX_VALOR = /^\d+(\.\d{1,2})?$/;

// Schema de ENVIO para a API (o que realmente vai no body do POST)
export const precoProdutoServicoSchema = z.object({
    id_produto_servico: z.number().int().positive('Selecione um produto/serviço'),
    val_preco: z.string().regex(REGEX_VALOR, 'Valor inválido. Use o formato 0.00'),
    dta_inicio: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Data inválida'),
});
export type PrecoProdutoServicoInput = z.infer<typeof precoProdutoServicoSchema>;

// Schema do FORMULÁRIO de criação (o que o usuário digita/seleciona na UI)
// dta_inicio aqui é Date por causa do DatePicker — convertido para string no submit
export const precoProdutoServicoFormSchema = z.object({
    id_produto_servico: z.number({ message: 'Selecione um produto/serviço' })
        .int().positive('Selecione um produto/serviço'),
    val_preco: z.string().regex(REGEX_VALOR, 'Valor inválido. Use o formato 0.00'),
    dta_inicio: z.date({ message: 'Selecione a data de início' }),
});
export type PrecoProdutoServicoFormInput = z.infer<typeof precoProdutoServicoFormSchema>;

export const precoProdutoServicoUpdateSchema = z.object({
    val_preco: z.string().regex(REGEX_VALOR, 'Valor inválido. Use o formato 0.00'),
});
export type PrecoProdutoServicoUpdateInput = z.infer<typeof precoProdutoServicoUpdateSchema>;
```

```ts
// src/features/produtos/preco-produto-servico/queryKeys.ts

export const precoProdutoServicoKeys = {
    all: ['precoProdutoServico'] as const,
    detail: (id: number) => ['precoProdutoServico', id] as const,
};
```

```ts
// src/features/produtos/preco-produto-servico/api.ts

import { httpClient } from '@/lib/http/client';
import {
    PrecoProdutoServicoListResponse,
    PrecoProdutoServicoResponse,
    PrecoProdutoServicoCreateResponse,
    PrecoProdutoServicoDeleteResponse,
} from './types';
import { PrecoProdutoServicoInput, PrecoProdutoServicoUpdateInput } from './schema';

export const PrecoProdutoServicos = {
    listar: () =>
        httpClient.get<PrecoProdutoServicoListResponse>('/api/produtos/precoProdutoServico'),

    buscar: (id: number) =>
        httpClient.get<PrecoProdutoServicoResponse>(`/api/produtos/precoProdutoServico/${id}`),

    criar: (data: PrecoProdutoServicoInput) =>
        httpClient.post<PrecoProdutoServicoCreateResponse>('/api/produtos/precoProdutoServico', data),

    atualizar: (id: number, data: PrecoProdutoServicoUpdateInput) =>
        httpClient.put<PrecoProdutoServicoResponse>(`/api/produtos/precoProdutoServico/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<PrecoProdutoServicoDeleteResponse>(`/api/produtos/precoProdutoServico/${id}`),
};
```

```ts
// src/features/produtos/preco-produto-servico/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PrecoProdutoServicos } from './api';
import { precoProdutoServicoKeys } from './queryKeys';
import {
    PrecoProdutoServicoListResponse,
    PrecoProdutoServicoResponse,
    PrecoProdutoServicoCreateResponse,
    PrecoProdutoServicoDeleteResponse,
} from './types';
import { PrecoProdutoServicoInput, PrecoProdutoServicoUpdateInput } from './schema';

export const usePrecoProdutoServicos = () => {
    return useQuery<PrecoProdutoServicoListResponse>({
        queryKey: precoProdutoServicoKeys.all,
        queryFn: PrecoProdutoServicos.listar,
    });
};

export const usePrecoProdutoServico = (id: number) => {
    return useQuery<PrecoProdutoServicoResponse>({
        queryKey: precoProdutoServicoKeys.detail(id),
        queryFn: () => PrecoProdutoServicos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarPrecoProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<PrecoProdutoServicoCreateResponse, unknown, PrecoProdutoServicoInput>({
        mutationFn: (data) => PrecoProdutoServicos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.all });
        },
    });
};

export const useAtualizarPrecoProdutoServico = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<PrecoProdutoServicoResponse, unknown, PrecoProdutoServicoUpdateInput>({
        mutationFn: (data) => PrecoProdutoServicos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.all });
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.detail(id) });
        },
    });
};

export const useDeletarPrecoProdutoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<PrecoProdutoServicoDeleteResponse, unknown, number>({
        mutationFn: (id) => PrecoProdutoServicos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: precoProdutoServicoKeys.all });
        },
    });
};
```
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos com suas respectivas melhorias:
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/produtos/produto/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado.

A tela de tabela tem um seção que contém um botão para Novo Produto, Filtros e Colunas:

```html
<div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
    <div className="text-2xl font-bold">Produtos</div>

    <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
        <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
            <DialogTrigger
                render={
                    <Button size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Novo Produto
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Produto</DialogTitle>
                    <DialogDescription>
                        Preencha os campos corretamente para cadastrar um novo produto.
                    </DialogDescription>
                </DialogHeader>

                <ProdutoForm
                    defaultValues={DEFAULT_FORM}
                    onSubmit={handleCriar}
                    submitting={criarMutation.isPending}
                    opcoesCategorias={categorias}
                />
            </DialogContent>
        </Dialog>
        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1">
                <Funnel className="h-4 w-4" />
                Filtros
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="outline" size="sm" className="gap-1">
                            <Columns className="h-4 w-4" />
                            Colunas
                        </Button>
                    }
                />
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
</div>
```

Não utilizar @/components/ui/form
***

Certo, no arquivo "imagem-card.tsx" adicionei dois botões:

1 - Para Visualizar
```tsx
<Button size="icon-xs" variant="outline" className="bg-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
   <View className="h-3 w-3 text-white" />
</Button>"
```
o botão deve abrir um formulário igual:
```tsx
<Dialog open={dialogVisualizarAberto} 
    onOpenChange={(open) => {
        setDialogVisualizarAberto(open);
        if (!open) setImagemSelecionada(null);
    }}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Imagem do Produto</DialogTitle>
            <DialogDescription>Detalhes da imagem selecionada</DialogDescription>
        </DialogHeader>
        {imagemSelecionada && (
            <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE_URL}/${imagemSelecionada.des_url_imagem}`} alt={imagemSelecionada.des_titulo_imagem ?? 'Imagem'} className="w-full max-h-64 object-contain rounded border" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>ID</Label>
                        <Input value={imagemSelecionada.id} disabled />
                    </div>
                    <div className="space-y-1">
                        <Label>Vínculo</Label>
                        <Input value={ imagemSelecionada.id_produto ? produtosMap[imagemSelecionada.id_produto] ?? `Produto #${imagemSelecionada.id_produto}` : gradesMap[imagemSelecionada.id_produto_grade ?? 0] ?? `Grade #${imagemSelecionada.id_produto_grade}` } disabled />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label>Título</Label>
                    <Input value={imagemSelecionada.des_titulo_imagem ?? '-'} disabled />
                </div>
                <div className="space-y-1">
                    <Label>Descrição</Label>
                    <Input value={imagemSelecionada.des_imagem ?? '-'} disabled />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Criado</Label>
                        <Input value={imagemSelecionada.created_at ? formatarData(imagemSelecionada.created_at) : '-'} disabled />
                    </div>
                    <div className="space-y-1">
                        <Label>Editado</Label>
                        <Input value={imagemSelecionada.updated_at ? formatarData(imagemSelecionada.updated_at) : '-'} disabled />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose variant="outline">Fechar</DialogClose>
                </DialogFooter>
            </div>
        )}
    </DialogContent>
</Dialog>
```    
2 - Para Editar
```tsx
<Button size="icon-xs" variant="outline" className="bg-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
    <SquarePen className="h-3 w-3 text-white" />
</Button>
```
o botão deve abrir um formulário igual:
```tsx
function ImagemProdutoUpdateForm({
    defaultValues,
    onSubmit,
    submitting,
    produtos,
    grades,
    imagemAtualUrl,
}: {
    defaultValues: ImagemProdutoUpdateInput;
    onSubmit: (data: ImagemProdutoUpdateInput) => void;
    submitting?: boolean;
    produtos: { id: number; nom_produto: string }[];
    grades: { id: number; label: string }[];
    imagemAtualUrl?: string | null;
}) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ImagemProdutoUpdateInput>({
        resolver: zodResolver(imagemProdutoUpdateSchema),
        defaultValues,
    });

    const tipoVinculo = watch('tipo_vinculo');
    const arquivo = watch('arquivo');
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!arquivo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(arquivo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [arquivo]);

    const handleTipoVinculoChange = (tipo: string) => {
        setValue('tipo_vinculo', tipo as ImagemProdutoUpdateInput['tipo_vinculo']);
        if (tipo === TIPO_VINCULO.PRODUTO) {
            setValue('id_produto_grade', null);
        } else {
            setValue('id_produto', null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* RadioGroup (Produto/Grade) + Switch (Principal) */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <Controller
                    name="tipo_vinculo"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={handleTipoVinculoChange}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.PRODUTO} id="edit-vinculo-produto" />
                                <Label htmlFor="edit-vinculo-produto">Produto</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.GRADE} id="edit-vinculo-grade" />
                                <Label htmlFor="edit-vinculo-grade">Grade</Label>
                            </div>
                        </RadioGroup>
                    )}
                />

                <div className="flex items-center gap-2">
                    <Label htmlFor="edit-ind_principal">Imagem principal</Label>
                    <Controller
                        name="ind_principal"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="edit-ind_principal"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Select dinâmico: produto ou grade */}
            <div className="space-y-1">
                <Label>{tipoVinculo === TIPO_VINCULO.PRODUTO ? 'Produto' : 'Grade (Produto - Tamanho)'}</Label>
                {tipoVinculo === TIPO_VINCULO.PRODUTO ? (
                    <Controller
                        name="id_produto"
                        control={control}
                        render={({ field }) => {
                            
                            const labelSelecionado = produtos.find((p) => p.id === field.value)?.nom_produto;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o produto">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produtos.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nom_produto}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                ) : (
                    <Controller
                        name="id_produto_grade"
                        control={control}
                        render={({ field }) => {
                            const labelSelecionado = grades.find((g) => g.id === field.value)?.label;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a grade">
                                            {labelSelecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map((g) => (
                                            <SelectItem key={g.id} value={String(g.id)}>
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                )}
                {errors.id_produto && (
                    <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                )}
            </div>

            {/* Upload de arquivo com preview (opcional na edição) */}
            <div className="space-y-1">
                <Label>Arquivo da Imagem</Label>
                <Controller
                    name="arquivo"
                    control={control}
                    render={({ field }) => (
                        <>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="edit-arquivo-imagem"
                                    className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed bg-muted/30"
                                >
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : imagemAtualUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={`${BASE_URL}/${imagemAtualUrl}`}
                                            alt="Imagem atual"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </label>
                                <Input
                                    id="edit-arquivo-imagem"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                />
                            </div>
                            <div className="min-w-0">
                                <span
                                    className="block text-sm text-muted-foreground truncate"
                                    title={field.value?.name ?? undefined}
                                >
                                    {field.value?.name ?? 'Manter arquivo atual'}
                                </span>
                            </div>
                        </>
                    )}
                />
                {errors.arquivo && (
                    <p className="text-sm text-destructive">{errors.arquivo.message as string}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Título da Imagem</Label>
                <Controller
                    name="des_titulo_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: Estampa de onça" />
                    )}
                />
                {errors.des_titulo_imagem && (
                    <p className="text-sm text-destructive">{errors.des_titulo_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Descrição da Imagem</Label>
                <Controller
                    name="des_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Ex: Bermuda de cintura alta com estampa de onça"
                        />
                    )}
                />
                {errors.des_imagem && (
                    <p className="text-sm text-destructive">{errors.des_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Ordem de Exibição</Label>
                <Controller
                    name="num_ordem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            min={0}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                {errors.num_ordem && (
                    <p className="text-sm text-destructive">{errors.num_ordem.message}</p>
                )}
            </div>

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}
```
***
Atualmente o formulário contido no arquivo 'galeria-section.tsx' para inserção de uma nova imagem de Produto ou Grade esta utilizando o formulário contido no arquivo 'imagem-upload-dialog.tsx', gostaria de que o formulário fosse igual ao formulário da página de imagem-produto contido no arquivo 'page.tsx'.

```tsx
function ImagemProdutoCreateForm({
    onSubmit,
    submitting,
    produtos,
    grades,
}: {
    onSubmit: (data: ImagemProdutoCreateInput) => void;
    submitting?: boolean;
    produtos: { id: number; nom_produto: string }[];
    grades: { id: number; label: string }[];
}) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ImagemProdutoCreateInput>({
        resolver: zodResolver(imagemProdutoCreateSchema),
        defaultValues: DEFAULT_FORM,
    });

    const tipoVinculo = watch('tipo_vinculo');
    const arquivo = watch('arquivo');
    const [preview, setPreview] = useState<string | null>(null);

    // Gera/limpa a URL de preview sempre que o arquivo mudar (evita memory leak)
    useEffect(() => {
        if (!arquivo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(arquivo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [arquivo]);

    const handleTipoVinculoChange = (tipo: string) => {
        setValue('tipo_vinculo', tipo as ImagemProdutoCreateInput['tipo_vinculo']);
        // Ao trocar o tipo, limpa o outro ID para não violar a regra XOR do banco
        if (tipo === TIPO_VINCULO.PRODUTO) {
            setValue('id_produto_grade', null);
        } else {
            setValue('id_produto', null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Linha: RadioGroup (Produto/Grade) + Switch (Principal) */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <Controller
                    name="tipo_vinculo"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={handleTipoVinculoChange}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.PRODUTO} id="vinculo-produto" />
                                <Label htmlFor="vinculo-produto">Produto</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.GRADE} id="vinculo-grade" />
                                <Label htmlFor="vinculo-grade">Grade</Label>
                            </div>
                        </RadioGroup>
                    )}
                />

                <div className="flex items-center gap-2">
                    <Label htmlFor="ind_principal">Imagem principal</Label>
                    <Controller
                        name="ind_principal"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="ind_principal"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Select dinâmico: produto ou grade, conforme o RadioGroup */}
            <div className="space-y-1">
                <Label>{tipoVinculo === TIPO_VINCULO.PRODUTO ? 'Produto' : 'Grade (Produto - Tamanho)'}</Label>
                {tipoVinculo === TIPO_VINCULO.PRODUTO ? (
                    <Controller
                        name="id_produto"
                        control={control}
                        render={({ field }) => {
                            const labelselecionado = produtos.find((p) => p.id === field.value)?.nom_produto;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o produto">
                                            {labelselecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produtos.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nom_produto}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )

                        }}
                    />
                ) : (
                    <Controller
                        name="id_produto_grade"
                        control={control}
                        render={({ field }) => {
                            const labelselecionado = grades.find((g) => g.id === field.value)?.label;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a grade">
                                            {labelselecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map((g) => (
                                            <SelectItem key={g.id} value={String(g.id)}>
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }}
                    />
                )}
                {errors.id_produto && (
                    <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                )}
            </div>

            {/* Upload de arquivo com preview */}
            <div className="space-y-1">
                <Label>Arquivo da Imagem</Label>
                <Controller
                    name="arquivo"
                    control={control}
                    render={({ field }) => (
                        <>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="arquivo-imagem"
                                    className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed bg-muted/30"
                                >
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </label>
                                <Input
                                    id="arquivo-imagem"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                />
                            </div>
                            <div className='min-w-0'>
                                <span className="block text-sm text-muted-foreground truncate"
                                    title={field.value?.name ?? undefined}>
                                    {field.value?.name ?? 'Nenhum arquivo selecionado'}
                                </span>
                            </div>
                        </>
                    )}
                />
                {errors.arquivo && (
                    <p className="text-sm text-destructive">{errors.arquivo.message as string}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Título da Imagem</Label>
                <Controller
                    name="des_titulo_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: Estampa de onça" />
                    )}
                />
                {errors.des_titulo_imagem && (
                    <p className="text-sm text-destructive">{errors.des_titulo_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Descrição da Imagem</Label>
                <Controller
                    name="des_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Ex: Bermuda de cintura alta com estampa de onça"
                        />
                    )}
                />
                {errors.des_imagem && (
                    <p className="text-sm text-destructive">{errors.des_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Ordem de Exibição</Label>
                <Controller
                    name="num_ordem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            min={0}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                {errors.num_ordem && (
                    <p className="text-sm text-destructive">{errors.num_ordem.message}</p>
                )}
            </div>

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}
```
***
Na tabela de produto, gostaria de trazer uma coluna de imagem preview caso o produto tenha imagem principal cadastrado exemplo da coluna:
```tsx
{
    id: 'preview',
    header: 'Imagem',
    cell: ({ row }) => (
        <img
            src={`${BASE_URL}/${row.original.des_url_imagem}`}
            alt={row.original.des_titulo_imagem ?? 'Imagem do produto'}
            className="h-12 w-12 rounded object-cover border"
        />
    ),
    meta: { label: 'Imagem' },
    enableSorting: false,
},
```

```tsx
// src/app/(private)/produtos/produto/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Produto } from '@/features/produtos/produto/types';
import { formatarData } from '@/lib/utils/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function SortableHeader({ label, column }: { label: string; column: any }) {
    return (
        <Button
            variant="ghost"
            className="p-0 h-auto font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
    );
}

export const columns: ColumnDef<Produto>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader label="ID" column={column} />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'nom_produto',
        header: ({ column }) => <SortableHeader label="Nome" column={column} />,
        meta: { label: 'Nome' },
    },
    {
        accessorKey: 'num_sku',
        header: ({ column }) => <SortableHeader label="SKU" column={column} />,
        meta: { label: 'SKU' },
        cell: ({ row }) => row.original.num_sku ?? '-',
    },
    {
        accessorKey: 'ref_produto',
        header: ({ column }) => <SortableHeader label="Referência" column={column} />,
        meta: { label: 'Referência' },
        cell: ({ row }) => row.original.ref_produto ?? '-',
    },
    {
        accessorKey: 'val_preco_base',
        header: ({ column }) => <SortableHeader label="Preço Base" column={column} />,
        meta: { label: 'Preço Base' },
        cell: ({ row }) => {
            const valor = Number(row.original.val_preco_base);
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
        },
    },
    {
        accessorKey: 'ind_ativo',
        header: ({ column }) => <SortableHeader label="Status" column={column} />,
        meta: { label: 'Status' },
        cell: ({ row }) =>
            row.original.ind_ativo === 1 ? (
                <Badge variant="default">Ativo</Badge>
            ) : (
                <Badge variant="secondary">Inativo</Badge>
            ),
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader label="Criado em" column={column} />,
        meta: { label: 'Criado em' },
        cell: ({ row }) => formatarData(row.original.created_at),
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader label="Atualizado em" column={column} />,
        meta: { label: 'Atualizado em' },
        cell: ({ row }) =>
            row.original.updated_at ? formatarData(row.original.updated_at) : '-',
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const produto = row.original;
            const meta = table.options.meta;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => meta?.onView?.(produto)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(produto)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(produto)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
```

```tsx
// src/app/(private)/produtos/produto/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Plus, Funnel, Columns } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

import { columns } from './columns';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    useProdutos,
    useCriarProduto,
    useAtualizarProduto,
    useDeletarProduto,
} from '@/features/produtos/produto/hooks';
import { ProdutoInput } from '@/features/produtos/produto/schema';
import { ProdutoForm } from '@/app/(private)/produtos/produto/produto-form';
import { Card, CardContent } from '@/components/ui/card';
import { useCategorias } from '@/features/produtos/categoria/hooks';
import { Produto } from '@/features/produtos/produto/types';
import { formatarData } from '@/lib/utils/formatters';

const DEFAULT_FORM: ProdutoInput = {
    id_categoria: null,
    nom_produto: '',
    num_sku: '',
    des_produto: '',
    ref_produto: '',
    val_preco_base: 0,
    ind_ativo: true,
};

const filterOptions = [
    { value: 'nom_produto', label: 'Nome' },
    { value: 'num_sku', label: 'SKU' },
    { value: 'ref_produto', label: 'Referência' },
];

export default function ProdutoPage() {
    const router = useRouter();
    const { data, isLoading } = useProdutos();
    const { data: categoriaRaw } = useCategorias();

    const criarMutation = useCriarProduto();

    // ---- states de dialogs / seleção ----
    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [produtoSelecionada, setProdutoSelecionada] = useState<Produto | null>(null);
    const [gradeParaDeletar, setGradeParaDeletar] = useState<Produto | null>(null);

    const [showFilters, setShowFilters] = useState(false);
    const [filterField, setFilterField] = useState('nom_produto');
    const [filterValue, setFilterValue] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<any[]>([]);

    const produtos = useMemo(
        () => (Array.isArray(data?.dados) ? data?.dados : []).filter((p) => p.deleted_at === null),
        [data]
    );

    const produtosMap = useMemo(() => {
        return produtos.reduce<Record<number, string>>((acc, v: any) => {
            acc[v.id] = v.nom_produto;
            return acc;
        }, {});
    }, [produtos]);

    const cateogrias = useMemo(
        () => (Array.isArray(categoriaRaw?.dados) ? categoriaRaw?.dados : []).filter((c) => c.deleted_at === null),
        [categoriaRaw]
    );

    const cateogriasMap = useMemo(() => {
        return cateogrias.reduce<Record<number, string>>((acc, v: any) => {
            acc[v.id] = v.nom_categoria;
            return acc;
        }, {});
    }, [cateogrias]);

    // ---- mutation de editar (depende do id selecionado) ----
    const atualizarMutation = useAtualizarProduto(produtoSelecionada?.id ?? 0);
    const deletarMutation = useDeletarProduto();

    const table = useReactTable({
        data: produtos,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
        meta: {
            produtosMap,
            cateogriasMap,
            onView: (produto: Produto) => {
                setProdutoSelecionada(produto);
                setDialogVisualizarAberto(true);
            },
            onEdit: (produto: Produto) => {
                router.push(`/produtos/produto/${produto.id}`);
            },
            onDelete: (produto: Produto) => {
                setGradeParaDeletar(produto);
            },
        },
    });

    function handleFilterChange(value: string) {
        setFilterValue(value);
        table.getColumn(filterField)?.setFilterValue(value);
    }

    function clearFilters() {
        setFilterValue('');
        table.getColumn(filterField)?.setFilterValue(undefined);
    }

    function handleCriar(values: ProdutoInput) {
        criarMutation.mutate(values, {
            onSuccess: (response) => {
                setDialogCriarAberto(false);
                // Redireciona para a tela de edição, liberando as seções
                // Grade, Produto/Serviço e Produto/Serviço/Preço
                router.push(`/produtos/produto/${response.dados.id}`);
            },
        });
    }

    function handleEditar(values: ProdutoInput) {
        if (!produtoSelecionada) return;
        atualizarMutation.mutate(values, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setProdutoSelecionada(null);
            },
        });
    }

    function handleConfirmarDelete() {
        if (!gradeParaDeletar) return;
        deletarMutation.mutate(gradeParaDeletar.id, {
            onSuccess: () => {
                setGradeParaDeletar(null);
            },
        });
    }

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Produtos</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Produto
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Produto</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo produto.
                            </DialogDescription>
                        </DialogHeader>

                        <ProdutoForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            opcoesCategorias={cateogrias}
                        />
                    </DialogContent>
                </Dialog>

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
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Columns className="h-4 w-4" />
                                    Colunas
                                </Button>
                            }
                        />
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

            {showFilters && (
                <div className="flex flex-wrap items-end gap-2 mb-4 p-4 border rounded-md bg-muted/20">
                    <div className="flex-1 min-w-[150px]">
                        <Select value={filterField} onValueChange={setFilterField}>
                            <SelectTrigger className="w-full">
                                {filterOptions.find((opt) => opt.value === filterField)?.label ||
                                    'Campo'}
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
                            placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'
                                }`}
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

            <Card
                className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 ${showFilters ? 'max-h-[55vh] sm:max-h-[60vh]' : 'max-h-[75vh] sm:max-h-[75vh]'
                    }`}
            >
                <CardContent className="p-0">
                    <div
                        className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary ${showFilters
                            ? 'max-h-[calc(55vh-105px)] sm:max-h-[calc(60vh-65px)]'
                            : 'max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]'
                            }`}
                    >
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Carregando...
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-muted/50">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Nenhum produto encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <DataTablePagination table={table} />

            {/* -------- Dialog: Visualizar -------- */}
            <Dialog open={dialogVisualizarAberto} onOpenChange={setDialogVisualizarAberto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes do Produto</DialogTitle>
                        <DialogDescription>Informações completas do produto selecionado.</DialogDescription>
                    </DialogHeader>

                    {produtoSelecionada && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nome</p>
                                <p className="font-medium">{produtoSelecionada.nom_produto}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">SKU</p>
                                <p className="font-medium">{produtoSelecionada.num_sku ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Referência</p>
                                <p className="font-medium">{produtoSelecionada.ref_produto ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Categoria</p>
                                <p className="font-medium">
                                    {produtoSelecionada.id_categoria
                                        ? cateogriasMap[produtoSelecionada.id_categoria] ?? produtoSelecionada.id_categoria
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Preço base</p>
                                <p className="font-medium">
                                    {Number(produtoSelecionada.val_preco_base).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge variant={produtoSelecionada.ind_ativo === 1 ? 'default' : 'secondary'}>
                                    {produtoSelecionada.ind_ativo === 1 ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Descrição</p>
                                <p className="font-medium">{produtoSelecionada.des_produto ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Criado em</p>
                                <p className="font-medium">{formatarData(produtoSelecionada.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Atualizado em</p>
                                <p className="font-medium">
                                    {produtoSelecionada.updated_at ? formatarData(produtoSelecionada.updated_at) : '-'}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* -------- Dialog: Editar -------- */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={(open) => {
                    setDialogEditarAberto(open);
                    if (!open) setProdutoSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>Atualize os dados do produto selecionado.</DialogDescription>
                    </DialogHeader>

                    {produtoSelecionada && (
                        <ProdutoForm
                            defaultValues={{
                                id_categoria: produtoSelecionada.id_categoria,
                                nom_produto: produtoSelecionada.nom_produto,
                                num_sku: produtoSelecionada.num_sku,
                                des_produto: produtoSelecionada.des_produto,
                                ref_produto: produtoSelecionada.ref_produto,
                                val_preco_base: Number(produtoSelecionada.val_preco_base),
                                ind_ativo: produtoSelecionada.ind_ativo === 1,
                            }}
                            onSubmit={handleEditar}
                            submitting={atualizarMutation.isPending}
                            opcoesCategorias={cateogrias}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* -------- AlertDialog: Deletar -------- */}
            <AlertDialog
                open={!!gradeParaDeletar}
                onOpenChange={(open) => {
                    if (!open) setGradeParaDeletar(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar produto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar o produto{' '}
                            <strong>{gradeParaDeletar?.nom_produto}</strong>? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmarDelete}
                            disabled={deletarMutation.isPending}
                        >
                            {deletarMutation.isPending ? 'Deletando...' : 'Deletar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
```