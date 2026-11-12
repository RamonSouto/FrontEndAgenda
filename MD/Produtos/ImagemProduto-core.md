Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Grade em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que está acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar Imagem Produto
    * **Método HTTP**: POST
    * **URL**: /api/produtos/imagemProduto
    * **Campos**:  id, id_produto_grade, id_produto, des_titulo_imagem, des_imagem, des_url_imagem, num_ordem, ind_principal, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 0 minutos.
    * **Chaves**: imagemProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | id_produto_grade | interger | 12 |
      | id_produto | interger | 12 |
      | des_titulo_imagem | string | 'Estampa de onça' |
      | des_imagem | numstringber | 'Bermuda de cintura alta com colchetes na estampa de onça no tamanho PP' |
      | num_ordem | interger | 1 |
      | ind_principal | boolean | true/false |
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
        "id": [
          {
            "id": 5,
            "id_produto_grade": null,
            "id_produto": 9,
            "des_url_imagem": "uploads/imagem_produto/img-prod-Icone-1787681370646-89287822.png",
            "num_ordem": 1,
            "ind_principal": 1,
            "created_at": "2026-08-25T18:09:30.000Z",
            "updated_at": "2026-08-25T18:09:30.000Z",
            "deleted_at": null
          }
        ]
      }
    }
    ```
  * Listar Imagem Produto:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/imagemProduto
    * **Campos**: id, id_produto_grade, id_produto, des_titulo_imagem, des_imagem, des_url_imagem, num_ordem, ind_principal, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 0 minutos.
    * **Chaves**: imagemProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 2,
      "dados": [
        {
          "id": 1,
          "id_produto_grade": null,
          "id_produto": 1,
          "des_url_imagem": "uploads/imagem_produto/Ramon-David-Souto-LinkedIn-1782449095809-247904809.jpg",
          "num_ordem": 1,
          "ind_principal": 0,
          "created_at": "2026-06-26T04:44:55.000Z",
          "updated_at": "2026-07-14T14:20:50.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "id_produto_grade": null,
          "id_produto": 1,
          "des_url_imagem": "uploads/imagem_produto/Ramon-David-Souto-LinkedIn-1782449100202-336506985.jpg",
          "num_ordem": 1,
          "ind_principal": 0,
          "created_at": "2026-06-26T04:45:00.000Z",
          "updated_at": "2026-07-14T14:20:50.000Z",
          "deleted_at": null
        },
      ]
    }
    ```
  * Buscar Imagem ID Produto: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/imagemProduto/{id}
    * **Campos**: id, id_produto_grade, id_produto, des_titulo_imagem, des_imagem, des_url_imagem, num_ordem, ind_principal, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 0 minutos.
    * **Chaves**: imagemProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": [
        {
          "id": 1,
          "id_produto_grade": null,
          "id_produto": 1,
          "des_url_imagem": "uploads/imagem_produto/Ramon-David-Souto-LinkedIn-1782449095809-247904809.jpg",
          "num_ordem": 1,
          "ind_principal": 0,
          "created_at": "2026-06-26T04:44:55.000Z",
          "updated_at": "2026-07-14T14:20:50.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "id_produto_grade": null,
          "id_produto": 1,
          "des_url_imagem": "uploads/imagem_produto/Ramon-David-Souto-LinkedIn-1782449100202-336506985.jpg",
          "num_ordem": 1,
          "ind_principal": 0,
          "created_at": "2026-06-26T04:45:00.000Z",
          "updated_at": "2026-07-14T14:20:50.000Z",
          "deleted_at": null
        },
      ]
    }
    ```
  * Buscar Imagem ID Grade: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/imagemProdutoGrade/{id}
    * **Campos**: id, id_produto_grade, id_produto, des_titulo_imagem, des_imagem, des_url_imagem, num_ordem, ind_principal, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 0 minutos.
    * **Chaves**: imagemProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": [
        {
          "id": 3,
          "id_produto_grade": 1,
          "id_produto": null,
          "des_url_imagem": "uploads/imagem_produto/Ramon-David-Souto-LinkedIn-1782450786691-544839042.jpg",
          "num_ordem": 1,
          "ind_principal": 0,
          "created_at": "2026-06-26T05:13:06.000Z",
          "updated_at": "2026-06-26T05:14:01.000Z",
          "deleted_at": null
        },
        {
          "id": 4,
          "id_produto_grade": 1,
          "id_produto": null,
          "des_url_imagem": "uploads/imagem_produto/Ramon-David-Souto-LinkedIn-1782450841305-764649282.jpg",
          "num_ordem": 1,
          "ind_principal": 0,
          "created_at": "2026-06-26T05:14:01.000Z",
          "updated_at": "2026-06-26T05:21:46.000Z",
          "deleted_at": null
        },
      ]
    }
    ```
  * Atualizar Imagem Produto:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/imagemProduto/{id}
    * **Campos**: id, id_produto_grade, id_produto, des_titulo_imagem, des_imagem, des_url_imagem, num_ordem, ind_principal, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 0 minutos.
    * **Chaves**: imagemProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | id_produto | interger | 12 |
      | ind_principal | boolean | true/false |
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": []
    }
    ```
  * Deletar Imagem Produto
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/imagemProduto/{id}
    * **Cache**: staleTime de 0 minutos.
    * **Chaves**: imagemProdutoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_produto_imagens (
  id int NOT NULL AUTO_INCREMENT,
  id_produto_grade int DEFAULT NULL,
  id_produto int DEFAULT NULL,
  des_titulo_imagem varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_imagem varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_url_imagem varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  num_ordem int DEFAULT '0',
  ind_principal tinyint(1) DEFAULT '0',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_produto (id_produto),
  KEY idx_grade (id_produto_grade),
  KEY idx_ordem (num_ordem),
  CONSTRAINT tab_produto_imagens_ibfk_1 FOREIGN KEY (id_produto_grade) REFERENCES tab_produto_grade (id) ON DELETE CASCADE,
  CONSTRAINT tab_produto_imagens_ibfk_2 FOREIGN KEY (id_produto) REFERENCES tab_produtos (id) ON DELETE CASCADE,
  CONSTRAINT chk_produto_ou_grade CHECK ((((id_produto is not null) and (id_produto_grade is null)) or ((id_produto is null) and (id_produto_grade is not null))))
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── produtos
│   │   │   ├── imagem-produto
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── imagem-produto
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...

```
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "categoria":
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/produtos/grade/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.


