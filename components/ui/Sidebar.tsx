import {
  ClipboardList,
  LayoutDashboard,
  UsersRound,
  Wallet,
} from "lucide-react";

export default function Sidebar() {
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
        <a
          href="/"
          className="
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            transition-all
            duration-200
            bg-sidebar-accent
            text-white
            border
            border-primary/20
          "
        >
          <LayoutDashboard size={19} className="text-primary" />
          Dashboard
        </a>

        <a
          href="/tarefas"
          className="
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
            transition-all
            duration-200
            hover:bg-sidebar-accent
            hover:text-white
          "
        >
          <ClipboardList size={19} />
          Tarefas
        </a>

        <a
          href="/clientes"
          className="
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
            transition-all
            duration-200
            hover:bg-sidebar-accent
            hover:text-white
          "
        >
          <UsersRound size={19} />
          Clientes
        </a>

        <a
          href="/pagamentos"
          className="
            p-3
            rounded-xl
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
            transition-all
            duration-200
            hover:bg-sidebar-accent
            hover:text-white
          "
        >
          <Wallet size={19} />
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
