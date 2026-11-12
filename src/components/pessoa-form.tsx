// app/(private)/parametros/Empresa/components/pessoa-form.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { pessoaSchema, PessoaInput } from '@/features/pessoas/schema';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { useEstados } from '@/features/parametrizacao/estados/hooks';
import { Eye, EyeOff } from 'lucide-react';
import { formatarCPF, formatarCEP, formatarTelefone, somenteDigitos } from '@/lib/utils/formatters';
import { buscarCep } from '@/lib/utils/cepService';
import { toast } from 'sonner';

export const PAPEIS_FORM = [
    { name: 'ind_paciente' as const, label: 'Paciente' },
    { name: 'ind_costureira' as const, label: 'Costureira' },
    { name: 'ind_medico' as const, label: 'Médico' },
    { name: 'ind_secretaria' as const, label: 'Secretária' },
    { name: 'ind_administrador' as const, label: 'Administrador' },
];

export function PessoaForm({
    defaultValues,
    onSubmit,
    submitting,
    readOnlyId,
    /** Se informado, esconde a seção de seleção de papéis e trava o valor (páginas por papel) */
    papelFixo,
}: {
    defaultValues: PessoaInput;
    onSubmit: (data: PessoaInput) => void;
    submitting?: boolean;
    readOnlyId?: number;
    papelFixo?: 'ind_medico' | 'ind_secretaria' | 'ind_costureira' | 'ind_paciente' | 'ind_administrador';
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

    const ehCostureira = watch('ind_costureira');
    const ehSecretaria = watch('ind_secretaria');
    const ehAdministrador = watch('ind_administrador');
    const cep = watch('num_cep');

    const precisaSenha = ehSecretaria || ehCostureira || ehAdministrador;

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

            const estadoEncontrado = estados.find(
                (e) => e.sgl_estado.toLowerCase() === resultado.uf.toLowerCase()
            );
            if (estadoEncontrado) setIdEstadoSelecionado(estadoEncontrado.id);

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

            {/* Papéis — ocultado quando papelFixo é informado (página específica de papel) */}
            {!papelFixo && (
                <div className="space-y-2">
                    <Label>Tipo de Pessoa</Label>
                    <div className="grid grid-cols-3 gap-4 p-3 border rounded-md">
                        {PAPEIS_FORM.map((papel) => (
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
            )}

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
                            setIdEstadoSelecionado(Number(value));
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
