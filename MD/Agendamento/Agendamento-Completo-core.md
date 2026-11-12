Preciso que se comporte como um engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Preciso implementar uma feature de Agendamento, Produto Agendado e Foto Agendamento, em um projeto Next.js 16.2.10 com tanstack/react-query 5.101.2 e um cliente HTTP customizado, vou utilizar a biblioteca Syncfusion® Scheduler para listar os agendamento de cada costureira estilo Multiple Resources Shared Events (https://ej2.syncfusion.com/nextjs/demos/tailwind3/schedule/group-editing). Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API AGENDAMENTO**:
  * Criar Agendamento
    * **Método HTTP**: POST
    * **URL**: /api/agendamentos/
    * **Campos**: id, des_url_externa, id_paciente, id_costureira, id_secretaria, dta_agendamento, des_observacoes_geral, des_observacoes_costureira, ind_status, ind_paciente_compareceu, dta_confirmacao, dta_conclusao, dta_cancelamento, created_at, updated_at, deleted_at, ind_slot_ativo
    * **Autenticação**: já existe httpClient com token via cookie
    * **Chaves**: agendamentoKeys
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_paciente": 9,
      "id_costureira": 3,
      "id_secretaria": 5,
      "dta_agendamento": "2026-11-11 09:00:00",
      "des_observacoes_geral": "Agendamento para ajuste de Bermuda",
      "des_observacoes_costureira": "Teste"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Agendamento criado com sucesso",
      "dados": {
        "id": 3,
        "des_url_externa": "87af8ecc-c83e-425c-87a0-f5a07ffa78e1",
        "id_paciente": 9,
        "id_costureira": 3,
        "id_secretaria": 5,
        "dta_agendamento": "2026-11-11T12:00:00.000Z",
        "des_observacoes_geral": "Agendamento para ajuste de Bermuda",
        "des_observacoes_costureira": "Teste",
        "ind_status": "agendado",
        "ind_paciente_compareceu": null,
        "dta_confirmacao": null,
        "dta_conclusao": null,
        "dta_cancelamento": null,
        "created_at": "2026-11-11T06:27:02.000Z",
        "updated_at": "2026-11-11T06:27:02.000Z",
        "deleted_at": null,
        "ind_slot_ativo": 1,
        "nom_paciente": "Paciente 1",
        "num_celular_paciente": "62789456123",
        "nom_costureira": "Costureira 1",
        "val_cor_costureira": "FF6B6B",
        "nom_secretaria": "Secretária 1"
      }
    }
    ```
  * Listar Agendamento:
    * **Método HTTP**: GET
    * **URL**: /api/agendamentos/
    * **Campos**: id, id_paciente, id_costureira, id_secretaria, dta_agendamento, des_observacoes_geral, des_observacoes_costureira, ind_status, ind_paciente_compareceu, dta_confirmacao, dta_conclusao, dta_cancelamento, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie
    * **Chaves**: agendamentoKeys
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "pagina": 2,
      "limite": 10,
      "ind_status": "agendado",
      "id_costureira": 3
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 19,
      "dados": [
        {
          "id": 11,
          "dta_agendamento": "2026-11-11T16:00:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "c872203d-3d07-4f63-ac16-c830ab5d6e59",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 12,
          "dta_agendamento": "2026-11-11T16:30:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "af9c5c29-5222-49b9-b66f-c08539005087",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 13,
          "dta_agendamento": "2026-11-11T17:00:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "2c45db30-f6b9-413a-a2f8-dfe1c9a97188",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 14,
          "dta_agendamento": "2026-11-11T17:30:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "57b8c882-af3e-4c45-8e94-63396d628a1d",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 15,
          "dta_agendamento": "2026-11-11T18:00:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "770ad3c8-e339-4087-91a1-c65cde20e136",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 16,
          "dta_agendamento": "2026-11-11T18:30:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "e77c07b0-3646-49b3-a553-242ebd4df0ee",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 17,
          "dta_agendamento": "2026-11-11T19:00:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "671b0f3f-33a5-4322-a257-dc12fa21406c",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 18,
          "dta_agendamento": "2026-11-11T19:30:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "361e97a2-cdec-43bc-8d4b-0b469a7f4c2e",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        },
        {
          "id": 19,
          "dta_agendamento": "2026-11-11T20:00:00.000Z",
          "ind_status": "agendado",
          "des_url_externa": "249d1293-9377-4537-bea0-02802728bda6",
          "id_paciente": 9,
          "id_costureira": 3,
          "nom_paciente": "Paciente 1",
          "nom_costureira": "Costureira 1",
          "val_cor_costureira": "FF6B6B"
        }
      ]
    }
    ```
  * Buscar Agendamento: 
    * **Método HTTP**: GET
    * **URL**: /api/produtos/produto/{id}
    * **Campos**: id, id_paciente, id_costureira, id_secretaria, dta_agendamento, des_observacoes_geral, des_observacoes_costureira, ind_status, ind_paciente_compareceu, dta_confirmacao, dta_conclusao, dta_cancelamento, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie
    * **Chaves**: agendamentoKeys
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 10,
        "des_url_externa": "2c48af1f-f2dd-4985-8915-2ffcd2a4ba27",
        "id_paciente": 9,
        "id_costureira": 3,
        "id_secretaria": 5,
        "dta_agendamento": "2026-11-11T15:30:00.000Z",
        "des_observacoes_geral": "Agendamento para ajuste de Bermuda",
        "des_observacoes_costureira": "Teste",
        "ind_status": "agendado",
        "ind_paciente_compareceu": null,
        "dta_confirmacao": null,
        "dta_conclusao": null,
        "dta_cancelamento": null,
        "created_at": "2026-11-11T06:35:35.000Z",
        "updated_at": "2026-11-11T06:35:35.000Z",
        "deleted_at": null,
        "ind_slot_ativo": 1,
        "nom_paciente": "Paciente 1",
        "num_celular_paciente": "62789456123",
        "nom_costureira": "Costureira 1",
        "val_cor_costureira": "FF6B6B",
        "nom_secretaria": "Secretária 1",
        "itens": []
      }
    }
    ```
  * Atualizar Agendamento:
    * **Método HTTP**: PUT
    * **URL**: /api/produtos/produto/{id}
    * **Campos**: id, id_paciente, id_costureira, id_secretaria, dta_agendamento, des_observacoes_geral, des_observacoes_costureira, ind_status, ind_paciente_compareceu, dta_confirmacao, dta_conclusao, dta_cancelamento, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie
    * **Chaves**: agendamentoKeys
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "dta_agendamento": "2026-11-12 08:30:00"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Agendamento atualizado",
      "dados": {
        "id": 20,
        "des_url_externa": "a03a9e24-e8a5-4118-a488-4f300b6d59b1",
        "id_paciente": 9,
        "id_costureira": 3,
        "id_secretaria": 5,
        "dta_agendamento": "2026-11-12T11:30:00.000Z",
        "des_observacoes_geral": "Agendamento para ajuste de Bermuda",
        "des_observacoes_costureira": "Teste",
        "ind_status": "agendado",
        "ind_paciente_compareceu": null,
        "dta_confirmacao": null,
        "dta_conclusao": null,
        "dta_cancelamento": null,
        "created_at": "2026-11-11T17:58:39.000Z",
        "updated_at": "2026-11-11T17:59:05.000Z",
        "deleted_at": null,
        "ind_slot_ativo": 1,
        "nom_paciente": "Paciente 1",
        "num_celular_paciente": "62789456123",
        "nom_costureira": "Costureira 1",
        "val_cor_costureira": "FF6B6B",
        "nom_secretaria": "Secretária 1",
        "itens": []
      }
    }
    ```
  * Deletar Agendamento
    * **Método HTTP**: DELETE
    * **URL**: /api/produtos/produto/{id}
    * **Chaves**: agendamentoKeys
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```

* **Endpoints da API AGENDAMENTO ITEM**:

formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE tab_agendamento (
  id int NOT NULL AUTO_INCREMENT,
  des_url_externa char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  id_paciente int NOT NULL,
  id_costureira int NOT NULL,
  id_secretaria int DEFAULT NULL,
  dta_agendamento datetime NOT NULL,
  des_observacoes_geral text COLLATE utf8mb4_unicode_ci,
  des_observacoes_costureira text COLLATE utf8mb4_unicode_ci,
  ind_status enum('agendado','confirmado','concluido','cancelado','falta') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'agendado',
  ind_paciente_compareceu tinyint(1) DEFAULT NULL,
  dta_confirmacao datetime DEFAULT NULL,
  dta_conclusao datetime DEFAULT NULL,
  dta_cancelamento datetime DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  ind_slot_ativo tinyint GENERATED ALWAYS AS (if(((ind_status <> _utf8mb4'cancelado') and (deleted_at is null)),1,NULL)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_agendamento_uuid (des_url_externa),
  UNIQUE KEY uq_agenda_costureira_slot (id_costureira,dta_agendamento,ind_slot_ativo),
  KEY idx_paciente (id_paciente),
  KEY idx_costureira (id_costureira),
  KEY idx_secretaria (id_secretaria),
  KEY idx_data (dta_agendamento),
  KEY idx_status (ind_status),
  KEY idx_costureira_ativa (id_costureira,ind_status,deleted_at),
  KEY idx_agenda_data_status (dta_agendamento,ind_status),
  CONSTRAINT tab_agendamento_ibfk_1 FOREIGN KEY (id_paciente) REFERENCES tab_pessoas (id),
  CONSTRAINT tab_agendamento_ibfk_2 FOREIGN KEY (id_costureira) REFERENCES tab_pessoas (id),
  CONSTRAINT tab_agendamento_ibfk_3 FOREIGN KEY (id_secretaria) REFERENCES tab_pessoas (id),
  CONSTRAINT chk_data_futura CHECK ((dta_agendamento > created_at))
) ENGINE=InnoDB
```
```sql
CREATE TABLE tab_agendamento_item (
  id int NOT NULL AUTO_INCREMENT,
  id_agendamento int NOT NULL,
  id_tipo_agendamento int NOT NULL,
  id_produto_grade int NOT NULL,
  id_produto_servico int NOT NULL,
  des_ajuste_produto text COLLATE utf8mb4_unicode_ci,
  val_preco_servico decimal(10,2) DEFAULT NULL,
  val_desconto_servico decimal(10,2) NOT NULL DEFAULT '0.00',
  ind_status enum('pendente','producao','concluido','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendente',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_agendamento (id_agendamento),
  KEY idx_produto_grade (id_produto_grade),
  KEY idx_status (ind_status),
  KEY tab_produto_agendamento_tab_produto_servico_FK (id_produto_servico),
  KEY tab_produto_agendamento_tab_tipo_agendamento_FK (id_tipo_agendamento),
  CONSTRAINT tab_agendamento_item_ibfk_1 FOREIGN KEY (id_agendamento) REFERENCES tab_agendamento (id),
  CONSTRAINT tab_agendamento_item_ibfk_2 FOREIGN KEY (id_produto_grade) REFERENCES tab_produto_grade (id),
  CONSTRAINT tab_produto_agendamento_tab_produto_servico_FK FOREIGN KEY (id_produto_servico) REFERENCES tab_produto_servico (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT tab_produto_agendamento_tab_tipo_agendamento_FK FOREIGN KEY (id_tipo_agendamento) REFERENCES tab_tipo_agendamento (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB
```
```sql
CREATE TABLE tab_agendamento_item_fotos (
  id int NOT NULL AUTO_INCREMENT,
  id_produto_agendamento int NOT NULL,
  des_caminho_arquivo varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  nom_original varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_tamanho_bytes int NOT NULL,
  ind_tipo_foto enum('antes','depois') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_produto_agendamento (id_produto_agendamento),
  CONSTRAINT tab_agendamento_item_fotos_ibfk_1 FOREIGN KEY (id_produto_agendamento) REFERENCES tab_agendamento_item (id) ON DELETE CASCADE
) ENGINE=InnoDB
```
```sql
CREATE TABLE tab_pessoas (
  id int NOT NULL AUTO_INCREMENT,
  id_cidade int NOT NULL,
  ind_status enum('ativo','inativo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativo',
  nom_completo varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_cpf varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_rg varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  dta_nascimento date NOT NULL,
  des_logradouro varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_endereco varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  des_complemento varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  num_cep varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  nom_bairro varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  num_celular_1 varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  ind_whatsapp_1 tinyint(1) NOT NULL DEFAULT (true),
  num_celular_2 varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  ind_whatsapp_2 tinyint(1) NOT NULL DEFAULT (true),
  des_email_1 varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  des_email_2 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  des_senha varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  num_tentativas_login int DEFAULT '0',
  dta_ultimo_login datetime DEFAULT NULL,
  dta_bloqueio_login datetime DEFAULT NULL,
  ind_medico tinyint(1) NOT NULL DEFAULT '0',
  ind_secretaria tinyint(1) NOT NULL DEFAULT '0',
  ind_costureira tinyint(1) NOT NULL DEFAULT '0',
  ind_paciente tinyint(1) NOT NULL DEFAULT '0',
  ind_administrador tinyint(1) NOT NULL DEFAULT '0',
  val_cor_hex varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Valor em hexadecimal da cor atribuida a uma costureira',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY num_cpf (num_cpf),
  KEY id_cidade (id_cidade),
  KEY idx_status (ind_status),
  KEY idx_tab_pessoas_ind_medico (ind_medico),
  KEY idx_tab_pessoas_ind_secretaria (ind_secretaria),
  KEY idx_tab_pessoas_ind_costureira (ind_costureira),
  KEY idx_tab_pessoas_ind_paciente (ind_paciente),
  KEY idx_tab_pessoas_ind_administrador (ind_administrador),
  CONSTRAINT tab_pessoas_ibfk_1 FOREIGN KEY (id_cidade) REFERENCES tab_cidade (id),
  CONSTRAINT chk_cep_length CHECK ((length(num_cep) = 8)),
  CONSTRAINT chk_cpf_length CHECK ((length(num_cpf) = 11)),
  CONSTRAINT chk_tab_pessoas_ao_menos_um_papel CHECK (((ind_medico = 1) or (ind_secretaria = 1) or (ind_costureira = 1) or (ind_paciente = 1) or (ind_administrador = 1)))
) ENGINE=InnoDB
```
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
  id_cor_unq int GENERATED ALWAYS AS (ifnull(id_variacao_cor_estampa,0)) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY num_sku (num_sku),
  UNIQUE KEY uniq_combinacao (id_produto,id_cor_unq,id_tamanho),
  KEY idx_produto (id_produto),
  KEY idx_sku (num_sku),
  KEY id_variacao_cor_estampa (id_variacao_cor_estampa),
  KEY id_tamanho (id_tamanho),
  CONSTRAINT tab_produto_grade_ibfk_1 FOREIGN KEY (id_produto) REFERENCES tab_produtos (id) ON DELETE CASCADE,
  CONSTRAINT tab_produto_grade_ibfk_2 FOREIGN KEY (id_variacao_cor_estampa) REFERENCES tab_variacoes_cor_estampa (id),
  CONSTRAINT tab_produto_grade_ibfk_3 FOREIGN KEY (id_tamanho) REFERENCES tab_tamanhos (id)
) ENGINE=InnoDB
```
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
```sql
CREATE TABLE tab_tipo_agendamento (
  id int NOT NULL AUTO_INCREMENT,
  des_tipo_agendamento varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  ind_ativo tinyint(1) DEFAULT '1',
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
│   │   ├── agendamentos
│   │   │   ├── agendamento
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── produto-agendamento
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── fotos-ajustes
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── tipo-agendamento
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── agendamentos
│   │   ├── agendamento
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   ├── produto-agendamento
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   ├── fotos-ajustes
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
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

Ja tenho as seguintes Features feito
Pessoa
```ts
//src/features/pessoas/api.ts

import { httpClient } from '@/lib/http/client';
import {
    PessoaListResponse,
    PessoaResponse,
    PessoaCreateResponse,
    PessoaUpdateResponse,
    PessoaDeleteResponse,
    PessoaAtivarResponse,
    PessoaDesativarResponse,
    TipoPapelPessoa,

} from './types';
import { PessoaInput } from './schema';

export const Pessoas = {
    listar: () => httpClient.get<PessoaListResponse>('/api/pessoas'),

    listarPorPapel: (tipo: TipoPapelPessoa) => httpClient.get<PessoaListResponse>(`/api/pessoas/papel/${tipo}`),

    buscar: (id: number) => httpClient.get<PessoaResponse>(`/api/pessoas/${id}`),

    criar: (data: PessoaInput) => httpClient.post<PessoaCreateResponse>('/api/pessoas', data),

    atualizar: (id: number, data: PessoaInput) => httpClient.put<PessoaUpdateResponse>(`/api/pessoas/${id}`, data),

    deletar: (id: number) => httpClient.delete<PessoaDeleteResponse>(`/api/pessoas/${id}`),

    ativar: (id: number) => httpClient.patch<PessoaAtivarResponse>(`/api/pessoas/${id}/ativar`),

    desativar: (id: number) => httpClient.patch<PessoaDesativarResponse>(`/api/pessoas/${id}/desativar`),
};
```
```ts
//src/features/pessoas/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pessoas } from './api';
import { pessoasKeys } from './queryKeys';
import {
    PessoaListResponse,
    PessoaResponse,
    PessoaCreateResponse,
    PessoaUpdateResponse,
    PessoaDeleteResponse,
    PessoaAtivarResponse,
    PessoaDesativarResponse,
    TipoPapelPessoa,
} from './types';
import { PessoaInput } from './schema';

export const usePessoas = () => {
    return useQuery<PessoaListResponse>({
        queryKey: pessoasKeys.all,
        queryFn: Pessoas.listar,
    });
};

export const usePessoa = (id: number) => {
    return useQuery<PessoaResponse>({
        queryKey: pessoasKeys.detail(id),
        queryFn: () => Pessoas.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaCreateResponse, unknown, PessoaInput>({
        mutationFn: (data) => Pessoas.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
        },
    });
};

export const useAtualizarPessoa = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<PessoaUpdateResponse, unknown, PessoaInput>({
        mutationFn: (data) => Pessoas.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const useDeletarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaDeleteResponse, unknown, number>({
        mutationFn: (id) => Pessoas.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
        },
    });
};

export const useAtivarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaAtivarResponse, unknown, number>({
        mutationFn: (id) => Pessoas.ativar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const useDesativarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaDesativarResponse, unknown, number>({
        mutationFn: (id) => Pessoas.desativar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['pessoas'] });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const usePessoasPorPapel = (tipo: TipoPapelPessoa) => {
    return useQuery<PessoaListResponse>({
        queryKey: pessoasKeys.porPapel(tipo),
        queryFn: () => Pessoas.listarPorPapel(tipo),
    });
};
```
```ts
//src/features/pessoas/queryKeys.ts
import { TipoPapelPessoa } from './types';

export const pessoasKeys = {
    all: ['pessoas'] as const,
    detail: (id: number) => ['pessoas', id] as const,
    porPapel: (tipo: TipoPapelPessoa) => ['pessoas', 'papel', tipo] as const,
};
```
```ts
//src/features/pessoas/schema.ts
import { z } from 'zod';

// Normaliza valores que podem vir como boolean OU como 0/1 (number/string)
const booleanFlexivel = z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (val === 1 || val === '1') return true;
    if (val === 0 || val === '0') return false;
    return val;
}, z.boolean());

const stringOpcionalNullable = (schema: z.ZodString) =>
    z.preprocess((val) => (val === '' || val === undefined ? null : val), schema.nullable());

export const pessoaSchema = z
    .object({
        id_cidade: z.number({ message: 'Cidade é obrigatória' }).int().positive(),

        ind_status: z.enum(['ativo', 'inativo']).default('ativo'),

        nom_completo: z
            .string()
            .min(3, 'Nome completo deve ter ao menos 3 caracteres')
            .max(255),

        num_cpf: z
            .string()
            .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos'),

        num_rg: z.string().min(1, 'RG é obrigatório').max(20),

        dta_nascimento: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (yyyy-MM-dd)'),

        des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(255),
        num_endereco: z.string().min(1, 'Número é obrigatório').max(10),
        des_complemento: z.string().max(100).optional().nullable(),

        num_cep: z
            .string()
            .regex(/^\d{8}$/, 'CEP deve conter exatamente 8 dígitos'),

        nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),

        num_celular_1: z
            .string()
            .regex(/^\d{10,11}$/, 'Celular inválido'),
        ind_whatsapp_1: booleanFlexivel.default(true),

        num_celular_2: stringOpcionalNullable(
            z.string().regex(/^\d{10,11}$/, 'Celular inválido')),
        ind_whatsapp_2: booleanFlexivel.default(true),

        des_email_1: z.string().email('E-mail inválido').max(255),
        des_email_2: stringOpcionalNullable(
            z.string().email('E-mail inválido').max(255)
        ),

        // Opcional: na edição, se vazio, o backend deve manter a senha atual
        des_senha: z
            .string()
            .min(6, 'Senha deve ter ao menos 6 caracteres')
            .optional()
            .or(z.literal('')),

        ind_medico: booleanFlexivel.default(false),
        ind_secretaria: booleanFlexivel.default(false),
        ind_costureira: booleanFlexivel.default(false),
        ind_paciente: booleanFlexivel.default(false),
        ind_administrador: booleanFlexivel.default(false),

        val_cor_hex: stringOpcionalNullable(
            z.string().regex(/^[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (ex: FFFFFF)')),
    })
    // Reflete a CHECK constraint chk_tab_pessoas_ao_menos_um_papel do banco
    .refine(
        (data) =>
            data.ind_medico ||
            data.ind_secretaria ||
            data.ind_costureira ||
            data.ind_paciente ||
            data.ind_administrador,
        {
            message: 'Selecione ao menos um papel (médico, secretária, costureira, paciente ou administrador)',
            path: ['ind_medico'],
        }
    );

export type PessoaInput = z.infer<typeof pessoaSchema>;
```
```ts
//src/features/pessoas/types.ts

export type StatusPessoa = 'ativo' | 'inativo';

export type TipoPapelPessoa = 'administrador' | 'medico' | 'paciente' | 'costureira' | 'secretaria';

export interface Pessoa {
    id: number;
    id_cidade: number;
    ind_status: StatusPessoa;
    nom_completo: string;
    num_cpf: string;
    num_rg: string;
    dta_nascimento: string;
    des_logradouro: string;
    num_endereco: string;
    des_complemento: string | null;
    num_cep: string;
    nom_bairro: string;
    num_celular_1: string;
    ind_whatsapp_1: number;
    num_celular_2: string | null;
    ind_whatsapp_2: number;
    des_email_1: string;
    des_email_2: string | null;
    // des_senha nunca deveria voltar em respostas de listagem/detalhe,
    // mas deixamos tipado como opcional por segurança/contrato.
    des_senha?: string;
    num_tentativas_login: number;
    dta_ultimo_login: string | null;
    dta_bloqueio_login: string | null;
    ind_medico: number;
    ind_secretaria: number;
    ind_costureira: number;
    ind_paciente: number;
    ind_administrador: number;
    val_cor_hex: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // Campos vindos de JOIN com tab_cidade / tab_estado
    nom_cidade?: string;
    nom_estado?: string;
    sgl_estado?: string;
}

export interface PessoaListResponse {
    sucesso: boolean;
    total: number;
    dados: Pessoa[];
}

export interface PessoaResponse {
    sucesso: boolean;
    dados: Pessoa;
}

export interface PessoaCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Pessoa;
}

export interface PessoaUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: Pessoa;
}

export interface PessoaDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}

export interface PessoaAtivarResponse {
    sucesso: boolean;
    mensagem: string;
}

export interface PessoaDesativarResponse {
    sucesso: boolean;
    mensagem: string;
}
```
Produto Grade
```ts
// src/features/produtos/grade/api.ts

import { httpClient } from '@/lib/http/client';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const GradeProduto = {
    listar: () =>
        httpClient.get<GradeProdutoListResponse>('/api/produtos/grade_produto'),

    buscar: (id: number) =>
        httpClient.get<GradeProdutoResponse>(`/api/produtos/grade_produto/${id}`),

    criar: (data: GradeProdutoInput) =>
        httpClient.post<GradeProdutoCreateResponse>('/api/produtos/grade_produto', data),

    atualizar: (id: number, data: GradeProdutoUpdateInput) =>
        httpClient.put<GradeProdutoUpdateResponse>(`/api/produtos/grade_produto/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<GradeProdutoDeleteResponse>(`/api/produtos/grade_produto/${id}`),
};
```
```ts
// src/features/produtos/grade/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GradeProduto } from './api';
import { gradeProdutoKeys } from './queryKeys';
import {
    GradeProdutoListResponse,
    GradeProdutoResponse,
    GradeProdutoCreateResponse,
    GradeProdutoUpdateResponse,
    GradeProdutoDeleteResponse,
} from './types';
import { GradeProdutoInput, GradeProdutoUpdateInput } from './schema';

