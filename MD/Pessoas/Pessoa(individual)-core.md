Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Tenho implementado uma feature de Pessoa em um projeto Next.js 16.2.10 com tanstack/react-query 5.101.2 e um cliente HTTP customizado. Agora preciso cria uma Página que traga somente as pessoas:
1 - Administrador
2 - Médico
3 - Paciente
4 - Costureira
5 - Secretária

Segue abaixo os end-points
* **Endpoints da API**:
  * Criar Pessoa
    * **Método HTTP**: POST
    * **URL**: /api/pessoas
    * **Campos**: id, id_cidade, ind_status, nom_completo, num_cpf, num_rg, dta_nascimento, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, num_celular_1, ind_whatsapp_1, num_celular_2, ind_whatsapp_2, des_email_1, des_email_2, des_senha, num_tentativas_login, dta_ultimo_login, dta_bloqueio_login, ind_medico, ind_secretaria, ind_costureira, ind_paciente, ind_administrador, val_cor_hex, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: pessoasKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_cidade": 5418,
      "ind_status": "ativo",
      "ind_medico": false,
      "ind_secretaria": false,
      "ind_costureira": true,
      "ind_paciente": true,
      "ind_administrador": false,
      "nom_completo": "Ana Costureira Santos",
      "num_cpf": "60092333133",
      "num_rg": "2222222",
      "dta_nascimento": "1985-03-20",
      "des_logradouro": "Avenida Central",
      "num_endereco": "300",
      "num_cep": "74200000",
      "nom_bairro": "Setor Oeste",
      "num_celular_1": "62977777777",
      "ind_whatsapp_1": true,
      "des_email_1": "costureira1@sistema.com",
      "des_senha": "senha123",
      "val_cor_hex": "FFFFFF"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro criado com sucesso",
      "dados": {
          "id": 14,
          "id_cidade": 5418,
          "ind_status": "ativo",
          "nom_completo": "Ana Costureira Santos",
          "num_cpf": "60092333133",
          "num_rg": "2222222",
          "dta_nascimento": "1985-03-19T03:00:00.000Z",
          "des_logradouro": "Avenida Central",
          "num_endereco": "300",
          "des_complemento": null,
          "num_cep": "74200000",
          "nom_bairro": "Setor Oeste",
          "num_celular_1": "62977777777",
          "ind_whatsapp_1": 1,
          "num_celular_2": null,
          "ind_whatsapp_2": 1,
          "des_email_1": "costureira1@sistema.com",
          "des_email_2": null,
          "num_tentativas_login": 0,
          "dta_ultimo_login": null,
          "dta_bloqueio_login": null,
          "ind_medico": 0,
          "ind_secretaria": 0,
          "ind_costureira": 1,
          "ind_paciente": 1,
          "ind_administrador": 0,
          "val_cor_hex": "FFFFFF",
          "created_at": "2026-08-31T14:40:24.000Z",
          "updated_at": "2026-08-31T14:40:24.000Z",
          "deleted_at": null,
          "nom_cidade": "Goiânia",
          "nom_estado": "Goiás",
          "sgl_estado": "GO"
        }
    }
    ```
  * Listar Pessoa:
    * **Método HTTP**: GET
    * **URL**: /api/pessoas
    * **Campos**: id, id_cidade, ind_status, nom_completo, num_cpf, num_rg, dta_nascimento, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, num_celular_1, ind_whatsapp_1, num_celular_2, ind_whatsapp_2, des_email_1, des_email_2, des_senha, num_tentativas_login, dta_ultimo_login, dta_bloqueio_login, ind_medico, ind_secretaria, ind_costureira, ind_paciente, ind_administrador, val_cor_hex, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: pessoasKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "total": 3,
      "dados": [
        {
          "id": 1,
          "id_cidade": 5418,
          "ind_status": "ativo",
          "nom_completo": "Administrador do Sistema",
          "num_cpf": "12345678909",
          "num_rg": "0000000",
          "dta_nascimento": "1980-01-01T03:00:00.000Z",
          "des_logradouro": "Rua Principal",
          "num_endereco": "1",
          "des_complemento": null,
          "num_cep": "00000000",
          "nom_bairro": "Centro",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": null,
          "ind_whatsapp_2": 1,
          "des_email_1": "admin@sistema.com",
          "des_email_2": null,
          "num_tentativas_login": 0,
          "dta_ultimo_login": "2026-08-31T14:17:38.000Z",
          "dta_bloqueio_login": null,
          "ind_medico": 0,
          "ind_secretaria": 0,
          "ind_costureira": 0,
          "ind_paciente": 1,
          "ind_administrador": 1,
          "val_cor_hex": "",
          "created_at": "2026-02-17T14:50:22.000Z",
          "updated_at": "2026-08-31T14:17:38.000Z",
          "deleted_at": null,
          "nom_cidade": "Goiânia",
          "nom_estado": "Goiás",
          "sgl_estado": "GO"
        },
        {
          "id": 2,
          "id_cidade": 5418,
          "ind_status": "ativo",
          "nom_completo": "Ana Costureira Santos",
          "num_cpf": "45557511164",
          "num_rg": "2222222",
          "dta_nascimento": "1985-03-19T03:00:00.000Z",
          "des_logradouro": "Avenida Central",
          "num_endereco": "300",
          "des_complemento": null,
          "num_cep": "74200000",
          "nom_bairro": "Setor Oeste",
          "num_celular_1": "62977777777",
          "ind_whatsapp_1": 1,
          "num_celular_2": null,
          "ind_whatsapp_2": 1,
          "des_email_1": "costureira1@sistema.com",
          "des_email_2": null,
          "num_tentativas_login": 0,
          "dta_ultimo_login": null,
          "dta_bloqueio_login": null,
          "ind_medico": 0,
          "ind_secretaria": 0,
          "ind_costureira": 1,
          "ind_paciente": 0,
          "ind_administrador": 0,
          "val_cor_hex": "AAAAAA",
          "created_at": "2026-02-19T15:39:39.000Z",
          "updated_at": "2026-07-21T04:50:40.000Z",
          "deleted_at": null,
          "nom_cidade": "Goiânia",
          "nom_estado": "Goiás",
          "sgl_estado": "GO"
        },
        {
          "id": 14,
          "id_cidade": 5418,
          "ind_status": "ativo",
          "nom_completo": "Ana Costureira Santos",
          "num_cpf": "60092333133",
          "num_rg": "2222222",
          "dta_nascimento": "1985-03-19T03:00:00.000Z",
          "des_logradouro": "Avenida Central",
          "num_endereco": "300",
          "des_complemento": null,
          "num_cep": "74200000",
          "nom_bairro": "Setor Oeste",
          "num_celular_1": "62977777777",
          "ind_whatsapp_1": 1,
          "num_celular_2": null,
          "ind_whatsapp_2": 1,
          "des_email_1": "costureira1@sistema.com",
          "des_email_2": null,
          "num_tentativas_login": 0,
          "dta_ultimo_login": null,
          "dta_bloqueio_login": null,
          "ind_medico": 0,
          "ind_secretaria": 0,
          "ind_costureira": 1,
          "ind_paciente": 1,
          "ind_administrador": 0,
          "val_cor_hex": "FFFFFF",
          "created_at": "2026-08-31T14:40:24.000Z",
          "updated_at": "2026-08-31T14:40:24.000Z",
          "deleted_at": null,
          "nom_cidade": "Goiânia",
          "nom_estado": "Goiás",
          "sgl_estado": "GO"
        },
      ]
    }
    ```
  * Buscar Pessoa: 
    * **Método HTTP**: GET
    * **URL**: /api/pessoas/{id}
    * **Campos**: id, id_cidade, ind_status, nom_completo, num_cpf, num_rg, dta_nascimento, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, num_celular_1, ind_whatsapp_1, num_celular_2, ind_whatsapp_2, des_email_1, des_email_2, des_senha, num_tentativas_login, dta_ultimo_login, dta_bloqueio_login, ind_medico, ind_secretaria, ind_costureira, ind_paciente, ind_administrador, val_cor_hex, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: pessoasKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
        "id": 1,
        "id_cidade": 5418,
        "ind_status": "ativo",
        "nom_completo": "Administrador do Sistema",
        "num_cpf": "12345678909",
        "num_rg": "0000000",
        "dta_nascimento": "1980-01-01T03:00:00.000Z",
        "des_logradouro": "Rua Principal",
        "num_endereco": "1",
        "des_complemento": null,
        "num_cep": "00000000",
        "nom_bairro": "Centro",
        "num_celular_1": "62999999999",
        "ind_whatsapp_1": 1,
        "num_celular_2": null,
        "ind_whatsapp_2": 1,
        "des_email_1": "admin@sistema.com",
        "des_email_2": null,
        "num_tentativas_login": 0,
        "dta_ultimo_login": "2026-08-31T14:17:38.000Z",
        "dta_bloqueio_login": null,
        "ind_medico": 0,
        "ind_secretaria": 0,
        "ind_costureira": 0,
        "ind_paciente": 1,
        "ind_administrador": 1,
        "val_cor_hex": "",
        "created_at": "2026-02-17T14:50:22.000Z",
        "updated_at": "2026-08-31T14:17:38.000Z",
        "deleted_at": null,
        "nom_cidade": "Goiânia",
        "nom_estado": "Goiás",
        "sgl_estado": "GO"
      }
    }
    ```
  * Atualizar Pessoa:
    * **Método HTTP**: PUT
    * **URL**: /api/pessoas/{id}
    * **Campos**: id, id_cidade, ind_status, nom_completo, num_cpf, num_rg, dta_nascimento, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, num_celular_1, ind_whatsapp_1, num_celular_2, ind_whatsapp_2, des_email_1, des_email_2, des_senha, num_tentativas_login, dta_ultimo_login, dta_bloqueio_login, ind_medico, ind_secretaria, ind_costureira, ind_paciente, ind_administrador, val_cor_hex, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: pessoasKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
      "id_cidade": 5418,
      "ind_status": "ativo",
      "ind_medico": 0,
      "ind_secretaria": 1,
      "ind_costureira": 0,
      "ind_paciente": 1,
      "ind_administrador": 0,
      "nom_completo": "Pedro Paciente Oliveira",
      "num_cpf": "96348700151",
      "num_rg": "7777777",
      "dta_nascimento": "1990-05-15",
      "des_logradouro": "Rua das Flores",
      "num_endereco": "200",
      "num_cep": "74200000",
      "nom_bairro": "Setor Bueno",
      "num_celular_1": "62933333333",
      "ind_whatsapp_1": true,
      "des_email_1": "paciente3@email.com",
      "des_senha": "senha123",
      "val_cor_hex": "FFFFFF"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro atualizado com sucesso",
      "dados": {
        "id": 7,
        "id_cidade": 5418,
        "ind_status": "ativo",
        "nom_completo": "Pedro Paciente Oliveira",
        "num_cpf": "96348700151",
        "num_rg": "7777777",
        "dta_nascimento": "1990-05-15T03:00:00.000Z",
        "des_logradouro": "Rua das Flores",
        "num_endereco": "200",
        "des_complemento": null,
        "num_cep": "74200000",
        "nom_bairro": "Setor Bueno",
        "num_celular_1": "62933333333",
        "ind_whatsapp_1": 1,
        "num_celular_2": null,
        "ind_whatsapp_2": 1,
        "des_email_1": "paciente3@email.com",
        "des_email_2": null,
        "num_tentativas_login": 0,
        "dta_ultimo_login": null,
        "dta_bloqueio_login": null,
        "ind_medico": 0,
        "ind_secretaria": 1,
        "ind_costureira": 0,
        "ind_paciente": 1,
        "ind_administrador": 0,
        "val_cor_hex": "FFFFFF",
        "created_at": "2026-02-19T15:50:26.000Z",
        "updated_at": "2026-08-31T14:46:14.000Z",
        "deleted_at": null,
        "nom_cidade": "Goiânia",
        "nom_estado": "Goiás",
        "sgl_estado": "GO"
      }
    }
    ```
  * Deletar Pessoa
    * **Método HTTP**: DELETE
    * **URL**: /api/pessoas/{id}
    * **Chaves**: pessoasKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Registro deletado com sucesso"
    }
    ```
  * Ativar Pessoa
    * **Método HTTP**: DELETE
    * **URL**: /api/pessoas/{id}/ativar
    * **Chaves**: pessoasKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Pessoa ativada com sucesso"
    }
    ```
  * Desativar Pessoa
    * **Método HTTP**: DELETE
    * **URL**: /api/pessoas/{id}/desativar
    * **Chaves**: pessoasKeys.
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "mensagem": "Pessoa desativada com sucesso"
    }
    ```
  * Listar Pessoa por tipo:
    * **Método HTTP**: GET
    * **URL**: /api/pessoas/papel/{tipoPessoa}
    * **tipos**: administrador, medico, paciente, secretaria, constureira
    * **Campos**: id, id_cidade, ind_status, nom_completo, num_cpf, num_rg, dta_nascimento, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, num_celular_1, ind_whatsapp_1, num_celular_2, ind_whatsapp_2, des_email_1, des_email_2, des_senha, num_tentativas_login, dta_ultimo_login, dta_bloqueio_login, ind_medico, ind_secretaria, ind_costureira, ind_paciente, ind_administrador, val_cor_hex, created_at, updated_at, deleted_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Chaves**: pessoasKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "total": 1,
        "dados": [
            {
                "id": 1,
                "id_cidade": 5418,
                "ind_status": "ativo",
                "nom_completo": "Administrador do Sistema",
                "num_cpf": "12345678909",
                "num_rg": "0000000",
                "dta_nascimento": "1980-01-01T03:00:00.000Z",
                "des_logradouro": "Rua Principal",
                "num_endereco": "1",
                "des_complemento": null,
                "num_cep": "00000000",
                "nom_bairro": "Centro",
                "num_celular_1": "62999999999",
                "ind_whatsapp_1": 1,
                "num_celular_2": null,
                "ind_whatsapp_2": 1,
                "des_email_1": "admin@sistema.com",
                "des_email_2": null,
                "num_tentativas_login": 0,
                "dta_ultimo_login": "2026-09-02T17:38:12.000Z",
                "dta_bloqueio_login": null,
                "ind_medico": 0,
                "ind_secretaria": 0,
                "ind_costureira": 0,
                "ind_paciente": 1,
                "ind_administrador": 1,
                "val_cor_hex": "",
                "created_at": "2026-02-17T14:50:22.000Z",
                "updated_at": "2026-09-02T17:38:12.000Z",
                "deleted_at": null,
                "nom_cidade": "Goiânia",
                "nom_estado": "Goiás",
                "sgl_estado": "GO"
            }
        ]
    }
    ```
