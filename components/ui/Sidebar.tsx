import {
  ClipboardList,
  LayoutDashboard,
  UsersRound,
  Wallet,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-68 h-screen bg-white text-gray-700 border-r  flex flex-col border-gray-300">
      <div className="py-3 px-4 border-b border-gray-300">
        <span className="block text-sm font-semibold text-gray-900">
          Assistente Administrativo
        </span>

        <span className="block mt-1 text-xs text-gray-400">Painel pessoal</span>
      </div>

      <nav className="px- mt-10">
        <a
          href="http://localhost:3000"
          className="p-3 hover:bg-gray-300 rounded flex items-center gap-3"
        >
          <LayoutDashboard />
          Dashboard
        </a>

        <a
          href="/tarefas"
          className="p-3 hover:bg-gray-300 rounded flex items-center gap-3"
        >
          <ClipboardList />
          Tarefas
        </a>

        <a
          href="/clientes"
          className="p-3 hover:bg-gray-300 rounded flex items-center gap-3"
        >
          <UsersRound />
          Clientes
        </a>

        <a
          href=""
          className="p-3 hover:bg-gray-300 rounded flex items-center gap-3"
        >
          <Wallet />
          Pagamentos
        </a>
      </nav>
    </aside>
  );
}
