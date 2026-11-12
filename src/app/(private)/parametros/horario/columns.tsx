// app/(private)/parametros/horario/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Horario } from '@/features/parametrizacao/horario/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarDataBR, minutosParaHHMM } from '@/lib/utils/formatters';
import type { Column } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
    }
}

const rotuloTipoDia: Record<Horario['des_tipo_dia'], string> = {
    UTIL: 'Dia Útil',
    SABADO: 'Sábado',
};

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export const horarioColumns: ColumnDef<Horario>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'des_tipo_dia',
        header: ({ column }) => <SortableHeader column={column} label="Dia" />,
        cell: ({ row }) => rotuloTipoDia[row.original.des_tipo_dia] ?? row.original.des_tipo_dia,
        meta: { label: 'Dia' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'hra_inicio',
        header: ({ column }) => <SortableHeader column={column} label="Horário Inicial" />,
        cell: ({ row }) => row.original.hra_inicio?.slice(0, 5),
        meta: { label: 'Horário Inicial' },
    },
    {
        accessorKey: 'hra_fim',
        header: ({ column }) => <SortableHeader column={column} label="Horário Final" />,
        cell: ({ row }) => row.original.hra_fim?.slice(0, 5),
        meta: { label: 'Horário Final' },
    },
    {
        accessorKey: 'qtd_minutos_intervalo',
        header: ({ column }) => <SortableHeader column={column} label="Intervalo" />,
        cell: ({ row }) => minutosParaHHMM(row.original.qtd_minutos_intervalo),
        meta: { label: 'Intervalo' },
    },
    {
        accessorKey: 'ind_ativo',
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) => (
            <Badge variant={row.original.ind_ativo ? 'default' : 'destructive'}>
                {row.original.ind_ativo ? 'Ativo' : 'Inativo'}
            </Badge>
        ),
        meta: { label: 'Status' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Criado" />,
        cell: ({ row }) => formatarDataBR(row.original.created_at),
        meta: { label: 'Criado' },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader column={column} label="Editado" />,
        cell: ({ row }) => formatarDataBR(row.original.updated_at),
        meta: { label: 'Editado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const horario = row.original;
            const meta = table.options.meta;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(horario)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(horario)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(horario)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
