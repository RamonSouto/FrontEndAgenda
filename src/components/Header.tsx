//src/components/Header.tsx
"use client";

import { authKeys, useAuth, useLogout } from "@/features/auth/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";


interface HeaderProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

const routeTitles: Record<string, string> = {
  // Adicione outras rotas conforme necessário
};

const getTitleFromPath = (path: string): string => {

  if (routeTitles[path]) return routeTitles[path];

  // Remove a barra e capitaliza
  const segment = path.split("/").filter(Boolean).pop();

  if (!segment) return "Dashboard";

  return segment.charAt(0).toUpperCase() + segment.slice(1);
}



export default function Header({ toggleSidebar, isCollapsed }: HeaderProps) {

  const { data: user, isLoading } = useAuth()
  const { mutate: logout, isPending } = useLogout()

  const pathname = usePathname();
  const pageTitle = getTitleFromPath(pathname);

  const handleLogout = () => {
    logout();
  };

  // console.log({ "perfil": authKeys.perfil, "Usuário": user });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary-200 bg-primary-100 px-4 shadow-sm dark:border-primary-700 dark:bg-primary-800 md:px-6 lg:px-8">
      <div className="flex items-center gap-4 h-10">
        {/* Botão toggle da sidebar */}
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-primary border border-primary-200 dark:border-primary-200 dark:text-white lg:h-8 lg:w-8 xl:border lg:bg-transparent dark:lg:bg-transparent invisible lg:visible"
          aria-label="Toggle Sidebar"
        >
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-primary-800 dark:text-white">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-700 dark:text-white" size={18} />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="rounded-lg border border-primary-400 bg-primary-50 py-1.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-primary-400 dark:bg-primary-700 dark:text-white placeholder-primary-400 dark:placeholder-primary-200"
          />
        </div>
        <button className="relative rounded-full p-2 hover:bg-primary-200 dark:hover:bg-primary-600" onClick={handleLogout}>
          <Bell size={20} className="text-primary-800 dark:text-white" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-800 dark:bg-primary-400 flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <span className="hidden text-sm font-medium text-primary-800 dark:text-white md:block">
            {isLoading ? 'Carregando' : user?.nome || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}