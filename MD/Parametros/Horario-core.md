Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Horario em um projeto Next.js com React Query e um cliente HTTP customizado. Os requisitos são:

* **Endpoints da API**:
  * Criar empresa
    * **Método HTTP**: POST
    * **URL**: /api/parametrizacao/
    * **Campos**: des_tipo_dia, hra_inicio, hra_fim, qtd_minutos_intervalo, ind_ativo
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | des_tipo_dia | text | UTIL/SABADO |
      | hra_inicio | text | 08:00:00 |
      | hra_fim | text | 17:00:00 |
      | qtd_minutos_intervalo | text | 30 |
      | ind_ativo | text | true |
    * **Estrutura de dados (resposta)**:
    ```json
      {
          "sucesso": true,
          "mensagem": "Registro criado com sucesso",
          "dados": 4
      }
      
    ```
  * Listar empresa:
    * **Método HTTP**: GET
    * **URL**: /api/parametrizacao/
    * **Campos**: des_tipo_dia, hra_inicio, hra_fim, qtd_minutos_intervalo, ind_ativo
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": 2,
      "dados": [
          {
              "id": 3,
              "des_tipo_dia": "UTIL",
              "hra_inicio": "08:00:00",
              "hra_fim": "17:00:00",
              "qtd_minutos_intervalo": "30",
              "ind_ativo": 1,
              "created_at": "2026-07-12T17:49:43.000Z",
              "updated_at": "2026-07-13T17:29:15.000Z",
              "deleted_at": null
          },
          {
              "id": 5,
              "des_tipo_dia": "SABADO",
              "hra_inicio": "08:00:00",
              "hra_fim": "10:00:00",
              "qtd_minutos_intervalo": "30",
              "ind_ativo": 1,
              "created_at": "2026-07-13T18:31:11.000Z",
              "updated_at": "2026-07-13T18:31:11.000Z",
              "deleted_at": null
          }
      ]
  }
    ```
  * Buscar empresa: 
    * **Método HTTP**: GET
    * **URL**: /api/parametrizacao/{id}
    * **Campos**: des_tipo_dia, hra_inicio, hra_fim, qtd_minutos_intervalo, ind_ativo
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 1,
          "des_tipo_dia": "UTIL",
          "hra_inicio": "08:00:00",
          "hra_fim": "17:00:00",
          "qtd_minutos_intervalo": "30",
          "ind_ativo": 0,
          "created_at": "2026-07-12T17:49:11.000Z",
          "updated_at": "2026-07-13T02:30:51.000Z",
          "deleted_at": null
      }
    }
    ```
  * Atualizar empresa:
    * **Método HTTP**: PUT
    * **URL**: /api/parametrizacao/{id}
    * **Campos**: des_tipo_dia, hra_inicio, hra_fim, qtd_minutos_intervalo, ind_ativo
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | des_tipo_dia | text | UTIL/SABADO |
      | hra_inicio | text | 08:00:00 |
      | hra_fim | text | 17:00:00 |
      | qtd_minutos_intervalo | text | 30 |
      | ind_ativo | text | true |
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 1,
          "des_tipo_dia": "UTIL",
          "hra_inicio": "08:00:00",
          "hra_fim": "17:00:00",
          "qtd_minutos_intervalo": "30",
          "ind_ativo": 0,
          "created_at": "2026-07-12T17:49:11.000Z",
          "updated_at": "2026-07-13T02:30:51.000Z",
          "deleted_at": null
      }
    }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/parametrizacao/{id}
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
CREATE TABLE tab_parametrizacao (
  id int NOT NULL AUTO_INCREMENT,
  des_tipo_dia enum('UTIL','SABADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT UTIL,
  hra_inicio time NOT NULL,
  hra_fim time NOT NULL,
  qtd_minutos_intervalo varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  ind_ativo tinyint(1) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id`),
  KEY idx_param_dia_ativo (des_tipo_dia, ind_ativo, deleted_at)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── parametros
│   │   │   ├── horario
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── parametrizacao
│   │   ├── horario
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...

```
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "cidades":
api.ts (métodos de requisição)
hooks.ts (hooks customizados com useQuery/useMutation)
queryKeys.ts (chaves de cache)
schema.ts (validação Zod)
types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/[Horario]/ e utilize o httpClient já existente em src/lib/http/client.ts