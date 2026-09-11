"use client";

import ContadoresTarefas from "../components/ui/ContadoresTarefas";

export default function Home() {
  return (
    <main>
      <header className="w-full border-b text-black border-gray-300 h-16 px-10 justify-start content-center">
        Dashboard
      </header>
      <div className="">
        <div className="grid grid-cols-2 py-10 px-4 gap-10">
          <div className="border border-gray-200 px-4 py-4 text-black rounded-sm shadow-md">
            Total de clientes
          </div>
          <div className="border border-gray-200 px-4 py-4 text-black rounded-sm shadow-md">
            Receita Mensal
          </div>
          <div className="border border-gray-200 px-4 py-4 text-black rounded-sm shadow-md">
            Pagamento Proximos
          </div>
          <div className="border border-gray-200 px-4 py-4 text-black rounded-sm shadow-md">
            Tarefas Pendentes
            <ContadoresTarefas />
          </div>
        </div>
        <div className="grid px-4">
          <div className="border border-gray-200 px-4 py-4 text-black rounded-sm shadow-md">
            Proximos Pagamentos
          </div>
        </div>
      </div>
    </main>
  );
}
