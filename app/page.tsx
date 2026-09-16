"use client";

import ContadoresClientes from "@/components/ui/ContadoresClientes";
import ContadoresTarefas from "../components/ui/ContadoresTarefas";
import ContadoresPagamentos from "@/components/ui/ContadoresPagamentos";
import ReceitaMensal from "@/components/ui/ReceitaMensal";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-border h-16 px-10 flex items-center">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </header>

      <div className="px-10 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Visão geral</h2>

          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe seus clientes, pagamentos e tarefas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div
            className="
      border
      border-border
      bg-card
      rounded-2xl
      p-6
      transition-all
      hover:border-primary/40
      min-h-40
    "
          >
            <span className="block text-sm text-muted-foreground">
              Total de clientes
            </span>

            <div className="mt-3">
              <ContadoresClientes />
            </div>
          </div>

          <div
            className="
      border
      border-border
      bg-card
      rounded-2xl
      p-6
      transition-all
      hover:border-primary/40
      min-h-40
    "
          >
            <span className="block text-sm text-muted-foreground">
              Receita mensal
            </span>

            <div className="mt-3">
              <ReceitaMensal />
            </div>
          </div>

          <div
            className="
      border
      border-border
      bg-card
      rounded-2xl
      p-6
      transition-all
      hover:border-primary/40
      min-h-40
    "
          >
            <span className="block text-sm text-muted-foreground">
              Pagamentos próximos
            </span>

            <div className="mt-3">
              <ContadoresPagamentos />
            </div>
          </div>

          <div
            className="
      border
      border-border
      bg-card
      rounded-2xl
      p-6
      transition-all
      hover:border-primary/40
      min-h-40
    "
          >
            <span className="block text-sm text-muted-foreground">
              Tarefas pendentes
            </span>

            <div className="mt-3">
              <ContadoresTarefas />
            </div>
          </div>
        </div>

        <div
          className="
            mt-5
            border
            border-border
            bg-card
            rounded-2xl
            p-6
          "
        >
          <span className="text-sm text-muted-foreground">
            Próximos pagamentos
          </span>

          <div className="mt-6 text-sm text-muted-foreground">
            Nenhum pagamento próximo.
          </div>
        </div>
      </div>
    </main>
  );
}
