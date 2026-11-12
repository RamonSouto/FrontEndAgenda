"use client"

import { Usuario } from "@/features/auth/schema"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ChevronsUpDown, EllipsisVertical, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks";

export function NavUser(
    user: Usuario) {

    const { mutate: logout, isPending } = useLogout()

    const { isMobile } = useSidebar()

    const handleLogout = () => {
        logout();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <SidebarMenuButton size="lg" className="flex flex-row w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            {/* <div className="flex flex-row items-center justify-between gap-4 "> */}
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.email} alt={user.nome} />
                                <AvatarFallback className="">{user.user?.nome[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate">{user.user?.nome}</span>
                                <span className="truncate">{user.user?.email}</span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4" />
                            {/* </div> */}
                        </SidebarMenuButton>
                    }>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <SidebarMenuButton onClick={handleLogout}>
                                {/* <DropdownMenuItem > */}
                                <LogOut />
                                Log out
                                {/* </DropdownMenuItem> */}
                            </SidebarMenuButton>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>

                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}