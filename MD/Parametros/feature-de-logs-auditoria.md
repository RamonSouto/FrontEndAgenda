# Feature de Logs (Auditoria)

## Visão geral do fluxo

```text
page.tsx (filtros no estado)
   └─► useLogs(filtros)                      → hooks.ts
          └─► queryKey: logKeys.list(filtros) → queryKeys.ts
          └─► Logs.listar(filtros, signal)    → api.ts
                 └─► monta ?query-string
                 └─► httpClient.get(...)      → client.ts (token via cookie)
                        └─► LogListResponse   → types.ts
   └─► logs_detalhados → useReactTable → columns.tsx
```

Decisões principais:

- **Filtros vão para a API.** Usuário, ação, tabela e período são enviados como query params. O servidor filtra, então o React Query não pode filtrar em memória.
- **O `httpClient` não monta query string.** Quem monta é o `api.ts`, com `URLSearchParams`, ignorando valores vazios.
- **Os filtros fazem parte da `queryKey`.** Cada combinação de filtros tem seu próprio cache. Trocar o filtro dispara uma nova requisição, e voltar a um filtro já usado reaproveita o cache.
- **Log é somente leitura.** Não há `useMutation`, `criar`, `atualizar` nem `deletar`. Auditoria não deve ser editável pela UI.
- **Ordenação e paginação da tabela são no cliente**, como na tela de Categoria. A API retorna `logs_detalhados` em uma única lista.

---

## 1. `src/features/parametrizacao/log/types.ts`

```ts
//src/features/parametrizacao/log/types.ts

export type LogDetalhes = Record<string, unknown>;

export interface Log {
    id: number;
    id_usuario: number | null;
    des_acao: string;
    des_tabela: string;
    num_registro_id: number | null;
    des_detalhes: LogDetalhes | null;
    num_ip_address: string | null;
    des_user_agent: string | null;
    created_at: string;
    // Campos vindos do JOIN com tab_pessoas
    usuario_nome: string | null;
    usuario_administrador: number;
    usuario_costureira: number;
    usuario_secretaria: number;
    usuario_medico: number;
    usuario_paciente: number;
}

export interface LogPorUsuario {
    nome: string;
    total: number;
}

export interface LogRelatorio {
    total_logs: number;
    periodo: Record<string, unknown>;
    por_acao: Record<string, number>;
    por_usuario: LogPorUsuario[];
    por_tabela: Record<string, number>;
    logs_detalhados: Log[];
}

export interface LogListResponse {
    sucesso: boolean;
    dados: LogRelatorio;
}

// Filtros enviados como query params (já normalizados: sem strings vazias)
export interface LogFiltros {
    id_usuario?: number;
    des_acao?: string;
    des_tabela?: string;
    data_inicio?: string; // YYYY-MM-DD
    data_fim?: string;    // YYYY-MM-DD
}
```

**O que acontece:**

- `Log` espelha a tabela `tab_log` mais os campos do JOIN (`usuario_nome`, `usuario_*`). Colunas `DEFAULT NULL` viram `| null`.
- `des_detalhes` é uma coluna JSON com formato variável por ação. `Record<string, unknown>` força checagem de tipo antes de acessar qualquer chave.
- A resposta não é uma lista simples. É um **relatório**: totais agregados (`por_acao`, `por_tabela`, `por_usuario`) mais a lista em `logs_detalhados`. Por isso existe `LogRelatorio`.
- `LogFiltros` representa o que vai para a URL. Todos os campos são opcionais, e `id_usuario` é `number` porque a API espera um id.

---

## 2. `src/features/parametrizacao/log/schema.ts`

