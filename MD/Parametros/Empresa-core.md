Preciso que se comporte como uma, engenheiro de software sênio, arquiteto de software sênio e desenvolvedor frontend sênio, Preciso implementar uma feature de Empresa em um projeto Next.js com React Query e um cliente HTTP customizado. Os requisitos são:

* **Endpoints da API**:
  * Criar empresa
    * **Método HTTP**: POST
    * **URL**: /api/empresa
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | id_cidade | text | 5418 |
      | ind_ativo | text | true |
      | nom_fantasia | text | Bood Accessoria 2 |
      | nom_razao_social | text | Bood Accessoria 2 |
      | num_cnpj | text | 89308985000120 |
      | num_inscricao_estadual | text | 205461964 |
      | dta_abertura | text | 2020-08-20 |
      | des_logradouro | text | Rua C Treze |
      | num_endereco | text | 0 |
      | des_complemento | text | QD 58 LT 15 |
      | num_cep | text | 74365690 |
      | nom_bairro | text | Setor Novo Horizonte |
      | ind_whatsapp_1 | text | true |
      | num_celular_1 | text | 62999999999 |
      | ind_whatsapp_2 | text | false |
      | num_celular_2 | text | 62999999999 |
      | des_email_1 | text | contato@boodacessoria.com.br |
      | val_cor_principal | text | faf6fe |
      | des_url_logo_horizontal | file | arquivo.png(binário) |
      | des_url_logo_vertical | file | arquivo.png(binário) |
      | des_url_logo_vertical_negativa | file | arquivo.png(binário) |
      | des_url_logo_horizontal_negativa | file | arquivo.png(binário) |
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
    * **URL**: /api/empresa
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
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
          "id_cidade": 5418,
          "ind_ativo": 1,
          "nom_fantasia": "Bood Accessoria",
          "nom_razao_social": "Bood Accessoria",
          "num_cnpj": "34374667000176",
          "num_inscricao_estadual": "205461964",
          "dta_abertura": "2020-08-19T03:00:00.000Z",
          "des_logradouro": "Rua C Treze",
          "num_endereco": "0",
          "des_complemento": "QD 58 LT 15",
          "num_cep": "74365690",
          "nom_bairro": "Setor Novo Horizonte",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": "62988888888",
          "ind_whatsapp_2": 1,
          "des_email_1": "contato@boodacessoria.com.br",
          "des_email_2": null,
          "val_cor_principal": "faf6fe",
          "des_url_logo_vertical": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429176-155775182.jpg",
          "des_url_logo_horizontal": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429171-973289006.jpg",
          "des_url_logo_vertical_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429179-322982734.jpg",
          "des_url_logo_horizontal_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429182-480855710.jpg",
          "created_at": "2026-08-01T21:57:09.000Z",
          "updated_ad": "2026-08-02T16:19:01.000Z",
          "deleted_at": null
      }
    }
    ```
  * Buscar empresa: 
    * **Método HTTP**: GET
    * **URL**: /api/empresa/{id}
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
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
          "id_cidade": 5418,
          "ind_ativo": 1,
          "nom_fantasia": "Bood Accessoria",
          "nom_razao_social": "Bood Accessoria",
          "num_cnpj": "34374667000176",
          "num_inscricao_estadual": "205461964",
          "dta_abertura": "2020-08-19T03:00:00.000Z",
          "des_logradouro": "Rua C Treze",
          "num_endereco": "0",
          "des_complemento": "QD 58 LT 15",
          "num_cep": "74365690",
          "nom_bairro": "Setor Novo Horizonte",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": "62988888888",
          "ind_whatsapp_2": 1,
          "des_email_1": "contato@boodacessoria.com.br",
          "des_email_2": null,
          "val_cor_principal": "faf6fe",
          "des_url_logo_vertical": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429176-155775182.jpg",
          "des_url_logo_horizontal": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429171-973289006.jpg",
          "des_url_logo_vertical_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429179-322982734.jpg",
          "des_url_logo_horizontal_negativa": "uploads/empresa/img-BoodAssessoria-LogoPositivo-1785621429182-480855710.jpg",
          "created_at": "2026-08-01T21:57:09.000Z",
          "updated_ad": "2026-08-02T16:19:01.000Z",
          "deleted_at": null
      }
    }
    ```
  * Atualizar empresa:
    * **Método HTTP**: PUT
    * **URL**: /api/empresa/{id}
    * **Campos**: id_cidade, ind_ativo, nom_fantasia, nom_razao_social, num_cnpj, num_inscricao_estadual, dta_abertura, des_logradouro, num_endereco, des_complemento, num_cep, nom_bairro, ind_whatsapp_1, num_celular_1, ind_whatsapp_2, num_celular_2, des_email_1, val_cor_principal, des_url_logo_horizontal, des_url_logo_vertical, des_url_logo_vertical_negativa, des_url_logo_horizontal_negativa
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: usuarioKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
      | Chave(Key) | Tipo(Type) | Valor/Descrição(value) |
      | :--- | :---: | ---: |
      | ind_ativo | text | false |
      | num_celular_2 | text | 62988888888 |
      | des_url_logo_horizontal | file | arquivo.png(binário) |
      | des_url_logo_vertical | file | arquivo.png(binário) |
      | des_url_logo_vertical_negativa | file | arquivo.png(binário) |
      | des_url_logo_horizontal_negativa | file | arquivo.png(binário) |
    * **Estrutura de dados (resposta)**:
    ```json
    {
      "sucesso": true,
      "dados": {
          "id": 3,
          "id_cidade": 5418,
          "ind_ativo": 1,
          "nom_fantasia": "Bood Accessoria 2",
          "nom_razao_social": "Bood Accessoria 2",
          "num_cnpj": "89308985000120",
          "num_inscricao_estadual": "205461964",
          "dta_abertura": "2020-08-19T03:00:00.000Z",
          "des_logradouro": "Rua C Treze",
          "num_endereco": "0",
          "des_complemento": "QD 58 LT 15",
          "num_cep": "74365690",
          "nom_bairro": "Setor Novo Horizonte",
          "num_celular_1": "62999999999",
          "ind_whatsapp_1": 1,
          "num_celular_2": "62988888888",
          "ind_whatsapp_2": 1,
          "des_email_1": "contato@boodacessoria.com.br",
          "des_email_2": null,
          "val_cor_principal": "faf6fe",
          "des_url_logo_vertical": null,
          "des_url_logo_horizontal": null,
          "des_url_logo_vertical_negativa": null,
          "des_url_logo_horizontal_negativa": null,
          "created_at": "2026-08-07T17:01:35.000Z",
          "updated_ad": "2026-08-07T17:21:50.000Z",
          "deleted_at": null
    }
  }
    ```
  * Deletar empresa
    * **Método HTTP**: DELETE
    * **URL**: /api/empresa/{id}
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
CREATE TABLE IF NOT EXISTS tab_empresa (
  id INT NOT NULL AUTO_INCREMENT,
  id_cidade INT NOT NULL,
  nom_fantasia VARCHAR(100) NOT NULL,
  nom_razao_social VARCHAR(100) NOT NULL,
  num_cnpj VARCHAR(14) NOT NULL,
  num_inscricao_estadual VARCHAR(20) NULL,
  dta_abertura DATE NOT NULL,
  des_logradouro VARCHAR(45) NOT NULL,
  num_endereco VARCHAR(255) NULL,
  des_complemento VARCHAR(100) NULL,
  num_cep VARCHAR(8) NOT NULL,
  nom_bairro VARCHAR(100) NOT NULL,
  num_celular_1 VARCHAR(15) NOT NULL,
  ind_whatsapp_1 TINYINT NOT NULL,
  num_celular_2 VARCHAR(15) NULL,
  ind_whatsapp_2 TINYINT NOT NULL,
  des_email_1 VARCHAR(255) NOT NULL,
  des_email_2 VARCHAR(255) NULL,
  val_cor_principal VARCHAR(6) NULL DEFAULT NULL,
  des_url_logo_vertical VARCHAR(255) NULL DEFAULT NULL,
  des_url_logo_horizontal VARCHAR(255) NULL DEFAULT NULL,
  des_url_logo_vertical_negativa VARCHAR(255) NULL DEFAULT NULL,
  des_url_logo_horizontal_negativa VARCHAR(255) NULL DEFAULT NULL,
  ind_ativo TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_ad DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_tab_empresa_tab_cidade1_idx (id_cidade ASC) VISIBLE,
  CONSTRAINT fk_tab_empresa_tab_cidade1
    FOREIGN KEY (id_cidade)
    REFERENCES tab_cidade (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── parametros
│   │   │   ├── Empresa
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── parametrizacao
│   │   ├── empresa
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
Obs.: Mantenha a organização em pastas src/features/[Empresa]/ e utilize o httpClient já existente em src/lib/http/client.ts