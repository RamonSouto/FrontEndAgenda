// src/app/(private)/parametros/outbox/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    PaginationState,
} from '@tanstack/react-table';
import { RefreshCw, RotateCw, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { useEmailOutbox, useReprocessarEmail } from '@/features/parametrizacao/outboxemail/hooks';
import {
    EmailOutboxListParams,
    EmailOutboxResumo,
    EmailStatus,
} from '@/features/parametrizacao/outboxemail/types';
import { ApiError } from '@/lib/http/errors';
import { formatarData } from '@/lib/utils/formatters';
import {
    COLUNAS_SOMENTE_LG,
    StatusBadge,
    formatarEvento,
    outboxColumns,
    podeReprocessar,
} from './columns';

const TODOS = 'todos';

const STATUS_OPCOES: { value: string; label: string }[] = [
    { value: TODOS, label: 'Todos os status' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'processando', label: 'Processando' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'falha', label: 'Falha' },
];

function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Input value={typeof value === 'string' || typeof value === 'number' ? value : ''} disabled />
        </div>
    );
}

// Mobile: card por e-mail
function EmailCard({
    email,
    onView,
    onReprocessar,
}: {
    email: EmailOutboxResumo;
    onView: (e: EmailOutboxResumo) => void;
    onReprocessar: (e: EmailOutboxResumo) => void;
}) {
    return (
        <Card className="py-0">
            <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate font-medium">{email.des_assunto}</p>
                        <p className="truncate text-sm text-muted-foreground">{email.des_destinatario}</p>
                    </div>
                    <StatusBadge status={email.ind_status} />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>#{email.id}</span>
                    <span>{formatarEvento(email.ind_evento)}</span>
                    <span>Tentativas: {email.num_tentativas}</span>
                    <span>Agend.: {email.id_agendamento ?? '-'}</span>
                    <span className="col-span-2">
                        {email.dta_envio
                            ? `Enviado em ${formatarData(email.dta_envio)}`
                            : `Criado em ${formatarData(email.created_at)}`}
                    </span>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => onView(email)}>
                        <Eye className="h-4 w-4" /> Ver
                    </Button>
                    {podeReprocessar(email.ind_status) && (
                        <Button size="sm" className="gap-1" onClick={() => onReprocessar(email)}>
                            <RotateCw className="h-4 w-4" /> Reprocessar
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function OutboxEmailPage() {
    // Filtros e paginação (server-side)
    const [statusFiltro, setStatusFiltro] = useState<string>(TODOS);
    const [agendamentoInput, setAgendamentoInput] = useState('');
    const agendamentoDebounced = useDebounce(agendamentoInput);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    // Diálogos
    const [emailSelecionado, setEmailSelecionado] = useState<EmailOutboxResumo | null>(null);
    const [emailParaReprocessar, setEmailParaReprocessar] = useState<EmailOutboxResumo | null>(null);

    const params = useMemo<EmailOutboxListParams>(() => {
        const idAgendamento = Number(agendamentoDebounced);
        return {
            ind_status: statusFiltro === TODOS ? undefined : (statusFiltro as EmailStatus),
            id_agendamento: Number.isInteger(idAgendamento) && idAgendamento > 0 ? idAgendamento : undefined,
            pagina: pagination.pageIndex + 1,
            limite: pagination.pageSize,
        };
    }, [statusFiltro, agendamentoDebounced, pagination]);

    const { data, isLoading, isFetching, error, refetch } = useEmailOutbox(params);
    const reprocessarMutation = useReprocessarEmail();

    const emails = useMemo(() => (Array.isArray(data?.dados) ? data.dados : []), [data]);
    const total = data?.total ?? 0;

    const table = useReactTable({
        data: emails,
        columns: outboxColumns,
        state: { pagination },
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(row.id),
        manualPagination: true,
        rowCount: total,
        onPaginationChange: setPagination,
        meta: {
            onView: (email: EmailOutboxResumo) => setEmailSelecionado(email),
            onReprocessar: (email: EmailOutboxResumo) => setEmailParaReprocessar(email),
        },
    });

    const voltarPrimeiraPagina = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

    const limparFiltros = () => {
        setStatusFiltro(TODOS);
        setAgendamentoInput('');
        voltarPrimeiraPagina();
    };

    const confirmarReprocessar = () => {
        if (!emailParaReprocessar) return;
        reprocessarMutation.mutate(emailParaReprocessar.id, {
            onSuccess: (res) => {
                setEmailParaReprocessar(null);
                toast.success(res?.mensagem ?? 'Mensagem recolocada na fila');
            },
            onError: (err) => {
                setEmailParaReprocessar(null);
                toast.error(
                    err instanceof ApiError ? err.message : 'Erro inesperado ao reprocessar o e-mail.'
                );
            },
        });
    };

    if (error) {
        return (
            <div className="p-4 md:p-6 space-y-3">
                <p>{error instanceof ApiError ? error.message : 'Erro ao carregar e-mails.'}</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Tentar novamente
                </Button>
            </div>
        );
    }

    const labelStatus = STATUS_OPCOES.find((o) => o.value === statusFiltro)?.label;
    const classeColuna = (id: string) => (COLUNAS_SOMENTE_LG.includes(id) ? 'hidden lg:table-cell' : '');

    return (
        <div className="p-4 md:p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl md:text-2xl font-bold">Fila de E-mails</h1>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Atualizar</span>
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col gap-2 rounded-md border bg-muted/20 p-3 sm:flex-row sm:items-end md:p-4">
                <div className="w-full sm:w-56 space-y-1">
                    <Label>Status</Label>
                    <Select
                        value={statusFiltro}
                        onValueChange={(v) => {
                            setStatusFiltro(v as string);
                            voltarPrimeiraPagina();
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status">{labelStatus}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPCOES.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full sm:w-56 space-y-1">
                    <Label>ID do agendamento</Label>
                    <Input
                        inputMode="numeric"
                        placeholder="Ex: 42"
                        value={agendamentoInput}
                        onChange={(e) => {
                            setAgendamentoInput(e.target.value.replace(/\D/g, ''));
                            voltarPrimeiraPagina();
                        }}
                    />
                </div>

                <Button variant="ghost" size="sm" onClick={limparFiltros}>
                    Limpar
                </Button>
            </div>

            {/* Mobile: cards */}
            <div className="space-y-3 md:hidden">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
                    ))
                ) : emails.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">Nenhum e-mail encontrado.</p>
                ) : (
                    emails.map((email) => (
                        <EmailCard
                            key={email.id}
                            email={email}
                            onView={setEmailSelecionado}
                            onReprocessar={setEmailParaReprocessar}
                        />
                    ))
                )}
            </div>

            {/* MD+: tabela */}
            <Card className="hidden md:block min-w-0 overflow-hidden rounded-lg shadow-lg py-0">
                <CardContent className="p-0">
                    <div className="relative max-h-[65vh] w-full min-w-0 overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <TableHead key={header.id} className={classeColuna(header.column.id)}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton columnsCount={outboxColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={outboxColumns.length} className="py-4 text-center">
                                            Nenhum e-mail encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className={classeColuna(cell.column.id)}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <DataTablePagination table={table} />

            {/* Detalhes */}
            <Dialog open={!!emailSelecionado} onOpenChange={(open) => !open && setEmailSelecionado(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>E-mail #{emailSelecionado?.id}</DialogTitle>
                        <DialogDescription>Detalhes do envio.</DialogDescription>
                    </DialogHeader>
                    {emailSelecionado && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Campo label="Destinatário" value={emailSelecionado.des_destinatario} />
                                <Campo label="Evento" value={formatarEvento(emailSelecionado.ind_evento)} />
                            </div>
                            <Campo label="Assunto" value={emailSelecionado.des_assunto} />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <div>
                                        <StatusBadge status={emailSelecionado.ind_status} />
                                    </div>
                                </div>
                                <Campo label="Tentativas" value={emailSelecionado.num_tentativas} />
                                <Campo label="Agendamento" value={emailSelecionado.id_agendamento ?? '-'} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Campo label="Criado" value={formatarData(emailSelecionado.created_at)} />
                                <Campo
                                    label="Próxima tentativa"
                                    value={formatarData(emailSelecionado.dta_proxima_tentativa)}
                                />
                                <Campo
                                    label="Enviado em"
                                    value={emailSelecionado.dta_envio ? formatarData(emailSelecionado.dta_envio) : '-'}
                                />
                            </div>
                            {emailSelecionado.des_ultimo_erro && (
                                <div className="space-y-1">
                                    <Label>Último erro</Label>
                                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                        {emailSelecionado.des_ultimo_erro}
                                    </pre>
                                </div>
                            )}
                            <DialogFooter>
                                {podeReprocessar(emailSelecionado.ind_status) && (
                                    <Button
                                        className="gap-1"
                                        onClick={() => {
                                            setEmailParaReprocessar(emailSelecionado);
                                            setEmailSelecionado(null);
                                        }}
                                    >
                                        <RotateCw className="h-4 w-4" /> Reprocessar
                                    </Button>
                                )}
                                <DialogClose variant="outline">Fechar</DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmação de reprocessamento */}
            <AlertDialog
                open={!!emailParaReprocessar}
                onOpenChange={(open) => !open && setEmailParaReprocessar(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reprocessar e-mail</AlertDialogTitle>
                        <AlertDialogDescription>
                            O e-mail #{emailParaReprocessar?.id} para {emailParaReprocessar?.des_destinatario} será
                            recolocado na fila de envio.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarReprocessar} disabled={reprocessarMutation.isPending}>
                            Reprocessar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