```ts
//src/features/parametrizacao/log/schema.ts
import { z } from 'zod';
import { LogFiltros } from './types';

// ---------- Schema do registro (mesmos campos da tab_log) ----------
export const logSchema = z.object({
    id: z.number().int(),
    id_usuario: z.number().int().nullable(),
    des_acao: z.string().max(100),
    des_tabela: z.string().max(50),
    num_registro_id: z.number().int().nullable(),
    des_detalhes: z.record(z.string(), z.unknown()).nullable(),
    num_ip_address: z.string().max(45).nullable(),
    des_user_agent: z.string().nullable(),
    created_at: z.string(),
});

export type LogInput = z.infer<typeof logSchema>;

// ---------- Schema do formulário de filtros ----------
// Inputs HTML sempre devolvem string, então o formulário trabalha com strings
const dataOpcional = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .or(z.literal(''));

export const logFiltroSchema = z
    .object({
        id_usuario: z.string().regex(/^\d*$/, 'Informe apenas números'),
        des_acao: z.string(),
        des_tabela: z.string(),
        data_inicio: dataOpcional,
        data_fim: dataOpcional,
    })
    .refine(
        (f) => !f.data_inicio || !f.data_fim || f.data_inicio <= f.data_fim,
        { message: 'A data inicial não pode ser maior que a final', path: ['data_fim'] }
    );

export type LogFiltroForm = z.infer<typeof logFiltroSchema>;

export const FILTRO_VAZIO: LogFiltroForm = {
    id_usuario: '',
    des_acao: '',
    des_tabela: '',
    data_inicio: '',
    data_fim: '',
};

// Converte o form (strings) em filtros da API (tipados, sem vazios)
export const paraFiltros = (f: LogFiltroForm): LogFiltros => ({
    id_usuario: f.id_usuario ? Number(f.id_usuario) : undefined,
    des_acao: f.des_acao || undefined,
    des_tabela: f.des_tabela || undefined,
    data_inicio: f.data_inicio || undefined,
    data_fim: f.data_fim || undefined,
});
```

**O que acontece:**

- `logSchema` atende ao requisito de "mesmos campos". Ele serve para validar dados do log, por exemplo em testes ou parsing defensivo da resposta, e os limites (`max(100)`, `max(50)`, `max(45)`) vêm do DDL.
- `logFiltroSchema` valida o formulário da tela. Todos os campos são `string`, porque `<input>` e `<select>` sempre devolvem texto. Vazio significa "sem filtro".
- O `refine` impede `data_inicio > data_fim` antes de chamar a API e anexa o erro ao campo `data_fim` via `path`.
- `paraFiltros` é a ponte entre UI e API. Ela converte `id_usuario` para número e transforma `''` em `undefined`. Isso mantém a `queryKey` estável, já que `{des_acao: ''}` e `{}` gerariam caches diferentes.

---

## 3. `src/features/parametrizacao/log/queryKeys.ts`

```ts
//src/features/parametrizacao/log/queryKeys.ts
import { LogFiltros } from './types';

export const logKeys = {
    all: ['logs'] as const,
    list: (filtros: LogFiltros) => ['logs', 'list', filtros] as const,
};
```

**O que acontece:**

- A chave é hierárquica: `['logs']` é o prefixo, e `['logs','list',{...filtros}]` é cada listagem.
- O React Query compara objetos dentro da key por valor e ignora a ordem das propriedades. Os mesmos filtros resultam no mesmo cache.
- `invalidateQueries({ queryKey: logKeys.all })` invalida todas as listagens de uma vez.

---

## 4. `src/features/parametrizacao/log/api.ts`

```ts
//src/features/parametrizacao/log/api.ts
import { httpClient } from '@/lib/http/client';
import { LogListResponse, LogFiltros } from './types';

const montarQuery = (filtros: LogFiltros = {}): string => {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor === undefined || valor === null || valor === '') return;
        params.append(chave, String(valor));
    });

    const query = params.toString();
    return query ? `?${query}` : '';
};

export const Logs = {
    listar: (filtros?: LogFiltros, signal?: AbortSignal) =>
        httpClient.get<LogListResponse>(
            `/api/relatorios/auditoria${montarQuery(filtros)}`,
            { signal }
        ),
};
```

**O que acontece:**

- `montarQuery` percorre os filtros, descarta os vazios e usa `URLSearchParams`, que já faz o encoding (`%20`, `&` etc.). Sem filtros, a URL fica `/api/relatorios/auditoria`. Com filtros, fica algo como `...?id_usuario=1&des_acao=login&data_inicio=2026-11-01`.
- O segundo parâmetro de `httpClient.get` é `RequestOptions extends RequestInit`, então dá para repassar o `signal`. O React Query fornece esse `signal` e cancela a requisição anterior se o filtro mudar antes de ela terminar. Assim uma resposta antiga não sobrescreve uma mais nova.
- O token `Bearer` é anexado automaticamente pelo `httpClient`, e os erros chegam como `ApiError`.

