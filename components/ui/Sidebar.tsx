"use client";

import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  UsersRound,
  Wallet,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-68 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* LOGO / NOME */}

      <div className="px-5 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-lg">A</span>
          </div>

          <div>
            <span className="block text-sm font-semibold text-white">
              Assistente
            </span>

            <span className="block text-xs text-muted-foreground">
              Administrativo
            </span>
          </div>
        </div>
      </div>

      {/* MENU */}

      <nav className="px-3 mt-6 flex flex-col gap-1">
        {/* DASHBOARD */}
        <a
          href="http://localhost:3000/"
          className={`
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            transition-all
            duration-200
            ${
              pathname === "/"
                ? "bg-sidebar-accent text-white border border-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
            }
          `}
        >
          <LayoutDashboard
            size={19}
            className={pathname === "/" ? "text-primary" : ""}
          />
          Dashboard
        </a>

        {/* TAREFAS */}
        <a
          href="/tarefas"
          className={`
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            transition-all
            duration-200
            ${
              pathname === "/tarefas"
                ? "bg-sidebar-accent text-white border border-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
            }
          `}
        >
          <ClipboardList
            size={19}
            className={pathname === "/tarefas" ? "text-primary" : ""}
          />
          Tarefas
        </a>

        {/* CLIENTES */}
        <a
          href="/clientes"
          className={`
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            transition-all
            duration-200
            ${
              pathname === "/clientes"
                ? "bg-sidebar-accent text-white border border-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
            }
          `}
        >
          <UsersRound
            size={19}
            className={pathname === "/clientes" ? "text-primary" : ""}
          />
          Clientes
        </a>

        {/* PAGAMENTOS */}
        <a
          href="/pagamentos"
          className={`
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            transition-all
            duration-200
            ${
              pathname === "/pagamentos"
                ? "bg-sidebar-accent text-white border border-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-white"
            }
          `}
        >
          <Wallet
            size={19}
            className={pathname === "/pagamentos" ? "text-primary" : ""}
          />
          Pagamentos
        </a>
      </nav>

      {/* RODAPÉ */}

      <div className="mt-auto px-4 py-5 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">Painel pessoal</div>
      </div>
    </aside>
  );
}