export const useGradesProduto = () => {
    return useQuery<GradeProdutoListResponse>({
        queryKey: gradeProdutoKeys.all,
        queryFn: GradeProduto.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGradeProduto = (id: number) => {
    return useQuery<GradeProdutoResponse>({
        queryKey: gradeProdutoKeys.detail(id),
        queryFn: () => GradeProduto.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoCreateResponse, unknown, GradeProdutoInput>({
        mutationFn: (data) => GradeProduto.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
    });
};

export const useAtualizarGradeProduto = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoUpdateResponse, unknown, GradeProdutoUpdateInput>({
        mutationFn: (data) => GradeProduto.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.detail(id) });
        },
    });
};

export const useDeletarGradeProduto = () => {
    const queryClient = useQueryClient();

    return useMutation<GradeProdutoDeleteResponse, unknown, number>({
        mutationFn: (id) => GradeProduto.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeProdutoKeys.all });
        },
        onError: (error) => {
            console.error('Erro ao deletar grade: ', error)
        }
    });
};
```
```ts
// src/features/produtos/grade/queryKeys.ts

export const gradeProdutoKeys = {
    all: ['grade-produto'] as const,
    detail: (id: number) => ['grade-produto', id] as const,
};
```
```ts
// src/features/produtos/grade/schema.ts
import { z } from 'zod';