No formulário para inserir a imagem (produto/grade) deve conter o título "Imagem do Produto", logo abaixo deve conter um texto explicativo "Preencha os campos corretamente para cadastrar uma nova imagem", logo abaixo na mesma linha deve conter um Radio Group para selecionar se vai se inserido uma imagem de "Produto" ou "Grade" e na mesma linha deve ter uma switch para informar se e imagem principal ou não, logo abaixo deve conter um select que se for selecionado "Produto" deve trazer a lista dos produtos, se for selecionado "Grade" deve trazer o "nome da do produto - tamanho", deve conter um input file com preview, deve conter o Titulo da Imagem, conter uma imagem de descrição, um campo para inserir o em qual o número da ordem deve ser inserido a foto.

Produto:
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
//src/features/produtos/produto/queryKeys.ts

export const produtoKeys = {
    all: ['produtos'] as const,
    detail: (id: number) => ['produtos', id] as const,
};
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

    buscar: (id: number) => httpClient.get<ProdutoResponse>(`/api/produtos/produto/${id}`),

    criar: (data: ProdutoInput) =>
        httpClient.post<ProdutoCreateResponse>('/api/produtos/produto', data),

    atualizar: (id: number, data: ProdutoInput) =>
        httpClient.put<ProdutoResponse>(`/api/produtos/produto/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<ProdutoDeleteResponse>(`/api/produtos/produto/${id}`),
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
Grade:
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
        onError: (error) => {
            console.error('Erro ao deletar grade: ', error)
        }
    });
};
```

```ts
//src/features/produtos/imagem-produto/types.ts

export interface ImagemProduto {
    id: number;
    id_produto_grade: number | null;
    id_produto: number | null;
    des_titulo_imagem: string | null;
    des_imagem: string | null;
    des_url_imagem: string;
    num_ordem: number;
    ind_principal: number; // 0 ou 1 (vem assim do backend)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

// GET /api/produtos/imagemProduto
export interface ImagemProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: ImagemProduto[];
}

// GET /api/produtos/imagemProduto/{id} e /imagemProdutoGrade/{id}
// -> a API retorna um array dentro de "dados", mesmo buscando por id
export interface ImagemProdutoConsultaResponse {
    sucesso: boolean;
    dados: ImagemProduto[];
}

// POST /api/produtos/imagemProduto
export interface ImagemProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: { id: number[] };
}

// PUT /api/produtos/imagemProduto/{id}
export interface ImagemProdutoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: unknown[];
}

// DELETE /api/produtos/imagemProduto/{id}
export interface ImagemProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

```ts
//src/features/produtos/imagem-produto/schema.ts
import { z } from 'zod';

// Payload enviado no POST (criar)
export const imagemProdutoCreateSchema = z
    .object({
        id_produto_grade: z.number().int().nullable().optional(),
        id_produto: z.number().int().nullable().optional(),
        des_titulo_imagem: z.string().max(50, 'Máximo de 50 caracteres').nullable().optional(),
        des_imagem: z.string().max(255, 'Máximo de 255 caracteres').nullable().optional(),
        num_ordem: z.coerce.number().int().default(0),
        ind_principal: z.boolean(),
    })
    // Regra de negócio do CHECK constraint do banco:
    // ou id_produto OU id_produto_grade, nunca os dois nem nenhum.
    .refine(
        (data) => {
            const temProduto = data.id_produto !== null && data.id_produto !== undefined;
            const temGrade = data.id_produto_grade !== null && data.id_produto_grade !== undefined;
            return temProduto !== temGrade; // XOR
        },
        {
            message: 'Informe id_produto OU id_produto_grade (nunca os dois, nem nenhum).',
            path: ['id_produto'],
        }
    );

export type ImagemProdutoCreateInput = z.infer<typeof imagemProdutoCreateSchema>;

// Payload enviado no PUT (atualizar) — conforme especificado, só 2 campos
export const imagemProdutoUpdateSchema = z.object({
    id_produto: z.coerce.number().int(),
    ind_principal: z.boolean(),
});

export type ImagemProdutoUpdateInput = z.infer<typeof imagemProdutoUpdateSchema>;
```

```ts
//src/features/produtos/imagem-produto/queryKeys.ts

export const imagemProdutoKeys = {
    all: ['imagemProduto'] as const,
    porProduto: (idProduto: number) => ['imagemProduto', 'produto', idProduto] as const,
    porGrade: (idGrade: number) => ['imagemProduto', 'grade', idGrade] as const,
};
```

```ts
//src/features/produtos/imagem-produto/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ImagemProdutoListResponse,
    ImagemProdutoConsultaResponse,
    ImagemProdutoCreateResponse,
    ImagemProdutoUpdateResponse,
    ImagemProdutoDeleteResponse,
} from './types';
import { ImagemProdutoCreateInput, ImagemProdutoUpdateInput } from './schema';

