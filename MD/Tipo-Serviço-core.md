Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Tipo de Serviço em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que está acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar Tipo Serviço
    * **Método HTTP**: POST
    * **URL**: /api/produtos/tipoServico
    * **Campos**: id, des_tipo_ajuste, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "des_tipo_ajuste": "Teste",
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
          "id": 4,
          "des_tipo_ajuste": "Teste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T17:41:21.000Z",
          "updated_at": "2026-08-17T17:41:21.000Z",
          "deleted_at": null
        }
      }
    }
    ```
  * Listar Tipo Serviço:
    * **Método HTTP**: GET
    * **URL**: /api/produtos/tipoServico
    * **Campos**: id, des_tipo_ajuste, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 4,
      "dados": [
        {
          "id": 1,
          "des_tipo_ajuste": "Ajuste pc grande 3º",
          "ind_ativo": 1,
          "created_at": "2026-07-04T23:14:08.000Z",
          "updated_at": "2026-07-14T13:17:21.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "des_tipo_ajuste": "Ajuste na largura de pç pequenas Bood",
          "ind_ativo": 1,
          "created_at": "2026-07-04T23:14:20.000Z",
          "updated_at": "2026-07-04T23:14:20.000Z",
          "deleted_at": null
        },
        {
          "id": 3,
          "des_tipo_ajuste": "Teste",
          "ind_ativo": 1,
          "created_at": "2026-07-04T23:16:18.000Z",
          "updated_at": "2026-07-14T13:16:29.000Z",
          "deleted_at": "2026-07-14T13:16:29.000Z"
        },
        {
          "id": 4,
          "des_tipo_ajuste": "Teste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T17:41:21.000Z",
          "updated_at": "2026-08-17T17:41:21.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Buscar Tipo Serviço: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/tipoServico/{id}
    * **Campos**: id, des_tipo_ajuste, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "des_tipo_ajuste": "Ajuste pc grande 3º",
        "ind_ativo": 1,
        "created_at": "2026-07-04T23:14:08.000Z",
        "updated_at": "2026-07-14T13:17:21.000Z",
        "deleted_at": null
      }
    }
    ```
  * Atualizar Grade:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/tipoServico/{id}
    * **Campos**: id, des_tipo_ajuste, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoServicoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "des_tipo_ajuste": "Ajuste pc grande 4º",
      "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 4,
        "des_tipo_ajuste": "Ajuste pc grande 4º",
        "ind_ativo": 1,
        "created_at": "2026-08-17T17:41:21.000Z",
        "updated_at": "2026-08-17T17:43:56.000Z",
        "deleted_at": null
      }
    }
    ```
  * Deletar Tipo Serviço
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/tipoServico/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoServicoKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_tipo_servico (
  id int NOT NULL AUTO_INCREMENT,
  des_tipo_ajuste varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  ind_ativo tinyint(1) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── produto
│   │   │   ├── tipo-servico
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── tipo-servico
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
Obs.: Mantenha a organização em pastas src/features/produtos/tipo-servico/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.