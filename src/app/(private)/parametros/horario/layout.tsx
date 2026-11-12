// src/app/(private)/parametros/cidades/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Horário",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
