// app/(private)/produtos/imagem-produto/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    useImagensProduto,
    useCriarImagemProduto,
    useAtualizarImagemProduto,
    useDeletarImagemProduto,
} from '@/features/produtos/imagem-produto/hooks';
import {
    imagemProdutoCreateSchema,
    imagemProdutoUpdateSchema,
    ImagemProdutoCreateInput,
    ImagemProdutoUpdateInput,
    TIPO_VINCULO,
} from '@/features/produtos/imagem-produto/schema';
import { ImagemProduto } from '@/features/produtos/imagem-produto/types';
import { imagemProdutoColumns } from './columns';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { Columns, Funnel, Plus, ImagePlus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { useGradesProduto } from '@/features/produtos/grade/hooks';
import { useProdutos } from '@/features/produtos/produto/hooks';
import { useTamanhos } from '@/features/produtos/tamanho/hooks';
import { ImagemProdutoUpdateForm } from '@/components/imagem-produto-update-form';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

const DEFAULT_FORM: ImagemProdutoCreateInput = {
    tipo_vinculo: TIPO_VINCULO.PRODUTO,
    id_produto: null,
    id_produto_grade: null,
    des_titulo_imagem: '',
    des_imagem: '',
    num_ordem: 0,
    ind_principal: false,
    arquivo: null,
};

// ---------------------------------------------------------------------------
// Formulário de criação
// ---------------------------------------------------------------------------
function ImagemProdutoCreateForm({
    onSubmit,
    submitting,
    produtos,
    grades,
}: {
    onSubmit: (data: ImagemProdutoCreateInput) => void;
    submitting?: boolean;
    produtos: { id: number; nom_produto: string }[];
    grades: { id: number; label: string }[];
}) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ImagemProdutoCreateInput>({
        resolver: zodResolver(imagemProdutoCreateSchema),
        defaultValues: DEFAULT_FORM,
    });

    const tipoVinculo = watch('tipo_vinculo');
    const arquivo = watch('arquivo');
    const [preview, setPreview] = useState<string | null>(null);

    // Gera/limpa a URL de preview sempre que o arquivo mudar (evita memory leak)
    useEffect(() => {
        if (!arquivo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(arquivo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [arquivo]);

    const handleTipoVinculoChange = (tipo: string) => {
        setValue('tipo_vinculo', tipo as ImagemProdutoCreateInput['tipo_vinculo']);
        // Ao trocar o tipo, limpa o outro ID para não violar a regra XOR do banco
        if (tipo === TIPO_VINCULO.PRODUTO) {
            setValue('id_produto_grade', null);
        } else {
            setValue('id_produto', null);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Linha: RadioGroup (Produto/Grade) + Switch (Principal) */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <Controller
                    name="tipo_vinculo"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={handleTipoVinculoChange}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.PRODUTO} id="vinculo-produto" />
                                <Label htmlFor="vinculo-produto">Produto</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={TIPO_VINCULO.GRADE} id="vinculo-grade" />
                                <Label htmlFor="vinculo-grade">Grade</Label>
                            </div>
                        </RadioGroup>
                    )}
                />

                <div className="flex items-center gap-2">
                    <Label htmlFor="ind_principal">Imagem principal</Label>
                    <Controller
                        name="ind_principal"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="ind_principal"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Select dinâmico: produto ou grade, conforme o RadioGroup */}
            <div className="space-y-1">
                <Label>{tipoVinculo === TIPO_VINCULO.PRODUTO ? 'Produto' : 'Grade (Produto - Tamanho)'}</Label>
                {tipoVinculo === TIPO_VINCULO.PRODUTO ? (
                    <Controller
                        name="id_produto"
                        control={control}
                        render={({ field }) => {
                            const labelselecionado = produtos.find((p) => p.id === field.value)?.nom_produto;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o produto">
                                            {labelselecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produtos.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nom_produto}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )

                        }}
                    />
                ) : (
                    <Controller
                        name="id_produto_grade"
                        control={control}
                        render={({ field }) => {
                            const labelselecionado = grades.find((g) => g.id === field.value)?.label;
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a grade">
                                            {labelselecionado}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map((g) => (
                                            <SelectItem key={g.id} value={String(g.id)}>
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        }}
                    />
                )}
                {errors.id_produto && (
                    <p className="text-sm text-destructive">{errors.id_produto.message}</p>
                )}
            </div>

            {/* Upload de arquivo com preview */}
            <div className="space-y-1">
                <Label>Arquivo da Imagem</Label>
                <Controller
                    name="arquivo"
                    control={control}
                    render={({ field }) => (
                        <>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="arquivo-imagem"
                                    className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed bg-muted/30"
                                >
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </label>
                                <Input
                                    id="arquivo-imagem"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                />
                            </div>
                            <div className='min-w-0'>
                                <span className="block text-sm text-muted-foreground truncate"
                                    title={field.value?.name ?? undefined}>
                                    {field.value?.name ?? 'Nenhum arquivo selecionado'}
                                </span>
                            </div>
                        </>
                    )}
                />
                {errors.arquivo && (
                    <p className="text-sm text-destructive">{errors.arquivo.message as string}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Título da Imagem</Label>
                <Controller
                    name="des_titulo_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} value={field.value ?? ''} placeholder="Ex: Estampa de onça" />
                    )}
                />
                {errors.des_titulo_imagem && (
                    <p className="text-sm text-destructive">{errors.des_titulo_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Descrição da Imagem</Label>
                <Controller
                    name="des_imagem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Ex: Bermuda de cintura alta com estampa de onça"
                        />
                    )}
                />
                {errors.des_imagem && (
                    <p className="text-sm text-destructive">{errors.des_imagem.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Ordem de Exibição</Label>
                <Controller
                    name="num_ordem"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            min={0}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                {errors.num_ordem && (
                    <p className="text-sm text-destructive">{errors.num_ordem.message}</p>
                )}
            </div>

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function ImagemProdutoPage() {
    const { data: imagensRaw, isLoading, error } = useImagensProduto();
    const { data: produtosRaw } = useProdutos();
    const { data: gradesRaw } = useGradesProduto();
    const { data: tamanhosRaw } = useTamanhos();

    const imagens = useMemo(
        () => (Array.isArray(imagensRaw?.dados) ? imagensRaw.dados : []).filter((i) => i.deleted_at === null),
        [imagensRaw]
    );

    const produtos = useMemo(
        () => (Array.isArray(produtosRaw?.dados) ? produtosRaw.dados : []).filter((p) => p.deleted_at === null),
        [produtosRaw]
    );

    const grades = useMemo(
        () => (Array.isArray(gradesRaw?.dados) ? gradesRaw.dados : []).filter((g) => g.deleted_at === null),
        [gradesRaw]
    );

    const tamanhos = useMemo(
        () => (Array.isArray(tamanhosRaw?.dados) ? tamanhosRaw.dados : []).filter((t: any) => t.deleted_at === null),
        [tamanhosRaw]
    );

    const produtosMap = useMemo(
        () =>
            produtos.reduce<Record<number, string>>((acc, p) => {
                acc[p.id] = p.nom_produto;
                return acc;
            }, {}),
        [produtos]
    );

    const tamanhosMap = useMemo(
        () =>
            tamanhos.reduce<Record<number, string>>((acc, t: any) => {
                acc[t.id] = t.des_tamanho ?? t.nom_tamanho;
                return acc;
            }, {}),
        [tamanhos]
    );

    // Monta o rótulo "Produto - Tamanho" exigido para o Select de Grade
    const gradesOptions = useMemo(
        () =>
            grades.map((g) => ({
                id: g.id,
                label: `${produtosMap[g.id_produto] ?? g.id_produto} - ${tamanhosMap[g.id_tamanho] ?? g.id_tamanho}`,
            })),
        [grades, produtosMap, tamanhosMap]
    );

    const gradesMap = useMemo(
        () =>
            gradesOptions.reduce<Record<number, string>>((acc, g) => {
                acc[g.id] = g.label;
                return acc;
            }, {}),
        [gradesOptions]
    );

    const criarMutation = useCriarImagemProduto();
    const [imagemSelecionada, setImagemSelecionada] = useState<ImagemProduto | null>(null);
    const atualizarMutation = useAtualizarImagemProduto(imagemSelecionada?.id ?? 0);
    const deletarMutation = useDeletarImagemProduto();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [imagemParaDeletar, setImagemParaDeletar] = useState<ImagemProduto | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        return imagemProdutoColumns
            .filter((col) => 'accessorKey' in col && col.id !== 'id' && col.id !== 'acoes')
            .map((col) => ({
                value: (col as any).accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));
    }, []);

    const [filterField, setFilterField] = useState(filterOptions[0]?.value || '');
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        setColumnFilters(filterField && value ? [{ id: filterField, value }] : []);
    };

    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    const table = useReactTable({
        data: imagens,
        columns: imagemProdutoColumns,
        state: { columnFilters, sorting, pagination, columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        manualPagination: false,
        meta: {
            produtosMap,
            gradesMap,
            onView: (imagem: ImagemProduto) => {
                setImagemSelecionada(imagem);
                setDialogVisualizarAberto(true);
            },
            onEdit: (imagem: ImagemProduto) => {
                setImagemSelecionada(imagem);
                setDialogEditarAberto(true);
            },
            onDelete: (imagem: ImagemProduto) => setImagemParaDeletar(imagem),
        },
    });

    const handleCriar = (data: ImagemProdutoCreateInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Imagem cadastrada com sucesso');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao cadastrar a imagem.');
            },
        });
    };

    const handleAtualizar = (data: ImagemProdutoUpdateInput) => {
        atualizarMutation.mutate(data, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setImagemSelecionada(null);
                toast.success('Imagem atualizada com sucesso!');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao atualizar a imagem.');
            },
        });
    };

    const confirmarDelecao = () => {
        if (!imagemParaDeletar) return;
        deletarMutation.mutate(imagemParaDeletar.id, {
            onSuccess: () => {
                setImagemParaDeletar(null);
                toast.success('Imagem deletada com sucesso!');
            },
            onError: (error) => {
                setImagemParaDeletar(null);
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao deletar a imagem.');
            },
        });
    };

    if (error) return <div>Erro ao carregar imagens.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Imagens de Produto</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Imagem
                            </Button>
                        }
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Imagem do Produto</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova imagem
                            </DialogDescription>
                        </DialogHeader>
                        <Card className='ring-0'>
                            <ImagemProdutoCreateForm
                                onSubmit={handleCriar}
                                submitting={criarMutation.isPending}
                                produtos={produtos}
                                grades={gradesOptions}
                            />
                        </Card>
                    </DialogContent>
                </Dialog>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1">
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
                                {filterOptions.find((opt) => opt.value === filterField)?.label || 'Campo'}
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
                            placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'}`}
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
                        <Table className="overflow-x-auto">
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton columnsCount={imagemProdutoColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={imagemProdutoColumns.length} className="text-center py-4">
                                            Nenhuma imagem encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>

            {/* Dialog de edição */}
            <Dialog
                open={dialogEditarAberto}
                onOpenChange={(open) => {
                    setDialogEditarAberto(open);
                    if (!open) setImagemSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Imagem do Produto</DialogTitle>
                        <DialogDescription>
                            Atualize o produto vinculado e/ou a marcação de imagem principal
                        </DialogDescription>
                    </DialogHeader>
                    {imagemSelecionada && (
                        <Card className='ring-0'>
                            <ImagemProdutoUpdateForm
                                defaultValues={{
                                    tipo_vinculo: imagemSelecionada.id_produto ? TIPO_VINCULO.PRODUTO : TIPO_VINCULO.GRADE,
                                    id_produto: imagemSelecionada.id_produto ?? null,
                                    id_produto_grade: imagemSelecionada.id_produto_grade ?? null,
                                    des_titulo_imagem: imagemSelecionada.des_titulo_imagem ?? '',
                                    des_imagem: imagemSelecionada.des_imagem ?? '',
                                    num_ordem: imagemSelecionada.num_ordem ?? 0,
                                    ind_principal: !!imagemSelecionada.ind_principal,
                                    arquivo: null,
                                }}
                                onSubmit={handleAtualizar}
                                submitting={atualizarMutation.isPending}
                                produtos={produtos}
                                grades={gradesOptions}
                                imagemAtualUrl={imagemSelecionada.des_url_imagem}
                            />
                        </Card>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setImagemSelecionada(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Imagem do Produto</DialogTitle>
                        <DialogDescription>Detalhes da imagem selecionada</DialogDescription>
                    </DialogHeader>
                    {imagemSelecionada && (
                        <div className="space-y-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${BASE_URL}/uploads/${imagemSelecionada.des_url_imagem}`}
                                alt={imagemSelecionada.des_titulo_imagem ?? 'Imagem'}
                                className="w-full max-h-64 object-contain rounded border"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={imagemSelecionada.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Vínculo</Label>
                                    <Input
                                        value={
                                            imagemSelecionada.id_produto
                                                ? produtosMap[imagemSelecionada.id_produto] ?? `Produto #${imagemSelecionada.id_produto}`
                                                : gradesMap[imagemSelecionada.id_produto_grade ?? 0] ?? `Grade #${imagemSelecionada.id_produto_grade}`
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Título</Label>
                                <Input value={imagemSelecionada.des_titulo_imagem ?? '-'} disabled />
                            </div>
                            <div className="space-y-1">
                                <Label>Descrição</Label>
                                <Input value={imagemSelecionada.des_imagem ?? '-'} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={imagemSelecionada.created_at ? formatarData(imagemSelecionada.created_at) : '-'}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={imagemSelecionada.updated_at ? formatarData(imagemSelecionada.updated_at) : '-'}
                                        disabled
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose variant="outline">Fechar</DialogClose>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirmação de deleção */}
            <AlertDialog open={!!imagemParaDeletar} onOpenChange={(open) => !open && setImagemParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar imagem</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta imagem? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarDelecao} disabled={deletarMutation.isPending}>
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
