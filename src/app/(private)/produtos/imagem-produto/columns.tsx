// app/(private)/produtos/imagem-produto/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { ImagemProduto } from '@/features/produtos/imagem-produto/types';
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
        produtosMap?: Record<number, string>;
        gradesMap?: Record<number, string>;
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const imagemProdutoColumns: ColumnDef<ImagemProduto>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        id: 'preview',
        header: 'Imagem',
        cell: ({ row }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={`${BASE_URL}/uploads/${row.original.des_url_imagem}`}
                alt={row.original.des_titulo_imagem ?? 'Imagem do produto'}
                className="h-12 w-12 rounded object-cover border"
            />
        ),
        meta: { label: 'Imagem' },
        enableSorting: false,
    },
    {
        accessorKey: 'des_titulo_imagem',
        header: ({ column }) => <SortableHeader column={column} label="Título" />,
        cell: ({ row }) => row.original.des_titulo_imagem ?? '-',
        meta: { label: 'Título' },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'id_produto',
        header: ({ column }) => <SortableHeader column={column} label="Produto" />,
        cell: ({ row, table }) => {
            const idProduto = row.original.id_produto;
            if (!idProduto) return;
            const nome = table.options.meta?.produtosMap?.[idProduto];
            return nome ?? idProduto;
        },
        meta: { label: 'Produto' },
    },
    {
        accessorKey: 'id_produto_grade',
        header: ({ column }) => <SortableHeader column={column} label="Grade" />,
        cell: ({ row, table }) => {
            const idGrade = row.original.id_produto_grade;
            if (!idGrade) return;
            const nome = table.options.meta?.gradesMap?.[idGrade];
            return nome ?? idGrade;
        },
        meta: { label: 'Grade' },
    },
    {
        accessorKey: 'num_ordem',
        header: ({ column }) => <SortableHeader column={column} label="Ordem" />,
        meta: { label: 'Ordem' },
    },
    {
        accessorKey: 'ind_principal',
        header: ({ column }) => <SortableHeader column={column} label="Principal" />,
        cell: ({ row }) =>
            row.original.ind_principal ? (
                <Badge>SIM</Badge>
            ) : (
                <></>
                // <Badge variant="secondary"></Badge>
            ),
        meta: { label: 'Principal' },
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
            const imagem = row.original;
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(imagem)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(imagem)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(imagem)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