> ⚠️ **Bug no seu `Horarios.criar`:** ele usa `{ ... }` sem `return`. A função retorna `void`, então o `mutationFn` resolve na hora, antes da resposta. Erros da API viram *unhandled rejection* e o `onError` nunca dispara. O correto é `criar: (data) => httpClient.post<...>(...)`.

---

## 5. `src/features/parametrizacao/log/hooks.ts`

```ts
//src/features/parametrizacao/log/hooks.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Logs } from './api';
import { logKeys } from './queryKeys';
import { LogListResponse, LogFiltros } from './types';

export const useLogs = (filtros: LogFiltros = {}) => {
    return useQuery<LogListResponse>({
        queryKey: logKeys.list(filtros),
        queryFn: ({ signal }) => Logs.listar(filtros, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30, // 30 segundos
    });
};
```

**O que acontece:**

- Só existe `useQuery`, porque a feature é de leitura.
- `queryKey: logKeys.list(filtros)` faz o hook reagir aos filtros. Quando o objeto muda, o React Query busca de novo, sem `useEffect` nem refetch manual.
- `queryFn` recebe `{ signal }` do React Query, que é repassado ao `fetch`. É o que permite cancelar requisições obsoletas.
- `placeholderData: keepPreviousData` (v5) mantém os dados da consulta anterior na tela enquanto a nova carrega. A tabela não pisca vazia nem volta ao skeleton a cada troca de filtro. Use `isFetching` para indicar a atualização.
- `staleTime` de 30s evita refetch ao reabrir a tela ou voltar o foco da janela. Log muda com frequência, então o tempo é curto.

---

## 6. `app/(private)/Parametros/log/columns.tsx`

```tsx
// app/(private)/Parametros/log/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { Log } from '@/features/parametrizacao/log/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Eye } from 'lucide-react';
import { formatarData } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
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

const varianteAcao = (acao: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const a = acao.toLowerCase();
    if (a.includes('delet') || a.includes('exclu') || a.includes('remov')) return 'destructive';
    if (a.includes('login') || a.includes('logout')) return 'default';
    if (a.includes('listar')) return 'secondary';
    return 'outline';
};

export const logColumns: ColumnDef<Log>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Data/Hora" />,
        cell: ({ row }) => (row.original.created_at ? formatarData(row.original.created_at) : '-'),
        meta: { label: 'Data/Hora' },
    },
    {
        accessorKey: 'usuario_nome',
        header: ({ column }) => <SortableHeader column={column} label="Usuário" />,
        cell: ({ row }) => {
            const { usuario_nome, id_usuario } = row.original;
            if (!id_usuario) return '-';
            return (
                <div className="flex flex-col">
                    <span>{usuario_nome ?? 'Desconhecido'}</span>
                    <span className="text-xs text-muted-foreground">ID: {id_usuario}</span>
                </div>
            );
        },
        meta: { label: 'Usuário' },
    },
    {
        accessorKey: 'des_acao',
        header: ({ column }) => <SortableHeader column={column} label="Ação" />,
        cell: ({ row }) => <Badge variant={varianteAcao(row.original.des_acao)}>{row.original.des_acao}</Badge>,
        meta: { label: 'Ação' },
    },
    {
        accessorKey: 'des_tabela',
        header: ({ column }) => <SortableHeader column={column} label="Tabela" />,
        meta: { label: 'Tabela' },
    },
    {
        accessorKey: 'num_registro_id',
        header: 'Registro',
        cell: ({ row }) => row.original.num_registro_id ?? '-',
        meta: { label: 'Registro' },
    },
    {
        accessorKey: 'num_ip_address',
        header: 'IP',
        cell: ({ row }) => row.original.num_ip_address ?? '-',
        meta: { label: 'IP' },
    },
    {
        accessorKey: 'des_user_agent',
        header: 'Navegador / Origem',
        cell: ({ row }) => {
            const ua = row.original.des_user_agent;
            if (!ua) return '-';
            return (
                <span className="block max-w-[220px] truncate" title={ua}>
                    {ua}
                </span>
            );
        },
        meta: { label: 'Navegador / Origem' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => (
            <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label="Visualizar detalhes"
                onClick={() => table.options.meta?.onView?.(row.original)}
            >
                <Eye className="h-4 w-4" />
            </Button>
        ),
    },
];
```

