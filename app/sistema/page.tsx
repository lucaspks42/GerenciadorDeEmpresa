"use client";

import ContadoresClientes from "@/components/ui/ContadoresClientes";
import ContadoresTarefas from "../../components/ui/ContadoresTarefas";
import ContadoresPagamentos from "@/components/ui/ContadoresPagamentos";
import ReceitaMensal from "@/components/ui/ReceitaMensal";
import { useSearch } from "@/components/context/SearchContext";

import type { Cliente } from "@/types/Cliente";

import { Building } from "lucide-react";

import { useEffect, useState } from "react";
import ModalCliente from "@/components/ui/ModalCliente";
import InfoCliente from "@/components/ui/InfoCliente";

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const { buscar } = useSearch();

  useEffect(() => {
    async function buscarCliente() {
      try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar clientes");
        }

        const clientesDoBanco: Cliente[] = await resposta.json();

        setClientes(clientesDoBanco);
      } catch (erro) {
        console.error(erro);
      }
    }
    buscarCliente();
  }, []);

  const itemsFiltrados = clientes.filter((cliente) => {
    const pesquisa = buscar.toLocaleLowerCase();

    return (
      cliente.nome.toLowerCase().includes(pesquisa) ||
      cliente.empresa.toLowerCase().includes(pesquisa) ||
      cliente.email.toLowerCase().includes(pesquisa) ||
      cliente.telefone.toLowerCase().includes(pesquisa)
    );
  });

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );

  const atualizarCliente = (clienteAtualizado: Cliente) => {
    setClientes((clientes) =>
      clientes.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente,
      ),
    );

    setClienteSelecionado(clienteAtualizado);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {clienteSelecionado && (
        <InfoCliente
          fecharModal={() => setClienteSelecionado(null)}
          cliente={clienteSelecionado}
          atualizarCliente={atualizarCliente}
        />
      )}
      {buscar.length === 0 ? (
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
      ) : (
        itemsFiltrados.map((cliente) => (
          <button
            key={cliente.id}
            onClick={() => {
              setClienteSelecionado(cliente);
            }}
            className="
                  w-full
                  grid
                  grid-cols-[2fr_1fr_2fr_auto]
                  items-center
                  px-6
                  py-5
                  border-b
                  border-border
                  last:border-b-0
                  hover:bg-accent
                  transition-colors
                  cursor-pointer
                  text-left
                "
          >
            <div>
              <div className="text-sm font-semibold text-foreground border-border">
                {cliente.nome}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <Building size={14} className="text-primary" />
                {cliente.empresa}
              </div>
            </div>

            <div className="text-sm text-white">{cliente.telefone}</div>

            <div className="text-sm text-white">{cliente.email}</div>

            <div className="flex justify-end text-white">
              <div
                className="
                      p-2
                      rounded-lg
                      hover:text-red-400
                      hover:bg-red-500/10
                      transition-colors
                      text-white
                    "
              ></div>
            </div>
          </button>
        ))
      )}
    </main>
  );
}
