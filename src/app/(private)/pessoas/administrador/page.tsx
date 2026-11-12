'use client';

import { PessoaPapelPage } from '@/app/(private)/pessoas/pessoa-papel-page';
import { administradorColumns } from './columns';

export default function AdministradorPage() {
    return (
        <PessoaPapelPage
            tipo="administrador"
            papelKey="ind_administrador"
            titulo="Administrador"
            columns={administradorColumns}
        />
    );
}
