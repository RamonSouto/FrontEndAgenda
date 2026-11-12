Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior, Preciso implementar uma feature de Categoria em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar categoria
    * **Método HTTP**: POST
    * **URL**: /api/produtos/categoria
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "nom_categoria": "Teste",
      "id_pai": 1
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
      {
        "sucesso": true,
        "mensagem": "Registro criado com sucesso",
        "dados": {
            "id": {
                "id": 16,
                "nom_categoria": "Teste",
                "id_pai": 1,
                "created_at": "2026-08-15T12:03:55.000Z",
                "updated_at": "2026-08-15T12:03:55.000Z",
                "deleted_at": null
            }
        }
      }
    ```
  * Listar categoria:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/categoria
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
    "sucesso": true,
    "total": 14,
    "dados": [
        {
            "id": 1,
            "nom_categoria": "Bermudas",
            "id_pai": null,
            "created_at": "2026-02-19T22:13:08.000Z",
            "updated_at": "2026-02-19T22:13:08.000Z",
            "deleted_at": null
        },
      ]
    }
    ```
  * Buscar categoria: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/categoria/{id}
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 14,
          "nom_categoria": "Soutiens",
          "id_pai": null,
          "created_at": "2026-02-19T22:16:16.000Z",
          "updated_at": "2026-02-20T00:45:23.000Z",
          "deleted_at": null
      }
    }
    ```
  * Atualizar categoria:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/categoria/{id}
    * **Campos**: nom_categoria, id_pai
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "nom_categoria": "Teste",
      "id_pai": 1
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
          "id": 16,
          "nom_categoria": "Teste 1",
          "id_pai": null,
          "created_at": "2026-08-15T12:03:55.000Z",
          "updated_at": "2026-08-15T12:20:57.000Z",
          "deleted_at": null
      }
    }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/categoria/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_categorias_produtos (
  id int NOT NULL AUTO_INCREMENT,
  nom_categoria varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  id_pai int DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_pai (id_pai),
  CONSTRAINT tab_categorias_produtos_ibfk_1 FOREIGN KEY (id_pai) REFERENCES tab_categorias_produtos (id)
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