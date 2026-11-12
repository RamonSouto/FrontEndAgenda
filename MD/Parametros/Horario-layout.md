Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Preciso implementar uma feature dos layout de Horario em um projeto Next.js V16.2.10 com React Query e um cliente HTTP customizado no layout estou utilizado Shadcn V4.16.0, para icones estou utilizando lucide-react V1.24.0. Estou trabalhando nos tamanhos de tela Mobile First, MD - medium e LG - larguer.Os requisitos são:
* **Empresas**:
  * Listar Horario
    1. Na tela de listagem de horario deve conter um titulo "Horario de Funcionamento" dentro de uma div com as seguintes classes "text-2xl font-bold"  
    2. Deve conter um botão para inserir uma nova empresa.
      * Abrir um modal (Dialog) para inserir um nova empresas os campos deve ser os campos abaixo:
      ```HTML
        <DialogHeader>
          <DialogTitle>Horario</DialogTitle>
          <DialogDescription>
            Preenhcas os campos corretamente para cadastrar um novo horario.
          </DialogDescription>
        </DialogHeader>
      ```
      | Campo | Descricao | Tipo(type)| Formato(format) |
      | :--- | :---: | :---: | ---: |
      | des_tipo_dia | Dia | Select | Enum |
      | hra_inicio | Horario Inicial | Input | hh:mm |
      | hra_fim | Horario Final | Input | hh:mm |
      | qtd_minutos_intervalo | Tempo de Intervalo | Input | hh:mm |
      | ind_ativo | Status | Switch |  |
      | created_at | Criado | Input(Disabled) | dd/MM/aaaa |
      | updated_ad | Editado | Input(Disabled) | dd/MM/aaaa |
      ```HTML
        <DialogFooter>
          <DialogClose variant="outline">Fechar</DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      ```
    3. Para gerar a tabela estou utilizando um componente data-table-pagination.tsx anexado (fazer sugestão de melhorias) as colunas devem ter ordenação asc(Ascending)|desc(descendente). Tabela deve conter os seguintes campos:
      | Campo | Descricao | Tipo(type)| Formato(format) |
      | :--- | :---: | :---: | ---: |
      | des_tipo_dia | Dia | Select | Enum |
      | hra_inicio | Horario Inicial | Input | hh:mm |
      | hra_fim | Horario Final | Input | hh:mm |
      | qtd_minutos_intervalo | Tempo de Intervalo | Input | hh:mm |
      | ind_ativo | Status | Switch |  |
      | created_at | Criado | Input(Disabled) | dd/MM/aaaa |
      | updated_ad | Editado | Input(Disabled) | dd/MM/aaaa |
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
        | des_tipo_dia | Dia | Select | Enum |
        | hra_inicio | Horario Inicial | Input | hh:mm |
        | hra_fim | Horario Final | Input | hh:mm |
        | qtd_minutos_intervalo | Tempo de Intervalo | Input | hh:mm |
        | ind_ativo | Status | Switch |  |
        | created_at | Criado | Input(Disabled) | dd/MM/aaaa |
        | updated_ad | Editado | Input(Disabled) | dd/MM/aaaa |
Segue abeixo meu campo no banco de dados da tabela de Empresa que contém os arquivos que são obrigatórios:
```SQL
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
│   │   │   ├── Horario
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
├── livb/
│   └── utils
│   │   ├── cepService.ts
│   │   ├── cnpjService.ts
│   │   ├── typeCEP.ts
│   │   ├── typeCNPJ.ts
│   │   └── formatters.ts
└── ...

```
Gere os seguintes arquivos columns.tsx e page.tsx de Horarios.

Estou anexando o arquivo page.tsx e columns.tsx de cidades para ter uma referencia de como quero que fique a tabela botão de filtro e colunas.