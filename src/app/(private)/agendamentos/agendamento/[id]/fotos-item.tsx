// src/app/(private)/agendamento/[id]/fotos-item.tsx
'use client';

import { useMemo, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

import {
    useFotosItem,
    useUploadFotos,
    useDeletarFoto,
    useFotoObjectUrl,
} from '@/features/agendamentos/fotos-ajustes/hooks';
import {
    fotoUploadSchema,
    FOTO_MAX_POR_ITEM,
    FOTO_TAMANHO_MAX_MB,
} from '@/features/agendamentos/fotos-ajustes/schema';
import { AgendamentoItemFoto, FotoTipo } from '@/features/agendamentos/fotos-ajustes/types';
import { ApiError } from '@/lib/http/errors';

const ABAS: { valor: FotoTipo; label: string }[] = [
    { valor: 'antes', label: 'Antes' },
    { valor: 'depois', label: 'Depois' },
];

const msgErro = (e: unknown, padrao: string) => (e instanceof ApiError ? e.message : padrao);

function FotoThumb({
    foto,
    onAbrir,
    onExcluir,
}: {
    foto: AgendamentoItemFoto;
    onAbrir: () => void;
    onExcluir: () => void;
}) {
    const { url, isError } = useFotoObjectUrl(foto.id);

    return (
        <div className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
            {url ? (
                <button type="button" onClick={onAbrir} className="h-full w-full cursor-zoom-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={foto.nom_original} className="h-full w-full object-cover" />
                </button>
            ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    {isError ? 'Erro ao carregar' : 'Carregando...'}
                </div>
            )}
            <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                onClick={onExcluir}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}

function FotoAmpliada({ foto, onClose }: { foto: AgendamentoItemFoto; onClose: () => void }) {
    const { url } = useFotoObjectUrl(foto.id); // reaproveita o Blob em cache

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="truncate">{foto.nom_original}</DialogTitle>
                </DialogHeader>
                {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={foto.nom_original} className="max-h-[75vh] w-full object-contain" />
                ) : (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                )}
            </DialogContent>
        </Dialog>
    );
}

interface FotosItemProps {
    idAgendamento: number;
    idItem: number;
    onErro: (msg: string) => void;
}

export function FotosItem({ idAgendamento, idItem, onErro }: FotosItemProps) {
    const { data, isLoading } = useFotosItem(idAgendamento, idItem);
    const upload = useUploadFotos(idAgendamento, idItem);
    const deletar = useDeletarFoto(idAgendamento, idItem);

    const [aba, setAba] = useState<FotoTipo>('antes');
    const [ampliada, setAmpliada] = useState<AgendamentoItemFoto | null>(null);
    const [paraExcluir, setParaExcluir] = useState<AgendamentoItemFoto | null>(null);

    const fotos = useMemo(
        () => (Array.isArray(data?.dados) ? data.dados : []).filter((f) => !f.deleted_at),
        [data]
    );
    const daAba = fotos.filter((f) => f.ind_tipo_foto === aba);
    const restantes = Math.max(FOTO_MAX_POR_ITEM - fotos.length, 0);

    function handleArquivos(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivos = Array.from(e.target.files ?? []);
        e.target.value = '';
        if (!arquivos.length) return;

        if (arquivos.length > restantes) {
            return onErro(
                `Limite de ${FOTO_MAX_POR_ITEM} fotos por item (você pode adicionar mais ${restantes}).`
            );
        }
        const parsed = fotoUploadSchema.safeParse({ ind_tipo_foto: aba, arquivos });
        if (!parsed.success) return onErro(parsed.error.issues[0].message);

        upload.mutate(parsed.data, {
            onError: (err) => onErro(msgErro(err, 'Falha ao enviar as fotos')),
        });
    }

    function handleExcluir() {
        if (!paraExcluir) return;
        deletar.mutate(paraExcluir.id, {
            onError: (err) => onErro(msgErro(err, 'Falha ao remover a foto')),
        });
        setParaExcluir(null);
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex rounded-md border p-0.5">
                    {ABAS.map((a) => (
                        <Button
                            key={a.valor}
                            type="button"
                            size="sm"
                            variant={aba === a.valor ? 'default' : 'ghost'}
                            onClick={() => setAba(a.valor)}
                        >
                            {a.label} ({fotos.filter((f) => f.ind_tipo_foto === a.valor).length})
                        </Button>
                    ))}
                </div>

                <label
                    className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${restantes === 0 || upload.isPending
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer hover:bg-muted'
                        }`}
                >
                    <ImagePlus className="h-4 w-4" />
                    {upload.isPending ? 'Enviando...' : `Adicionar (${aba})`}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleArquivos}
                        disabled={restantes === 0 || upload.isPending}
                    />
                </label>
            </div>

            <p className="text-xs text-muted-foreground">
                {fotos.length}/{FOTO_MAX_POR_ITEM} fotos · máx. {FOTO_TAMANHO_MAX_MB} MB cada
            </p>

            {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando fotos...</p>
            ) : daAba.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {daAba.map((f) => (
                        <FotoThumb
                            key={f.id}
                            foto={f}
                            onAbrir={() => setAmpliada(f)}
                            onExcluir={() => setParaExcluir(f)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Nenhuma foto de &quot;{aba}&quot;.</p>
            )}

            {ampliada && <FotoAmpliada foto={ampliada} onClose={() => setAmpliada(null)} />}

            <AlertDialog open={!!paraExcluir} onOpenChange={(open) => !open && setParaExcluir(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover foto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remover &quot;{paraExcluir?.nom_original}&quot;? Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExcluir}>Remover</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