Formulário tem os seguintes campos no banco de dados: 
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
  KEY idx_cpf (num_cpf),
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
CREATE TABLE tab_cidade (
  id int NOT NULL AUTO_INCREMENT,
  id_estado int NOT NULL,
  nom_cidade varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  cod_municipio_ibge varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_estado (id_estado),
  KEY idx_ibge (cod_municipio_ibge),
  CONSTRAINT tab_cidade_ibfk_1 FOREIGN KEY (id_estado) REFERENCES tab_estado (id)
) ENGINE=InnoDB
```
```sql
CREATE TABLE tab_estado (
  id int NOT NULL AUTO_INCREMENT,
  nom_estado varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  sgl_estado varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  KEY idx_sigla (sgl_estado)
) ENGINE=InnoDB
```
Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── pessoas
│   │   │   ├── columns.tsx
│   │   │   ├── page.tsx
│   │   │   ├── administrador
│   │   │   │   ├── columns.tsx (criar)
│   │   │   │   └── page.tsx (criar)
│   │   │   ├── medico
│   │   │   │   ├── columns.tsx (criar)
│   │   │   │   └── page.tsx (criar)
│   │   │   ├── paciente
│   │   │   │   ├── columns.tsx (criar)
│   │   │   │   └── page.tsx (criar)
│   │   │   ├── costureira
│   │   │   │   ├── columns.tsx (criar)
│   │   │   │   └── page.tsx (criar)
│   │   │   ├── secretaria
│   │   │   │   ├── columns.tsx (criar)
│   │   │   │   └── page.tsx (criar)
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── produtos
│   │   ├── pessoas
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...

```
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "pessoa":
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)