export const ImagensProduto = {
    // GET /api/produtos/imagemProduto
    listar: () =>
        httpClient.get<ImagemProdutoListResponse>('/api/produtos/imagemProduto'),

    // GET /api/produtos/imagemProduto/{id}  (id aqui é id_produto)
    buscarPorProduto: (idProduto: number) =>
        httpClient.get<ImagemProdutoConsultaResponse>(`/api/produtos/imagemProduto/${idProduto}`),

    // GET /api/produtos/imagemProdutoGrade/{id}  (id aqui é id_produto_grade)
    buscarPorGrade: (idGrade: number) =>
        httpClient.get<ImagemProdutoConsultaResponse>(`/api/produtos/imagemProdutoGrade/${idGrade}`),

    // POST /api/produtos/imagemProduto
    criar: (data: ImagemProdutoCreateInput) =>
        httpClient.post<ImagemProdutoCreateResponse>('/api/produtos/imagemProduto', data),

    // PUT /api/produtos/imagemProduto/{id}
    atualizar: (id: number, data: ImagemProdutoUpdateInput) =>
        httpClient.put<ImagemProdutoUpdateResponse>(`/api/produtos/imagemProduto/${id}`, data),

    // DELETE /api/produtos/imagemProduto/{id}
    deletar: (id: number) =>
        httpClient.delete<ImagemProdutoDeleteResponse>(`/api/produtos/imagemProduto/${id}`),
};
```

```ts
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

