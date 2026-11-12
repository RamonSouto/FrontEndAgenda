Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Preciso implementar uma feature dos layout de Empresa em um projeto Next.js V16.2.10 com React Query e um cliente HTTP customizado no layout estou utilizado Shadcn V4.16.0, para icones estou utilizando lucide-react V1.24.0. Estou trabalhando nos tamanhos de tela Mobile First, MD - medium e LG - larguer.Os requisitos são:
* **Empresas**:
  * Listar empresa
    1. Na tela de listagem de empresa deve conter um titulo "Empresas" dentro de uma div com as seguintes classes "text-2xl font-bold"  
    2. Deve conter um botão para inserir uma nova empresa.
      * Abrir um modal (Dialog) para inserir um nova empresas os campos deve ser os campos abaixo:
      ```HTML
        <DialogHeader>
          <DialogTitle>Empresa</DialogTitle>
          <DialogDescription>
            Preenhcas os campos corretamente para cadastrar uma nova empresa.
          </DialogDescription>
        </DialogHeader>
      ```
      | Campo | Descricao | Tipo(type)| Formato(format) |
      | :--- | :---: | :---: | ---: |
      | nom_fantasia | Nome Fantasia | Input | String |
      | nom_razao_social | Razão Social | Input | String |
      | num_cnpj | Razão Social | Input | 99.999.999/9999-99 |
      | num_inscricao_estadual | I.E. | Input | String |
      | nom_razao_social | Razão Social | Input | String |
      | nom_fantasia | Nome Fantasia | Input | String |
      | dta_abertura | Data de Abertura | Date Picker | dd/MM/aaaa |
      | num_cep | CEP | Input | 99.999-999 |
      | des_logradouro | logradouro | Input | String |
      | num_endereco | Número | Input | Number |
      | des_complemento | Complemento | Input | String |
      | nom_bairro | Bairro | Input | String |
      | num_celular_1 | Celular 1 | Input | (99) 9 9999-9999 |
      | ind_whatsapp_1 | WhatsApp | Switch |  |
      | num_celular_2 | Celular 2 | Input | (99) 9 9999-9999 |
      | ind_whatsapp_2 | WhatsApp | Switch |  |
      | des_email_1 | Email | Input | contato@bood.com.br |
      | des_email_2 | Email 2 | Input | contato@bood.com.br |
      | val_cor_principal | Cor principal logo | Date Picker Color | #999999 |
      | nom_estado | Estado | Select |  |
      | nom_cidade | Cidade | Select |  |
      | ind_ativo | Status | Switch |  |
      | created_at | Criado | Input(Disabled) | dd/MM/aaaa |
      | updated_ad | Editado | Input(Disabled) | dd/MM/aaaa |
      ```HTML
        <DialogFooter>
          <DialogClose variant="outline">Fechar</DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      ```
      * Ao preencher o campo de CEP deve ser realizado a busca na API viacep.com.br/ws/{numeroCEP}/json/ e BrasilApi https://brasilapi.com.br/api/cep/v2/{cep} o retono deve ser preenchido os campos correlacionado na tabela abaixo, caso não seja encontrado o CEP na API deixe liberado os campos para ser preenchido manualmente pelo usuário, ao selecionar uma estado deve filtrar somente as cidades que pertencem ao estado selecionado:
      Retorno do VIA CEP:
      ```JSON
      {
        "cep": "01001-000",
        "logradouro": "Praça da Sé",
        "complemento": "lado ímpar",
        "unidade": "",
        "bairro": "Sé",
        "localidade": "São Paulo",
        "uf": "SP",
        "estado": "São Paulo",
        "regiao": "Sudeste",
        "ibge": "3550308",
        "gia": "1004",
        "ddd": "11",
        "siafi": "7107"
      }
      ``` 
      | Retorno JSON | Campos Relacionado |
      | :--- | :--- |
      | cep | num_cep |
      | logradouro | des_logradouro |
      | complemento | des_complemento |
      | bairro | nom_bairro |
      | localidade | nom_cidade |
      | estado | nom_estado |
      Retorno do Brasil API:
      ```JSON
      {
        "cep": "89010025",
        "state": "SC",
        "city": "Blumenau",
        "neighborhood": "Centro",
        "street": "Rua Doutor Luiz de Freitas Melro",
        "timezoneName": "America/Sao_Paulo",
        "location": {
        "type": "Point",
        "coordinates": {}
        },
          "ibge": {
          "city": "4202404",
          "state": "42"
        }
      }
      ```
      | Retorno JSON | Campos Relacionado |
      | :--- | :--- |
      | cep | num_cep |
      | street | des_logradouro |
      | neighborhood | nom_bairro |
      | city | nom_cidade |
      * Ao preencher o campo de CNPJ deve ser realizado a busca na BrasilApi https://brasilapi.com.br/api/cnpj/v1/{cnpj} o retono deve ser preenchido os campos correlacionado na tabela abaixo, caso não seja encontrado o CNPJ na API deixe liberado os campos para ser preenchido manualmente pelo usuário.
      Retorno do Brasil API:
      ```JSON
      {
        "uf": "SP",
        "cep": "01311902",
        "qsa": [
          {
            "pais": null,
            "nome_socio": "HAYDEE SVAB",
            "codigo_pais": null,
            "faixa_etaria": "Entre 41 a 50 anos",
            "cnpj_cpf_do_socio": "***112108**",
            "qualificacao_socio": "Presidente",
            "codigo_faixa_etaria": 5,
            "data_entrada_sociedade": "2024-02-27",
            "identificador_de_socio": 2,
            "cpf_representante_legal": "***000000**",
            "nome_representante_legal": "",
            "codigo_qualificacao_socio": 16,
            "qualificacao_representante_legal": "Não informada",
            "codigo_qualificacao_representante_legal": 0
          }
        ],
        "cnpj": "19131243000197",
        "pais": null,
        "email": null,
        "porte": "DEMAIS",
        "bairro": "BELA VISTA",
        "numero": "37",
        "ddd_fax": "",
        "municipio": "SAO PAULO",
        "logradouro": "PAULISTA 37",
        "cnae_fiscal": 9430800,
        "codigo_pais": null,
        "complemento": "ANDAR 4",
        "codigo_porte": 5,
        "razao_social": "OPEN KNOWLEDGE BRASIL",
        "nome_fantasia": "REDE PELO CONHECIMENTO LIVRE",
        "capital_social": 0,
        "ddd_telefone_1": "1123851939",
        "ddd_telefone_2": "",
        "opcao_pelo_mei": null,
        "descricao_porte": "",
        "codigo_municipio": 7107,
        "cnaes_secundarios": [
          {
            "codigo": 9493600,
            "descricao": "Atividades de organizações associativas ligadas à cultura e à arte"
          },
          {
            "codigo": 9499500,
            "descricao": "Atividades associativas não especificadas anteriormente"
          },
          {
            "codigo": 8599699,
            "descricao": "Outras atividades de ensino não especificadas anteriormente"
          },
          {
            "codigo": 8230001,
            "descricao": "Serviços de organização de feiras, congressos, exposições e festas"
          },
          {
            "codigo": 6204000,
            "descricao": "Consultoria em tecnologia da informação"
          }
        ],
        "natureza_juridica": "Associação Privada",
        "regime_tributario": [
          {
            "ano": 2017,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          },
          {
            "ano": 2018,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          },
          {
            "ano": 2019,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          },
          {
            "ano": 2020,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          },
          {
            "ano": 2021,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          },
          {
            "ano": 2022,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          },
          {
            "ano": 2023,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "ISENTA DO IRPJ",
            "quantidade_de_escrituracoes": 1
          }
        ],
        "situacao_especial": "",
        "opcao_pelo_simples": null,
        "situacao_cadastral": 2,
        "data_opcao_pelo_mei": null,
        "data_exclusao_do_mei": null,
        "cnae_fiscal_descricao": "Atividades de associações de defesa de direitos sociais",
        "codigo_municipio_ibge": 3550308,
        "data_inicio_atividade": "2013-10-03",
        "data_situacao_especial": null,
        "data_opcao_pelo_simples": null,
        "data_situacao_cadastral": "2013-10-03",
        "nome_cidade_no_exterior": "",
        "codigo_natureza_juridica": 3999,
        "data_exclusao_do_simples": null,
        "motivo_situacao_cadastral": 0,
        "ente_federativo_responsavel": "",
        "identificador_matriz_filial": 1,
        "qualificacao_do_responsavel": 16,
        "descricao_situacao_cadastral": "ATIVA",
        "descricao_tipo_de_logradouro": "AVENIDA",
        "descricao_motivo_situacao_cadastral": "SEM MOTIVO",
        "descricao_identificador_matriz_filial": "MATRIZ"
      }
      ```
    3. Deve conter uma seção somente contendo filtros deve ter um botão toggle que ao clicar ele mostre os campos de filtro com icone Funnel do lucide, no filtro deve conter uma caixa de texto, ao lado uma caixa de select que contém os campos que podem ser selecionado para ser utilizado no filtro (Razão Social, Nome Fantasia, CNPJ, IE, Cidade, Estado, UF); deve ter um botão para exibir e oculta coluna inicialmente deve ser mostradado somente as colunas (ID, Razão Social, Nome Fantasia, CNPJ, Ação).
    4. Para gerar a tabela estou utilizando um componente data-table-pagination.tsx anexado (fazer sugestão de melhorias) as colunas devem ter ordenação asc(Ascending)|desc(descendente). Tabela deve conter os seguintes campos:
      | Campo | Descricao | Formato |
      | :--- | :---: | ---: |
      | id | ID | Number |
      | nom_fantasia | Nome Fantasia | String |
      | nom_razao_social | Razão Social | String |
      | num_cnpj | Razão Social | String - 99.999.999/9999-99 |
      | num_inscricao_estadual | I.E. | String |
      | nom_cidade | Cidade | String |
      | nom_estado | Estado | String |
      | sgl_estado | UF | String |
      | ind_ativo | Status | Switch |
      | created_at | Criado | String |
      | updated_ad | Editado | String |
      |  | Ação | DropdownMenu (Visualizar(DropdownMenuItem), Editar(DropdownMenuItem), separator(DropdownMenuSeparator), Deletar(DropdownMenuItem variant="destructive")) |
      * Para edição deve ter o seguinte campos
        ```HTML
          <DialogHeader>
            <DialogTitle>Empresa</DialogTitle>
            <DialogDescription>
              Preenhcas os campos corretamente para cadastrar uma nova empresa.
            </DialogDescription>
          </DialogHeader>
        ```
        | Campo | Descricao | Tipo(type)| Formato(format) |
        | :--- | :---: | :---: | ---: |
        | id | ID | Input(Disabled) |  |
        | nom_fantasia | Nome Fantasia | Input | String |
        | nom_razao_social | Razão Social | Input | String |
        | num_cnpj | Razão Social | Input | 99.999.999/9999-99 |
        | num_inscricao_estadual | I.E. | Input | String |
        | nom_razao_social | Razão Social | Input | String |
        | nom_fantasia | Nome Fantasia | Input | String |
        | dta_abertura | Data de Abertura | Date Picker | dd/MM/aaaa |
        | num_cep | CEP | Input | 99.999-999 |
        | des_logradouro | logradouro | Input | String |
        | num_endereco | Número | Input | Number |
        | des_complemento | Complemento | Input | String |
        | nom_bairro | Bairro | Input | String |
        | num_celular_1 | Celular 1 | Input | (99) 9 9999-9999 |
        | ind_whatsapp_1 | WhatsApp | Switch |  |
        | num_celular_2 | Celular 2 | Input | (99) 9 9999-9999 |
        | ind_whatsapp_2 | WhatsApp | Switch |  |
        | des_email_1 | Email | Input | contato@bood.com.br |
        | des_email_2 | Email 2 | Input | contato@bood.com.br |
        | val_cor_principal | Cor principal logo | Date Picker Color | #999999 |
        | nom_estado | Estado | Select |  |
        | nom_cidade | Cidade | Select |  |
        | ind_ativo | Status | Switch |  |
        | created_at | Criado | Input(Disabled) | dd/MM/aaaa |
        | updated_ad | Editado | Input(Disabled) | dd/MM/aaaa |
        * Logo abaixo do formulário deve trazer uma seção que contenha uma tabela que contenha os seguintes campos:
        | Campo | Descricao | Formato |
        | :--- | :---: | ---: |
        | id | ID | Number |
        | des_tipo_dia | String |  |
        | hra_inicio | String | 08:00:00 |
        | hra_fim | String | 17:00:00 |
        | qtd_minutos_intervalo | String | 00:30:00 |
        | ind_ativo | Status | Switch |
        | created_at | Criado | String |
        | updated_ad | Editado | String |
        |  | Ação | DropdownMenu (Visualizar(DropdownMenuItem), Editar(DropdownMenuItem), separator(DropdownMenuSeparator), Deletar(DropdownMenuItem variant="destructive")) |
        ```HTML
          <DialogFooter>
            <DialogClose variant="outline">Fechar</DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        ```
