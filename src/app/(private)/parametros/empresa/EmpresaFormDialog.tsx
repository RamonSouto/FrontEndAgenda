// app/(private)/parametros/empresa/EmpresaFormDialog.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { empresaSchema, EmpresaFormValues } from '@/features/parametrizacao/empresa/schema';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { useCriarEmpresa, useAtualizarEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { useEstados } from '@/features/parametrizacao/estados/hooks';
import { useCidades } from '@/features/parametrizacao/cidades/hooks';
import { buscarCep } from '@/lib/utils/cepService';
import { buscarCnpj } from '@/lib/utils/cnpjService';
import { formatarCNPJ, formatarCEP, formatarTelefone, formatarDataInput, somenteDigitos, formatarData } from '@/lib/utils/formatters';
import { HorariosEmpresaTable } from '@/app/(private)/parametros/empresa/HorariosEmpresaTable';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import { toast } from 'sonner';
import { ApiError } from '@/lib/http/errors';

interface EmpresaFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    empresa?: Empresa | null;
    onOpenChange: (open: boolean) => void;
}

export function EmpresaFormDialog({ open, mode, empresa, onOpenChange }: EmpresaFormDialogProps) {
    const { data: estadosRaw } = useEstados();
    const { data: cidadesRaw } = useCidades();
    const estados = useMemo(() => (Array.isArray(estadosRaw?.dados) ? estadosRaw.dados : []), [estadosRaw]);
    const cidades = useMemo(() => (Array.isArray(cidadesRaw?.dados) ? cidadesRaw.dados : []), [cidadesRaw]);

    const criarEmpresa = useCriarEmpresa();
    const atualizarEmpresa = useAtualizarEmpresa();

    const [buscandoCep, setBuscandoCep] = useState(false);
    const [buscandoCnpj, setBuscandoCnpj] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EmpresaFormValues>({
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            // ind_whatsapp_1: false,
            // ind_whatsapp_2: false,
            ind_ativo: true,
        },
    });

    const estadoSelecionado = watch('nom_estado');
    const cidadesFiltradas = useMemo(
        () => cidades.filter((c: any) => c.nom_estado === estadoSelecionado),
        [cidades, estadoSelecionado]
    );

    useEffect(() => {
        if (mode === 'edit' && empresa && cidades.length > 0) {
            const cidadeAtual = cidades.find((c: any) => c.id === empresa.id_cidade);
            reset({
                nom_fantasia: empresa.nom_fantasia,
                nom_razao_social: empresa.nom_razao_social,
                num_cnpj: empresa.num_cnpj,
                num_inscricao_estadual: empresa.num_inscricao_estadual ?? '',
                dta_abertura: formatarDataInput(empresa.dta_abertura),
                num_cep: empresa.num_cep,
                des_logradouro: empresa.des_logradouro,
                num_endereco: empresa.num_endereco ?? '',
                des_complemento: empresa.des_complemento ?? '',
                nom_bairro: empresa.nom_bairro,
                num_celular_1: empresa.num_celular_1,
                ind_whatsapp_1: !!empresa.ind_whatsapp_1,
                num_celular_2: empresa.num_celular_2 ?? '',
                ind_whatsapp_2: !!empresa.ind_whatsapp_2,
                des_email_1: empresa.des_email_1,
                des_email_2: empresa.des_email_2 ?? '',
                val_cor_principal: empresa.val_cor_principal ?? '#999999',
                nom_estado: empresa.nom_estado ?? '',
                id_cidade: empresa.id_cidade,
                ind_ativo: !!empresa.ind_ativo,
                des_url_logo_vertical: empresa.des_url_logo_vertical ?? null,
                des_url_logo_horizontal: empresa.des_url_logo_horizontal ?? null,
                des_url_logo_vertical_negativa: empresa.des_url_logo_vertical_negativa ?? null,
                des_url_logo_horizontal_negativa: empresa.des_url_logo_horizontal_negativa ?? null,
            } as EmpresaFormValues);
        } else if (mode === 'create') {
            reset({
                ind_whatsapp_1: false,
                ind_whatsapp_2: false,
                ind_ativo: true,
                val_cor_principal: '#ffffff',
                des_url_logo_vertical: null,
                des_url_logo_horizontal: null,
                des_url_logo_vertical_negativa: null,
                des_url_logo_horizontal_negativa: null,
            } as EmpresaFormValues);
        }
    }, [mode, empresa, cidades, reset]);

    // Busca CEP
    const handleCepBlur = async (cepValue: string) => {
        const digits = somenteDigitos(cepValue);
        if (digits.length !== 8) return;
        setBuscandoCep(true);
        try {
            const resultado = await buscarCep(digits);
            if (resultado) {
                setValue('des_logradouro', resultado.logradouro);
                setValue('des_complemento', resultado.complemento);
                setValue('nom_bairro', resultado.bairro);
                setValue('nom_estado', resultado.estado || resultado.uf);
                // pequena espera para a lista de cidades filtrar antes de setar
                setTimeout(() => {
                    const cidadeEncontrada = cidades.find(
                        (c: any) => c.nom_cidade?.toLowerCase() === resultado.cidade.toLowerCase()
                    );
                    if (cidadeEncontrada) setValue('id_cidade', cidadeEncontrada.id);
                }, 0);
            }
        } finally {
            setBuscandoCep(false);
        }
    };

    // Busca CNPJ
    const handleCnpjBlur = async (cnpjValue: string) => {
        const digits = somenteDigitos(cnpjValue);
        if (digits.length !== 14) return;
        setBuscandoCnpj(true);
        try {
            const resultado = await buscarCnpj(digits);
            if (resultado) {
                setValue('nom_razao_social', resultado.razao_social);
                setValue('nom_fantasia', resultado.nome_fantasia);
                setValue('dta_abertura', resultado.dta_abertura);
                if (resultado.cep) {
                    setValue('num_cep', resultado.cep);
                    await handleCepBlur(resultado.cep);
                }
                setValue('num_endereco', resultado.numero);
                setValue('des_email_1', resultado.email ?? '');
                if (resultado.telefone_1) setValue('num_celular_1', resultado.telefone_1);
            }
        } finally {
            setBuscandoCnpj(false);
        }
    };

    const onSubmit = async (values: EmpresaFormValues) => {
        try {
            if (mode === 'create') {
                await criarEmpresa.mutateAsync(values);
                toast.success('Empresa cadastrado com sucesso!')
            } else if (empresa) {
                await atualizarEmpresa.mutateAsync({ id: empresa.id, payload: values });
                toast.success('Cadastrado de empresa atualizado com sucesso!')
            }
            onOpenChange(false);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.isValidation && error.details) {
                    // Exibe cada erro de campo retornado pelo backend
                    Object.entries(error.details).forEach(([campo, mensagens]) => {
                        mensagens.forEach((msg) => toast.error(`${campo}: ${msg}`));
                    });
                } else {
                    toast.error({ title: 'Error', description: error.message, variant: 'destructive' });
                }
            } else {
                toast.error('Erro inesperado ao salvar a empresa.');
            }
        }

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xs md:max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 scrollbar-gutter-stable scroll-smooth scrollbar-thin scrollbar-thumb-primary">
                <DialogHeader>
                    <DialogTitle>Empresa</DialogTitle>
                    <DialogDescription>
                        Preenchas os campos corretamente para cadastrar uma nova empresa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {mode === 'edit' && empresa && (
                        <div>
                            <Label>ID</Label>
                            <Input disabled value={empresa.id} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>CNPJ {buscandoCnpj && '(buscando...)'}</Label>
                            <Controller
                                control={control}
                                name="num_cnpj"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={formatarCNPJ(field.value ?? '')}
                                        onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            handleCnpjBlur(e.target.value);
                                        }}
                                        maxLength={18}
                                        placeholder="99.999.999/9999-99"
                                    />
                                )}
                            />
                            {errors.num_cnpj && <p className="text-sm text-destructive">{errors.num_cnpj.message}</p>}
                        </div>

                        <div>
                            <Label>I.E.</Label>
                            <Input {...register('num_inscricao_estadual')} />
                        </div>

                        <div>
                            <Label>Nome Fantasia</Label>
                            <Input {...register('nom_fantasia')} />
                            {errors.nom_fantasia && <p className="text-sm text-destructive">{errors.nom_fantasia.message}</p>}
                        </div>
                        <div>
                            <Label>Razão Social</Label>
                            <Input {...register('nom_razao_social')} />
                            {errors.nom_razao_social && <p className="text-sm text-destructive">{errors.nom_razao_social.message}</p>}
                        </div>

                        <div>
                            <Label>Data de Abertura</Label>
                            <Input type="date" {...register('dta_abertura')} />
                            {errors.dta_abertura && <p className="text-sm text-destructive">{errors.dta_abertura.message}</p>}
                        </div>

                        <div>
                            <Label>CEP {buscandoCep && '(buscando...)'}</Label>
                            <Controller
                                control={control}
                                name="num_cep"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={formatarCEP(field.value ?? '')}
                                        onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            handleCepBlur(e.target.value);
                                        }}
                                        maxLength={9}
                                        placeholder="99999-999"
                                    />
                                )}
                            />
                            {errors.num_cep && <p className="text-sm text-destructive">{errors.num_cep.message}</p>}
                        </div>

                        <div>
                            <Label>Logradouro</Label>
                            <Input {...register('des_logradouro')} />
                        </div>
                        <div>
                            <Label>Número</Label>
                            <Input {...register('num_endereco')} />
                        </div>
                        <div>
                            <Label>Complemento</Label>
                            <Input {...register('des_complemento')} />
                        </div>
                        <div>
                            <Label>Bairro</Label>
                            <Input {...register('nom_bairro')} />
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <Label>Celular 1</Label>
                                <Controller
                                    control={control}
                                    name="num_celular_1"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={formatarTelefone(field.value ?? '')}
                                            onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                            placeholder="(99) 9 9999-9999"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Controller
                                    control={control}
                                    name="ind_whatsapp_1"
                                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label>WhatsApp</Label>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <Label>Celular 2</Label>
                                <Controller
                                    control={control}
                                    name="num_celular_2"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={formatarTelefone(field.value ?? '')}
                                            onChange={(e) => field.onChange(somenteDigitos(e.target.value))}
                                            placeholder="(99) 9 9999-9999"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Controller
                                    control={control}
                                    name="ind_whatsapp_2"
                                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                />
                                <Label>WhatsApp</Label>
                            </div>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" {...register('des_email_1')} placeholder="contato@empresa.com.br" />
                            {errors.des_email_1 && <p className="text-sm text-destructive">{errors.des_email_1.message}</p>}
                        </div>
                        <div>
                            <Label>Email 2</Label>
                            <Input type="email" {...register('des_email_2')} placeholder="contato@empresa.com.br" />
                        </div>

                        <div>
                            <Label>Estado</Label>
                            <Controller
                                control={control}
                                name="nom_estado"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue('id_cidade', undefined as any); }}>
                                        <SelectTrigger className="w-full">
                                            {field.value || 'Selecione o estado'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {estados.map((estado: any) => (
                                                <SelectItem key={estado.id} value={estado.nom_estado}>
                                                    {estado.nom_estado}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.nom_estado && <p className="text-sm text-destructive">{errors.nom_estado.message}</p>}
                        </div>

                        <div>
                            <Label>Cidade</Label>
                            <Controller
                                control={control}
                                name="id_cidade"
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        disabled={!estadoSelecionado}
                                    >
                                        <SelectTrigger className="w-full">
                                            {cidadesFiltradas.find((c: any) => c.id === field.value)?.nom_cidade || 'Selecione a cidade'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cidadesFiltradas.map((cidade: any) => (
                                                <SelectItem key={cidade.id} value={String(cidade.id)}>
                                                    {cidade.nom_cidade}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.id_cidade && <p className="text-sm text-destructive">{errors.id_cidade.message as string}</p>}
                        </div>

                        <div>
                            <Label>Cor principal logo</Label>
                            <Controller
                                control={control}
                                name="val_cor_principal"
                                render={({ field }) => (
                                    <Input
                                        type="color"
                                        value={`#${(field.value ?? '999999').replace('#', '')}`}
                                        onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <Controller
                                control={control}
                                name="ind_ativo"
                                render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                            />
                            <Label>Status</Label>
                        </div>
                        {/* NOVOS CAMPOS DE IMAGEM */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                control={control}
                                name="des_url_logo_vertical"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Vertical"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="square"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="des_url_logo_vertical_negativa"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Vertical Negativa"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="square"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="des_url_logo_horizontal"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Horizontal"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="wide"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="des_url_logo_horizontal_negativa"
                                render={({ field }) => (
                                    <ImageUploadField
                                        label="Logo Horizontal Negativa"
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspect="wide"
                                    />
                                )}
                            />
                        </div>

                        {mode === 'edit' && empresa && (
                            <>
                                <div>
                                    <Label>Criado</Label>
                                    <Input disabled value={formatarData(empresa.created_at)} />
                                </div>
                                <div>
                                    <Label>Editado</Label>
                                    <Input disabled value={empresa.updated_ad ? formatarData(empresa.updated_ad) : ''} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* {mode === 'edit' && empresa && (
                        <div className="pt-4">
                            <HorariosEmpresaTable idEmpresa={empresa.id} />
                        </div>
                    )} */}

                    <DialogFooter>
                        <DialogClose variant="outline">Fechar</DialogClose>
                        <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
