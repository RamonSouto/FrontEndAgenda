// app/(private)/pessoas/pessoas/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    usePessoas,
    useCriarPessoa,
    useAtualizarPessoa,
    useDeletarPessoa,
    useAtivarPessoa,
    useDesativarPessoa,
} from '@/features/pessoas/hooks';
import { pessoaSchema, PessoaInput } from '@/features/pessoas/schema';
import { Pessoa } from '@/features/pessoas/types';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { pessoaColumns, PAPEIS_CONFIG } from './columns';
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
import { Columns, Funnel, Plus, Eye, EyeOff } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatarData, formatarCPF, formatarCEP, formatarTelefone, somenteDigitos } from '@/lib/utils/formatters';
import { buscarCep } from '@/lib/utils/cepService';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';
import { useEstados } from '@/features/parametrizacao/estados/hooks';

const DEFAULT_FORM: PessoaInput = {
    id_cidade: 0,
    ind_status: 'ativo',
    nom_completo: '',
    num_cpf: '',
    num_rg: '',
    dta_nascimento: '',
    des_logradouro: '',
    num_endereco: '',
    des_complemento: '',
    num_cep: '',
    nom_bairro: '',
    num_celular_1: '',
    ind_whatsapp_1: true,
    num_celular_2: '',
    ind_whatsapp_2: true,
    des_email_1: '',
    des_email_2: '',
    des_senha: '',
    ind_medico: false,
    ind_secretaria: false,
    ind_costureira: false,
    ind_paciente: false,
    ind_administrador: false,
    val_cor_hex: '',
};

