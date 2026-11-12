// src/app/(private)/produtos/categoria/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categoria",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
