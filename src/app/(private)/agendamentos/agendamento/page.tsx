// src/app/(private)/agendamentos/agendamento/page.tsx
'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    PaginationState,
} from '@tanstack/react-table';
import { Plus, CalendarDays, List } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/data-table-pagination';

import { columns, STATUS_LABEL, formatarDataHoraLocal, AgendamentoTableMeta } from './columns';
import { AgendamentoForm } from './agendamento-form';
import type { CostureiraRecurso } from './agenda-scheduler';

import {
    useAgendamentos,
    useAgendamento,
    useCriarAgendamento,
    useAtualizarAgendamento,
    useDeletarAgendamento,
} from '@/features/agendamentos/agendamento/hooks';
import {
    AgendamentoInput,
    agendamentoUpdateSchema,
} from '@/features/agendamentos/agendamento/schema';
import {
    AgendamentoResumo,
    AgendamentoStatus,
} from '@/features/agendamentos/agendamento/types';
import { usePessoasPorPapel } from '@/features/pessoas/hooks';
import { ApiError } from '@/lib/http/errors';

// Syncfusion só no cliente: ssr:false evita acesso a window/document no servidor
const AgendaScheduler = dynamic(
    () => import('./agenda-scheduler').then((m) => m.AgendaScheduler),
    {
        ssr: false,
        loading: () => (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
                Carregando agenda...
            </div>
        ),
    }
);

const LIMITE_AGENDA = 100; // a API só filtra por página/status/costureira, então buscamos "tudo"

const DEFAULT_FORM: AgendamentoInput = {
    id_paciente: 0,
    id_costureira: 0,
    id_secretaria: null,
    dta_agendamento: '',
    des_observacoes_geral: '',
    des_observacoes_costureira: '',
};

// API espera "YYYY-MM-DD HH:mm:ss" em horário local (mover para lib/utils/formatters.ts se preferir)
function paraDataHoraAPI(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
}

