// src/app/(private)/produtos/tamanho/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tamanho",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
