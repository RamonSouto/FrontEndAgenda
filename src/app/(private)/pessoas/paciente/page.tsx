'use client';

import { PessoaPapelPage } from '@/app/(private)/pessoas/pessoa-papel-page';
import { pacienteColumns } from './columns';

export default function PacientePage() {
    return (
        <PessoaPapelPage
            tipo="paciente"
            papelKey="ind_paciente"
            titulo="Pacientes"
            columns={pacienteColumns}
        />
    );
}