export default function AgendamentoPage() {
    const router = useRouter();

    // ---- estado de UI ----
    const [visao, setVisao] = useState<'agenda' | 'lista'>('agenda');
    const [statusFiltro, setStatusFiltro] = useState('todos');
    const [costureiraFiltro, setCostureiraFiltro] = useState('todas');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [erro, setErro] = useState<string | null>(null);

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [formInicial, setFormInicial] = useState<AgendamentoInput>(DEFAULT_FORM);
    const [idVisualizar, setIdVisualizar] = useState<number | null>(null);
    const [paraDeletar, setParaDeletar] = useState<AgendamentoResumo | null>(null);

    // ---- dados ----
    // Uma única query: parâmetros mudam conforme a visão (agenda = tudo, lista = paginado)
    const { data, isLoading } = useAgendamentos(
        visao === 'agenda'
            ? { limite: LIMITE_AGENDA }
            : {
                pagina: pagination.pageIndex + 1,
                limite: pagination.pageSize,
                ind_status:
                    statusFiltro === 'todos' ? undefined : (statusFiltro as AgendamentoStatus),
                id_costureira: costureiraFiltro === 'todas' ? undefined : Number(costureiraFiltro),
            }
    );
    const agendamentos = useMemo(() => (Array.isArray(data?.dados) ? data.dados : []), [data]);
    const total = data?.total ?? 0;

    const { data: costureirasRaw } = usePessoasPorPapel('costureira');
    const { data: pacientesRaw } = usePessoasPorPapel('paciente');
    const { data: detalhe } = useAgendamento(idVisualizar ?? 0);

    const costureiras = useMemo(
        () =>
            (Array.isArray(costureirasRaw?.dados) ? costureirasRaw.dados : []).filter(
                (p) => p.deleted_at === null && p.ind_status === 'ativo'
            ),
        [costureirasRaw]
    );
    const pacientes = useMemo(
        () =>
            (Array.isArray(pacientesRaw?.dados) ? pacientesRaw.dados : []).filter(
                (p) => p.deleted_at === null && p.ind_status === 'ativo'
            ),
        [pacientesRaw]
    );
    const recursos: CostureiraRecurso[] = useMemo(
        () =>
            costureiras.map((c) => ({
                id: c.id,
                nome: c.nom_completo,
                cor: `#${c.val_cor_hex ?? '999999'}`,
            })),
        [costureiras]
    );

    // ---- mutations ----
    const criarMutation = useCriarAgendamento();
    const atualizarMutation = useAtualizarAgendamento();
    const deletarMutation = useDeletarAgendamento();

    // ---- handlers ----
    function abrirNovo(inicio?: Date, idCostureira?: number) {
        setFormInicial({
            ...DEFAULT_FORM,
            dta_agendamento: inicio ? paraDataHoraAPI(inicio) : '',
            id_costureira: idCostureira ?? 0,
        });
        setDialogCriarAberto(true);
    }

    function handleCriar(values: AgendamentoInput) {
        criarMutation.mutate(values, {
            onSuccess: (response) => {
                setDialogCriarAberto(false);
                // Vai para a tela de detalhe, onde ficam os itens e as fotos
                router.push(`/agendamentos/agendamento/${response.dados.id}`);
            },
        });
    }

    function handleMover(id: number, inicio: Date, idCostureira: number) {
        const parsed = agendamentoUpdateSchema.safeParse({
            dta_agendamento: paraDataHoraAPI(inicio),
            id_costureira: idCostureira,
        });
        if (!parsed.success) {
            setErro(parsed.error.issues[0].message);
            return;
        }
        setErro(null);
        atualizarMutation.mutate(
            { id, data: parsed.data },
            {
                onError: (e) =>
                    setErro(
                        e instanceof ApiError ? e.message : 'Não foi possível mover o agendamento'
                    ),
            }
        );
    }

    function handleConfirmarDelete() {
        if (!paraDeletar) return;
        deletarMutation.mutate(paraDeletar.id, { onSuccess: () => setParaDeletar(null) });
    }

    // ---- tabela (paginação no servidor) ----
    const table = useReactTable({
        data: agendamentos,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: total,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // ordena só a página atual
        meta: {
            onView: (a) => setIdVisualizar(a.id),
            onEdit: (a) => router.push(`/agendamentos/agendamento/${a.id}`),
            onDelete: (a) => setParaDeletar(a),
        } satisfies AgendamentoTableMeta,
    });

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Agendamentos</div>

            <div className="flex justify-between flex-wrap items-center gap-4">
                <Button size="sm" className="gap-1" onClick={() => abrirNovo()}>
                    <Plus className="h-4 w-4" />
                    Novo Agendamento
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant={visao === 'agenda' ? 'default' : 'outline'}
                        size="sm"
                        className="gap-1"
                        onClick={() => setVisao('agenda')}
                    >
                        <CalendarDays className="h-4 w-4" /> Agenda
                    </Button>
                    <Button
                        variant={visao === 'lista' ? 'default' : 'outline'}
                        size="sm"
                        className="gap-1"
                        onClick={() => setVisao('lista')}
                    >
                        <List className="h-4 w-4" /> Lista
                    </Button>
                </div>
            </div>

            {erro && (
                <div className="flex items-center justify-between rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {erro}
                    <Button variant="ghost" size="sm" onClick={() => setErro(null)}>
                        Fechar
                    </Button>
                </div>
            )}

            {visao === 'agenda' ? (
                <Card className="rounded-lg shadow-lg py-0">
                    <CardContent className="p-2">
                        <AgendaScheduler
                            agendamentos={agendamentos}
                            costureiras={recursos}
                            onNovo={abrirNovo}
                            onSelecionar={setIdVisualizar}
                            onMover={handleMover}
                        />
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/20">
                        <div className="min-w-[180px]">
                            <Select
                                value={statusFiltro}
                                onValueChange={(v) => {
                                    setStatusFiltro(v ?? 'todos');
                                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    {statusFiltro === 'todos'
                                        ? 'Todos os status'
                                        : STATUS_LABEL[statusFiltro as AgendamentoStatus]}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os status</SelectItem>
                                    {Object.entries(STATUS_LABEL).map(([valor, label]) => (
                                        <SelectItem key={valor} value={valor}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="min-w-[200px]">
                            <Select
                                value={costureiraFiltro}
                                onValueChange={(v) => {
                                    setCostureiraFiltro(v ?? 'todas');
                                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    {costureiraFiltro === 'todas'
                                        ? 'Todas as costureiras'
                                        : recursos.find((r) => String(r.id) === costureiraFiltro)?.nome}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas as costureiras</SelectItem>
                                    {recursos.map((r) => (
                                        <SelectItem key={r.id} value={String(r.id)}>
                                            {r.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="min-w-0 overflow-auto rounded-lg shadow-lg py-0 max-h-[70vh]">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((hg) => (
                                        <TableRow key={hg.id}>
                                            {hg.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                Carregando...
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} className="hover:bg-muted/50">
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                Nenhum agendamento encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <DataTablePagination table={table} />
                        </CardContent>
                    </Card>
                </>
            )}

            {/* -------- Dialog: Criar -------- */}
            <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Agendamento</DialogTitle>
                        <DialogDescription>
                            Informe paciente, costureira e horário. Os itens são adicionados em seguida.
                        </DialogDescription>
                    </DialogHeader>
                    <AgendamentoForm
                        defaultValues={formInicial}
                        onSubmit={handleCriar}
                        submitting={criarMutation.isPending}
                        opcoesPacientes={pacientes}
                        opcoesCostureiras={costureiras}
                    />
                </DialogContent>
            </Dialog>

            {/* -------- Dialog: Visualizar -------- */}
            <Dialog
                open={idVisualizar !== null}
                onOpenChange={(open) => !open && setIdVisualizar(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes do Agendamento</DialogTitle>
                        <DialogDescription>Informações completas do agendamento.</DialogDescription>
                    </DialogHeader>

                    {detalhe?.dados ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Paciente</p>
                                    <p className="font-medium">{detalhe.dados.nom_paciente}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Celular</p>
                                    <p className="font-medium">{detalhe.dados.num_celular_paciente ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Costureira</p>
                                    <p className="font-medium">{detalhe.dados.nom_costureira}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Data/Hora</p>
                                    <p className="font-medium">
                                        {formatarDataHoraLocal(detalhe.dados.dta_agendamento)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <Badge variant="secondary">{STATUS_LABEL[detalhe.dados.ind_status]}</Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Itens</p>
                                    <p className="font-medium">{detalhe.dados.itens?.length ?? 0}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Observações gerais</p>
                                    <p className="font-medium">{detalhe.dados.des_observacoes_geral ?? '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Observações da costureira</p>
                                    <p className="font-medium">
                                        {detalhe.dados.des_observacoes_costureira ?? '-'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => router.push(`/agendamentos/agendamento/${detalhe.dados.id}`)}
                            >
                                Editar / Itens e fotos
                            </Button>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                    )}
                </DialogContent>
            </Dialog>

            {/* -------- AlertDialog: Deletar -------- */}
            <AlertDialog
                open={!!paraDeletar}
                onOpenChange={(open) => !open && setParaDeletar(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar o agendamento de{' '}
                            <strong>{paraDeletar?.nom_paciente}</strong> em{' '}
                            {paraDeletar && formatarDataHoraLocal(paraDeletar.dta_agendamento)}? Essa ação
                            não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmarDelete}
                            disabled={deletarMutation.isPending}
                        >
                            {deletarMutation.isPending ? 'Deletando...' : 'Deletar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
