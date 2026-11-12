"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import Link from "next/link"

export function NavMain({
    items,
}: {
    items: {
        titulo: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            icon?: LucideIcon
            url: string

        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.titulo}
                        defaultOpen={item.isActive}
                        className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger
                                render={
                                    <SidebarMenuButton tooltip={item.titulo} className="w-full">
                                        {item.icon && <item.icon />}
                                        <span>{item.titulo}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-700 group-data-[open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>}>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton render={
                                                <Link href={subItem.url}>
                                                    {/* {subItem.icon && <subItem.icon className="!text-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]" />} */}
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            }>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
