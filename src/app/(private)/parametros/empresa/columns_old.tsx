// app/(private)/parametros/empresa/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatarCNPJ, formatarData } from '@/lib/utils/formatters';

function sortableHeader(label: string) {
  return ({ column }: any) => (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

interface EmpresaColumnsProps {
  onView: (empresa: Empresa) => void;
  onEdit: (empresa: Empresa) => void;
  onDelete: (empresa: Empresa) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export function getEmpresaColumns({ onView, onEdit, onDelete }: EmpresaColumnsProps): ColumnDef<Empresa>[] {
  return [
    {
      accessorKey: 'id',
      header: sortableHeader('ID'),
      meta: { label: 'ID' },
    },
    {
      accessorKey: 'nom_razao_social',
      header: sortableHeader('Razão Social'),
      meta: { label: 'Razão Social' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'nom_fantasia',
      header: sortableHeader('Nome Fantasia'),
      meta: { label: 'Nome Fantasia' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'des_url_logo_horizontal',
      header: sortableHeader('Logo'),
      cell: ({ row }) => {
        const url = row.original.des_url_logo_horizontal

        if (!url) {
          return (
            <div className="h-12 w-12 rounded border bg-muted/30 flex items-center justify-center text-muted-foreground text-xs">
              N/A
            </div>
          );
        }

        return (
          <img
            src={`${BASE_URL}/${url}`}
            alt="Imagem do produto"
            className="h-12 w-12 rounded object-cover border"
          />
        )
      },
      meta: { label: 'logo' },
    },
    {
      accessorKey: 'num_cnpj',
      header: sortableHeader('CNPJ'),
      meta: { label: 'CNPJ' },
      filterFn: 'includesString',
      cell: ({ row }) => formatarCNPJ(row.original.num_cnpj),
    },
    {
      accessorKey: 'num_inscricao_estadual',
      header: sortableHeader('I.E.'),
      meta: { label: 'I.E.' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'nom_cidade',
      header: sortableHeader('Cidade'),
      meta: { label: 'Cidade' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'nom_estado',
      header: sortableHeader('Estado'),
      meta: { label: 'Estado' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'sgl_estado',
      header: sortableHeader('UF'),
      meta: { label: 'UF' },
      filterFn: 'includesString',
    },
    {
      accessorKey: 'ind_ativo',
      header: sortableHeader('Status'),
      meta: { label: 'Status' },
      cell: ({ row }) => (
        <Badge variant={row.original.ind_ativo === 1 ? 'default' : 'destructive'}>
          {row.original.ind_ativo === 1 ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: sortableHeader('Criado'),
      meta: { label: 'Criado' },
      cell: ({ row }) => formatarData(row.original.created_at),
    },
    {
      accessorKey: 'updated_at',
      header: sortableHeader('Editado'),
      meta: { label: 'Editado' },
      cell: ({ row }) => (row.original.updated_at ? formatarData(row.original.updated_at) : '-'),
    },
    {
      id: 'acoes',
      header: 'Ação',
      meta: { label: 'Ação' },
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={(
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )} />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Eye className="mr-2 h-4 w-4" /> Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
              <Trash2 className="mr-2 h-4 w-4" /> Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

// Colunas visíveis por padrão: ID, Razão Social, Nome Fantasia, CNPJ, Ação
export const empresaDefaultVisibility: Record<string, boolean> = {
  id: true,
  nom_razao_social: true,
  nom_fantasia: true,
  num_cnpj: true,
  num_inscricao_estadual: false,
  nom_cidade: false,
  nom_estado: false,
  sgl_estado: false,
  ind_ativo: false,
  created_at: false,
  updated_at: false,
  acoes: true,
};
