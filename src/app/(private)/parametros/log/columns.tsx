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