Obs.: Mantenha a organização em pastas src/features/pessoas/[pessoas]/ e utilize o httpClient já existente em src/lib/http/client.ts

Crie os arquivos de Page.tsx e Columns.tsx, deve ter o Titulop de "Pessoa", abaixo a mensagem "Preencha os campos corretamente para cadastrar uma nova pessoa.", deve ter uma seção para selecionar o tipo de de pessoa deve ter um checkbox (Médico, Secretária, Paciente, Costureira e Administrador), campo de Nome Completo, campo de CPF com a mascara xxx.xxx.xxx-xx, campo de RG, campo de data de Nascimento, select de Status, campo de CEP xxx.xxx-xxx que deve pesquisar serviço de CEP (src/lib/utils/cepService.ts) se houver CEP deve preencher o campo de Estado, Cidade, Logradouro e Bairro, formulario deve ter campo Número, Complemento, Celular 1 formatado (xx) x xxxx-xxxx, flag para é celular, Celular 2 formatado (xx) x xxxx-xxxx, flag para é celular, campo para e-mail 1, campo para e-mail 2, se for costureira, administrador ou secretária deve liberar o campo de senha com a função de mostrar senha, se for costureira deve liberar o campo de DataPicker para selecionar uma cor.

```tsx
//src/features/pessoas/types.ts

export type StatusPessoa = 'ativo' | 'inativo';

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
```tsx
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
```tsx
//src/features/pessoas/queryKeys.ts

export const pessoasKeys = {
    all: ['pessoas'] as const,
    detail: (id: number) => ['pessoas', id] as const,
};
```
```tsx
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
} from './types';
import { PessoaInput } from './schema';

export const Pessoas = {
    listar: () => httpClient.get<PessoaListResponse>('/api/pessoas'),

    buscar: (id: number) => httpClient.get<PessoaResponse>(`/api/pessoas/${id}`),

    criar: (data: PessoaInput) => httpClient.post<PessoaCreateResponse>('/api/pessoas', data),

    atualizar: (id: number, data: PessoaInput) => httpClient.put<PessoaUpdateResponse>(`/api/pessoas/${id}`, data),

    deletar: (id: number) => httpClient.delete<PessoaDeleteResponse>(`/api/pessoas/${id}`),

    ativar: (id: number) => httpClient.patch<PessoaAtivarResponse>(`/api/pessoas/${id}/ativar`),

    desativar: (id: number) => httpClient.patch<PessoaDesativarResponse>(`/api/pessoas/${id}/desativar`),
};
```
```tsx
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
            queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
        },
    });
};

export const useAtualizarPessoa = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<PessoaUpdateResponse, unknown, PessoaInput>({
        mutationFn: (data) => Pessoas.atualizar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const useDeletarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaDeleteResponse, unknown, number>({
        mutationFn: (id) => Pessoas.deletar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
        },
    });
};

export const useAtivarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaAtivarResponse, unknown, number>({
        mutationFn: (id) => Pessoas.ativar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};

export const useDesativarPessoa = () => {
    const queryClient = useQueryClient();

    return useMutation<PessoaDesativarResponse, unknown, number>({
        mutationFn: (id) => Pessoas.desativar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
            queryClient.invalidateQueries({ queryKey: pessoasKeys.detail(id) });
        },
    });
};
```

