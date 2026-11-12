// components/ui/image-upload-field.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, Upload, X } from 'lucide-react';

const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface ImageUploadFieldProps {
    label: string;
    value: string | File | null | undefined; // string = URL relativa vinda do backend | File = novo upload
    onChange: (file: File | null) => void;
    onRemove?: () => void;
    aspect?: 'square' | 'wide'; // vertical (square-ish) ou horizontal (wide)
}

export function ImageUploadField({ label, value, onChange, onRemove, aspect = 'square' }: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }

        if (typeof value === 'string' && value) {
            setPreviewUrl(`${ASSETS_BASE_URL}/${value}`);
            return;
        }

        setPreviewUrl(null);
    }, [value]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        onRemove?.();
        if (inputRef.current) inputRef.current.value = '';
    };

    // const aspectClass = aspect === 'wide' ? 'aspect-video w-full' : 'aspect-square w-32';
    const aspectClass = aspect === 'wide' ? 'w-64 h-64' : 'w-28 h-28';

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-3">
                <div
                    className={`${aspectClass} relative flex items-center justify-center rounded-md border border-dashed bg-muted/30 overflow-hidden shrink-0`}
                >
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt={label}
                            className="h-full w-full object-contain"
                            onError={() => setPreviewUrl(null)}
                        />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => inputRef.current?.click()}
                    >
                        <Upload className="h-4 w-4" />
                        {previewUrl ? 'Substituir' : 'Selecionar'}
                    </Button>
                    {previewUrl && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                            Remover
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
