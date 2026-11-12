import { ColumnDef } from '@tanstack/react-table';
import { Estado } from '@/features/parametrizacao/estados/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const estadoColumns: ColumnDef<Estado>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    ID
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        meta: {
            label: 'ID'
        }
    },
    {
        accessorKey: 'nom_estado',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Nome
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        meta: {
            label: 'Nome'
        }
    },
    {
        accessorKey: 'sgl_estado',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    UF
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        meta: {
            label: 'UF'
        }
    },
];