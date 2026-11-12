Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Preço x Produto x Serviço em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que está acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar Preço Produto Serviço
    * **Método HTTP**: POST
    * **URL**: /api/produtos/precoProdutoServico
    * **Campos**:  id, id_produto_servico, val_preco, dta_inicio, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: precoProdutoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
        "id_produto_servico": 7,
        "val_preco": 2.50,
        "dta_inicio": "07-06-2026"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "mensagem": "Registro criado com sucesso",
        "dados": {
            "id": 12
        }
    }
    ```
  * Listar Preço Produto Serviço:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/precoProdutoServico
    * **Campos**: id, id_produto_servico, val_preco, dta_inicio, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: precoProdutoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "total": 2,
        "dados": [
            {
                "id": 1,
                "id_produto_servico": 1,
                "val_preco": "5.40",
                "dta_inicio": "2026-07-06T03:00:00.000Z",
                "created_at": "2026-07-06T14:15:33.000Z",
                "updated_at": "2026-07-14T13:23:06.000Z",
                "deleted_at": null
            },
            {
                "id": 3,
                "id_produto_servico": 5,
                "val_preco": "2.50",
                "dta_inicio": "2026-07-06T03:00:00.000Z",
                "created_at": "2026-07-06T14:23:57.000Z",
                "updated_at": "2026-07-14T13:23:21.000Z",
                "deleted_at": null
            }
        ]
    }
    ```
  * Buscar Preço Produto Serviço: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/precoProdutoServico/{id}
    * **Campos**: id, id_produto_servico, val_preco, dta_inicio, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: precoProdutoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "dados": {
            "id": 3,
            "id_produto_servico": 5,
            "val_preco": "2.50",
            "dta_inicio": "2026-07-06T03:00:00.000Z",
            "created_at": "2026-07-06T14:23:57.000Z",
            "updated_at": "2026-07-14T13:23:21.000Z",
            "deleted_at": null
        }
    }
    ```
  * Atualizar Preço Produto Serviço:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/precoProdutoServico/{id}
    * **Campos**: id, id_produto_servico, val_preco, dta_inicio, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: precoProdutoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
        "val_preco": "5.40"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "mensagem": "Registro atualizado com sucesso",
        "dados": {
            "id": 1,
            "id_produto_servico": 1,
            "val_preco": "5.40",
            "dta_inicio": "2026-07-06T03:00:00.000Z",
            "created_at": "2026-07-06T14:15:33.000Z",
            "updated_at": "2026-07-14T13:23:06.000Z",
            "deleted_at": null
        }
    }
    ```
  * Deletar Preço Produto Serviço
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/precoProdutoServico/{id}
    * **Chaves**: precoProdutoServicoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
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
