// app/(private)/parametros/Empresa/components/ParametrizacaoTable.tsx

'use client';

import { useParametros } from '@/features/parametrizacao/parametros/hooks';
import { useDeleteParametro } from '@/features/parametrizacao/parametros/hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface ParametrizacaoTableProps {
    empresaId: number; // não usado diretamente, mas pode ser usado para filtrar
}

export function ParametrizacaoTable({ empresaId }: ParametrizacaoTableProps) {
    const { data: parametros, isLoading } = useParametros();
    const deleteMutation = useDeleteParametro();

    // Se houver vínculo, filtrar por empresaId, senão listar todos
    const filtered = parametros || [];

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja deletar esta parametrização?')) {
            deleteMutation.mutate(id, {
                onSuccess: () => toast.success('Parametrização deletada com sucesso'),
                onError: () => toast.error('Erro ao deletar'),
            });
        }
    };

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo Dia</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Fim</TableHead>
                        <TableHead>Intervalo (min)</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead>Criado</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                Carregando...
                            </TableCell>
                        </TableRow>
                    ) : filtered.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                Nenhuma parametrização encontrada.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filtered.map((param) => (
                            <TableRow key={param.id}>
                                <TableCell>{param.id}</TableCell>
                                <TableCell>{param.des_tipo_dia}</TableCell>
                                <TableCell>{param.hra_inicio}</TableCell>
                                <TableCell>{param.hra_fim}</TableCell>
                                <TableCell>{param.qtd_minutos_intervalo}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={param.ind_ativo}
                                        disabled
                                        className="cursor-default"
                                    />
                                </TableCell>
                                <TableCell>
                                    {format(new Date(param.created_at), 'dd/MM/yyyy HH:mm', {
                                        locale: ptBR,
                                    })}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Visualizar</DropdownMenuItem>
                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(param.id)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                Deletar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}