**O que acontece:**

- A tabela é genérica (`ColumnDef<Log>[]`). A UI de cada célula fica aqui e a página só monta a tabela.
- `declare module` amplia o `TableMeta` para `table.options.meta.onView` ter tipo. Na tela de Categoria você já declara `onView` com o mesmo tipo, e o TypeScript aceita declarações idênticas, então não há conflito.
- `varianteAcao` mapeia a ação para a cor do `Badge`. Como `des_acao` é texto livre (`varchar`), o padrão é `outline` e o mapeamento é por substring. Ajuste conforme as ações reais.
- A coluna de usuário mostra `usuario_nome` (do JOIN) e o ID embaixo. Se `id_usuario` for `null`, o log é de sistema e mostra `-`.
- `des_user_agent` pode ser enorme, então a célula usa `truncate` e o `title` mostra o valor completo no hover.
- `des_detalhes` (JSON) fica fora da tabela e aparece no modal do botão "Visualizar".
- A coluna `acoes` tem `enableHiding: false`, como no padrão da Categoria, e fica fora do menu "Colunas".

---

## 7. `app/(private)/Parametros/log/page.tsx`

```tsx
// app/(private)/Parametros/log/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { Columns, Search } from 'lucide-react';
import { useLogs } from '@/features/parametrizacao/log/hooks';
import {
    logFiltroSchema,
    paraFiltros,
    FILTRO_VAZIO,
    LogFiltroForm,
} from '@/features/parametrizacao/log/schema';
import { Log, LogFiltros } from '@/features/parametrizacao/log/types';
import { logColumns } from './columns';
import { formatarData } from '@/lib/utils/formatters';

const TODOS = 'todos';

export default function LogPage() {
    // Rascunho do formulário (muda a cada digitação) x filtros aplicados (disparam a API)
    const [filtrosForm, setFiltrosForm] = useState<LogFiltroForm>(FILTRO_VAZIO);
    const [filtrosAplicados, setFiltrosAplicados] = useState<LogFiltros>({});
    const [errosFiltro, setErrosFiltro] = useState<Record<string, string>>({});

    // Consulta filtrada (alimenta tabela e resumo)
    const { data, isLoading, isFetching, error } = useLogs(filtrosAplicados);

    // Consulta sem filtros: usada só para popular os selects de ação/tabela.
    // Quando não há filtros aplicados, tem a mesma queryKey acima e é deduplicada.
    const { data: semFiltros } = useLogs({});

    const logs = useMemo(() => data?.dados?.logs_detalhados ?? [], [data]);
    const totalLogs = data?.dados?.total_logs ?? 0;
    const porAcao = data?.dados?.por_acao ?? {};

    const opcoesAcao = useMemo(
        () => Object.keys(semFiltros?.dados?.por_acao ?? {}).sort(),
        [semFiltros]
    );
    const opcoesTabela = useMemo(
        () => Object.keys(semFiltros?.dados?.por_tabela ?? {}).sort(),
        [semFiltros]
    );

    // Estados da tabela (ordenação e paginação são locais)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

    const [logSelecionado, setLogSelecionado] = useState<Log | null>(null);

    const table = useReactTable({
        data: logs,
        columns: logColumns,
        state: { sorting, pagination, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        manualPagination: false,
        meta: {
            onView: (log: Log) => setLogSelecionado(log),
        },
    });

    const setCampo = (campo: keyof LogFiltroForm, valor: string) =>
        setFiltrosForm((prev) => ({ ...prev, [campo]: valor }));

    const aplicarFiltros = () => {
        const resultado = logFiltroSchema.safeParse(filtrosForm);

        if (!resultado.success) {
            const erros: Record<string, string> = {};
            resultado.error.issues.forEach((issue) => {
                const campo = String(issue.path[0]);
                if (!erros[campo]) erros[campo] = issue.message;
            });
            setErrosFiltro(erros);
            return;
        }

        setErrosFiltro({});
        setFiltrosAplicados(paraFiltros(resultado.data));
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // volta para a primeira página
    };

    const limparFiltros = () => {
        setFiltrosForm(FILTRO_VAZIO);
        setErrosFiltro({});
        setFiltrosAplicados({});
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    if (error) return <div>Erro ao carregar logs.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-2xl font-bold">Logs de Auditoria</div>
                {isFetching && !isLoading && (
                    <span className="text-sm text-muted-foreground">Atualizando...</span>
                )}
            </div>

            {/* Resumo */}
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Total: {totalLogs}</Badge>
                {Object.entries(porAcao).map(([acao, total]) => (
                    <Badge key={acao} variant="secondary">
                        {acao}: {total}
                    </Badge>
                ))}
            </div>

            {/* Filtros (enviados como query params) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 border rounded-md bg-muted/20">
                <div className="space-y-1">
                    <Label>ID do usuário</Label>
                    <Input
                        inputMode="numeric"
                        placeholder="Ex: 1"
                        value={filtrosForm.id_usuario}
                        onChange={(e) => setCampo('id_usuario', e.target.value)}
                    />
                    {errosFiltro.id_usuario && (
                        <p className="text-sm text-destructive">{errosFiltro.id_usuario}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Ação</Label>
                    <Select
                        value={filtrosForm.des_acao || TODOS}
                        onValueChange={(v) => setCampo('des_acao', !v || v === TODOS ? '' : v)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todas">{filtrosForm.des_acao || 'Todas'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TODOS}>Todas</SelectItem>
                            {opcoesAcao.map((acao) => (
                                <SelectItem key={acao} value={acao}>
                                    {acao}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label>Tabela</Label>
                    <Select
                        value={filtrosForm.des_tabela || TODOS}
                        onValueChange={(v) => setCampo('des_tabela', !v || v === TODOS ? '' : v)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todas">{filtrosForm.des_tabela || 'Todas'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TODOS}>Todas</SelectItem>
                            {opcoesTabela.map((tabela) => (
                                <SelectItem key={tabela} value={tabela}>
                                    {tabela}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label>Data início</Label>
                    <Input
                        type="date"
                        value={filtrosForm.data_inicio}
                        onChange={(e) => setCampo('data_inicio', e.target.value)}
                    />
                    {errosFiltro.data_inicio && (
                        <p className="text-sm text-destructive">{errosFiltro.data_inicio}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Data fim</Label>
                    <Input
                        type="date"
                        value={filtrosForm.data_fim}
                        onChange={(e) => setCampo('data_fim', e.target.value)}
                    />
                    {errosFiltro.data_fim && (
                        <p className="text-sm text-destructive">{errosFiltro.data_fim}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-5 justify-end">
                    <Button variant="ghost" size="sm" onClick={limparFiltros}>
                        Limpar
                    </Button>
                    <Button size="sm" className="gap-1" onClick={aplicarFiltros}>
                        <Search className="h-4 w-4" />
                        Filtrar
                    </Button>
                </div>
            </div>

            <div className="flex justify-end">
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

            <Card className="min-w-0 overflow-auto rounded-lg shadow-lg py-0 max-h-[75vh]">
                <CardContent className="p-0">
                    <div className="relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary max-h-[calc(75vh-100px)]">
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
                                    <TableSkeleton columnsCount={logColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={logColumns.length} className="text-center py-4">
                                            Nenhum log encontrado.
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

            {/* Dialog de visualização */}
            <Dialog
                open={!!logSelecionado}
                onOpenChange={(open) => {
                    if (!open) setLogSelecionado(null);
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Log #{logSelecionado?.id}</DialogTitle>
                        <DialogDescription>Detalhes do registro de auditoria.</DialogDescription>
                    </DialogHeader>
                    {logSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Usuário</Label>
                                    <Input
                                        value={
                                            logSelecionado.id_usuario
                                                ? `${logSelecionado.usuario_nome ?? 'Desconhecido'} (ID ${logSelecionado.id_usuario})`
                                                : '-'
                                        }
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Data/Hora</Label>
                                    <Input value={formatarData(logSelecionado.created_at)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Ação</Label>
                                    <Input value={logSelecionado.des_acao} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Tabela</Label>
                                    <Input value={logSelecionado.des_tabela} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>ID do registro</Label>
                                    <Input value={logSelecionado.num_registro_id ?? '-'} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>IP</Label>
                                    <Input value={logSelecionado.num_ip_address ?? '-'} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>User Agent</Label>
                                <Input value={logSelecionado.des_user_agent ?? '-'} disabled />
                            </div>
                            <div className="space-y-1">
                                <Label>Detalhes (JSON)</Label>
                                <pre className="max-h-64 overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
                                    {logSelecionado.des_detalhes
                                        ? JSON.stringify(logSelecionado.des_detalhes, null, 2)
                                        : '-'}
                                </pre>
                            </div>
                            <DialogFooter>
                                <DialogClose variant="outline">Fechar</DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
```

