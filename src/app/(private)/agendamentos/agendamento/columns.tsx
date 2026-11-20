// src/app/(private)/agendamentos/agendamento/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AgendamentoResumo,
    AgendamentoStatus,
} from '@/features/agendamentos/agendamento/types';
import { formatarData } from '@/lib/utils/formatters';

export const STATUS_LABEL: Record<AgendamentoStatus, string> = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    falta: 'Falta',
};

const STATUS_VARIANT: Record<
    AgendamentoStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    agendado: 'secondary',
    confirmado: 'default',
    concluido: 'outline',
    cancelado: 'destructive',
    falta: 'destructive',
};

// A API devolve ISO em UTC; o navegador converte para o fuso local.
// (formatarData() força UTC e mostraria 12:00 em vez de 09:00)
export const formatarDataHoraLocal = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).replace(',', '');

export interface AgendamentoTableMeta {
    onView?: (a: AgendamentoResumo) => void;
    onEdit?: (a: AgendamentoResumo) => void;
    onDelete?: (a: AgendamentoResumo) => void;
}

function SortableHeader({ label, column }: { label: string; column: any }) {
    return (
        <Button
            variant="ghost"
            className="p-0 h-auto font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
    );
}

export const columns: ColumnDef<AgendamentoResumo>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader label="ID" column={column} />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'dta_agendamento',
        header: ({ column }) => <SortableHeader label="Data/Hora" column={column} />,
        meta: { label: 'Data/Hora' },
        cell: ({ row }) => formatarDataHoraLocal(row.original.dta_agendamento), //formatarData(row.original.dta_agendamento),
    },
    {
        accessorKey: 'nom_paciente',
        header: ({ column }) => <SortableHeader label="Paciente" column={column} />,
        meta: { label: 'Paciente' },
    },
    {
        accessorKey: 'nom_costureira',
        header: ({ column }) => <SortableHeader label="Costureira" column={column} />,
        meta: { label: 'Costureira' },
        cell: ({ row }) => {
            const cor = row.original.val_cor_costureira;
            return (
                <div className="flex items-center gap-2">
                    <span
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: cor ? `#${cor}` : 'transparent' }}
                    />
                    {row.original.nom_costureira}
                </div>
            );
        },
    },
    {
        accessorKey: 'ind_status',
        header: ({ column }) => <SortableHeader label="Status" column={column} />,
        meta: { label: 'Status' },
        cell: ({ row }) => (
            <Badge variant={STATUS_VARIANT[row.original.ind_status]}>
                {STATUS_LABEL[row.original.ind_status]}
            </Badge>
        ),
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const agendamento = row.original;
            const meta = table.options.meta as AgendamentoTableMeta | undefined;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(agendamento)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(agendamento)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar / Itens
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => meta?.onDelete?.(agendamento)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
