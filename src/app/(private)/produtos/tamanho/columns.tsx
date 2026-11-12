// app/(private)/produtos/tamanho/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { Tamanho } from '@/features/produtos/tamanho/types';
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

function SortableHeader<TData>({ column, label }: { column: Column<TData, unknown>; label: string }) {
    return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

const categoriaLabel: Record<string, string> = {
    vestuario: 'Vestuário',
    calcados: 'Calçados',
    acessorios: 'Acessórios',
    outros: 'Outros',
};

export const tamanhoColumns: ColumnDef<Tamanho>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'cod_tamanho',
        header: ({ column }) => <SortableHeader column={column} label="Código" />,
        meta: { label: 'Código' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'des_tamanho',
        header: ({ column }) => <SortableHeader column={column} label="Descrição" />,
        cell: ({ row }) => row.original.des_tamanho ?? '-',
        meta: { label: 'Descrição' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'des_categoria_tamanho',
        header: ({ column }) => <SortableHeader column={column} label="Categoria" />,
        cell: ({ row }) => {
            const categoria = row.original.des_categoria_tamanho;
            if (!categoria) return <Badge variant="secondary">Sem categoria</Badge>;
            return <Badge variant="outline">{categoriaLabel[categoria] ?? categoria}</Badge>;
        },
        meta: { label: 'Categoria' },
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
            const tamanho = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(tamanho)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(tamanho)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(tamanho)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
