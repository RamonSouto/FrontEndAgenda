// src/app/(private)/produtos/produto/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Produto",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
