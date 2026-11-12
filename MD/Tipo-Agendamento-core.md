Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Tipo de Agendamento em um projeto Next.js com React Query e um cliente HTTP customizado. Explique em detalhes o que está acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
  * Criar Tipo Serviço
    * **Método HTTP**: POST
    * **URL**: /api/agendamentos/tipo
    * **Campos**: id, des_tipo_agendamento, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoAgendamentoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "des_tipo_agendamento": "Reajuste",
      "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": [
        {
          "id": 12,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T19:58:26.000Z",
          "updated_at": "2026-08-17T19:58:26.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Listar Tipo Serviço:
    * **Método HTTP**: GET
    * **URL**: /api/agendamentos/tipo
    * **Campos**: id, des_tipo_agendamento, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoAgendamentoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 12,
      "dados": [
        {
          "id": 1,
          "des_tipo_agendamento": "24 HORAS",
          "ind_ativo": 1,
          "created_at": "2026-06-30T19:43:22.000Z",
          "updated_at": "2026-06-30T19:43:22.000Z",
          "deleted_at": null
        },
        {
          "id": 2,
          "des_tipo_agendamento": "Primeiro Ajuste",
          "ind_ativo": 1,
          "created_at": "2026-06-30T19:44:35.000Z",
          "updated_at": "2026-06-30T19:44:35.000Z",
          "deleted_at": null
        },
        {
          "id": 3,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-06-30T21:40:01.000Z",
          "updated_at": "2026-06-30T21:40:01.000Z",
          "deleted_at": null
        },
        {
          "id": 4,
          "des_tipo_agendamento": "teste",
          "ind_ativo": 1,
          "created_at": "2026-06-30T21:41:28.000Z",
          "updated_at": "2026-07-14T13:28:49.000Z",
          "deleted_at": "2026-07-14T13:28:49.000Z"
        },
        {
          "id": 5,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T18:44:29.000Z",
          "updated_at": "2026-08-17T18:44:29.000Z",
          "deleted_at": null
        },
        {
          "id": 6,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T18:47:13.000Z",
          "updated_at": "2026-08-17T18:47:13.000Z",
          "deleted_at": null
        },
        {
          "id": 7,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T18:48:21.000Z",
          "updated_at": "2026-08-17T18:48:21.000Z",
          "deleted_at": null
        },
        {
          "id": 8,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T18:48:47.000Z",
          "updated_at": "2026-08-17T18:48:47.000Z",
          "deleted_at": null
        },
        {
          "id": 9,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T19:55:08.000Z",
          "updated_at": "2026-08-17T19:55:08.000Z",
          "deleted_at": null
        },
        {
          "id": 10,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T19:56:53.000Z",
          "updated_at": "2026-08-17T19:56:53.000Z",
          "deleted_at": null
        },
        {
          "id": 11,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T19:58:12.000Z",
          "updated_at": "2026-08-17T19:58:12.000Z",
          "deleted_at": null
        },
        {
          "id": 12,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T19:58:26.000Z",
          "updated_at": "2026-08-17T19:58:26.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Buscar Tipo Serviço: 
    * **Método HTTP**: GET
    * **URL**: /api/agendamentos/tipo/{id}
    * **Campos**: id, des_tipo_agendamento, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoAgendamentoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 1,
      "dados": [
        {
          "id": 3,
          "des_tipo_agendamento": "Reajuste",
          "ind_ativo": 1,
          "created_at": "2026-06-30T21:40:01.000Z",
          "updated_at": "2026-06-30T21:40:01.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Atualizar Grade:
    * **Método HTTP**: PUT
    * **URL**: /api/agendamentos/tipo/{id}
    * **Campos**: id, des_tipo_agendamento, ind_ativo, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoAgendamentoKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "des_tipo_agendamento": "teste",
      "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": [
        {
          "id": 12,
          "des_tipo_agendamento": "teste",
          "ind_ativo": 1,
          "created_at": "2026-08-17T19:58:26.000Z",
          "updated_at": "2026-08-17T20:02:22.000Z",
          "deleted_at": null
        }
      ]
    }
    ```
  * Deletar Tipo Serviço
    * **Método HTTP**: DELETE
    * **URL**: /api/agendamentos/tipo/{id}
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: tipoAgendamentoKeys.
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
│   │   ├── agendamento
│   │   │   ├── tipo-agendamento
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── agendamento
│   │   ├── tipo-agendamento
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
Obs.: Mantenha a organização em pastas src/features/agendamento/tipo-agendamento/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.