// --- Formulário reutilizado para criar/editar ---
function PessoaForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
}: {
    defaultValues: PessoaInput;
    onSubmit: (data: PessoaInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
}) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PessoaInput>({
        resolver: zodResolver(pessoaSchema),
        defaultValues,
    });

    const { data: cidadesResp } = useCidades();
    const cidades = useMemo(() => cidadesResp?.dados ?? [], [cidadesResp]);

    const { data: estadosResp } = useEstados();
    const estados = useMemo(() => estadosResp?.dados ?? [], [estadosResp]);

    const [idEstadoSelecionado, setIdEstadoSelecionado] = useState<number | null>(null);

    useEffect(() => {
        const idCidadeAtual = defaultValues.id_cidade;
        if (idCidadeAtual && cidades.length > 0 && idEstadoSelecionado === null) {
            const cidadeAtual = cidades.find((c) => c.id === idCidadeAtual);
            if (cidadeAtual) setIdEstadoSelecionado(cidadeAtual.id_estado);
        }
    }, [cidades, defaultValues.id_cidade, idEstadoSelecionado]);

    const cidadesFiltradas = useMemo(
        () => cidades.filter((c) => c.id_estado === idEstadoSelecionado),
        [cidades, idEstadoSelecionado]
    );

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);
    const [estadoBusca, setEstadoBusca] = useState<{ nom_estado: string; sgl_estado: string } | null>(null);

    const ehMedico = watch('ind_medico');
    const ehSecretaria = watch('ind_secretaria');
    const ehCostureira = watch('ind_costureira');
    const ehPaciente = watch('ind_paciente');
    const ehAdministrador = watch('ind_administrador');
    const cep = watch('num_cep');

    // Libera senha para papéis administrativos
    const precisaSenha = ehSecretaria || ehCostureira || ehAdministrador;

    // Busca CEP automaticamente quando completar 8 dígitos
    const handleCepBlur = async () => {
        const cepLimpo = somenteDigitos(cep || '');
        if (cepLimpo.length !== 8) return;

        setBuscandoCep(true);
        try {
            const resultado = await buscarCep(cepLimpo);
            if (!resultado) {
                toast.error('CEP não encontrado.');
                return;
            }

            setValue('des_logradouro', resultado.logradouro);
            setValue('nom_bairro', resultado.bairro);

            // Localiza o estado retornado na lista de estados cadastrados
            const estadoEncontrado = estados.find(
                (e) => e.sgl_estado.toLowerCase() === resultado.uf.toLowerCase()
            );

            if (estadoEncontrado) {
                setIdEstadoSelecionado(estadoEncontrado.id);
            }

            // Tenta casar a cidade retornada com a lista de cidades cadastradas (por nome + UF)
            const cidadeEncontrada = cidades.find(
                (c) =>
                    c.nom_cidade.toLowerCase() === resultado.cidade.toLowerCase() &&
                    c.sgl_estado.toLowerCase() === resultado.uf.toLowerCase()
            );

            if (cidadeEncontrada) {
                setValue('id_cidade', cidadeEncontrada.id);
                setIdEstadoSelecionado(cidadeEncontrada.id_estado);
            } else {
                setValue('id_cidade', 0);
                toast.warning(
                    `Cidade "${resultado.cidade} - ${resultado.uf}" não encontrada na base. Selecione manualmente.`
                );
            }
        } catch {
            toast.error('Erro ao buscar CEP.');
        } finally {
            setBuscandoCep(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {readOnlyId !== undefined && (
                <div className="space-y-1">
                    <Label>ID</Label>
                    <Input value={readOnlyId} disabled />
                </div>
            )}

            {/* Papéis */}
            <div className="space-y-2">
                <Label>Tipo de Pessoa</Label>
                <div className="grid grid-cols-3 gap-4 p-3 border rounded-md">
                    {[
                        { name: 'ind_paciente' as const, label: 'Paciente' },
                        { name: 'ind_costureira' as const, label: 'Costureira' },
                        { name: 'ind_medico' as const, label: 'Médico' },
                        { name: 'ind_secretaria' as const, label: 'Secretária' },
                        { name: 'ind_administrador' as const, label: 'Administrador' },
                    ].map((papel) => (
                        <Controller
                            key={papel.name}
                            name={papel.name}
                            control={control}
                            render={({ field }) => (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                                    <span className="text-sm">{papel.label}</span>
                                </label>
                            )}
                        />
                    ))}
                </div>
                {errors.ind_medico && (
                    <p className="text-sm text-destructive">{errors.ind_medico.message}</p>
                )}
            </div>

            {/* Dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                    <Label>Nome Completo</Label>
                    <Controller
                        name="nom_completo"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: Maria da Silva" />}
                    />
                    {errors.nom_completo && (
                        <p className="text-sm text-destructive">{errors.nom_completo.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>CPF</Label>
                    <Controller
                        name="num_cpf"
                        control={control}
                        render={({ field }) => (
                            <Input
                                value={formatarCPF(field.value || '')}
                                onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 11))}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        )}
                    />
                    {errors.num_cpf && <p className="text-sm text-destructive">{errors.num_cpf.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>RG</Label>
                    <Controller
                        name="num_rg"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: 1234567" />}
                    />
                    {errors.num_rg && <p className="text-sm text-destructive">{errors.num_rg.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Data de Nascimento</Label>
                    <Controller
                        name="dta_nascimento"
                        control={control}
                        render={({ field }) => <Input {...field} type="date" />}
                    />
                    {errors.dta_nascimento && (
                        <p className="text-sm text-destructive">{errors.dta_nascimento.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Status</Label>
                    <Controller
                        name="ind_status"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>CEP</Label>
                    <Controller
                        name="num_cep"
                        control={control}
                        render={({ field }) => (
                            <Input
                                value={formatarCEP(field.value || '')}
                                onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 8))}
                                onBlur={handleCepBlur}
                                placeholder="00.000-000"
                                maxLength={10}
                                disabled={buscandoCep}
                            />
                        )}
                    />
                    {buscandoCep && <p className="text-xs text-muted-foreground">Buscando endereço...</p>}
                    {errors.num_cep && <p className="text-sm text-destructive">{errors.num_cep.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Estado</Label>
                    <Select
                        value={idEstadoSelecionado ? String(idEstadoSelecionado) : ''}
                        onValueChange={(value) => {
                            const novoId = Number(value);
                            setIdEstadoSelecionado(novoId);
                            // Ao trocar o estado, limpa a cidade selecionada (evita inconsistência)
                            setValue('id_cidade', 0);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o estado">
                                {estados.find((e) => e.id === idEstadoSelecionado)?.nom_estado}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {estados.map((e) => (
                                <SelectItem key={e.id} value={String(e.id)}>
                                    {e.nom_estado} ({e.sgl_estado})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label>Cidade</Label>
                    <Controller
                        name="id_cidade"
                        control={control}
                        render={({ field }) => {
                            const cidadeAtual = cidades.find((c) => c.id === field.value);
                            return (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    disabled={!idEstadoSelecionado}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={idEstadoSelecionado ? 'Selecione a cidade' : 'Selecione o estado primeiro'}>
                                            {cidadeAtual?.nom_cidade}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cidadesFiltradas.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.nom_cidade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        }}
                    />
                    {errors.id_cidade && (
                        <p className="text-sm text-destructive">{errors.id_cidade.message}</p>
                    )}
                </div>

                <div className="space-y-1 md:col-span-2">
                    <Label>Logradouro</Label>
                    <Controller
                        name="des_logradouro"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: Rua das Flores" />}
                    />
                    {errors.des_logradouro && (
                        <p className="text-sm text-destructive">{errors.des_logradouro.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Número</Label>
                    <Controller
                        name="num_endereco"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: 123" />}
                    />
                    {errors.num_endereco && (
                        <p className="text-sm text-destructive">{errors.num_endereco.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Complemento</Label>
                    <Controller
                        name="des_complemento"
                        control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Ex: Apto 101" />}
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <Label>Bairro</Label>
                    <Controller
                        name="nom_bairro"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Ex: Setor Bueno" />}
                    />
                    {errors.nom_bairro && (
                        <p className="text-sm text-destructive">{errors.nom_bairro.message}</p>
                    )}
                </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Celular 1</Label>
                    <div className="flex items-center gap-4">
                        <Controller
                            name="num_celular_1"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    value={formatarTelefone(field.value || '')}
                                    onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 11))}
                                    placeholder="(00) 0 0000-0000"
                                    maxLength={16}
                                />
                            )}
                        />
                        <Controller
                            name="ind_whatsapp_1"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                    <span className="text-xs text-muted-foreground">WhatsApp</span>
                                </div>
                            )}
                        />
                    </div>
                    {errors.num_celular_1 && (
                        <p className="text-sm text-destructive">{errors.num_celular_1.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>Celular 2</Label>
                    <div className="flex items-center gap-4">
                        <Controller
                            name="num_celular_2"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    value={formatarTelefone(field.value || '')}
                                    onChange={(e) => field.onChange(somenteDigitos(e.target.value).slice(0, 11))}
                                    placeholder="(00) 0 0000-0000"
                                    maxLength={16}
                                />
                            )}
                        />
                        <Controller
                            name="ind_whatsapp_2"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                    <span className="text-xs text-muted-foreground">WhatsApp</span>
                                </div>
                            )}
                        />
                    </div>
                    {errors.num_celular_2 && (
                        <p className="text-sm text-destructive">{errors.num_celular_2.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>E-mail 1</Label>
                    <Controller
                        name="des_email_1"
                        control={control}
                        render={({ field }) => <Input {...field} type="email" placeholder="Ex: nome@email.com" />}
                    />
                    {errors.des_email_1 && (
                        <p className="text-sm text-destructive">{errors.des_email_1.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label>E-mail 2</Label>
                    <Controller
                        name="des_email_2"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} value={field.value ?? ''} type="email" placeholder="Ex: alternativo@email.com" />
                        )}
                    />
                    {errors.des_email_2 && (
                        <p className="text-sm text-destructive">{errors.des_email_2.message}</p>
                    )}
                </div>
            </div>

            {/* Senha - somente para papéis com acesso ao sistema */}
            {precisaSenha && (
                <div className="space-y-1">
                    <Label>Senha {readOnlyId !== undefined && '(deixe em branco para manter a atual)'}</Label>
                    <div className="relative">
                        <Controller
                            name="des_senha"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    type={mostrarSenha ? 'text' : 'password'}
                                    placeholder="Mínimo 6 caracteres"
                                    className="pr-10"
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.des_senha && (
                        <p className="text-sm text-destructive">{errors.des_senha.message}</p>
                    )}
                </div>
            )}

            {/* Cor - somente para costureira */}
            {ehCostureira && (
                <div className="space-y-1">
                    <Label>Cor de Identificação</Label>
                    <Controller
                        name="val_cor_hex"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={field.value ? `#${field.value}` : '#ffffff'}
                                    onChange={(e) => field.onChange(e.target.value.replace('#', '').toUpperCase())}
                                    className="h-9 w-14 rounded border cursor-pointer"
                                />
                                <Input
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value.replace('#', '').toUpperCase())}
                                    placeholder="FFFFFF"
                                    maxLength={6}
                                    className="w-32"
                                />
                            </div>
                        )}
                    />
                    {errors.val_cor_hex && (
                        <p className="text-sm text-destructive">{errors.val_cor_hex.message}</p>
                    )}
                </div>
            )}

            <DialogFooter>
                <DialogClose>Fechar</DialogClose>
                <Button type="submit" disabled={submitting}>
                    Salvar
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function PessoaPage() {
    const { data: pessoasResp, isLoading, error } = usePessoas();
    const pessoas = useMemo(() => pessoasResp?.dados ?? [], [pessoasResp]);

    const criarMutation = useCriarPessoa();
    const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
    const atualizarMutation = useAtualizarPessoa(pessoaSelecionada?.id ?? 0);
    const deletarMutation = useDeletarPessoa();
    const ativarMutation = useAtivarPessoa();
    const desativarMutation = useDesativarPessoa();

    const [dialogCriarAberto, setDialogCriarAberto] = useState(false);
    const [dialogEditarAberto, setDialogEditarAberto] = useState(false);
    const [dialogVisualizarAberto, setDialogVisualizarAberto] = useState(false);
    const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = useMemo(() => {
        const opcoesColunas = pessoaColumns
            .filter((col) => 'accessorKey' in col && col.id !== 'id' && col.id !== 'acoes')
            .map((col) => ({
                value: (col as any).accessorKey as string,
                label: col.meta?.label ?? col.id,
            }));

        return [...opcoesColunas, { value: 'papeis', label: 'Papéis' }];
    }, []);

    const [filterField, setFilterField] = useState(filterOptions[0]?.value || '');
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        if (filterField && value) {
            setColumnFilters([{ id: filterField, value }]);
        } else {
            setColumnFilters([]);
        }
    };

    const clearFilters = () => {
        setFilterValue('');
        setColumnFilters([]);
    };

    const table = useReactTable({
        data: pessoas,
        columns: pessoaColumns,
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
            onView: (pessoa: Pessoa) => {
                setPessoaSelecionada(pessoa);
                setDialogVisualizarAberto(true);
            },
            onEdit: (pessoa: Pessoa) => {
                setPessoaSelecionada(pessoa);
                setDialogEditarAberto(true);
            },
            onDelete: (pessoa: Pessoa) => {
                setPessoaParaDeletar(pessoa);
            },
            onAtivar: (pessoa: Pessoa) => {
                ativarMutation.mutate(pessoa.id, {
                    onSuccess: () => toast.success('Pessoa ativada com sucesso!'),
                    onError: (error) =>
                        toast.error(error instanceof ApiError ? error.message : 'Erro ao ativar pessoa.'),
                });
            },
            onDesativar: (pessoa: Pessoa) => {
                desativarMutation.mutate(pessoa.id, {
                    onSuccess: () => toast.success('Pessoa desativada com sucesso!'),
                    onError: (error) =>
                        toast.error(error instanceof ApiError ? error.message : 'Erro ao desativar pessoa.'),
                });
            },
        },
    });

    // Converte dados do formulário (boolean) para o payload (mantém boolean; API aceita boolean no create/update)
    const handleCriar = (data: PessoaInput) => {
        criarMutation.mutate(data, {
            onSuccess: () => {
                setDialogCriarAberto(false);
                toast.success('Pessoa cadastrada com sucesso');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao cadastrar a pessoa.');
            },
        });
    };

    const handleAtualizar = (data: PessoaInput) => {
        // Se a senha ficou vazia na edição, remove do payload para não sobrescrever
        const payload = { ...data };
        if (!payload.des_senha) delete payload.des_senha;

        atualizarMutation.mutate(payload, {
            onSuccess: () => {
                setDialogEditarAberto(false);
                setPessoaSelecionada(null);
                toast.success('Pessoa atualizada com sucesso!');
            },
            onError: (error) => {
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao atualizar a pessoa.');
            },
        });
    };

    const confirmarDelecao = () => {
        if (!pessoaParaDeletar) return;
        deletarMutation.mutate(pessoaParaDeletar.id, {
            onSuccess: () => {
                setPessoaParaDeletar(null);
                toast.success('Pessoa deletada com sucesso!');
            },
            onError: (error) => {
                setPessoaParaDeletar(null);
                toast.error(error instanceof ApiError ? error.message : 'Erro inesperado ao deletar a pessoa.');
            },
        });
    };

    if (error) return <div>Erro ao carregar pessoas.</div>;

    return (
        <div className="p-6 space-y-4 min-w-0 max-w-full overflow-x-hidden">
            <div className="text-2xl font-bold">Pessoa</div>

            <div className="flex justify-between flex-wrap items-center gap-4 mb-4">
                <Dialog open={dialogCriarAberto} onOpenChange={setDialogCriarAberto}>
                    <DialogTrigger
                        render={
                            <Button size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Nova Pessoa
                            </Button>
                        }
                    />
                    <DialogContent className="max-w-xs md:max-w-[90vw] max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Pessoa</DialogTitle>
                            <DialogDescription>
                                Preencha os campos corretamente para cadastrar uma nova pessoa.
                            </DialogDescription>
                        </DialogHeader>

                        <PessoaForm
                            defaultValues={DEFAULT_FORM}
                            onSubmit={handleCriar}
                            submitting={criarMutation.isPending}
                        />
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
                        <Select value={filterField}
                            onValueChange={(value) => {
                                setFilterField(value);
                                setFilterValue('');
                                setColumnFilters([])
                            }}>
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
                        {filterField === 'papeis' ? (
                            <Select
                                value={filterField}
                                onValueChange={(value) => {
                                    setFilterValue(value);
                                    setColumnFilters([{ id: 'papeis', value }])
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o papel">
                                        {PAPEIS_CONFIG.find((p) => p.key === filterValue)?.label}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {PAPEIS_CONFIG.map((p) => (
                                        <SelectItem key={p.key} value={p.key}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                placeholder={`Filtrar por ${filterOptions.find((o) => o.value === filterField)?.label || '...'}`}
                                value={filterValue}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-full"
                            />
                        )}
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
                                    <TableSkeleton columnsCount={pessoaColumns.length} rowsCount={6} />
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={pessoaColumns.length} className="text-center py-4">
                                            Nenhuma pessoa encontrada.
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
                    if (!open) setPessoaSelecionada(null);
                }}
            >
                <DialogContent className="max-w-xs md:max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Pessoa</DialogTitle>
                        <DialogDescription>Preencha os campos corretamente para editar a pessoa.</DialogDescription>
                    </DialogHeader>
                    {pessoaSelecionada && (
                        <PessoaForm
                            defaultValues={{
                                id_cidade: pessoaSelecionada.id_cidade,
                                ind_status: pessoaSelecionada.ind_status,
                                nom_completo: pessoaSelecionada.nom_completo,
                                num_cpf: pessoaSelecionada.num_cpf,
                                num_rg: pessoaSelecionada.num_rg,
                                dta_nascimento: pessoaSelecionada.dta_nascimento?.slice(0, 10) ?? '',
                                des_logradouro: pessoaSelecionada.des_logradouro,
                                num_endereco: pessoaSelecionada.num_endereco,
                                des_complemento: pessoaSelecionada.des_complemento,
                                num_cep: pessoaSelecionada.num_cep,
                                nom_bairro: pessoaSelecionada.nom_bairro,
                                num_celular_1: pessoaSelecionada.num_celular_1,
                                ind_whatsapp_1: !!pessoaSelecionada.ind_whatsapp_1,
                                num_celular_2: pessoaSelecionada.num_celular_2,
                                ind_whatsapp_2: !!pessoaSelecionada.ind_whatsapp_2,
                                des_email_1: pessoaSelecionada.des_email_1,
                                des_email_2: pessoaSelecionada.des_email_2,
                                des_senha: '',
                                ind_medico: !!pessoaSelecionada.ind_medico,
                                ind_secretaria: !!pessoaSelecionada.ind_secretaria,
                                ind_costureira: !!pessoaSelecionada.ind_costureira,
                                ind_paciente: !!pessoaSelecionada.ind_paciente,
                                ind_administrador: !!pessoaSelecionada.ind_administrador,
                                val_cor_hex: pessoaSelecionada.val_cor_hex,
                            }}
                            onSubmit={handleAtualizar}
                            submitting={atualizarMutation.isPending}
                            readOnlyId={pessoaSelecionada.id}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de visualização */}
            <Dialog
                open={dialogVisualizarAberto}
                onOpenChange={(open) => {
                    setDialogVisualizarAberto(open);
                    if (!open) setPessoaSelecionada(null);
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Pessoa</DialogTitle>
                        <DialogDescription>Detalhes da pessoa selecionada.</DialogDescription>
                    </DialogHeader>
                    {pessoaSelecionada && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>ID</Label>
                                    <Input value={pessoaSelecionada.id} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <Input value={pessoaSelecionada.ind_status} disabled />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Nome Completo</Label>
                                <Input value={pessoaSelecionada.nom_completo} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>CPF</Label>
                                    <Input value={formatarCPF(pessoaSelecionada.num_cpf)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>RG</Label>
                                    <Input value={pessoaSelecionada.num_rg} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Celular 1</Label>
                                    <Input value={formatarTelefone(pessoaSelecionada.num_celular_1)} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>E-mail 1</Label>
                                    <Input value={pessoaSelecionada.des_email_1} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Cidade</Label>
                                    <Input value={pessoaSelecionada.nom_cidade ?? '-'} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Estado</Label>
                                    <Input value={pessoaSelecionada.sgl_estado ?? '-'} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Criado</Label>
                                    <Input
                                        value={pessoaSelecionada.created_at ? formatarData(pessoaSelecionada.created_at) : '-'}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Editado</Label>
                                    <Input
                                        value={pessoaSelecionada.updated_at ? formatarData(pessoaSelecionada.updated_at) : '-'}
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
            <AlertDialog open={!!pessoaParaDeletar} onOpenChange={(open) => !open && setPessoaParaDeletar(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar pessoa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar esta pessoa? Essa ação não pode ser desfeita.
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
