"use client";

import type { Cliente } from "@/types/Cliente";
import InfoCliente from "@/components/ui/InfoCliente";
import { InputGroupDemo } from "@/components/ui/InputGroupDemo";
import ModalCliente from "@/components/ui/ModalCliente";
import { Building, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function Clientes() {
  const [modalAberto, setModalAberto] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );

  const [clientes, setClientes] = useState<Cliente[]>([]);

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

  const fechar = () => {
    setModalAberto(false);
  };

  const adicionarCliente = (cliente: Cliente) => {
    setClientes([...clientes, cliente]);
  };

  async function deletarClientes(id: number) {
    try {
      const resposta = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar cliente");
      }

      setClientes((clientes) =>
        clientes.filter((cliente) => cliente.id !== id),
      );
    } catch (erro) {
      console.error("Erro ao deletar cliente:", erro);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {modalAberto && (
        <ModalCliente
          fecharModal={fechar}
          adicionarCliente={adicionarCliente}
        />
      )}

      {clienteSelecionado && (
        <InfoCliente
          fecharModal={() => setClienteSelecionado(null)}
          cliente={clienteSelecionado}
        />
      )}

      <header className="w-full border-b border-border h-16 px-10 flex items-center">
        <h1 className="text-lg font-semibold">Clientes</h1>
      </header>

      <div className="px-10 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Clientes</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Gerencie seus clientes e acompanhe seus pagamentos.
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="
              bg-primary
              hover:bg-primary/85
              text-primary-foreground
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-all
              shadow-lg
              shadow-primary/10
            "
          >
            + Novo Cliente
          </button>
        </div>

        <div className="mb-5">
          <InputGroupDemo />
        </div>

        {clientes.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              h-100
              border
              border-dashed
              border-border
              rounded-2xl
              bg-card/50
            "
          >
            <div className="text-lg font-semibold">
              Nenhum cliente cadastrado
            </div>

            <div className="text-sm text-center text-muted-foreground mt-2">
              Cadastre seu primeiro cliente para começar a acompanhar pagamentos
              e tarefas.
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            <div
              className="
                grid
                grid-cols-[2fr_1fr_2fr_auto]
                px-6
                py-4
                border-b
                border-border
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-muted-foreground
              "
            >
              <div>Cliente</div>
              <div>Telefone</div>
              <div>Email</div>
              <div />
            </div>

            {clientes.map((cliente) => (
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
                  <div className="text-sm font-semibold text-foreground">
                    {cliente.nome}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Building size={14} className="text-primary" />

                    {cliente.empresa}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {cliente.telefone}
                </div>

                <div className="text-sm text-muted-foreground">
                  {cliente.email}
                </div>

                <div className="flex justify-end">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deletarClientes(cliente.id);
                    }}
                    className="
                      p-2
                      rounded-lg
                      text-muted-foreground
                      hover:text-red-400
                      hover:bg-red-500/10
                      transition-colors
                    "
                  >
                    <Trash size={18} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