Segue abeixo meu campo no banco de dados da tabela de Empresa que contém os arquivos que são obrigatórios:
```SQL
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
Segue abeixo meu campo no banco de dados da tabela de Parametrizacao que contém os arquivos que são obrigatórios:
```SQL
CREATE TABLE `tab_parametrizacao` (
  id int NOT NULL AUTO_INCREMENT,
  des_tipo_dia enum('UTIL','SABADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTIL',
  hra_inicio time NOT NULL,
  hra_fim time NOT NULL,
  qtd_minutos_intervalo varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  ind_ativo tinyint(1) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  KEY idx_param_dia_ativo (des_tipo_dia,ind_ativo,deleted_at)
) ENGINE=InnoDB 
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
│   │   │   ├── Cidade
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── Estado
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
│   │   ├── parametros
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   ├── estado
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   ├── cidade
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
├── livb/
│   └── utils
│   │   ├── cepService.ts
│   │   ├── cnpjService.ts
│   │   ├── typeCEP.ts
│   │   ├── typeCNPJ.ts
│   │   └── formatters.ts
└── ...

```
Gere os seguintes arquivos columns.tsx e page.tsx da Empresa será necessário criar os arquivos utilitário para fazer busca na API's no CEP e CNPJ na qual deve ser separado a Tipos de Intefaces e Results no arquivos (typeCEP.ts e typeCNPJ.ts) e deixar buscarCnpj e buscarCep no arquivo (cepService.ts e cnpjService.ts).

Estou anexando o arquivo page.tsx e columns.tsx de cidades para ter uma referencia de como quero que fique a tabela botão de filtro e colunas.