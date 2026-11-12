Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Produto em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar Produto Serviço
    * **Método HTTP**: POST
    * **URL**: /api/produtos/produto-servico
    * **Campos**:  id, id_produto, id_tipo_servico, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_produto": 3,
      "id_tipo_servico": 2,
      "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
        "id": 6,
        "id_produto": 3,
        "id_tipo_servico": 2,
        "ind_ativo": 1,
        "created_at": "2026-08-18T00:47:26.000Z",
        "updated_at": "2026-08-18T00:47:26.000Z",
        "deleted_at": null
      }
    }
    ```
  * Listar Produto Serviço:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/produto/produto-servico
    * **Campos**: id, id_produto, id_tipo_servico, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 3,
      "dados": [
        {
          "id": 1,
          "id_produto": 1,
          "id_tipo_servico": 1,
          "ind_ativo": 1,
          "created_at": "2026-07-06T12:52:13.000Z",
          "updated_at": "2026-07-06T12:52:13.000Z",
          "deleted_at": null
        },
        {
          "id": 5,
          "id_produto": 3,
          "id_tipo_servico": 2,
          "ind_ativo": 1,
          "created_at": "2026-07-06T13:00:43.000Z",
          "updated_at": "2026-07-14T13:21:22.000Z",
          "deleted_at": null
        },
        {
          "id": 6,
          "id_produto": 3,
          "id_tipo_servico": 2,
          "ind_ativo": 1,
          "created_at": "2026-08-18T00:47:26.000Z",
          "updated_at": "2026-08-18T00:47:26.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Buscar Produto Serviço: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/produto/produto-servico/{id}
    * **Campos**: id, id_produto, id_tipo_servico, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 5,
        "id_produto": 3,
        "id_tipo_servico": 2,
        "ind_ativo": 1,
        "created_at": "2026-07-06T13:00:43.000Z",
        "updated_at": "2026-07-14T13:21:22.000Z",
        "deleted_at": null
      }
    }
    ```
  * Atualizar Produto Serviço:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/produto/produto-servico/{id}
    * **Campos**: id, id_produto, id_tipo_servico, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: produtoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_tipo_servico": 2,
      "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 5,
        "id_produto": 3,
        "id_tipo_servico": 2,
        "ind_ativo": 1,
        "created_at": "2026-07-06T13:00:43.000Z",
        "updated_at": "2026-07-14T13:21:22.000Z",
        "deleted_at": null
      }
    }
    ```
  * Deletar Produto Serviço
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/produto/produto-servico/{id}
    * **Chaves**: produtoServicoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
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

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── produtos
│   │   │   ├── produto-servico
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── produto-servico
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...

```
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "horario":
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/produtos/produto-servico/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.

Segue abaixo os Hooks e types

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


// src/features/produtos/tipo-servico/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TipoServicos } from './api';
import { tipoServicoKeys } from './queryKeys';
import {
    TipoServicoListResponse,
    TipoServicoResponse,
    TipoServicoCreateResponse,
    TipoServicoDeleteResponse,
} from './types';
import { TipoServicoInput } from './schema';

export const useTiposServico = () => {
    return useQuery<TipoServicoListResponse>({
        queryKey: tipoServicoKeys.all,
        queryFn: TipoServicos.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTipoServico = (id: number) => {
    return useQuery<TipoServicoResponse>({
        queryKey: tipoServicoKeys.detail(id),
        queryFn: () => TipoServicos.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTipoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoServicoCreateResponse, unknown, TipoServicoInput>({
        mutationFn: (data) => TipoServicos.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.all });
        },
    });
};

export const useAtualizarTipoServico = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TipoServicoResponse, unknown, TipoServicoInput>({
        mutationFn: (data) => TipoServicos.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.all });
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.detail(id) });
        },
    });
};

export const useDeletarTipoServico = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoServicoDeleteResponse, unknown, number>({
        mutationFn: (id) => TipoServicos.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoServicoKeys.all });
        },
    });
};


// src/features/produtos/tipo-servico/types.ts

export interface TipoServico {
    id: number;
    des_tipo_ajuste: string;
    ind_ativo: number; // 0 ou 1, como retornado pelo MySQL (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface TipoServicoListResponse {
    sucesso: boolean;
    total?: number;
    dados: TipoServico[];
}

export interface TipoServicoResponse {
    sucesso: boolean;
    dados: TipoServico;
}

export interface TipoServicoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoServico;
}

export interface TipoServicoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}