export const gradeProdutoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione o produto' })
        .int()
        .positive('Selecione o produto'),

    id_variacao_cor_estampa: z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    id_tamanho: z
        .number({ error: 'Selecione o tamanho' })
        .int()
        .positive('Selecione o tamanho'),

    num_sku: z
        .string()
        .max(50, 'SKU deve ter no máximo 50 caracteres')
        .nullable()
        .optional(),

    val_preco_variacao: z
        .number({ error: 'Informe um valor válido' })
        .nonnegative('O preço não pode ser negativo')
        .nullable()
        .optional(),

    ind_ativo: z.boolean().default(true),

    num_codigo_barras: z
        .string()
        .max(100, 'Código de barras deve ter no máximo 100 caracteres')
        .nullable()
        .optional(),
});

export type GradeProdutoInput = z.infer<typeof gradeProdutoSchema>;

// Schema para atualização parcial (ex.: PUT só com num_sku, como no seu exemplo)
export const gradeProdutoUpdateSchema = gradeProdutoSchema.partial();
export type GradeProdutoUpdateInput = z.infer<typeof gradeProdutoUpdateSchema>;
```
```ts
// src/features/produtos/grade/types.ts

export interface GradeProduto {
    id: number;
    id_produto: number;
    id_variacao_cor_estampa: number | null;
    id_tamanho: number;
    num_sku: string | null;
    val_preco_variacao: string | null; // decimal vem como string do MySQL
    ind_ativo: number; // tinyint(1): 0 ou 1
    num_codigo_barras: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface GradeProdutoListResponse {
    sucesso: boolean;
    total?: number;
    dados: GradeProduto[];
}

export interface GradeProdutoResponse {
    sucesso: boolean;
    dados: GradeProduto;
}

export interface GradeProdutoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: GradeProduto;
}

