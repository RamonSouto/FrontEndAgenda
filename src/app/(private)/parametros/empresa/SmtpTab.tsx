// app/(private)/parametros/empresa/SmtpTab.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSmtp, useSalvarSmtp, useTestarSmtp } from '@/features/parametrizacao/smtp/hooks';
import {
  criarSmtpSchema,
  smtpDefaultValues,
  smtpParaFormValues,
  smtpTesteSchema,
  type SmtpFormValues,
} from '@/features/parametrizacao/smtp/schema';
import { ApiError } from '@/lib/http/errors';

function notificarErro(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.isValidation && error.details) {
      Object.entries(error.details).forEach(([campo, msgs]) =>
        msgs.forEach((m) => toast.error(`${campo}: ${m}`)),
      );
      return;
    }
    toast.error(error.message);
    return;
  }
  toast.error(fallback);
}

const Erro = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-sm text-destructive">{msg}</p> : null;

interface SmtpTabProps {
  idEmpresa: number;
  onDirtyChange: (sujo: boolean) => void;
  /** Solicita o fechamento passando pela confirmação de descarte do pai. */
  onClose: () => void;
}

export function SmtpTab({ idEmpresa, onDirtyChange, onClose }: SmtpTabProps) {
  // A aba só é montada quando aberta => o GET só acontece aqui.
  const { data, isLoading, isError, refetch } = useSmtp(idEmpresa);
  const salvar = useSalvarSmtp(idEmpresa);
  const testar = useTestarSmtp(idEmpresa);

  const senhaConfigurada = !!data?.dados.ind_senha_configurada;
  const schema = useMemo(() => criarSmtpSchema(senhaConfigurada), [senhaConfigurada]);
  const [destinatario, setDestinatario] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SmtpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: smtpDefaultValues,
  });

  // Carga inicial / refetch em background: nunca sobrescreve edição em andamento.
  useEffect(() => {
    if (!data || isDirty) return;
    reset(smtpParaFormValues(data.dados));
    setDestinatario((atual) => atual || data.dados.des_smtp_email_remetente || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    return () => onDirtyChange(false);
  }, [onDirtyChange]);

  const onSubmit = async (values: SmtpFormValues) => {
    try {
      const res = await salvar.mutateAsync(values);
      reset(smtpParaFormValues(res.dados)); // limpa dirty e esvazia a senha
      toast.success('Configuração SMTP salva com sucesso!');
    } catch (error) {
      notificarErro(error, 'Erro inesperado ao salvar o SMTP.');
    }
  };

  const handleTeste = async () => {
    if (isDirty) {
      toast.warning('Há alterações não salvas. Salve antes de testar: o teste usa a configuração gravada.');
      return;
    }
    if (!data?.dados.ind_smtp_ativo) {
      toast.warning('Ative e salve o SMTP antes de enviar o teste.');
      return;
    }
    const parsed = smtpTesteSchema.safeParse({ des_destinatario: destinatario });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    try {
      const res = await testar.mutateAsync(parsed.data);
      toast.success(res.mensagem);
    } catch (error) {
      notificarErro(error, 'Falha ao enviar o e-mail de teste.');
    }
  };

  if (isLoading) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Carregando configuração...</p>;
  }

  if (isError) {
    return (
      <div className="py-6 text-center space-y-2">
        <p className="text-sm text-destructive">Erro ao carregar a configuração SMTP.</p>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="ind_smtp_ativo"
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>SMTP ativo</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Servidor (host)</Label>
          <Input {...register('des_smtp_host')} placeholder="smtp.exemplo.com" />
          <Erro msg={errors.des_smtp_host?.message} />
        </div>

        <div>
          <Label>Porta</Label>
          <Input
            type="number"
            placeholder="587"
            {...register('num_smtp_porta', {
              setValueAs: (v) => (v === '' || v == null ? null : Number(v)),
            })}
          />
          <Erro msg={errors.num_smtp_porta?.message} />
        </div>

        <div>
          <Label>Usuário</Label>
          <Input {...register('des_smtp_usuario')} autoComplete="off" />
          <Erro msg={errors.des_smtp_usuario?.message} />
        </div>

        <div>
          <Label>Senha</Label>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder={senhaConfigurada ? '••••••••' : ''}
            {...register('des_smtp_senha')}
          />
          {senhaConfigurada && (
            <p className="text-xs text-muted-foreground">
              Senha já configurada. Deixe em branco para mantê-la.
            </p>
          )}
          <Erro msg={errors.des_smtp_senha?.message} />
        </div>

        <div>
          <Label>E-mail do remetente</Label>
          <Input type="email" {...register('des_smtp_email_remetente')} placeholder="agenda@empresa.com.br" />
          <Erro msg={errors.des_smtp_email_remetente?.message} />
        </div>

        <div>
          <Label>Nome do remetente</Label>
          <Input {...register('nom_smtp_remetente')} placeholder="Agenda Empresa" />
          <Erro msg={errors.nom_smtp_remetente?.message} />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <Controller
            control={control}
            name="ind_smtp_seguro"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
          <div>
            <Label>Conexão segura (TLS implícito)</Label>
            <p className="text-xs text-muted-foreground">
              Ligado: porta 465. Desligado: STARTTLS (porta 587).
            </p>
          </div>
        </div>
      </div>

      {/* Teste */}
      <div className="rounded-md border p-3 space-y-2 bg-muted/20">
        <Label>Enviar e-mail de teste</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            placeholder="destinatario@exemplo.com"
          />
          <Button type="button" variant="outline" onClick={handleTeste} disabled={testar.isPending}>
            {testar.isPending ? 'Enviando...' : 'Enviar e-mail de teste'}
          </Button>
        </div>
        {isDirty && (
          <p className="text-xs text-amber-600">
            Alterações não salvas: salve antes de testar, pois o teste usa a configuração gravada.
          </p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button type="submit" disabled={isSubmitting || salvar.isPending || !isDirty}>
          Salvar SMTP
        </Button>
      </DialogFooter>
    </form>
  );
}