**O que acontece, passo a passo:**

1. **Dois estados de filtro.** `filtrosForm` é o rascunho, atualizado a cada tecla. `filtrosAplicados` é o que vai para o `useLogs`. Sem essa separação, cada digitação dispararia uma requisição.
2. **`aplicarFiltros`.**
   - Valida o rascunho com `logFiltroSchema.safeParse`. Se falhar, mapeia `issues` para `errosFiltro` e exibe a mensagem sob o campo.
   - Se passar, `paraFiltros` converte para o formato da API e atualiza `filtrosAplicados`. Essa mudança altera a `queryKey` e dispara a requisição.
   - Volta o `pageIndex` para 0. Sem isso, você poderia ficar na página 5 de um resultado que agora só tem 1 página.
3. **Duas chamadas a `useLogs`.** A primeira usa os filtros aplicados. A segunda usa `{}` e serve só para popular os selects de ação e tabela com as chaves de `por_acao` e `por_tabela`. Sem ela, as opções encolheriam após filtrar. Com `filtrosAplicados = {}` as duas têm a mesma chave e viram uma única requisição.
4. **`useMemo`.** `logs` e as opções só são recalculados quando `data` muda. Isso evita nova referência de array a cada render, que faria o TanStack Table recalcular tudo.
5. **Tabela.** É o mesmo padrão da Categoria: `useReactTable` com ordenação e paginação no cliente. Não há `getFilteredRowModel`, porque o filtro é no servidor. O `meta.onView` guarda o log selecionado.
6. **Estados de UI.**
   - `isLoading` (primeira carga) mostra o skeleton.
   - `isFetching && !isLoading` (troca de filtro com `keepPreviousData`) mostra "Atualizando..." sem esvaziar a tabela.
   - A lista vazia mostra "Nenhum log encontrado.".
