// app/(private)/produtos/cor-estampa/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { CorEstampa } from '@/features/produtos/cor-estampa/types';
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
import { formatarData } from '@/lib/utils/formatters';

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        onView?: (data: TData) => void;
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
    }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export const corEstampaColumns: ColumnDef<CorEstampa>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'nom_cor_estampa',
        header: ({ column }) => <SortableHeader column={column} label="Nome" />,
        meta: { label: 'Nome' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'ind_tipo',
        header: ({ column }) => <SortableHeader column={column} label="Tipo" />,
        cell: ({ row }) => (
            <Badge variant={row.original.ind_tipo === 'cor' ? 'default' : 'secondary'}>
                {row.original.ind_tipo === 'cor' ? 'Cor' : 'Estampa'}
            </Badge>
        ),
        meta: { label: 'Tipo' },
    },
    {
        accessorKey: 'val_codigo_hex',
        header: 'Cor',
        cell: ({ row }) => {
            const hex = row.original.val_codigo_hex;
            if (!hex) return '-';
            return (
                <div className="flex items-center gap-2">
                    <span
                        className="inline-block h-4 w-4 rounded-full border"
                        style={{ backgroundColor: hex }}
                    />
                    <span>{hex}</span>
                </div>
            );
        },
        meta: { label: 'Cor' },
    },
    {
        accessorKey: 'des_imagem_url',
        header: 'Imagem',
        cell: ({ row }) => {
            const url = row.original.des_imagem_url;
            if (!url) return '-';
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${url}`} alt="Estampa" className="h-8 w-8 rounded object-cover border" />
            );
        },
        meta: { label: 'Imagem' },
    },
    {
        accessorKey: 'num_ordem_exibicao',
        header: ({ column }) => <SortableHeader column={column} label="Ordem" />,
        meta: { label: 'Ordem' },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <SortableHeader column={column} label="Criado" />,
        cell: ({ row }) => (row.original.created_at ? formatarData(row.original.created_at) : '-'),
        meta: { label: 'Criado' },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => <SortableHeader column={column} label="Editado" />,
        cell: ({ row }) => (row.original.updated_at ? formatarData(row.original.updated_at) : '-'),
        meta: { label: 'Editado' },
    },
    {
        id: 'acoes',
        header: 'Ação',
        enableHiding: false,
        enableSorting: false,
        cell: ({ row, table }) => {
            const registro = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(registro)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(registro)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(registro)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
