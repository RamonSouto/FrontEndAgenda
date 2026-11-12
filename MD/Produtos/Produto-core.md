Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior, Preciso implementar uma feature de Produto em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

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
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "horario":
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/produtos/produto/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.