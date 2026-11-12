Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior, Preciso implementar uma feature de Pessoa em um projeto Next.js 16.2.10 com tanstack/react-query 5.101.2 e um cliente HTTP customizado.

Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

* **Endpoints da API**:s
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
│   │   │   ├── pessoas
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
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
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "horario":
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

        num_celular_2: z
            .string()
            .regex(/^\d{10,11}$/, 'Celular inválido')
            .optional()
            .nullable(),
        ind_whatsapp_2: booleanFlexivel.default(true),

        des_email_1: z.string().email('E-mail inválido').max(255),
        des_email_2: z
            .string()
            .email('E-mail inválido')
            .max(255)
            .optional()
            .nullable(),

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

        val_cor_hex: z
            .string()
            .regex(/^[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (ex: FFFFFF)')
            .optional()
            .nullable(),
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

    criar: (data: PessoaInput) =>
        httpClient.post<PessoaCreateResponse>('/api/pessoas', data),

    atualizar: (id: number, data: PessoaInput) =>
        httpClient.put<PessoaUpdateResponse>(`/api/pessoas/${id}`, data),

    deletar: (id: number) =>
        httpClient.delete<PessoaDeleteResponse>(`/api/pessoas/${id}`),

    ativar: (id: number) =>
        httpClient.delete<PessoaAtivarResponse>(`/api/pessoas/${id}/ativar`),

    desativar: (id: number) =>
        httpClient.delete<PessoaDesativarResponse>(`/api/pessoas/${id}/desativar`),
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

Na coluna de Papéis cada Badge deve ter a seguinte cor:
Médico: 'bg-blue-100 text-blue-800 border-blue-200',
Secretária: 'bg-purple-100 text-purple-800 border-purple-200',
Costureira: 'bg-pink-100 text-pink-800 border-pink-200',
Paciente: 'bg-green-100 text-green-800 border-green-200',
Administrador: 'bg-yellow-100 text-yellow-800 border-yellow-200',