7. **Dialog de detalhes.** `des_detalhes` é renderizado com `JSON.stringify(..., null, 2)` em um `<pre>` com scroll. O dialog abre quando `logSelecionado` não é `null`.

---

## Pontos de atenção

- **Formato da data:** assumi que a API aceita `data_inicio` e `data_fim` como `YYYY-MM-DD`, que é o valor de `<input type="date">`. Se ela esperar outro formato ou incluir o dia final até 23:59:59, ajuste em `paraFiltros`.
- **Volume:** a resposta de exemplo traz 100 logs em `logs_detalhados` e `total_logs: 100`. Se a API limitar a quantidade, a paginação deste front só enxerga o que veio. Para auditoria em volume real, peça `page`/`limit` no backend e use `manualPagination: true`, com `page` e `limit` entrando em `LogFiltros` e na `queryKey`.
- **Fuso horário:** o `formatarData` existente força `timeZone: 'UTC'`. Se o servidor devolve `created_at` em UTC (`Z`), os horários aparecerão em UTC, 3h à frente de Brasília. Se o `datetime` do MySQL guarda hora local e o `Z` está só no serializador, está correto. Vale conferir com um log recente.
- **Filtro por usuário:** `por_usuario` não traz o `id`, só `nome` e `total`, então não dá para montar um select de usuários a partir dele. Por isso o filtro é um input numérico. Se houver um endpoint de pessoas, troque por um select com nomes.
- **Rota:** a pasta do seu print é `Parametros` (maiúscula). Em Next.js a URL diferencia maiúsculas e minúsculas, então confirme que `/Parametros/log` é o que o menu aponta.