```tsx
//src/features/parametrizacao/cidades/types.ts

export interface Cidade {
    id: number;
    nom_cidade: string;
    cod_municipio_ibge: string;
    id_estado: number;
    nom_estado: string;
    sgl_estado: string;

}

export interface CidadeResponse {
    sucesso: boolean;
    cidades?: number;
    dados: Cidade[];
}
```
```tsx
//src/features/parametrizacao/cidades/schema.ts
import { z } from 'zod';

export const cidadeSchema = z.object({
    id: z.int(),
    id_estado: z.int(),
    nom_cidade: z.string(),
    cod_municipio_ibge: z.string()
})

export type CidadeInput = z.infer<typeof cidadeSchema>;
```
```tsx
//src/features/parametrizacao/cidades/queryKeys.ts

export const cidadeKeys = {
    all: ['cidades'] as const,
    // detail: (id: number) => ['cidade', id] as const,
    // byNome: (nome: string) => ['cidades', 'nome', nome] as const,
    // byEstado: (estadoId: number) => ['cidades', 'estado', estadoId] as const,
};
```
```tsx
//src/features/parametrizacao/cidades/api.ts

import { httpClient } from '@/lib/http/client';
import { CidadeResponse } from './types';

export const Cidades = {
    listar: () => httpClient.get<CidadeResponse>('/api/pessoas/cidades'),
}
```
```tsx
import { useQuery } from '@tanstack/react-query';
import { Cidades } from './api';
import { cidadeKeys } from './queryKeys';
import { Cidade } from './types';

export const useCidades = () => {
    return useQuery<Cidade[]>({
        queryKey: cidadeKeys.all,
        queryFn: Cidades.listar,
        staleTime: 1000 * 60 * 60 * 24, // 10 minutos
    });
};
```
```tsx
//src/features/parametrizacao/estados/types.ts

export interface Estado {
    id: number;
    nom_estado: string;
    sgl_estado: string;
}

export interface EstadoResponse {
    sucesso: boolean;
    estados?: number;
    dados: Estado[];
}
```
```tsx
//src/features/parametrizacao/estados/schema.ts
import { z } from 'zod';

export const EstadoSchema = z.object({
    id: z.number(),
    nom_estado: z.string(),
    sgl_estado: z.string(),
});

export type Estado = z.infer<typeof EstadoSchema>;
```
```tsx
//src/features/parametrizacao/estados/queryKeys.ts

export const estadoKeys = {
    all: ['estados'] as const,
    detail: (id: number) => ['estado', id] as const,
};
```
```tsx
//src/features/parametrizacao/estados/api.tsimport { EstadoResponse, Estado } from './types';

import { httpClient } from "@/lib/http/client";
import { EstadoResponse } from "./types";


export const Estados = {
    listar: () => httpClient.get<EstadoResponse>('/api/pessoas/estados'),
}
```
```tsx
//src/features/parametrizacao/estados/hooks.ts

import { useQuery } from '@tanstack/react-query';
import { Estados } from './api';
import { estadoKeys } from './queryKeys';

export function useEstados() {
    return useQuery({
        queryKey: estadoKeys.all,
        queryFn: Estados.listar,
        staleTime: 1000 * 60 * 10, // 10 minutos
    });
}
```
```tsx
// src/lib/utils/cepService.ts

import { BrasilApiCepResponse, CepResult, ViaCepResponse } from "./typeCEP";

const VIA_CEP_URL = 'https://viacep.com.br/ws';
const BRASIL_API_CEP_URL = 'https://brasilapi.com.br/api/cep/v2';


export async function buscarCep(cep: string): Promise<CepResult | null> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
    }

    // 1. Tentar ViaCEP
    try {
        const response = await fetch(`${VIA_CEP_URL}/${cepLimpo}/json/`);
        const data: ViaCepResponse = await response.json();

        if (!data.erro && data.cep) {
            return {
                cep: data.cep,
                logradouro: data.logradouro || '',
                complemento: data.complemento || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.estado || '',
                uf: data.uf || '',
            };
        }
    } catch (_) {
        // Falha no ViaCEP, tentar BrasilAPI
    }

    try {
        const response = await fetch(`${BRASIL_API_CEP_URL}/${cepLimpo}`);
        const data: BrasilApiCepResponse = await response.json();

        if (data.cep) {
            return {
                cep: data.cep,
                logradouro: data.street || '',
                complemento: '', // BrasilAPI não retorna complemento
                bairro: data.neighborhood || '',
                cidade: data.city || '',
                estado: '', // Não retorna nome do estado
                uf: data.state || '',
            };
        }
    } catch (_) {

    }

    return null;
}
```

Utilizar o componente:
```tsx
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ButtonGroup } from './button-group';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRight, ChevronRightIcon } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const totalRows = table.getFilteredRowModel().rows.length;

    return (
        <div className="flex justify-center items-center px-2 py-4">
            <div className="flex min-w-full justify-between items-center lg:space-x-8">
                <div className="flex justify-start items-center space-x-2">
                    <ButtonGroup>
                        <Button variant="outline">Por página</Button>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </ButtonGroup>
                    {/* <p className="text-sm font-medium">Por página</p> */}

                </div>
                <div className="flex w-[80px] md:w-[150px] items-center justify-center text-sm font-medium">
                    <span className='sr-only md:not-sr-only'>Página&nbsp;</span> {table.getState().pagination.pageIndex + 1} <span className='md:sr-only'> {'/'} </span><span className='sr-only md:not-sr-only'>&nbsp;de&nbsp;</span>{table.getPageCount()}
                </div>
                <div className="flex justify-end items-center space-x-2">
                    <ButtonGroup>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronFirstIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRightIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronLastIcon />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
```

