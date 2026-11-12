"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarRail
} from "@/components/ui/sidebar"
import { Building2, CalendarClock, Clipboard, Clock, DollarSignIcon, FileText, Flag, Grid, HeartPulse, Image, MapPin, Package, PackageCheck, Palette, Ruler, Scissors, Shield, ShoppingBag, Stethoscope, Tags, User, Wrench } from "lucide-react";
import { NavMain } from "./NavMain";
import { useAuth } from "@/features/auth/hooks";
import { NavUser } from "./NavUser";
import { NavCompany } from "./NavCompany";
import { useEmpresas } from "@/features/parametrizacao/empresa/hooks";
import { useMemo } from "react";

const data = {
    navMenu: [
        {
            titulo: 'Produto',
            url: '#',
            icon: Package,
            isActive: false,
            items: [
                { title: "Produto", icon: Package, url: "/produtos/produto" },
                { title: "Categoria", icon: Tags, url: "/produtos/categoria" },
                { title: "Tamanho", icon: Ruler, url: "/produtos/tamanho" },
                { title: "Cor e Estampa", icon: Palette, url: "/produtos/cor-estampa" },
                { title: "Grade", icon: Grid, url: "/produtos/grade" },
                { title: "Imagem Produto", icon: Image, url: "/produtos/imagem-produto" },
                { title: "Tipo de Serviço", icon: Wrench, url: "/produtos/tipo-servico" },
                { title: "Produto Serviço", icon: ShoppingBag, url: "/produtos/produto-servico" },
                { title: "Preço Produto Serviço", icon: DollarSignIcon, url: "/produtos/preco-produto-servico" },
            ]
        },
        {
            titulo: 'Pessoas',
            url: '#',
            icon: User,
            items: [
                { title: "Pessoa", icon: User, url: "/pessoas" },
                // { title: "Administrador", icon: Shield, url: "/pessoas/administrador" },
                // { title: "Médico", icon: Stethoscope, url: "/pessoas/medico" },
                // { title: "Paciente", icon: HeartPulse, url: "/pessoas/paciente" },
                // { title: "Costureira", icon: Scissors, url: "/pessoas/costureira" },
                // { title: "Secretaria", icon: Clipboard, url: "/pessoas/secretaria" },
            ]
        },
        {
            titulo: 'Agendamento',
            url: '#',
            icon: CalendarClock,
            items: [
                { title: "Agendamento", icon: CalendarClock, url: "/agendamento" },
                { title: "Produto Agendado", icon: PackageCheck, url: "/dashboard" },
                { title: "Foto Agendamento", icon: Image, url: "/dashboard" },
                { title: "Tipo Agendamento", icon: Image, url: "/agendamento/tipo-agendamento" },
            ]
        },
        {
            titulo: 'Parametros',
            url: '#',
            icon: Building2,
            items: [
                { title: "Empresa", icon: Building2, url: "/parametros/empresa" },
                { title: "Horário", icon: Clock, url: "/parametros/horario" },
                { title: "Cidade", icon: MapPin, url: "/parametros/cidades" },
                { title: "Estado", icon: Flag, url: "/parametros/estados" },
                { title: "Log", icon: FileText, url: "/parametros/log" }
            ]
        },
    ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { data: user } = useAuth()
    const { data: empresasRaw } = useEmpresas()

    const empresa = useMemo(() => {
        const lista = (Array.isArray(empresasRaw?.dados) ? empresasRaw?.dados : []);
        return lista[0];
    }, [empresasRaw])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b-1">
                <NavCompany empresa={empresa} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMenu} />
            </SidebarContent>
            <SidebarFooter className="border-t-1">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}