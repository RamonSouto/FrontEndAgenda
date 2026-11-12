Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Tamanho em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar categoria
    * **Método HTTP**: POST
    * **URL**: /api/produtos/tamanho
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tamanhoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "cod_tamanho": "G4",
      "des_tamanho": "Tamanho G4",
      "des_categoria_tamanho": "vestuario",
      "num_ordem_exibicao": 9
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
        "id": {
          "id": 10,
          "cod_tamanho": "G4",
          "des_tamanho": "Tamanho G4",
          "des_categoria_tamanho": "vestuario",
          "num_ordem_exibicao": 9,
          "created_at": "2026-08-16T02:08:41.000Z",
          "updated_at": "2026-08-16T02:08:41.000Z",
          "deleted_at": null
        }
      }
    }
    ```
  * Listar categoria:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/tamanho
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tamanhoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 2,
      "dados": [
        {
          "id": 1,
          "cod_tamanho": "PP",
          "des_tamanho": "Tamanho PP",
          "des_categoria_tamanho": "vestuario",
          "num_ordem_exibicao": 1,
          "created_at": "2026-02-25T18:24:41.000Z",
          "updated_at": "2026-02-25T18:24:41.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "cod_tamanho": "P",
          "des_tamanho": "Tamanho P",
          "des_categoria_tamanho": "vestuario",
          "num_ordem_exibicao": 2,
          "created_at": "2026-02-25T18:27:27.000Z",
          "updated_at": "2026-02-25T18:27:27.000Z",
          "deleted_at": null
        },
      ]
    }
    ```
  * Buscar categoria: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/tamanho/{id}
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tamanhoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "cod_tamanho": "PP",
        "des_tamanho": "Tamanho PP",
        "des_categoria_tamanho": "vestuario",
        "num_ordem_exibicao": 1,
        "created_at": "2026-02-25T18:24:41.000Z",
        "updated_at": "2026-02-25T18:24:41.000Z",
        "deleted_at": null
      }
    }
    ```
  * Atualizar categoria:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/tamanho/{id}
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tamanhoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "num_ordem_exibicao": 9
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 10,
        "cod_tamanho": "G4",
        "des_tamanho": "Tamanho G4",
        "des_categoria_tamanho": "vestuario",
        "num_ordem_exibicao": 9,
        "created_at": "2026-08-16T02:08:41.000Z",
        "updated_at": "2026-08-16T02:08:41.000Z",
        "deleted_at": null
      }
    }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/tamanho/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tamanhoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_tamanhos (
  id int NOT NULL AUTO_INCREMENT,
  cod_tamanho varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  des_tamanho varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_categoria_tamanho enum('vestuario','calcados','acessorios','outros') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  num_ordem_exibicao int DEFAULT '0',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_categoria (des_categoria_tamanho),
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
Obs.: Mantenha a organização em pastas src/features/produtos/[categoria]/ e utilize o httpClient já existente em src/lib/http/client.ts