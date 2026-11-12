Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Cor e Estampa em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar categoria
    * **Método HTTP**: POST
    * **URL**: /api/produtos/cor_estampa
    * **Campos**: nom_cor_estampa, ind_tipo, val_codigo_hex, des_imagem_url, num_ordem_exibicao
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: corEstampaKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "nom_cor_estampa": "Cor preta",
      "ind_tipo": "cor",
      "val_codigo_hex": "#000000",
      "des_imagem_url": null,
      "num_ordem_exibicao": 1
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
        "id": {
          "id": 3,
          "nom_cor_estampa": "Cor preta",
          "ind_tipo": "cor",
          "val_codigo_hex": "#000000",
          "des_imagem_url": null,
          "num_ordem_exibicao": 1,
          "created_at": "2026-08-16T02:52:58.000Z",
          "updated_at": "2026-08-16T02:52:58.000Z",
          "deleted_at": null
        }
      }
    }
    ```
  * Listar categoria:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/cor_estampa
    * **Campos**: nom_cor_estampa, ind_tipo, val_codigo_hex, des_imagem_url, num_ordem_exibicao
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: corEstampaKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 3,
      "dados": [
        {
          "id": 1,
          "nom_cor_estampa": "Cor preta",
          "ind_tipo": "cor",
          "val_codigo_hex": "#000000",
          "des_imagem_url": null,
          "num_ordem_exibicao": 1,
          "created_at": "2026-03-03T19:05:42.000Z",
          "updated_at": "2026-03-03T19:05:42.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "nom_cor_estampa": "Cor preta",
          "ind_tipo": "cor",
          "val_codigo_hex": "#000000",
          "des_imagem_url": null,
          "num_ordem_exibicao": 2,
          "created_at": "2026-03-03T21:05:30.000Z",
          "updated_at": "2026-07-13T18:54:13.000Z",
          "deleted_at": "2026-07-13T18:54:13.000Z"
        },
        {
          "id": 3,
          "nom_cor_estampa": "Cor preta",
          "ind_tipo": "cor",
          "val_codigo_hex": "#000000",
          "des_imagem_url": null,
          "num_ordem_exibicao": 1,
          "created_at": "2026-08-16T02:52:58.000Z",
          "updated_at": "2026-08-16T02:52:58.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Buscar categoria: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/cor_estampa/{id}
    * **Campos**: nom_cor_estampa, ind_tipo, val_codigo_hex, des_imagem_url, num_ordem_exibicao
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: corEstampaKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "nom_cor_estampa": "Cor preta",
        "ind_tipo": "cor",
        "val_codigo_hex": "#000000",
        "des_imagem_url": null,
        "num_ordem_exibicao": 1,
        "created_at": "2026-03-03T19:05:42.000Z",
        "updated_at": "2026-03-03T19:05:42.000Z",
        "deleted_at": null
      }
    }
    ```
  * Atualizar categoria:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/cor_estampa/{id}
    * **Campos**: nom_cor_estampa, ind_tipo, val_codigo_hex, des_imagem_url, num_ordem_exibicao
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: corEstampaKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "num_ordem_exibicao": 2
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 3,
        "nom_cor_estampa": "Cor preta",
        "ind_tipo": "cor",
        "val_codigo_hex": "#000000",
        "des_imagem_url": null,
        "num_ordem_exibicao": 2,
        "created_at": "2026-08-16T02:52:58.000Z",
        "updated_at": "2026-08-16T02:54:46.000Z",
        "deleted_at": null
      }
    }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/cor_estampa/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: corEstampaKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_variacoes_cor_estampa (
  id int NOT NULL AUTO_INCREMENT,
  nom_cor_estampa varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  ind_tipo enum('cor','estampa') COLLATE utf8mb4_unicode_ci NOT NULL,
  val_codigo_hex varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_imagem_url varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  num_ordem_exibicao int DEFAULT '0',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_tipo (ind_tipo),
  KEY idx_ordem (num_ordem_exibicao)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── produtos
│   │   │   ├── categoria
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── categoria
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
Obs.: Mantenha a organização em pastas src/features/produtos/cor-estampa/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.