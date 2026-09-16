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

  const atualizarCliente = (clienteAtualizado: Cliente) => {
    setClientes((clientes) =>
      clientes.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente,
      ),
    );

    setClienteSelecionado(clienteAtualizado);
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
          atualizarCliente={atualizarCliente}
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
              border-white/40
              border
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

            <div className="text-sm text-center mt-2 text-white">
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
            ></div>

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
                    onClick={(e) => {
                      e.stopPropagation();
                      deletarClientes(cliente.id);
                    }}
                    className="
                      p-2
                      rounded-lg
                      hover:text-red-400
                      hover:bg-red-500/10
                      transition-colors
                      text-white
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
