'use client';

import { PessoaPapelPage } from '@/app/(private)/pessoas/pessoa-papel-page';
import { secretariaColumns } from './columns';

export default function SecretariaPage() {
    return (
        <PessoaPapelPage
            tipo="secretaria"
            papelKey="ind_secretaria"
            titulo="Secretárias"
            columns={secretariaColumns}
        />
    );
}