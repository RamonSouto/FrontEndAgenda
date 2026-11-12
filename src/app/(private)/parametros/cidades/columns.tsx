// app/(private)/parametros//columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Cidade } from '@/features/parametrizacao/cidades/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const cidadeColumns: ColumnDef<Cidade>[] = [
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
    meta: { label: 'ID' }
  },
  {
    accessorKey: 'nom_cidade',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cidade
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    meta: {
      label: 'Nome da cidade'
    },
    filterFn: 'includesString'
  },
  {
    accessorKey: 'cod_municipio_ibge',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Municipio IBGE
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    meta: {
      label: 'Código municipio IBGE'
    },
    filterFn: 'includesString'
  },
  {
    accessorKey: 'nom_estado',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Estado
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    meta: {
      label: 'Nome do estado'
    },
    filterFn: 'includesString'
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
    },
    filterFn: 'includesString'
  }
];