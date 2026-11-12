'use client';

import { PessoaPapelPage } from '@/app/(private)/pessoas/pessoa-papel-page';
import { medicoColumns } from './columns';

export default function MedicoPage() {
    return (
        <PessoaPapelPage
            tipo="medico"
            papelKey="ind_medico"
            titulo="Médicos"
            columns={medicoColumns}
        />
    );
}
