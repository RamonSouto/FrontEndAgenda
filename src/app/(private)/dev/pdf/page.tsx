// src/app/(private)/dev/pdf/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { AgendamentoPdf } from '@/features/agendamentos/agendamento/pdf/agendamento-pdf';
import { mockData } from './mock';

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((m) => m.PDFViewer), { ssr: false });

export default function PdfDevPage() {
    if (process.env.NODE_ENV === 'production') return null;

    return (
        <PDFViewer width="100%" style={{ height: '100vh', border: 0 }}>
            <AgendamentoPdf data={mockData} />
        </PDFViewer>
    );
}
