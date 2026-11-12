// src/features/empresa/components/NavCompany.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Empresa } from "@/features/parametrizacao/empresa/types"
import Link from "next/link"

export function NavCompany({ ...empresa }: Empresa) {
    const { isMobile } = useSidebar()
    const pathRef = useRef<SVGPathElement>(null)
    const [pathLength, setPathLength] = useState(1000)

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength()
            setPathLength(length)
        }
    }, [])


    const pathStyle: React.CSSProperties = {
        fill: 'none',
        stroke: '#d8b8fa',
        strokeMiterlimit: 10,
        strokeWidth: '24px',
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        animation: `draw 3s ease forwards infinite`,

    };


    if (!empresa) {
        return (
            <>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
                            <span>Nenhuma empresa</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </>
        )
    }

    return (

        <>
            <style>{`
                @keyframes draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" className="data-[slot=sidebar-menu-button]:p-1.5!">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent">
                            <svg id="Camada_2" data-name="Camada 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.49 247.47">
                                <g id="Camada_1-2" data-name="Camada 1">
                                    <path ref={pathRef} style={pathStyle} d="M198.98,110.93c-16.7-48.54-66.8-76.1-115.77-65.85V6.2c0-1.76-1.43-3.2-3.2-3.2H6.21c-1.77,0-3.21,1.44-3.21,3.2v139.54c.01.45.02.91.04,1.36.33,9.78,2.1,19.67,5.45,29.4,18.1,52.6,75.42,80.57,128.03,62.46,52.6-18.11,80.57-75.43,62.46-128.03ZM110.42,163.12c-10.72,3.69-22.4-2.01-26.09-12.73-.76-2.21-1.12-4.47-1.12-6.68,0-8.52,5.34-16.48,13.85-19.41,10.71-3.68,22.39,2.01,26.08,12.73,3.69,10.72-2.01,22.4-12.72,26.09Z" />
                                </g>
                            </svg>
                        </div>
                        {/* <SwatchBookIcon className="size-5!" /> */}
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <Link href="/dashboard">
                                <span className="truncate font-medium">{empresa.empresa?.nom_fantasia}</span><br />
                                <span className="truncate text-xs">{empresa.empresa?.nom_razao_social}</span>
                            </Link>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}