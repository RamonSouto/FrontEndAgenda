// app/(private)/parametros/Empresa/components/EmpresaForm.tsx

'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmpresaCreateInput, empresaCreateSchema } from '@/features/parametrizacao/empresa/schema';
import { Empresa } from '@/features/parametrizacao/empresa/types';
import { useCreateEmpresa, useUpdateEmpresa } from '@/features/parametrizacao/empresa/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { buscarCep } from '@/lib/utils/cepService';
import { buscarCnpj } from '@/lib/utils/cnpjService';
import { toast } from 'sonner';

interface EmpresaFormProps {
    initialData?: Empresa | null;
    onSuccess: () => void;
    onCancel: () => void;
    cidades: any[]; // tipo Cidade
    estados: any[]; // tipo Estado
}

export function EmpresaForm({
    initialData,
    onSuccess,
    onCancel,
    cidades,
    estados,
}: EmpresaFormProps) {
    const createMutation = useCreateEmpresa();
    const updateMutation = useUpdateEmpresa();
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues: EmpresaCreateInput = initialData
        ? {
            id_cidade: initialData.id_cidade,
            ind_ativo: initialData.ind_ativo === 1,
            nom_fantasia: initialData.nom_fantasia,
            nom_razao_social: initialData.nom_razao_social,
            num_cnpj: initialData.num_cnpj,
            num_inscricao_estadual: initialData.num_inscricao_estadual || undefined,
            dta_abertura: initialData.dta_abertura,
            des_logradouro: initialData.des_logradouro,
            num_endereco: initialData.num_endereco || undefined,
            des_complemento: initialData.des_complemento || undefined,
            num_cep: initialData.num_cep,
            nom_bairro: initialData.nom_bairro,
            num_celular_1: initialData.num_celular_1,
            ind_whatsapp_1: initialData.ind_whatsapp_1 === 1,
            num_celular_2: initialData.num_celular_2 || undefined,
            ind_whatsapp_2: initialData.ind_whatsapp_2 === 1,
            des_email_1: initialData.des_email_1,
            des_email_2: initialData.des_email_2 || undefined,
            val_cor_principal: initialData.val_cor_principal || undefined,
        }
        : {
            id_cidade: 0,
            ind_ativo: true,
            nom_fantasia: '',
            nom_razao_social: '',
            num_cnpj: '',
            num_inscricao_estadual: '',
            dta_abertura: '',
            des_logradouro: '',
            num_endereco: '',
            des_complemento: '',
            num_cep: '',
            nom_bairro: '',
            num_celular_1: '',
            ind_whatsapp_1: false,
            num_celular_2: '',
            ind_whatsapp_2: false,
            des_email_1: '',
            des_email_2: '',
            val_cor_principal: '',
        };

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<EmpresaCreateInput>({
        resolver: zodResolver(empresaCreateSchema),
        defaultValues,
    });

    // Preencher cidade a partir do estado selecionado (filtro)
    const selectedEstado = watch('nom_estado'); // vamos adicionar campo nom_estado no schema? Melhor usar id_cidade diretamente

    // Para simplificar, vamos usar um estado local para controle de cidade e estado
    const [estadoId, setEstadoId] = useState<number | null>(null);
    const [cidadesFiltradas, setCidadesFiltradas] = useState(cidades);

    useEffect(() => {
        if (estadoId) {
            setCidadesFiltradas(cidades.filter((c) => c.id_estado === estadoId));
        } else {
            setCidadesFiltradas(cidades);
        }
    }, [estadoId, cidades]);

    // Busca CEP
    const handleCepBlur = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setIsLoading(true);
            const result = await buscarCep(cleanCep);
            setIsLoading(false);
            if (result) {
                setValue('num_cep', result.cep);
                setValue('des_logradouro', result.logradouro);
                setValue('nom_bairro', result.bairro);
                setValue('des_complemento', result.complemento || '');
                // Encontrar estado pelo UF
                const estadoEncontrado = estados.find((e) => e.sgl_estado === result.uf);
                if (estadoEncontrado) {
                    setEstadoId(estadoEncontrado.id);
                    // Se houver cidade, preencher id_cidade (precisa filtrar)
                    const cidadeEncontrada = cidades.find(
                        (c) =>
                            c.nom_cidade === result.cidade && c.id_estado === estadoEncontrado.id
                    );
                    if (cidadeEncontrada) {
                        setValue('id_cidade', cidadeEncontrada.id);
                    }
                }
                toast.success('CEP encontrado!');
            } else {
                toast.error('CEP não encontrado. Preencha os campos manualmente.');
            }
        }
    };

    // Busca CNPJ
    const handleCnpjBlur = async (cnpj: string) => {
        const cleanCnpj = cnpj.replace(/\D/g, '');
        if (cleanCnpj.length === 14) {
            setIsLoading(true);
            const result = await buscarCnpj(cleanCnpj);
            setIsLoading(false);
            if (result) {
                setValue('num_cnpj', result.cnpj);
                setValue('nom_razao_social', result.razao_social);
                setValue('nom_fantasia', result.nome_fantasia || result.razao_social);
                setValue('des_logradouro', result.logradouro);
                setValue('num_endereco', result.numero);
                setValue('des_complemento', result.complemento || '');
                setValue('nom_bairro', result.bairro);
                setValue('num_cep', result.cep);
                if (result.email) setValue('des_email_1', result.email);
                if (result.telefone_1) setValue('num_celular_1', result.telefone_1);
                if (result.telefone_2) setValue('num_celular_2', result.telefone_2);
                // Encontrar estado
                const estadoEncontrado = estados.find((e) => e.sgl_estado === result.uf);
                if (estadoEncontrado) {
                    setEstadoId(estadoEncontrado.id);
                }
                toast.success('CNPJ encontrado!');
            } else {
                toast.error('CNPJ não encontrado. Preencha os campos manualmente.');
            }
        }
    };

    const onSubmit = (data: EmpresaCreateInput) => {
        // Converter booleanos para 0/1
        const payload = {
            ...data,
            ind_ativo: data.ind_ativo ? 1 : 0,
            ind_whatsapp_1: data.ind_whatsapp_1 ? 1 : 0,
            ind_whatsapp_2: data.ind_whatsapp_2 ? 1 : 0,
            // Logo fields (não incluso no formulário, podem ser adicionados depois)
        };

        if (initialData) {
            updateMutation.mutate(
                { id: initialData.id, data: payload },
                { onSuccess }
            );
        } else {
            createMutation.mutate(payload, { onSuccess });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome Fantasia */}
                <div className="space-y-1">
                    <Label htmlFor="nom_fantasia">Nome Fantasia</Label>
                    <Controller
                        name="nom_fantasia"
                        control={control}
                        render={({ field }) => (
                            <Input id="nom_fantasia" {...field} />
                        )}
                    />
                    {errors.nom_fantasia && (
                        <p className="text-sm text-destructive">{errors.nom_fantasia.message}</p>
                    )}
                </div>

                {/* Razão Social */}
                <div className="space-y-1">
                    <Label htmlFor="nom_razao_social">Razão Social</Label>
                    <Controller
                        name="nom_razao_social"
                        control={control}
                        render={({ field }) => (
                            <Input id="nom_razao_social" {...field} />
                        )}
                    />
                    {errors.nom_razao_social && (
                        <p className="text-sm text-destructive">{errors.nom_razao_social.message}</p>
                    )}
                </div>

                {/* CNPJ */}
                <div className="space-y-1">
                    <Label htmlFor="num_cnpj">CNPJ</Label>
                    <Controller
                        name="num_cnpj"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="num_cnpj"
                                {...field}
                                onBlur={() => handleCnpjBlur(field.value)}
                                placeholder="99.999.999/9999-99"
                            />
                        )}
                    />
                    {errors.num_cnpj && (
                        <p className="text-sm text-destructive">{errors.num_cnpj.message}</p>
                    )}
                </div>

                {/* Inscrição Estadual */}
                <div className="space-y-1">
                    <Label htmlFor="num_inscricao_estadual">Inscrição Estadual</Label>
                    <Controller
                        name="num_inscricao_estadual"
                        control={control}
                        render={({ field }) => (
                            <Input id="num_inscricao_estadual" {...field} />
                        )}
                    />
                </div>

                {/* Data Abertura */}
                <div className="space-y-1">
                    <Label>Data de Abertura</Label>
                    <Controller
                        name="dta_abertura"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value
                                            ? format(parseISO(field.value), 'dd/MM/yyyy', { locale: ptBR })
                                            : 'Selecione uma data'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? parseISO(field.value) : undefined}
                                        onSelect={(date) =>
                                            field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.dta_abertura && (
                        <p className="text-sm text-destructive">{errors.dta_abertura.message}</p>
                    )}
                </div>

                {/* CEP */}
                <div className="space-y-1">
                    <Label htmlFor="num_cep">CEP</Label>
                    <Controller
                        name="num_cep"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="num_cep"
                                {...field}
                                onBlur={() => handleCepBlur(field.value)}
                                placeholder="99.999-999"
                            />
                        )}
                    />
                    {errors.num_cep && (
                        <p className="text-sm text-destructive">{errors.num_cep.message}</p>
                    )}
                </div>

                {/* Logradouro */}
                <div className="space-y-1">
                    <Label htmlFor="des_logradouro">Logradouro</Label>
                    <Controller
                        name="des_logradouro"
                        control={control}
                        render={({ field }) => (
                            <Input id="des_logradouro" {...field} />
                        )}
                    />
                    {errors.des_logradouro && (
                        <p className="text-sm text-destructive">{errors.des_logradouro.message}</p>
                    )}
                </div>

                {/* Número */}
                <div className="space-y-1">
                    <Label htmlFor="num_endereco">Número</Label>
                    <Controller
                        name="num_endereco"
                        control={control}
                        render={({ field }) => (
                            <Input id="num_endereco" {...field} />
                        )}
                    />
                </div>

                {/* Complemento */}
                <div className="space-y-1">
                    <Label htmlFor="des_complemento">Complemento</Label>
                    <Controller
                        name="des_complemento"
                        control={control}
                        render={({ field }) => (
                            <Input id="des_complemento" {...field} />
                        )}
                    />
                </div>

                {/* Bairro */}
                <div className="space-y-1">
                    <Label htmlFor="nom_bairro">Bairro</Label>
                    <Controller
                        name="nom_bairro"
                        control={control}
                        render={({ field }) => (
                            <Input id="nom_bairro" {...field} />
                        )}
                    />
                    {errors.nom_bairro && (
                        <p className="text-sm text-destructive">{errors.nom_bairro.message}</p>
                    )}
                </div>

                {/* Estado (Select) */}
                <div className="space-y-1">
                    <Label>Estado</Label>
                    <Select
                        onValueChange={(value) => {
                            const id = Number(value);
                            setEstadoId(id);
                            // Limpar cidade selecionada
                            setValue('id_cidade', 0);
                        }}
                        value={estadoId?.toString() || ''}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {estados.map((estado) => (
                                <SelectItem key={estado.id} value={estado.id.toString()}>
                                    {estado.nom_estado} ({estado.sgl_estado})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Cidade (Select) */}
                <div className="space-y-1">
                    <Label>Cidade</Label>
                    <Controller
                        name="id_cidade"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString() || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a cidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cidadesFiltradas.map((cidade) => (
                                        <SelectItem key={cidade.id} value={cidade.id.toString()}>
                                            {cidade.nom_cidade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.id_cidade && (
                        <p className="text-sm text-destructive">{errors.id_cidade.message}</p>
                    )}
                </div>

                {/* Celular 1 */}
                <div className="space-y-1">
                    <Label htmlFor="num_celular_1">Celular 1</Label>
                    <Controller
                        name="num_celular_1"
                        control={control}
                        render={({ field }) => (
                            <Input id="num_celular_1" {...field} />
                        )}
                    />
                    {errors.num_celular_1 && (
                        <p className="text-sm text-destructive">{errors.num_celular_1.message}</p>
                    )}
                </div>

                {/* WhatsApp 1 */}
                <div className="flex items-center space-x-2">
                    <Controller
                        name="ind_whatsapp_1"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="ind_whatsapp_1"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="ind_whatsapp_1">WhatsApp 1</Label>
                </div>

                {/* Celular 2 */}
                <div className="space-y-1">
                    <Label htmlFor="num_celular_2">Celular 2</Label>
                    <Controller
                        name="num_celular_2"
                        control={control}
                        render={({ field }) => (
                            <Input id="num_celular_2" {...field} />
                        )}
                    />
                </div>

                {/* WhatsApp 2 */}
                <div className="flex items-center space-x-2">
                    <Controller
                        name="ind_whatsapp_2"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="ind_whatsapp_2"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="ind_whatsapp_2">WhatsApp 2</Label>
                </div>

                {/* Email 1 */}
                <div className="space-y-1">
                    <Label htmlFor="des_email_1">E-mail</Label>
                    <Controller
                        name="des_email_1"
                        control={control}
                        render={({ field }) => (
                            <Input id="des_email_1" type="email" {...field} />
                        )}
                    />
                    {errors.des_email_1 && (
                        <p className="text-sm text-destructive">{errors.des_email_1.message}</p>
                    )}
                </div>

                {/* Email 2 */}
                <div className="space-y-1">
                    <Label htmlFor="des_email_2">E-mail 2</Label>
                    <Controller
                        name="des_email_2"
                        control={control}
                        render={({ field }) => (
                            <Input id="des_email_2" type="email" {...field} />
                        )}
                    />
                </div>

                {/* Cor principal */}
                <div className="space-y-1">
                    <Label htmlFor="val_cor_principal">Cor Principal (hex)</Label>
                    <Controller
                        name="val_cor_principal"
                        control={control}
                        render={({ field }) => (
                            <Input id="val_cor_principal" {...field} placeholder="#999999" />
                        )}
                    />
                </div>

                {/* Status Ativo */}
                <div className="flex items-center space-x-2">
                    <Controller
                        name="ind_ativo"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="ind_ativo"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="ind_ativo">Ativo</Label>
                </div>

                {/* Campos disabled (created_at, updated_ad) - apenas se initialData */}
                {initialData && (
                    <>
                        <div className="space-y-1">
                            <Label>Criado em</Label>
                            <Input
                                value={format(new Date(initialData.created_at), 'dd/MM/yyyy HH:mm')}
                                disabled
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Atualizado em</Label>
                            <Input
                                value={
                                    initialData.updated_ad
                                        ? format(new Date(initialData.updated_ad), 'dd/MM/yyyy HH:mm')
                                        : '-'
                                }
                                disabled
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}