export interface GradeProdutoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```
Produto Serviço
```ts
// src/features/produtos/produto-servico/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ProdutoServicoListResponse,
    ProdutoServicoResponse,
    ProdutoServicoCreateResponse,
    ProdutoServicoDeleteResponse,
} from './types';
import { ProdutoServicoInput } from './schema';

export const ProdutoServicos = {
    listar: () =>
        httpClient.get<ProdutoServicoListResponse>('/api/produtos/produtoServico'),

    buscar: (id: number) =>
        httpClient.get<ProdutoServicoResponse>(`/api/produtos/produtoServico/${id}`),

    criar: (data: ProdutoServicoInput) =>
        httpClient.post<ProdutoServicoCreateResponse>('/api/produtos/produtoServico', data),

    atualizar: (id: number, data: ProdutoServicoInput) =>
        httpClient.put<ProdutoServicoResponse>(`/api/produtos/produtoServico/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<ProdutoServicoDeleteResponse>(`/api/produtos/produtoServico/${id}`),
};
```
```ts
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
```
```ts
// src/features/produtos/produto-servico/queryKeys.ts

export const produtoServicoKeys = {
    all: ['produto-servico'] as const,
    detail: (id: number) => ['produto-servico', id] as const,
};
```
```ts
// src/features/produtos/produto-servico/schema.ts
import { z } from 'zod';

export const produtoServicoSchema = z.object({
    id_produto: z
        .number({ error: 'Selecione um produto' })
        .int()
        .positive('Selecione um produto'),
    id_tipo_servico: z
        .number({ error: 'Selecione um tipo de serviço' })
        .int()
        .positive('Selecione um tipo de serviço'),
    ind_ativo: z.boolean(),
});

export type ProdutoServicoInput = z.infer<typeof produtoServicoSchema>;
```
```ts
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
```
Tipo Agendamento
```ts
// src/features/agendamento/tipo-agendamento/api.ts

import { httpClient } from '@/lib/http/client';
import {
    TipoAgendamentoListResponse,
    TipoAgendamentoResponse,
    TipoAgendamentoCreateResponse,
    TipoAgendamentoUpdateResponse,
    TipoAgendamentoDeleteResponse,
} from './types';
import { TipoAgendamentoInput } from './schema';

export const TiposAgendamento = {
    listar: () =>
        httpClient.get<TipoAgendamentoListResponse>('/api/agendamentos/tipo'),

    buscar: (id: number) =>
        httpClient.get<TipoAgendamentoResponse>(`/api/agendamentos/tipo/${id}`),

    criar: (data: TipoAgendamentoInput) =>
        httpClient.post<TipoAgendamentoCreateResponse>('/api/agendamentos/tipo', data),

    atualizar: (id: number, data: TipoAgendamentoInput) =>
        httpClient.put<TipoAgendamentoUpdateResponse>(`/api/agendamentos/tipo/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<TipoAgendamentoDeleteResponse>(`/api/agendamentos/tipo/${id}`),
};
```
```ts
// src/features/agendamento/tipo-agendamento/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TiposAgendamento } from './api';
import { tipoAgendamentoKeys } from './queryKeys';
import {
    TipoAgendamentoListResponse,
    TipoAgendamentoResponse,
    TipoAgendamentoCreateResponse,
    TipoAgendamentoUpdateResponse,
    TipoAgendamentoDeleteResponse,
} from './types';
import { TipoAgendamentoInput } from './schema';

export const useTiposAgendamento = () => {
    return useQuery<TipoAgendamentoListResponse>({
        queryKey: tipoAgendamentoKeys.all,
        queryFn: TiposAgendamento.listar,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useTipoAgendamento = (id: number) => {
    return useQuery<TipoAgendamentoResponse>({
        queryKey: tipoAgendamentoKeys.detail(id),
        queryFn: () => TiposAgendamento.buscar(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });
};

export const useCriarTipoAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoCreateResponse, unknown, TipoAgendamentoInput>({
        mutationFn: (data) => TiposAgendamento.criar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
        },
    });
};

export const useAtualizarTipoAgendamento = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoUpdateResponse, unknown, TipoAgendamentoInput>({
        mutationFn: (data) => TiposAgendamento.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.detail(id) });
        },
    });
};

