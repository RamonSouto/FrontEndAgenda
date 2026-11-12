'use client';

import { PessoaPapelPage } from '@/app/(private)/pessoas/pessoa-papel-page';
import { costureiraColumns } from './columns';

export default function CostureiraPage() {
    return (
        <PessoaPapelPage
            tipo="costureira"
            papelKey="ind_costureira"
            titulo="Costureiras"
            columns={costureiraColumns}
        />
    );
}