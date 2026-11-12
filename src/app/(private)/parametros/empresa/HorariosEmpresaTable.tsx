// app/(private)/parametros/empresa/HorariosEmpresaTable.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useHorariosEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { formatarData } from '@/lib/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';

export function HorariosEmpresaTable({ idEmpresa }: { idEmpresa: number }) {
    const { data, isLoading } = useHorariosEmpresa(idEmpresa);
    const horarios = data?.dados ?? [];

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
            <div className="border rounded-md overflow-auto max-h-[300px]">
                <Card className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 max-h-[55vh]'}`}>
                    <CardContent className="p-0">
                        <div className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary '}`}>
                            <Table>
                                <TableHeader className="top-0 bg-background">
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Tipo de Dia</TableHead>
                                        <TableHead>Início</TableHead>
                                        <TableHead>Fim</TableHead>
                                        <TableHead>Intervalo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Criado</TableHead>
                                        <TableHead>Editado</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={9} className="text-center py-4">Carregando...</TableCell></TableRow>
                                    ) : horarios.length === 0 ? (
                                        <TableRow><TableCell colSpan={9} className="text-center py-4">Nenhum horário cadastrado.</TableCell></TableRow>
                                    ) : (
                                        horarios.map((h) => (
                                            <TableRow key={h.id}>
                                                <TableCell>{h.id}</TableCell>
                                                <TableCell>{h.des_tipo_dia}</TableCell>
                                                <TableCell>{h.hra_inicio}</TableCell>
                                                <TableCell>{h.hra_fim}</TableCell>
                                                <TableCell>{h.qtd_minutos_intervalo}</TableCell>
                                                <TableCell>
                                                    <Badge variant={h.ind_ativo ? 'default' : 'secondary'}>
                                                        {h.ind_ativo ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatarData(h.created_at)}</TableCell>
                                                <TableCell>{h.updated_at ? formatarData(h.updated_at) : '-'}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger render={(
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        )} />
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Visualizar</DropdownMenuItem>
                                                            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Deletar</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