// Listagem geral (usada na tela de gerenciamento)
export const useImagensProduto = () => {
    return useQuery<ImagemProdutoListResponse>({
        queryKey: imagemProdutoKeys.all,
        queryFn: ImagensProduto.listar,
        staleTime: 0,
    });
};

// Imagens de um produto específico (ex: galeria na tela de detalhe do produto)
export const useImagensPorProduto = (idProduto: number) => {
    return useQuery<ImagemProdutoConsultaResponse>({
        queryKey: imagemProdutoKeys.porProduto(idProduto),
        queryFn: () => ImagensProduto.buscarPorProduto(idProduto),
        staleTime: 0,
        enabled: !!idProduto, // só dispara a requisição se houver um id válido
    });
};

// Imagens de uma grade específica (variação/tamanho do produto)
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
            // Invalida a lista geral para forçar refetch após criar
            queryClient.invalidateQueries({ queryKey: imagemProdutoKeys.all });
        },
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
```

```tsx
// app/(private)/produtos/imagem-produto/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { ImagemProduto } from '@/features/produtos/imagem-produto/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
        produtosMap?: Record<number, string>;
        gradesMap?: Record<number, string>
    }
}

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const imagemProdutoColumns: ColumnDef<ImagemProduto>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        id: 'preview',
        header: 'Imagem',
        cell: ({ row }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={`${BASE_URL}/${row.original.des_url_imagem}`}
                alt={row.original.des_titulo_imagem ?? 'Imagem do produto'}
                className="h-12 w-12 rounded object-cover border"
            />
        ),
        meta: { label: 'Imagem' },
        enableSorting: false,
    },
    {
        accessorKey: 'des_titulo_imagem',
        header: ({ column }) => <SortableHeader column={column} label="Título" />,
        cell: ({ row }) => row.original.des_titulo_imagem ?? '-',
        meta: { label: 'Título' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'id_produto',
        header: ({ column }) => <SortableHeader column={column} label="Produto" />,
        cell: ({ row, table }) => {
            const idProduto = row.original.id_produto
            if (!idProduto) return;
            const nome = table.options.meta?.produtosMap?.[idProduto];
            return nome ?? idProduto
        },
        meta: { label: 'Produto' },
    },
    {
        accessorKey: 'id_grade',
        header: ({ column }) => <SortableHeader column={column} label="Grade" />,
        cell: ({ row, table }) => {
            const idGrade = row.original.id_produto_grade;
            if (!idGrade) return <Badge variant="secondary">-</Badge>;
            const nome = table.options.meta?.gradesMap?.[idGrade];
            return nome ?? idGrade;
        },
        meta: { label: 'Grade' },
    },
    {
        accessorKey: 'num_ordem',
        header: ({ column }) => <SortableHeader column={column} label="Ordem" />,
        meta: { label: 'Ordem' },
    },
    {
        accessorKey: 'ind_principal',
        header: ({ column }) => <SortableHeader column={column} label="Principal" />,
        cell: ({ row }) =>
            row.original.ind_principal ? (
                <Badge>Principal</Badge>
            ) : (
                <Badge variant="secondary">Secundária</Badge>
            ),
        meta: { label: 'Principal' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Criado" />,
        cell: ({ row }) => (row.original.created_at ? formatarData(row.original.created_at) : '-'),
        meta: { label: 'Criado' },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader column={column} label="Editado" />,
        cell: ({ row }) => (row.original.updated_at ? formatarData(row.original.updated_at) : '-'),
        meta: { label: 'Editado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const imagem = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(imagem)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(imagem)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(imagem)}>
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
// app/(private)/produtos/imagem-produto/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    useImagensProduto,
    useCriarImagemProduto,
    useAtualizarImagemProduto,
    useDeletarImagemProduto,
} from '@/features/produtos/imagem-produto/hooks';
import {
    imagemProdutoCreateSchema,
    imagemProdutoUpdateSchema,
    ImagemProdutoCreateInput,
    ImagemProdutoUpdateInput,
} from '@/features/produtos/imagem-produto/schema';
import { ImagemProduto } from '@/features/produtos/imagem-produto/types';
import { imagemProdutoColumns } from './columns';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { useGradeProduto, useGradesProduto } from '@/features/produtos/grade/hooks';
import { useProdutos } from '@/features/produtos/produto/hooks';
import { useTamanhos } from '@/features/produtos/tamanho/hooks';

const TIPO_VINCULO = { PRODUTO: 'produto', GRADE: 'grade' } as const;

const DEFAULT_FORM: ImagemProdutoCreateInput = {
    id_produto: null,
    id_produto_grade: null,
    des_titulo_imagem: '',
    des_imagem: '',
    num_ordem: 0,
    ind_principal: false,
};

// --- Formulário de criação ---
function ImagemProdutoCreateForm({
    onSubmit,
    submitting,
}: {
    onSubmit: (data: ImagemProdutoCreateInput) => void;
    submitting?: boolean;
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

    // Alterna entre vincular a um produto ou a uma grade (regra do CHECK do banco)
    const tipoVinculo = watch('id_produto') !== null ? TIPO_VINCULO.PRODUTO : TIPO_VINCULO.GRADE;

    const handleTipoVinculoChange = (tipo: string) => {
        if (tipo === TIPO_VINCULO.PRODUTO) {
            setValue('id_produto_grade', null);
        } else {
            setValue('id_produto', null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label>Vincular a</Label>
                <Select value={tipoVinculo} onValueChange={handleTipoVinculoChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={TIPO_VINCULO.PRODUTO}>Produto</SelectItem>
                        <SelectItem value={TIPO_VINCULO.GRADE}>Grade (variação)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {tipoVinculo === TIPO_VINCULO.PRODUTO ? (
                <div className="space-y-1">
                    <Label>ID do Produto</Label>
                    <Controller
                        name="id_produto"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                            />
                        )}
                    />
                </div>
            ) : (
                <div className="space-y-1">
                    <Label>ID da Grade</Label>
                    <Controller
                        name="id_produto_grade"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                            />
                        )}
                    />
                </div>
            )}
            {errors.id_produto && (
                <p className="text-sm text-destructive">{errors.id_produto.message}</p>
            )}

            <div className="space-y-1">
                <Label>Título da Imagem</Label>
                <Controller
                    name="des_titulo_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: Estampa de onça" />
                    )}
                />
            </div>

            <div className="space-y-1">
                <Label>Descrição</Label>
                <Controller
                    name="des_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Descrição da imagem" />
                    )}
                />
            </div>

            <div className="space-y-1">
                <Label>Ordem</Label>
                <Controller
                    name="num_ordem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
            </div>

            <div className="flex items-center gap-2">
                <Controller
                    name="ind_principal"
                    control={control}
                    render={({ field }) => (
                        <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />
                    )}
                />
                <Label>Imagem principal</Label>
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

// --- Formulário de edição (só id_produto + ind_principal, conforme contrato da API) ---
function ImagemProdutoUpdateForm({
    defaultValues,
    onSubmit,
    submitting,
}: {
    defaultValues: ImagemProdutoUpdateInput;
    onSubmit: (data: ImagemProdutoUpdateInput) => void;
    submitting?: boolean;
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ImagemProdutoUpdateInput>({
        resolver: zodResolver(imagemProdutoUpdateSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label>ID do Produto</Label>
                <Controller
                    name="id_produto"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                {errors.id_produto && (
                    <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Controller
                    name="ind_principal"
                    control={control}
                    render={({ field }) => (
                        <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(!!v)} />
                    )}
                />
                <Label>Imagem principal</Label>
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

export default function ImagemProdutoPage() {
    const { data: imagensRaw, isLoading, error } = useImagensProduto();

    const { data: produtosRaw, isLoading: isLoadingProdutos } = useProdutos();
    const { data: gradesRaw, isLoading: isLoadingGrades } = useGradesProduto();
    const { data: tamanhosRaw, isLoading: isLoadingTamanhos } = useTamanhos();

    const imagens = useMemo(() => {
        return (Array.isArray(imagensRaw?.dados) ? imagensRaw.dados : []).filter((i) => i.deleted_at === null)
    }, [imagensRaw]);

    const produtos = useMemo(() => {
        return (Array.isArray(produtosRaw?.dados) ? produtosRaw.dados : []).filter((p) => p.deleted_at === null);
    }, [produtosRaw]);

    const grades = useMemo(() => {
        return (Array.isArray(gradesRaw?.dados) ? gradesRaw.dados : []).filter((p) => p.deleted_at === null);
    }, [gradesRaw]);

    const tamanhos = useMemo(() => {
        return (Array.isArray(tamanhosRaw?.dados) ? tamanhosRaw.dados : []).filter((t: any) => t.deleted_at === null);
    }, [tamanhosRaw]);


    const produtosMap = useMemo(() => {
        return produtos.reduce<Record<number, string>>((acc, p: any) => {
            acc[p.id] = p.nom_produto;
            return acc;
        }, {});
    }, [produtos]);

    const tamanhosMap = useMemo(() => {
        return tamanhos.reduce<Record<number, string>>((acc, t: any) => {
            acc[t.id] = t.des_tamanho ?? t.nom_tamanho; // ajuste conforme o campo real
            return acc;
        }, {});
    }, [tamanhos]);

    const gradesMap = useMemo(() => {
        return grades.reduce<Record<number, string>>((acc, g: any) => {
            const nomeProduto = produtosMap[g.id_produto] ?? g.id_produto;
            const nomeTamanho = tamanhosMap[g.id_tamanho] ?? g.id_tamanho;
            acc[g.id] = `${nomeProduto} - ${nomeTamanho}`;
            return acc;
        }, {});
    }, [grades, produtosMap, tamanhosMap]);

    const criarMutation = useCriarImagemProduto();
    const [imagemSelecionada, setImagemSelecionada] = useState<ImagemProduto | null>(null);
    const atualizarMutation = useAtualizarImagemProduto(imagemSelecionada?.id ?? 0);
    const deletarMutation = useDeletarImagemProduto();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [imagemParaDeletar, setImagemParaDeletar] = useState<ImagemProduto | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return imagemProdutoColumns
            .filter((col) => 'accessorKey' in col && col.id !== 'id' && col.id !== 'acoes')
            .map((col) => ({
                value: (col as any).accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));
    }, []);

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
        data: imagens,
        columns: imagemProdutoColumns,
        state: { columnFilters, sorting, pagination, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        manualPagination: false,
        meta: {
            produtosMap,
            gradesMap,
            onView: (imagem: ImagemProduto) => {
                setImagemSelecionada(imagem);
                setDialogVisualizarAberto(true);
            },
            onEdit: (imagem: ImagemProduto) => {
                setImagemSelecionada(imagem);
                setDialogEditarAberto(true);
            },
            onDelete: (imagem: ImagemProduto) => {
                setImagemParaDeletar(imagem);
            },
        },
    });

    const handleCriar = (data: ImagemProdutoCreateInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Imagem cadastrada com sucesso');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao cadastrar a imagem.');
                }
            },
        });
    };

    const handleAtualizar = (data: ImagemProdutoUpdateInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setImagemSelecionada(null);
                toast.success('Imagem atualizada com sucesso!');
            },
            onError: (error) => {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao atualizar a imagem.');
                }
            },
        });
    };

    const confirmarDelecao = () => {
        if (!imagemParaDeletar) return;
        deletarMutation.mutate(imagemParaDeletar.id, {
            onSuccess: () => {
                setImagemParaDeletar(null);
                toast.success('Imagem deletada com sucesso!');
            },
            onError: (error) => {
                setImagemParaDeletar(null);
                if (error instanceof ApiError) {
                    toast.error(error.message);
                } else {
                    toast.error('Erro inesperado ao deletar a imagem.');
                }
            },
        });
    };

    if (error) return <div>Erro ao carregar imagens.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Imagens de Produto</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Imagem
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Imagem do Produto</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova imagem.
                            </DialogDescription>
                        </DialogHeader>

                        <ImagemProdutoCreateForm onSubmit={handleCriar} submitting={criarMutation.isPending} />
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
                                    <TableSkeleton columnsCount={imagemProdutoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={imagemProdutoColumns.length} className="text-center py-4">
                                            Nenhuma imagem encontrada.
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

            {/* Dialog de edição */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={(open) => {
                    setDialogEditarAberto(open);
                    if (!open) setImagemSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Imagem do Produto</DialogTitle>
                        <DialogDescription>
                            Atualize o produto vinculado e/ou a marcação de imagem principal.
                        </DialogDescription>
                    </DialogHeader>
                    {imagemSelecionada && (
                        <ImagemProdutoUpdateForm
                            defaultValues={{
                                id_produto: imagemSelecionada.id_produto ?? 0,
                                ind_principal: !!imagemSelecionada.ind_principal,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setImagemSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Imagem do Produto</DialogTitle>
                        <DialogDescription>Detalhes da imagem selecionada.</DialogDescription>
                    </DialogHeader>
                    {imagemSelecionada && (
                        <div className="space-y-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${imagemSelecionada.des_url_imagem}`}
                                alt={imagemSelecionada.des_titulo_imagem ?? 'Imagem'}
                                className="w-full max-h-64 object-contain rounded border"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={imagemSelecionada.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Vínculo</Label>
                                    <Input
                                        value={
                                            imagemSelecionada.id_produto
                                                ? `Produto #${imagemSelecionada.id_produto}`
                                                : `Grade #${imagemSelecionada.id_produto_grade}`
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Título</Label>
                                <Input value={imagemSelecionada.des_titulo_imagem ?? '-'} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={imagemSelecionada.created_at ? formatarData(imagemSelecionada.created_at) : '-'}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={imagemSelecionada.updated_at ? formatarData(imagemSelecionada.updated_at) : '-'}
                                        disabled
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose variant="outline">Fechar</DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmação de deleção */}
            <AlertDialog open={!!imagemParaDeletar} onOpenChange={(open) => !open && setImagemParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar imagem</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta imagem? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarDelecao} disabled={deletarMutation.isPending}>
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
```