// src/app/(private)/produtos/produto/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Plus, Funnel, Columns } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

import { columns } from './columns';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    useProdutos,
    useCriarProduto,
    useAtualizarProduto,
    useDeletarProduto,
} from '@/features/produtos/produto/hooks';
import { ProdutoInput } from '@/features/produtos/produto/schema';
import { ProdutoForm } from '@/app/(private)/produtos/produto/produto-form';
import { Card, CardContent } from '@/components/ui/card';
import { useCategorias } from '@/features/produtos/categoria/hooks';
import { Produto } from '@/features/produtos/produto/types';
import { formatarData } from '@/lib/utils/formatters';
import { useImagensProduto } from '@/features/produtos/imagem-produto/hooks';


const DEFAULT_FORM: ProdutoInput = {
    id_categoria: null,
    nom_produto: '',
    num_sku: '',
    des_produto: '',
    ref_produto: '',
    val_preco_base: 0,
    ind_ativo: true,
};

const filterOptions = [
    { value: 'nom_produto', label: 'Nome' },
    { value: 'num_sku', label: 'SKU' },
    { value: 'ref_produto', label: 'Referência' },
];

export default function ProdutoPage() {
    const router = useRouter();
    const { data, isLoading } = useProdutos();
    const { data: categoriaRaw } = useCategorias();
    const { data: imagensRaw } = useImagensProduto();


    const criarMutation = useCriarProduto();

    // ---- states de dialogs / seleção ----
    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [produtoSelecionada, setProdutoSelecionada] = useState<Produto | null>(null);
    const [gradeParaDeletar, setGradeParaDeletar] = useState<Produto | null>(null);

    const [showFilters, setShowFilters] = useState(false);
    const [filterField, setFilterField] = useState('nom_produto');
    const [filterValue, setFilterValue] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<any[]>([]);

    const produtos = useMemo(
        () => (Array.isArray(data?.dados) ? data?.dados : []).filter((p) => p.deleted_at === null),
        [data]
    );

    const imagens = useMemo(
        () => (Array.isArray(imagensRaw?.dados) ? imagensRaw.dados : []).filter((i) => i.deleted_at === null),
        [imagensRaw]
    );

    const produtosMap = useMemo(() => {
        return produtos.reduce<Record<number, string>>((acc, v: any) => {
            acc[v.id] = v.nom_produto;
            return acc;
        }, {});
    }, [produtos]);

    const imagemPrincipalMap = useMemo(() => {
        return imagens.reduce<Record<number, string>>((acc, img) => {
            if (img.id_produto && img.ind_principal === 1) {
                acc[img.id_produto] = img.des_url_imagem;
            }
            return acc;
        }, {});
    }, [imagens]);

    const cateogrias = useMemo(
        () => (Array.isArray(categoriaRaw?.dados) ? categoriaRaw?.dados : []).filter((c) => c.deleted_at === null),
        [categoriaRaw]
    );

    const categoriasMap = useMemo(() => {
        return cateogrias.reduce<Record<number, string>>((acc, v: any) => {
            acc[v.id] = v.nom_categoria;
            return acc;
        }, {});
    }, [cateogrias]);

    // ---- mutation de editar (depende do id selecionado) ----
    const atualizarMutation = useAtualizarProduto(produtoSelecionada?.id ?? 0);
    const deletarMutation = useDeletarProduto();

    const table = useReactTable({
        data: produtos,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
        meta: {
            produtosMap,
            categoriasMap,
            imagemPrincipalMap,
            onView: (produto: Produto) => {
                setProdutoSelecionada(produto);
                setDialogVisualizarAberto(true);
            },
            onEdit: (produto: Produto) => {
                router.push(`/produtos/produto/${produto.id}`);
            },
            onDelete: (produto: Produto) => {
                setGradeParaDeletar(produto);
            },
        },
    });

    function handleFilterChange(value: string) {
        setFilterValue(value);
        table.getColumn(filterField)?.setFilterValue(value);
    }

    function clearFilters() {
        setFilterValue('');
        table.getColumn(filterField)?.setFilterValue(undefined);
    }

    function handleCriar(values: ProdutoInput) {
        criarMutation.mutate(values, {
            onSuccess: (response) => {
                setDialogCriarAberto(false);
                // Redireciona para a tela de edição, liberando as seções
                // Grade, Produto/Serviço e Produto/Serviço/Preço
                router.push(`/produtos/produto/${response.dados.id}`);
            },
        });
    }

    function handleEditar(values: ProdutoInput) {
        if (!produtoSelecionada) return;
        atualizarMutation.mutate(values, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setProdutoSelecionada(null);
            },
        });
    }

    function handleConfirmarDelete() {
        if (!gradeParaDeletar) return;
        deletarMutation.mutate(gradeParaDeletar.id, {
            onSuccess: () => {
                setGradeParaDeletar(null);
            },
        });
    }

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Produtos</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Novo Produto
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Produto</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar um novo produto.
                            </DialogDescription>
                        </DialogHeader>

                        <ProdutoForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                            opcoesCategorias={cateogrias}
                        />
                    </DialogContent>
                </Dialog>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-1"
                    >
                        <Funnel className="h-4 w-4" />
                        Filtros
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="outline" size="sm" className="gap-1">
                                    <Columns className="h-4 w-4" />
                                    Colunas
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.columnDef.meta?.label ?? column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-wrap items-end gap-2 mb-4 p-4 border rounded-md bg-muted/20">
                    <div className="flex-1 min-w-[150px]">
                        <Select value={filterField} onValueChange={setFilterField}>
                            <SelectTrigger className="w-full">
                                {filterOptions.find((opt) => opt.value === filterField)?.label ||
                                    'Campo'}
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Input
                            placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'
                                }`}
                            value={filterValue}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar
                    </Button>
                </div>
            )}

            <Card
                className={`min-w-0 overflow-auto rounded-lg shadow-lg py-0 ${showFilters ? 'max-h-[55vh] sm:max-h-[60vh]' : 'max-h-[75vh] sm:max-h-[75vh]'
                    }`}
            >
                <CardContent className="p-0">
                    <div
                        className={`relative w-full min-w-0 overflow-auto scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary ${showFilters
                            ? 'max-h-[calc(55vh-105px)] sm:max-h-[calc(60vh-65px)]'
                            : 'max-h-[calc(75vh-100px)] sm:max-h-[calc(75vh-100px)]'
                            }`}
                    >
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Carregando...
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-muted/50">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Nenhum produto encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>



            {/* -------- Dialog: Visualizar -------- */}
            <Dialog open={dialogVisualizarAberto} onOpenChange={setDialogVisualizarAberto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes do Produto</DialogTitle>
                        <DialogDescription>Informações completas do produto selecionado.</DialogDescription>
                    </DialogHeader>

                    {produtoSelecionada && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nome</p>
                                <p className="font-medium">{produtoSelecionada.nom_produto}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">SKU</p>
                                <p className="font-medium">{produtoSelecionada.num_sku ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Referência</p>
                                <p className="font-medium">{produtoSelecionada.ref_produto ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Categoria</p>
                                <p className="font-medium">
                                    {produtoSelecionada.id_categoria ? categoriasMap[produtoSelecionada.id_categoria] ?? produtoSelecionada.id_categoria : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Preço base</p>
                                <p className="font-medium">
                                    {Number(produtoSelecionada.val_preco_base).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge variant={produtoSelecionada.ind_ativo === 1 ? 'default' : 'secondary'}>
                                    {produtoSelecionada.ind_ativo === 1 ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Descrição</p>
                                <p className="font-medium">{produtoSelecionada.des_produto ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Criado em</p>
                                <p className="font-medium">{formatarData(produtoSelecionada.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Atualizado em</p>
                                <p className="font-medium">
                                    {produtoSelecionada.updated_at ? formatarData(produtoSelecionada.updated_at) : '-'}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* -------- Dialog: Editar -------- */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={(open) => {
                    setDialogEditarAberto(open);
                    if (!open) setProdutoSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>Atualize os dados do produto selecionado.</DialogDescription>
                    </DialogHeader>

                    {produtoSelecionada && (
                        <ProdutoForm
                            defaultValues={{
                                id_categoria: produtoSelecionada.id_categoria,
                                nom_produto: produtoSelecionada.nom_produto,
                                num_sku: produtoSelecionada.num_sku,
                                des_produto: produtoSelecionada.des_produto,
                                ref_produto: produtoSelecionada.ref_produto,
                                val_preco_base: Number(produtoSelecionada.val_preco_base),
                                ind_ativo: produtoSelecionada.ind_ativo === 1,
                            }}
                            onSubmit={handleEditar}
                            submitting={atualizarMutation.isPending}
                            opcoesCategorias={cateogrias}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* -------- AlertDialog: Deletar -------- */}
            <AlertDialog
                open={!!gradeParaDeletar}
                onOpenChange={(open) => {
                    if (!open) setGradeParaDeletar(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar produto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar o produto{' '}
                            <strong>{gradeParaDeletar?.nom_produto}</strong>? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmarDelete}
                            disabled={deletarMutation.isPending}
                        >
                            {deletarMutation.isPending ? 'Deletando...' : 'Deletar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
