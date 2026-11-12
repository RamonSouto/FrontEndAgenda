// app/(private)/pessoas/columns.tsx
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { Pessoa } from '@/features/pessoas/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Power,
    PowerOff,
} from 'lucide-react';
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
        onAtivar?: (data: TData) => void;
        onDesativar?: (data: TData) => void;
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

function formatarCpfExibicao(cpf: string) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export const PAPEIS_CONFIG: { key: keyof Pessoa; label: string; classe: string }[] = [
    { key: 'ind_medico', label: 'Médico', classe: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'ind_secretaria', label: 'Secretária', classe: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'ind_costureira', label: 'Costureira', classe: 'bg-pink-100 text-pink-800 border-pink-200' },
    { key: 'ind_paciente', label: 'Paciente', classe: 'bg-green-100 text-green-800 border-green-200' },
    { key: 'ind_administrador', label: 'Administrador', classe: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
];

export const pessoaColumns: ColumnDef<Pessoa>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        meta: { label: 'ID' },
    },
    {
        accessorKey: 'nom_completo',
        header: ({ column }) => <SortableHeader column={column} label="Nome" />,
        meta: { label: 'Nome' },
        filterFn: 'includesString',
    },
    // {
    //     accessorKey: 'num_cpf',
    //     header: ({ column }) => <SortableHeader column={column} label="CPF" />,
    //     cell: ({ row }) => formatarCpfExibicao(row.original.num_cpf),
    //     meta: { label: 'CPF' },
    // },
    {
        id: 'papeis',
        header: 'Papéis',
        enableSorting: false,
        accessorFn: (row) => row,
        cell: ({ row }) => {
            const pessoa = row.original;
            return (
                <div className="flex flex-wrap gap-1">
                    {PAPEIS_CONFIG.filter((p) => Number(pessoa[p.key]) === 1).map((p) => (
                        <Badge key={p.key} variant="outline" className={p.classe}>
                            {p.label}
                        </Badge>
                    ))}
                </div>
            );
        },
        filterFn: (row, columnId, filterValue: string) => {
            if (!filterValue) return true;
            const pessoa = row.original as Pessoa;
            return Number(pessoa[filterValue as keyof Pessoa]) === 1;
        },
        meta: { label: 'Papéis' },
    },
    {
        accessorKey: 'ind_status',
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) =>
            row.original.ind_status === 'ativo' ? (
                <Badge>Ativo</Badge>
            ) : (
                <Badge variant="destructive">Inativo</Badge>
            ),
        meta: { label: 'Status' },
    },
    {
        accessorKey: 'nom_cidade',
        header: ({ column }) => <SortableHeader column={column} label="Cidade" />,
        cell: ({ row }) =>
            row.original.nom_cidade ? `${row.original.nom_cidade}/${row.original.sgl_estado}` : '-',
        meta: { label: 'Cidade' },
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
            const pessoa = row.original;
            const meta = table.options.meta;
            const ativo = pessoa.ind_status === 'ativo';
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
                        <DropdownMenuItem onClick={() => meta?.onView?.(pessoa)}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => meta?.onEdit?.(pessoa)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {ativo ? (
                            <DropdownMenuItem onClick={() => meta?.onDesativar?.(pessoa)}>
                                <PowerOff className="mr-2 h-4 w-4" /> Desativar
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => meta?.onAtivar?.(pessoa)}>
                                <Power className="mr-2 h-4 w-4" /> Ativar
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => meta?.onDelete?.(pessoa)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
