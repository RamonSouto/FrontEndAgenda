"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Package,
    Tags,
    Ruler,
    Palette,
    Grid,
    Image,
    Wrench,
    DollarSignIcon,
    User,
    Shield,
    Stethoscope,
    HeartPulse,
    Scissors,
    Clipboard,
    CalendarClock,
    PackageCheck,
    Building2,
    Clock,
    MapPin,
    Flag,
    FileText,
} from "lucide-react";

const produtoItems = [
    { name: "Produto", icon: Package, href: "/dashboard" },
    { name: "Categoria", icon: Tags, href: "/dashboard" },
    { name: "Tamanho", icon: Ruler, href: "/dashboard" },
    { name: "Cor e Estampa", icon: Palette, href: "/dashboard" },
    { name: "Grade", icon: Grid, href: "/dashboard" },
    { name: "Imagem Produto", icon: Image, href: "/dashboard" },
    { name: "Tipo de Serviço", icon: Wrench, href: "/dashboard" },
    { name: "Produto Serviço", icon: ShoppingBag, href: "/dashboard" },
    { name: "Preço Produto Serviço", icon: DollarSignIcon, href: "/dashboard" },
];

const pessoasItems = [
    { name: "Pessoa", icon: User, href: "/dashboard" },
    { name: "Administrador", icon: Shield, href: "/dashboard" },
    { name: "Médico", icon: Stethoscope, href: "/dashboard" },
    { name: "Paciente", icon: HeartPulse, href: "/dashboard" },
    { name: "Costureira", icon: Scissors, href: "/dashboard" },
    { name: "Secretaria", icon: Clipboard, href: "/dashboard" },
];

const agendamentosItems = [
    { name: "Agendamento", icon: CalendarClock, href: "/dashboard" },
    { name: "Produto Agendado", icon: PackageCheck, href: "/dashboard" },
    { name: "Foto Agendamento", icon: Image, href: "/dashboardui" },
];

const parametrosItems = [
    { name: "Empresa", icon: Building2, href: "/dashboard" },
    { name: "Horário", icon: Clock, href: "/dashboard" },
    { name: "Cidade", icon: MapPin, href: "/dashboard" },
    { name: "Estado", icon: Flag, href: "/dashboard" },
    { name: "Log", icon: FileText, href: "/dashboard" },
];

const allItems = [...produtoItems, ...pessoasItems, ...agendamentosItems, ...parametrosItems];


interface SidebarProps {
    isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {

    const empresa = "Boob Accessoria"
    const [isOpen, setIsOpen] = useState(false);

    const [produtoOpen, setProdutoOpen] = useState(true);
    const [pessoaOpen, setPessoaOpen] = useState(true);
    const [agendamentoOpen, setAgendamentoOpen] = useState(true);
    const [parametroOpen, setParametroOpen] = useState(true);


    // Largura da sidebar: 72 (w-72) quando expandida, 20 (w-20) quando colapsada
    const sidebarWidth = isCollapsed ? "w-20" : "w-72";

    // Para mobile, ainda usamos o drawer (overlay) independente do colapso
    // Em desktop, aplicamos a largura fixa
    return (
        <>
            {/* Botão para mobile (aparece apenas em telas menores) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden dark:bg-primary-900 ring-1"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 transform overflow-y-auto bg-primary-100 px-2 py-6 shadow-lg transition-all duration-300 ease-in-out
          dark:bg-primary-800 dark:shadow-gray-700/50
          ${sidebarWidth}
          lg:relative lg:translate-x-0
          scrollbar-none overflow-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className={`mb-8 flex items-center gap-2 ${isCollapsed ? "justify-center" : "px-2"}`}>
                    <div className="h-8 w-8 rounded-lg bg-primary-800 dark:bg-primary-400 flex items-center justify-center text-white font-bold text-xl">
                        {empresa[0]}
                    </div>
                    {!isCollapsed && (
                        <span className="text-2xl font-bold text-primary-800 dark:text-white">
                            {empresa}
                        </span>
                    )}
                </div>

                <nav>
                    {isCollapsed ? (
                        // MODO COLAPSADO: apenas ícones, sem títulos, sem acordeões
                        <ul className="flex flex-col items-center space-y-1">
                            {allItems.map((item) => (
                                <li key={item.name} className="w-full">
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-center rounded-lg px-3 py-2 text-primary-600 transition hover:bg-primary-200 hover:text-primary-900 dark:text-primary-300 dark:hover:bg-primary-600 dark:hover:text-white"
                                        title={item.name}
                                    >
                                        <item.icon size={20} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // MODO EXPANDIDO: acordeões com títulos
                        <div className="space-y-6">
                            {/* PRODUTOS */}
                            <div>
                                <button
                                    onClick={() => setProdutoOpen(!produtoOpen)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-400 transition hover:bg-primary-200 hover:text-primary-600 dark:text-white dark:hover:bg-primary-700 dark:hover:text-primary-50"
                                >
                                    <span>Produtos</span>
                                    {produtoOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                {produtoOpen && (
                                    <ul className="mt-1 space-y-1">
                                        {produtoItems.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-200 hover:text-primary-900 dark:text-primary-100 dark:hover:bg-primary-700 dark:hover:text-white"
                                                >
                                                    <item.icon size={20} />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* PESSOAS */}
                            <div>
                                <button
                                    onClick={() => setPessoaOpen(!pessoaOpen)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-400 transition hover:bg-primary-200 hover:text-primary-600 dark:text-white dark:hover:bg-primary-700 dark:hover:text-primary-50"
                                >
                                    <span>Pessoas</span>
                                    {pessoaOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                {pessoaOpen && (
                                    <ul className="mt-1 space-y-1">
                                        {pessoasItems.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-200 hover:text-primary-900 dark:text-primary-100 dark:hover:bg-primary-700 dark:hover:text-white"
                                                >
                                                    <item.icon size={20} />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* AGENDA */}
                            <div>
                                <button
                                    onClick={() => setAgendamentoOpen(!agendamentoOpen)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-400 transition hover:bg-primary-200 hover:text-primary-600 dark:text-white dark:hover:bg-primary-700 dark:hover:text-primary-50"
                                >
                                    <span>Agendamento</span>
                                    {agendamentoOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                {agendamentoOpen && (
                                    <ul className="mt-1 space-y-1">
                                        {agendamentosItems.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-200 hover:text-primary-900 dark:text-primary-100 dark:hover:bg-primary-700 dark:hover:text-white"
                                                >
                                                    <item.icon size={20} />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* PARAMENTRO */}
                            <div>
                                <button
                                    onClick={() => setParametroOpen(!parametroOpen)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-400 transition hover:bg-primary-200 hover:text-primary-600 dark:text-white dark:hover:bg-primary-700 dark:hover:text-primary-50"
                                >
                                    <span>Parametro</span>
                                    {parametroOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                {parametroOpen && (
                                    <ul className="mt-1 space-y-1">
                                        {parametrosItems.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-200 hover:text-primary-900 dark:text-primary-100 dark:hover:bg-primary-700 dark:hover:text-white"
                                                >
                                                    <item.icon size={20} />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>


                        </div>
                    )}
                </nav>
            </aside>
        </>
    );
}