```tsx
// app/(private)/pessoas/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { Pessoa } from '@/features/pessoas/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Power,
    PowerOff,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
        onAtivar?: (data: TData) => void;
        onDesativar?: (data: TData) => void;
    }
}

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

function formatarCpfExibicao(cpf: string) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export const PAPEIS_CONFIG: { key: keyof Pessoa; label: string; classe: string }[] = [
    { key: 'ind_medico', label: 'Médico', classe: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'ind_secretaria', label: 'Secretária', classe: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'ind_costureira', label: 'Costureira', classe: 'bg-pink-100 text-pink-800 border-pink-200' },
    { key: 'ind_paciente', label: 'Paciente', classe: 'bg-green-100 text-green-800 border-green-200' },
    { key: 'ind_administrador', label: 'Administrador', classe: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
];

export const pessoaColumns: ColumnDef<Pessoa>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'nom_completo',
        header: ({ column }) => <SortableHeader column={column} label="Nome" />,
        meta: { label: 'Nome' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'num_cpf',
        header: ({ column }) => <SortableHeader column={column} label="CPF" />,
        cell: ({ row }) => formatarCpfExibicao(row.original.num_cpf),
        meta: { label: 'CPF' },
    },
    {
        id: 'papeis',
        header: 'Papéis',
        enableSorting: false,
        accessorFn: (row) => row,
        cell: ({ row }) => {
            const pessoa = row.original;
            return (
                <div className="flex flex-wrap gap-1">
                    {PAPEIS_CONFIG.filter((p) => Number(pessoa[p.key]) === 1).map((p) => (
                        <Badge key={p.key} variant="outline" className={p.classe}>
                            {p.label}
                        </Badge>
                    ))}
                </div>
            );
        },
        filterFn: (row, columnId, filterValue: string) => {
            if (!filterValue) return true;
            const pessoa = row.original as Pessoa;
            return Number(pessoa[filterValue as keyof Pessoa]) === 1;
        },
        meta: { label: 'Papéis' },
    },
    {
        accessorKey: 'ind_status',
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) =>
            row.original.ind_status === 'ativo' ? (
                <Badge>Ativo</Badge>
            ) : (
                <Badge variant="destructive">Inativo</Badge>
            ),
        meta: { label: 'Status' },
    },
    {
        accessorKey: 'nom_cidade',
        header: ({ column }) => <SortableHeader column={column} label="Cidade" />,
        cell: ({ row }) =>
            row.original.nom_cidade ? `${row.original.nom_cidade}/${row.original.sgl_estado}` : '-',
        meta: { label: 'Cidade' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Criado" />,
        cell: ({ row }) => (row.original.created_at ? formatarData(row.original.created_at) : '-'),
        meta: { label: 'Criado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const pessoa = row.original;
            const meta = table.options.meta;
            const ativo = pessoa.ind_status === 'ativo';
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => meta?.onView?.(pessoa)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(pessoa)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {ativo ? (
                            <DropdownMenuItem onClick={() => meta?.onDesativar?.(pessoa)}>
                                <PowerOff className="mr-2 h-4 w-4" /> Desativar
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => meta?.onAtivar?.(pessoa)}>
                                <Power className="mr-2 h-4 w-4" /> Ativar
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(pessoa)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
```
```tsx
// app/(private)/pessoas/pessoas/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    usePessoas,
    useCriarPessoa,
    useAtualizarPessoa,
    useDeletarPessoa,
    useAtivarPessoa,
    useDesativarPessoa,
} from '@/features/pessoas/hooks';
import { pessoaSchema, PessoaInput } from '@/features/pessoas/schema';
import { Pessoa } from '@/features/pessoas/types';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { pessoaColumns, PAPEIS_CONFIG } from './columns';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus, Eye, EyeOff } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData, formatarCPF, formatarCEP, formatarTelefone, somenteDigitos } from '@/lib/utils/formatters';
import { buscarCep } from '@/lib/utils/cepService';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { useEstados } from '@/features/parametrizacao/estados/hooks';

const DEFAULT_FORM: PessoaInput = {
    id_cidade: 0,
    ind_status: 'ativo',
    nom_completo: '',
    num_cpf: '',
    num_rg: '',
    dta_nascimento: '',
    des_logradouro: '',
    num_endereco: '',
    des_complemento: '',
    num_cep: '',
    nom_bairro: '',
    num_celular_1: '',
    ind_whatsapp_1: true,
    num_celular_2: '',
    ind_whatsapp_2: true,
    des_email_1: '',
    des_email_2: '',
    des_senha: '',
    ind_medico: false,
    ind_secretaria: false,
    ind_costureira: false,
    ind_paciente: false,
    ind_administrador: false,
    val_cor_hex: '',
};

// --- Formulário reutilizado para criar/editar ---
function PessoaForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
}: {
    defaultValues: PessoaInput;
    onSubmit: (data: PessoaInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
}) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PessoaInput>({
        resolver: zodResolver(pessoaSchema),
        defaultValues,
    });

    const { data: cidadesResp } = useCidades();
    const cidades = useMemo(() => cidadesResp?.dados ?? [], [cidadesResp]);

    const { data: estadosResp } = useEstados();
    const estados = useMemo(() => estadosResp?.dados ?? [], [estadosResp]);

    const [idEstadoSelecionado, setIdEstadoSelecionado] = useState<number | null>(null);

    useEffect(() => {
        const idCidadeAtual = defaultValues.id_cidade;
        if (idCidadeAtual && cidades.length > 0 && idEstadoSelecionado === null) {
            const cidadeAtual = cidades.find((c) => c.id === idCidadeAtual);
            if (cidadeAtual) setIdEstadoSelecionado(cidadeAtual.id_estado);
        }
    }, [cidades, defaultValues.id_cidade, idEstadoSelecionado]);

    const cidadesFiltradas = useMemo(
        () => cidades.filter((c) => c.id_estado === idEstadoSelecionado),
        [cidades, idEstadoSelecionado]
    );

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [estadoBusca, setEstadoBusca] = useState<{ nom_estado: string; sgl_estado: string } | null>(null);

    const ehMedico = watch('ind_medico');
    const ehSecretaria = watch('ind_secretaria');
    const ehCostureira = watch('ind_costureira');
    const ehPaciente = watch('ind_paciente');
    const ehAdministrador = watch('ind_administrador');
    const cep = watch('num_cep');

    // Libera senha para papéis administrativos
    const precisaSenha = ehSecretaria || ehCostureira || ehAdministrador;

    // Busca CEP automaticamente quando completar 8 dígitos
    const handleCepBlur = async () => {
        const cepLimpo = somenteDigitos(cep || '');
        if (cepLimpo.length !== 8) return;

        setBuscandoCep(true);
        try {
            const resultado = await buscarCep(cepLimpo);
            if (!resultado) {
                toast.error('CEP não encontrado.');
                return;
            }

            setValue('des_logradouro', resultado.logradouro);
            setValue('nom_bairro', resultado.bairro);

            // Localiza o estado retornado na lista de estados cadastrados
            const estadoEncontrado = estados.find(
                (e) => e.sgl_estado.toLowerCase() === resultado.uf.toLowerCase()
            );

            if (estadoEncontrado) {
                setIdEstadoSelecionado(estadoEncontrado.id);
            }

            // Tenta casar a cidade retornada com a lista de cidades cadastradas (por nome + UF)
            const cidadeEncontrada = cidades.find(
                (c) =>
                    c.nom_cidade.toLowerCase() === resultado.cidade.toLowerCase() &&
                    c.sgl_estado.toLowerCase() === resultado.uf.toLowerCase()
            );

            if (cidadeEncontrada) {
                setValue('id_cidade', cidadeEncontrada.id);
                setIdEstadoSelecionado(cidadeEncontrada.id_estado);
            } else {
                setValue('id_cidade', 0);
                toast.warning(
                    `Cidade "${resultado.cidade} - ${resultado.uf}" não encontrada na base. Selecione manualmente.`
                );
            }
        } catch {
            toast.error('Erro ao buscar CEP.');
        } finally {
            setBuscandoCep(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {readOnlyId !== undefined && (
                <div className="space-y-1">
                    <Label>ID</Label>
                    <Input value={readOnlyId} disabled />
                </div>
            )}

            {/* Papéis */}
            <div className="space-y-2">
                <Label>Tipo de Pessoa</Label>
                <div className="grid grid-cols-3 gap-4 p-3 border rounded-md">
                    {[
                        { name: 'ind_paciente' as const, label: 'Paciente' },
                        { name: 'ind_costureira' as const, label: 'Costureira' },
                        { name: 'ind_medico' as const, label: 'Médico' },
                        { name: 'ind_secretaria' as const, label: 'Secretária' },
                        { name: 'ind_administrador' as const, label: 'Administrador' },
                    ].map((papel) => (
                        <Controller
                            key={papel.name}
                            name={papel.name}
                            control={control}
                            render={({ field }) => (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                                    <span className="text-sm">{papel.label}</span>
                                </label>
                            )}
                        />
                    ))}
                </div>
                {errors.ind_medico && (
                    <p className="text-sm text-destructive">{errors.ind_medico.message}</p>
                )}
            </div>

            {/* Dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                    <Label>Nome Completo</Label>
                    <Controller
                        name="nom_completo"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: Maria da Silva" />}
                    />
                    {errors.nom_completo && (
                        <p className="text-sm text-destructive">{errors.nom_completo.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>CPF</Label>
                    <Controller
                        name="num_cpf"
                        control={control}
                        render={({ field }) => (
                            <Input
                                value={formatarCPF(field.value || '')}
                                onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 11))}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        )}
                    />
                    {errors.num_cpf && <p className="text-sm text-destructive">{errors.num_cpf.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>RG</Label>
                    <Controller
                        name="num_rg"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: 1234567" />}
                    />
                    {errors.num_rg && <p className="text-sm text-destructive">{errors.num_rg.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Data de Nascimento</Label>
                    <Controller
                        name="dta_nascimento"
                        control={control}
                        render={({ field }) => <Input {...field} type="date" />}
                    />
                    {errors.dta_nascimento && (
                        <p className="text-sm text-destructive">{errors.dta_nascimento.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Status</Label>
                    <Controller
                        name="ind_status"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>CEP</Label>
                    <Controller
                        name="num_cep"
                        control={control}
                        render={({ field }) => (
                            <Input
                                value={formatarCEP(field.value || '')}
                                onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 8))}
                                onBlur={handleCepBlur}
                                placeholder="00.000-000"
                                maxLength={10}
                                disabled={buscandoCep}
                            />
                        )}
                    />
                    {buscandoCep && <p className="text-xs text-muted-foreground">Buscando endereço...</p>}
                    {errors.num_cep && <p className="text-sm text-destructive">{errors.num_cep.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Estado</Label>
                    <Select
                        value={idEstadoSelecionado ? String(idEstadoSelecionado) : ''}
                        onValueChange={(value) => {
                            const novoId = Number(value);
                            setIdEstadoSelecionado(novoId);
                            // Ao trocar o estado, limpa a cidade selecionada (evita inconsistência)
                            setValue('id_cidade', 0);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o estado">
                                {estados.find((e) => e.id === idEstadoSelecionado)?.nom_estado}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {estados.map((e) => (
                                <SelectItem key={e.id} value={String(e.id)}>
                                    {e.nom_estado} ({e.sgl_estado})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label>Cidade</Label>
                    <Controller
                        name="id_cidade"
                        control={control}
                        render={({ field }) => {
                            const cidadeAtual = cidades.find((c) => c.id === field.value);
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    disabled={!idEstadoSelecionado}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={idEstadoSelecionado ? 'Selecione a cidade' : 'Selecione o estado primeiro'}>
                                            {cidadeAtual?.nom_cidade}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cidadesFiltradas.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.nom_cidade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                    {errors.id_cidade && (
                        <p className="text-sm text-destructive">{errors.id_cidade.message}</p>
                    )}
                </div>

                <div className="space-y-1 md:col-span-2">
                    <Label>Logradouro</Label>
                    <Controller
                        name="des_logradouro"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: Rua das Flores" />}
                    />
                    {errors.des_logradouro && (
                        <p className="text-sm text-destructive">{errors.des_logradouro.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Número</Label>
                    <Controller
                        name="num_endereco"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: 123" />}
                    />
                    {errors.num_endereco && (
                        <p className="text-sm text-destructive">{errors.num_endereco.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Complemento</Label>
                    <Controller
                        name="des_complemento"
                        control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Ex: Apto 101" />}
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <Label>Bairro</Label>
                    <Controller
                        name="nom_bairro"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: Setor Bueno" />}
                    />
                    {errors.nom_bairro && (
                        <p className="text-sm text-destructive">{errors.nom_bairro.message}</p>
                    )}
                </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Celular 1</Label>
                    <div className="flex items-center gap-4">
                        <Controller
                            name="num_celular_1"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    value={formatarTelefone(field.value || '')}
                                    onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 11))}
                                    placeholder="(00) 0 0000-0000"
                                    maxLength={16}
                                />
                            )}
                        />
                        <Controller
                            name="ind_whatsapp_1"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                    <span className="text-xs text-muted-foreground">WhatsApp</span>
                                </div>
                            )}
                        />
                    </div>
                    {errors.num_celular_1 && (
                        <p className="text-sm text-destructive">{errors.num_celular_1.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Celular 2</Label>
                    <div className="flex items-center gap-4">
                        <Controller
                            name="num_celular_2"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    value={formatarTelefone(field.value || '')}
                                    onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 11))}
                                    placeholder="(00) 0 0000-0000"
                                    maxLength={16}
                                />
                            )}
                        />
                        <Controller
                            name="ind_whatsapp_2"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                    <span className="text-xs text-muted-foreground">WhatsApp</span>
                                </div>
                            )}
                        />
                    </div>
                    {errors.num_celular_2 && (
                        <p className="text-sm text-destructive">{errors.num_celular_2.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>E-mail 1</Label>
                    <Controller
                        name="des_email_1"
                        control={control}
                        render={({ field }) => <Input {...field} type="email" placeholder="Ex: nome@email.com" />}
                    />
                    {errors.des_email_1 && (
                        <p className="text-sm text-destructive">{errors.des_email_1.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>E-mail 2</Label>
                    <Controller
                        name="des_email_2"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} value={field.value ?? ''} type="email" placeholder="Ex: alternativo@email.com" />
                        )}
                    />
                    {errors.des_email_2 && (
                        <p className="text-sm text-destructive">{errors.des_email_2.message}</p>
                    )}
                </div>
            </div>

            {/* Senha - somente para papéis com acesso ao sistema */}
            {precisaSenha && (
                <div className="space-y-1">
                    <Label>Senha {readOnlyId !== undefined && '(deixe em branco para manter a atual)'}</Label>
                    <div className="relative">
                        <Controller
                            name="des_senha"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    type={mostrarSenha ? 'text' : 'password'}
                                    placeholder="Mínimo 6 caracteres"
                                    className="pr-10"
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.des_senha && (
                        <p className="text-sm text-destructive">{errors.des_senha.message}</p>
                    )}
                </div>
            )}

            {/* Cor - somente para costureira */}
            {ehCostureira && (
                <div className="space-y-1">
                    <Label>Cor de Identificação</Label>
                    <Controller
                        name="val_cor_hex"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={field.value ? `#${field.value}` : '#ffffff'}
                                    onChange={(e) => field.onChange(e.target.value.replace('#', '').toUpperCase())}
                                    className="h-9 w-14 rounded border cursor-pointer"
                                />
                                <Input
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value.replace('#', '').toUpperCase())}
                                    placeholder="FFFFFF"
                                    maxLength={6}
                                    className="w-32"
                                />
                            </div>
                        )}
                    />
                    {errors.val_cor_hex && (
                        <p className="text-sm text-destructive">{errors.val_cor_hex.message}</p>
                    )}
                </div>
            )}

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function PessoaPage() {
    const { data: pessoasResp, isLoading, error } = usePessoas();
    const pessoas = useMemo(() => pessoasResp?.dados ?? [], [pessoasResp]);

    const criarMutation = useCriarPessoa();
    const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
    const atualizarMutation = useAtualizarPessoa(pessoaSelecionada?.id ?? 0);
    const deletarMutation = useDeletarPessoa();
    const ativarMutation = useAtivarPessoa();
    const desativarMutation = useDesativarPessoa();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        const opcoesColunas = pessoaColumns
            .filter((col) => 'accessorKey' in col && col.id !== 'id' && col.id !== 'acoes')
            .map((col) => ({
                value: (col as any).accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));

        return [...opcoesColunas, { value: 'papeis', label: 'Papéis' }];
    }, []);

    const [filterField, setFilterField] = useState(filterOptions[0]?.value || '');
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        if (filterField && value) {
            setColumnFilters([{ id: filterField, value }]);
        } else {
            setColumnFilters([]);
        }
    };

    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    const table = useReactTable({
        data: pessoas,
        columns: pessoaColumns,
        state: { columnFilters, sorting, pagination, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        manualPagination: false,
        meta: {
            onView: (pessoa: Pessoa) => {
                setPessoaSelecionada(pessoa);
                setDialogVisualizarAberto(true);
            },
            onEdit: (pessoa: Pessoa) => {
                setPessoaSelecionada(pessoa);
                setDialogEditarAberto(true);
            },
            onDelete: (pessoa: Pessoa) => {
                setPessoaParaDeletar(pessoa);
            },
            onAtivar: (pessoa: Pessoa) => {
                ativarMutation.mutate(pessoa.id, {
                    onSuccess: () => toast.success('Pessoa ativada com sucesso!'),
                    onError: (error) =>
                        toast.error(error instanceof ApiError ? error.message : 'Erro ao ativar pessoa.'),
                });
            },
            onDesativar: (pessoa: Pessoa) => {
                desativarMutation.mutate(pessoa.id, {
                    onSuccess: () => toast.success('Pessoa desativada com sucesso!'),
                    onError: (error) =>
                        toast.error(error instanceof ApiError ? error.message : 'Erro ao desativar pessoa.'),
                });
            },
        },
    });

    // Converte dados do formulário (boolean) para o payload (mantém boolean; API aceita boolean no create/update)
    const handleCriar = (data: PessoaInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Pessoa cadastrada com sucesso');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao cadastrar a pessoa.');
            },
        });
    };

    const handleAtualizar = (data: PessoaInput) => {
        // Se a senha ficou vazia na edição, remove do payload para não sobrescrever
        const payload = { ...data };
        if (!payload.des_senha) delete payload.des_senha;

        atualizarMutation.mutate(payload, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setPessoaSelecionada(null);
                toast.success('Pessoa atualizada com sucesso!');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao atualizar a pessoa.');
            },
        });
    };

    const confirmarDelecao = () => {
        if (!pessoaParaDeletar) return;
        deletarMutation.mutate(pessoaParaDeletar.id, {
            onSuccess: () => {
                setPessoaParaDeletar(null);
                toast.success('Pessoa deletada com sucesso!');
            },
            onError: (error) => {
                setPessoaParaDeletar(null);
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao deletar a pessoa.');
            },
        });
    };

    if (error) return <div>Erro ao carregar pessoas.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Pessoa</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Pessoa
                            </Button>
                        }
                    />
                    <DialogContent className="max-w-xs md:max-w-[90vw] max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Pessoa</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova pessoa.
                            </DialogDescription>
                        </DialogHeader>

                        <PessoaForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                        />
                    </DialogContent>
                </Dialog>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1">
                        <Funnel className="h-4 w-4" />
                        Filtros
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Columns className="h-4 w-4" />
                                    Colunas
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.columnDef.meta?.label ?? column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-wrap items-end gap-2 mb-4 p-4 border rounded-md bg-muted/20">
                    <div className="flex-1 min-w-[150px]">
                        <Select value={filterField}
                            onValueChange={(value) => {
                                setFilterField(value);
                                setFilterValue('');
                                setColumnFilters([])
                            }}>
                            <SelectTrigger className="w-full">
                                {filterOptions.find((opt) => opt.value === filterField)?.label || 'Campo'}
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        {filterField === 'papeis' ? (
                            <Select
                                value={filterField}
                                onValueChange={(value) => {
                                    setFilterValue(value);
                                    setColumnFilters([{ id: 'papeis', value }])
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o papel">
                                        {PAPEIS_CONFIG.find((p) => p.key === filterValue)?.label}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {PAPEIS_CONFIG.map((p) => (
                                        <SelectItem key={p.key} value={p.key}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'}`}
                                value={filterValue}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-full"
                            />
                        )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar
                    </Button>
                </div>
            )}

            <Card
                className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 ${showFilters ? 'max-h-[55vh] sm:max-h-[60vh]' : 'max-h-[75vh] sm:max-h-[75vh]'
                    }`}
            >
                <CardContent className="p-0">
                    <div
                        className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary ${showFilters
                            ? 'max-h-[calc(55vh-105px)] sm:max-h-[calc(60vh-65px)]'
                            : 'max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]'
                            }`}
                    >
                        <Table className="overflow-x-auto">
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton columnsCount={pessoaColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={pessoaColumns.length} className="text-center py-4">
                                            Nenhuma pessoa encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            {/* Dialog de edição */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={(open) => {
                    setDialogEditarAberto(open);
                    if (!open) setPessoaSelecionada(null);
                }}
            >
                <DialogContent className="max-w-xs md:max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Pessoa</DialogTitle>
                        <DialogDescription>Preencha os campos corretamente para editar a pessoa.</DialogDescription>
                    </DialogHeader>
                    {pessoaSelecionada && (
                        <PessoaForm
                            defaultValues={{
                                id_cidade: pessoaSelecionada.id_cidade,
                                ind_status: pessoaSelecionada.ind_status,
                                nom_completo: pessoaSelecionada.nom_completo,
                                num_cpf: pessoaSelecionada.num_cpf,
                                num_rg: pessoaSelecionada.num_rg,
                                dta_nascimento: pessoaSelecionada.dta_nascimento?.slice(0, 10) ?? '',
                                des_logradouro: pessoaSelecionada.des_logradouro,
                                num_endereco: pessoaSelecionada.num_endereco,
                                des_complemento: pessoaSelecionada.des_complemento,
                                num_cep: pessoaSelecionada.num_cep,
                                nom_bairro: pessoaSelecionada.nom_bairro,
                                num_celular_1: pessoaSelecionada.num_celular_1,
                                ind_whatsapp_1: !!pessoaSelecionada.ind_whatsapp_1,
                                num_celular_2: pessoaSelecionada.num_celular_2,
                                ind_whatsapp_2: !!pessoaSelecionada.ind_whatsapp_2,
                                des_email_1: pessoaSelecionada.des_email_1,
                                des_email_2: pessoaSelecionada.des_email_2,
                                des_senha: '',
                                ind_medico: !!pessoaSelecionada.ind_medico,
                                ind_secretaria: !!pessoaSelecionada.ind_secretaria,
                                ind_costureira: !!pessoaSelecionada.ind_costureira,
                                ind_paciente: !!pessoaSelecionada.ind_paciente,
                                ind_administrador: !!pessoaSelecionada.ind_administrador,
                                val_cor_hex: pessoaSelecionada.val_cor_hex,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={pessoaSelecionada.id}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setPessoaSelecionada(null);
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Pessoa</DialogTitle>
                        <DialogDescription>Detalhes da pessoa selecionada.</DialogDescription>
                    </DialogHeader>
                    {pessoaSelecionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={pessoaSelecionada.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <Input value={pessoaSelecionada.ind_status} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Nome Completo</Label>
                                <Input value={pessoaSelecionada.nom_completo} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>CPF</Label>
                                    <Input value={formatarCPF(pessoaSelecionada.num_cpf)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>RG</Label>
                                    <Input value={pessoaSelecionada.num_rg} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Celular 1</Label>
                                    <Input value={formatarTelefone(pessoaSelecionada.num_celular_1)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>E-mail 1</Label>
                                    <Input value={pessoaSelecionada.des_email_1} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Cidade</Label>
                                    <Input value={pessoaSelecionada.nom_cidade ?? '-'} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Estado</Label>
                                    <Input value={pessoaSelecionada.sgl_estado ?? '-'} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={pessoaSelecionada.created_at ? formatarData(pessoaSelecionada.created_at) : '-'}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={pessoaSelecionada.updated_at ? formatarData(pessoaSelecionada.updated_at) : '-'}
                                        disabled
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose variant="outline">Fechar</DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmação de deleção */}
            <AlertDialog open={!!pessoaParaDeletar} onOpenChange={(open) => !open && setPessoaParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar pessoa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta pessoa? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarDelecao} disabled={deletarMutation.isPending}>
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
```