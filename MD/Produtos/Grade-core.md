Preciso que se comporte como um engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior, Preciso implementar uma feature de Grade em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que está acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar Grade
    * **Método HTTP**: POST
    * **URL**: /api/produtos/grade_produto
    * **Campos**: id_produto, id_variacao_cor_estampa,  id_tamanho, num_sku, val_preco_variacao, ind_ativo, num_codigo_barras, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: gradeProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_produto": 1,
      "id_variacao_cor_estampa": 1,
      "id_tamanho": 4,
      "num_sku": "CON109G",
      "val_preco_variacao": 200.00,
      "ind_ativo": true,
      "num_codigo_barras": "1234567890123"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
        "id": {
          "id": 8,
          "id_produto": 4,
          "id_variacao_cor_estampa": 1,
          "id_tamanho": 4,
          "num_sku": "BOOD109E",
          "val_preco_variacao": "201.00",
          "ind_ativo": 1,
          "num_codigo_barras": "1234567890124",
          "created_at": "2026-08-16T17:29:52.000Z",
          "updated_at": "2026-08-16T17:29:52.000Z",
          "deleted_at": null
        }
      }
    }
    ```
  * Listar Grade:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/grade_produto
    * **Campos**: id_produto, id_variacao_cor_estampa,  id_tamanho, num_sku, val_preco_variacao, ind_ativo, num_codigo_barras, created_at, updated_at, deleted_at 
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: gradeProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 5,
      "dados": [
        {
          "id": 1,
          "id_produto": 1,
          "id_variacao_cor_estampa": 1,
          "id_tamanho": 1,
          "num_sku": "BOOD109PP",
          "val_preco_variacao": "200.00",
          "ind_ativo": 1,
          "num_codigo_barras": "1234567890123",
          "created_at": "2026-03-09T00:52:12.000Z",
          "updated_at": "2026-08-16T17:27:43.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "id_produto": 1,
          "id_variacao_cor_estampa": 1,
          "id_tamanho": 2,
          "num_sku": "BOOD109P",
          "val_preco_variacao": "200.00",
          "ind_ativo": 1,
          "num_codigo_barras": "1234567890123",
          "created_at": "2026-03-09T00:53:30.000Z",
          "updated_at": "2026-08-16T17:27:43.000Z",
          "deleted_at": null
        },
        {
          "id": 3,
          "id_produto": 1,
          "id_variacao_cor_estampa": 1,
          "id_tamanho": 3,
          "num_sku": "BOOD109M",
          "val_preco_variacao": "200.00",
          "ind_ativo": 1,
          "num_codigo_barras": "1234567890123",
          "created_at": "2026-03-09T00:53:43.000Z",
          "updated_at": "2026-08-16T17:27:43.000Z",
            "deleted_at": null
        },
        {
          "id": 4,
          "id_produto": 1,
          "id_variacao_cor_estampa": 1,
          "id_tamanho": 4,
          "num_sku": "BOOD109G",
          "val_preco_variacao": "200.00",
          "ind_ativo": 1,
          "num_codigo_barras": "1234567890123",
          "created_at": "2026-03-09T00:53:53.000Z",
          "updated_at": "2026-08-16T17:27:43.000Z",
          "deleted_at": "2026-07-13T18:58:58.000Z"
        },
        {
          "id": 8,
          "id_produto": 4,
          "id_variacao_cor_estampa": 1,
          "id_tamanho": 4,
          "num_sku": "BOOD109E",
          "val_preco_variacao": "201.00",
          "ind_ativo": 1,
          "num_codigo_barras": "1234567890124",
          "created_at": "2026-08-16T17:29:52.000Z",
          "updated_at": "2026-08-16T17:29:52.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Buscar Grade: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/grade_produto/{id}
    * **Campos**: id_produto, id_variacao_cor_estampa,  id_tamanho, num_sku, val_preco_variacao, ind_ativo, num_codigo_barras, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: gradeProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "id_produto": 1,
        "id_variacao_cor_estampa": 1,
        "id_tamanho": 1,
        "num_sku": "BOOD109PP",
        "val_preco_variacao": "200.00",
        "ind_ativo": 1,
        "num_codigo_barras": "1234567890123",
        "created_at": "2026-03-09T00:52:12.000Z",
        "updated_at": "2026-08-16T17:27:43.000Z",
        "deleted_at": null
      }
    }
    ```
  * Atualizar Grade:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/grade_produto/{id}
    * **Campos**: id_produto, id_variacao_cor_estampa,  id_tamanho, num_sku, val_preco_variacao, ind_ativo, num_codigo_barras, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: gradeProdutoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "num_sku": "CON110P"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 8,
        "id_produto": 4,
        "id_variacao_cor_estampa": 1,
        "id_tamanho": 4,
        "num_sku": "CON110P",
        "val_preco_variacao": "201.00",
        "ind_ativo": 1,
        "num_codigo_barras": "1234567890124",
        "created_at": "2026-08-16T17:29:52.000Z",
        "updated_at": "2026-08-16T17:32:46.000Z",
        "deleted_at": null
      }
    }
    ```
  * Deletar Grade
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/grade_produto/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: gradeProdutoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
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

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── produtos
│   │   │   ├── grade
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── grade
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