// app/(private)/parametros/Template/page.tsx
'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { ApiError } from '@/lib/http/errors';
import { formatarData } from '@/lib/utils/formatters';
import { useEmpresas } from '@/features/parametrizacao/empresa/hooks';
import {
    useTemplatesEmail,
    useSalvarTemplateEmail,
    usePreviewTemplateEmail,
} from '@/features/parametrizacao/template/hooks';
import {
    templateEmailSchema,
    TemplateEmailInput,
    TemplatePreviewInput,
} from '@/features/parametrizacao/template/schema';
import {
    EVENTOS_TEMPLATE,
    EVENTOS_TEMPLATE_LABEL,
    EventoTemplate,
    TemplateEmailLinha,
} from '@/features/parametrizacao/template/types';
import { templateColumns } from './columns';

// Tiptap só no client (usa window/document)
const HtmlEditor = dynamic(() => import('./html-editor'), {
    ssr: false,
    loading: () => <div className="h-[320px] w-full animate-pulse rounded-md bg-muted" />,
});

// --- Formulário de cadastro/edição ---
function TemplateForm({
    defaultValues,
    placeholders,
    submitting,
    previewing,
    onSubmit,
    onPreview,
}: {
    defaultValues: TemplateEmailInput;
    placeholders: string[];
    submitting?: boolean;
    previewing?: boolean;
    onSubmit: (data: TemplateEmailInput) => void;
    onPreview: (data: TemplatePreviewInput) => void;
}) {
    const {
        control,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors },
    } = useForm<TemplateEmailInput>({
        resolver: zodResolver(templateEmailSchema),
        defaultValues,
    });

    const handlePreview = async () => {
        const valido = await trigger(['des_assunto', 'des_corpo_html']);
        if (!valido) return;
        const { des_assunto, des_corpo_html } = getValues();
        onPreview({ des_assunto, des_corpo_html });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 min-w-0">
            <div className="space-y-1">
                <Label>Assunto</Label>
                <Controller
                    name="des_assunto"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} maxLength={200} placeholder="Ex: Agendamento confirmado" />
                    )}
                />
                {errors.des_assunto && (
                    <p className="text-sm text-destructive">{errors.des_assunto.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Corpo do e-mail</Label>
                <Controller
                    name="des_corpo_html"
                    control={control}
                    render={({ field }) => (
                        <HtmlEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholders={placeholders}
                        />
                    )}
                />
                {errors.des_corpo_html && (
                    <p className="text-sm text-destructive">{errors.des_corpo_html.message}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Controller
                    name="ind_ativo"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="ind_ativo" />
                    )}
                />
                <Label htmlFor="ind_ativo">Template ativo</Label>
            </div>

            <DialogFooter className="gap-2">
                <DialogClose>Fechar</DialogClose>
                {/* <Button type="button" variant="outline" onClick={handlePreview} disabled={previewing}>
                    <Eye className="mr-2 h-4 w-4" />
                    Pré-visualizar
                </Button> */}
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function TemplatePage() {
    // --- Empresa ---
    const { data: empresasRaw } = useEmpresas();
    const empresas = useMemo(
        () => (Array.isArray(empresasRaw?.dados) ? empresasRaw.dados : []),
        [empresasRaw]
    );
    const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
    const idEmpresa = empresaSelecionada ?? empresas[0]?.id ?? null;
    const nomeEmpresa = empresas.find((e) => e.id === idEmpresa)?.nom_fantasia;

    // --- Dados ---
    const { data, isLoading, error } = useTemplatesEmail(idEmpresa);
    const salvarMutation = useSalvarTemplateEmail(idEmpresa);
    const previewMutation = usePreviewTemplateEmail(idEmpresa);

    const placeholders = data?.dados?.placeholders ?? [];

    // Sempre 1 linha por evento, mesmo sem template cadastrado
    const linhas = useMemo<TemplateEmailLinha[]>(() => {
        const templates = data?.dados?.templates ?? [];
        return EVENTOS_TEMPLATE.map((evento) => {
            const t = templates.find((x) => x.ind_evento === evento);
            return {
                ind_evento: evento,
                id: t?.id ?? null,
                des_assunto: t?.des_assunto ?? '',
                des_corpo_html: t?.des_corpo_html ?? '',
                ind_ativo: t?.ind_ativo ?? 0,
                updated_at: t?.updated_at ?? null,
                configurado: !!t,
            };
        });
    }, [data]);

    // --- Estado de UI ---
    const [linhaEdicao, setLinhaEdicao] = useState<TemplateEmailLinha | null>(null);
    const [previewAberto, setPreviewAberto] = useState(false);

    const erroApi = (e: unknown, fallback: string) =>
        toast.error(e instanceof ApiError ? e.message : fallback);

    const abrirPreview = (evento: EventoTemplate, payload: TemplatePreviewInput) => {
        if (!idEmpresa) return;
        setPreviewAberto(true);
        previewMutation.mutate(
            { evento, data: payload },
            {
                onError: (e) => {
                    setPreviewAberto(false);
                    erroApi(e, 'Erro inesperado ao gerar a pré-visualização.');
                },
            }
        );
    };

    const handleSalvar = (payload: TemplateEmailInput) => {
        if (!linhaEdicao || !idEmpresa) return;
        salvarMutation.mutate(
            { evento: linhaEdicao.ind_evento, data: payload },
            {
                onSuccess: () => {
                    setLinhaEdicao(null);
                    toast.success('Template salvo com sucesso!');
                },
                onError: (e) => erroApi(e, 'Erro inesperado ao salvar o template.'),
            }
        );
    };

    const table = useReactTable({
        data: linhas,
        columns: templateColumns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onPreview: (t: TemplateEmailLinha) =>
                abrirPreview(t.ind_evento, {
                    des_assunto: t.des_assunto,
                    des_corpo_html: t.des_corpo_html,
                }),
            onEdit: (t: TemplateEmailLinha) => setLinhaEdicao(t),
        },
    });

    if (error) return <div className="p-6">Erro ao carregar templates.</div>;

    return (
        <div className="p-4 sm:p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Templates de E-mail</h1>
                    <p className="text-sm text-muted-foreground">
                        Personalize as mensagens enviadas em cada evento do agendamento.
                    </p>
                </div>

                <div className="w-full md:w-72 space-y-1">
                    <Label>Empresa</Label>
                    <Select
                        value={idEmpresa ? String(idEmpresa) : ''}
                        onValueChange={(v) => v && setEmpresaSelecionada(Number(v))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a empresa">{nomeEmpresa}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {empresas.map((e) => (
                                <SelectItem key={e.id} value={String(e.id)}>
                                    {e.nom_fantasia}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="min-w-0 overflow-hidden rounded-lg shadow-lg py-0">
                <CardContent className="p-0">
                    <div className="relative w-full min-w-0 overflow-auto">
                        <Table>
                            <TableHeader className="bg-background">
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className={header.column.columnDef.meta?.className}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading || !idEmpresa ? (
                                    <TableSkeleton columnsCount={templateColumns.length} rowsCount={3} />
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cell.column.columnDef.meta?.className}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog de cadastro/edição */}
            <Dialog open={!!linhaEdicao} onOpenChange={(open) => !open && setLinhaEdicao(null)}>
                <DialogContent className="w-[calc(100vw-1rem)] max-h-[92vh] overflow-y-auto sm:max-w-2xl lg:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {linhaEdicao ? EVENTOS_TEMPLATE_LABEL[linhaEdicao.ind_evento] : 'Template'}
                        </DialogTitle>
                        <DialogDescription>
                            {linhaEdicao?.configurado
                                ? 'Edite o assunto e o corpo do e-mail.'
                                : 'Este evento ainda não possui template. Preencha para cadastrar.'}
                            {linhaEdicao?.updated_at && ` Última edição: ${formatarData(linhaEdicao.updated_at)}.`}
                        </DialogDescription>
                    </DialogHeader>
                    {linhaEdicao && (
                        <TemplateForm
                            key={linhaEdicao.ind_evento}
                            defaultValues={{
                                des_assunto: linhaEdicao.des_assunto,
                                des_corpo_html: linhaEdicao.des_corpo_html,
                                ind_ativo: linhaEdicao.configurado ? linhaEdicao.ind_ativo === 1 : true,
                            }}
                            placeholders={placeholders}
                            submitting={salvarMutation.isPending}
                            previewing={previewMutation.isPending}
                            onSubmit={handleSalvar}
                            onPreview={(p) => abrirPreview(linhaEdicao.ind_evento, p)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de pré-visualização */}
            <Dialog
                open={previewAberto}
                onOpenChange={(open) => {
                    setPreviewAberto(open);
                    if (!open) previewMutation.reset();
                }}
            >
                <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-2xl lg:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Pré-visualização</DialogTitle>
                        <DialogDescription>
                            {previewMutation.data?.dados.assunto ?? 'Gerando pré-visualização...'}
                        </DialogDescription>
                    </DialogHeader>

                    {previewMutation.isPending ? (
                        <div className="h-[60vh] w-full animate-pulse rounded-md bg-muted" />
                    ) : (
                        previewMutation.data && (
                            <iframe
                                title="Pré-visualização do e-mail"
                                sandbox=""
                                srcDoc={previewMutation.data.dados.html}
                                className="h-[60vh] w-full rounded-md border bg-white"
                            />
                        )
                    )}

                    <DialogFooter>
                        <DialogClose>Fechar</DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
