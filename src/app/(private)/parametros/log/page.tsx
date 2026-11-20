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

export default function LogPage() {
    // Rascunho do formulário (muda a cada digitação) x filtros aplicados (disparam a API)
    const [filtrosForm, setFiltrosForm] = useState<LogFiltroForm>(FILTRO_VAZIO);
    const [filtrosAplicados, setFiltrosAplicados] = useState<LogFiltros>({});
    const [errosFiltro, setErrosFiltro] = useState<Record<string, string>>({});

    // Consulta filtrada (alimenta tabela e resumo)
    const { data, isLoading, isFetching, error } = useLogs(filtrosAplicados);

    const logs = useMemo(() => data?.dados?.logs_detalhados ?? [], [data]);
    const totalLogs = data?.dados?.total_logs ?? 0;
    const porAcao = data?.dados?.por_acao ?? {};

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
                    <Input
                        placeholder="Ex: login"
                        maxLength={100}
                        value={filtrosForm.des_acao}
                        onChange={(e) => setCampo('des_acao', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                    />
                </div>

                <div className="space-y-1">
                    <Label>Tabela</Label>
                    <Input
                        placeholder="Ex: tab_pessoas"
                        maxLength={50}
                        value={filtrosForm.des_tabela}
                        onChange={(e) => setCampo('des_tabela', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                    />
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