export const useDeletarTipoAgendamento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAgendamentoDeleteResponse, unknown, number>({
        mutationFn: (id) => TiposAgendamento.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tipoAgendamentoKeys.all });
        },
    });
};
```
```ts
// src/features/agendamento/tipo-agendamento/queryKeys.ts

export const tipoAgendamentoKeys = {
    all: ['tipo-agendamento'] as const,
    detail: (id: number) => ['tipo-agendamento', id] as const,
};
```
```ts
// src/features/agendamento/tipo-agendamento/schema.ts
import { z } from 'zod';

export const tipoAgendamentoSchema = z.object({
    des_tipo_agendamento: z
        .string()
        .min(1, 'O nome do tipo de agendamento é obrigatório')
        .max(100, 'Máximo de 100 caracteres'),
    ind_ativo: z.boolean(),
});

export type TipoAgendamentoInput = z.infer<typeof tipoAgendamentoSchema>;
```
```ts
// src/features/agendamento/tipo-agendamento/types.ts

export interface TipoAgendamento {
    id: number;
    des_tipo_agendamento: string;
    ind_ativo: number; // vem como 0 | 1 do banco (tinyint)
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

// GET /api/agendamentos/tipo
export interface TipoAgendamentoListResponse {
    sucesso: boolean;
    total: number;
    dados: TipoAgendamento[];
}

// GET /api/agendamentos/tipo/{id}
// A API retorna "dados" como array mesmo buscando por 1 registro
export interface TipoAgendamentoResponse {
    sucesso: boolean;
    total: number;
    dados: TipoAgendamento[];
}

// POST /api/agendamentos/tipo
export interface TipoAgendamentoCreateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoAgendamento[];
}

// PUT /api/agendamentos/tipo/{id}
export interface TipoAgendamentoUpdateResponse {
    sucesso: boolean;
    mensagem: string;
    dados: TipoAgendamento[];
}

// DELETE /api/agendamentos/tipo/{id}
export interface TipoAgendamentoDeleteResponse {
    sucesso: boolean;
    mensagem: string;
}
```

Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "horario":
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/produtos/produto/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de categoria.