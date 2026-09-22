"use client";

import type { Cliente } from "@/types/Cliente";

import InfoCliente from "@/components/ui/InfoCliente";
import ModalCliente from "@/components/ui/ModalCliente";
import { useSearch } from "@/components/context/SearchContext";

import { Building, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function Clientes() {
  const [modalAberto, setModalAberto] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const { buscar, clienteSelecionado, setClienteSelecionado } = useSearch();

  useEffect(() => {
    async function buscarClientes() {
      try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar clientes");
        }

        const clientesDoBanco: Cliente[] = await resposta.json();

        setClientes(clientesDoBanco);
      } catch (erro) {
        console.error("Erro ao buscar clientes:", erro);
      }
    }

    buscarClientes();
  }, []);

  const fecharModal = () => {
    setModalAberto(false);
  };

  const adicionarCliente = (cliente: Cliente) => {
    setClientes((clientesAtuais) => [...clientesAtuais, cliente]);
  };

  const atualizarCliente = (clienteAtualizado: Cliente) => {
    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente,
      ),
    );

    setClienteSelecionado(clienteAtualizado);
  };

  async function deletarCliente(id: number) {
    try {
      const resposta = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar cliente");
      }

      setClientes((clientesAtuais) =>
        clientesAtuais.filter((cliente) => cliente.id !== id),
      );

      if (clienteSelecionado?.id === id) {
        setClienteSelecionado(null);
      }
    } catch (erro) {
      console.error("Erro ao deletar cliente:", erro);
    }
  }

  const itensFiltrados = clientes.filter((cliente) => {
    const pesquisa = buscar.toLowerCase().trim();

    if (!pesquisa) {
      return true;
    }

    return (
      cliente.nome.toLowerCase().includes(pesquisa) ||
      cliente.empresa.toLowerCase().includes(pesquisa) ||
      cliente.email.toLowerCase().includes(pesquisa) ||
      cliente.telefone.toLowerCase().includes(pesquisa)
    );
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Modal para adicionar cliente */}
      {modalAberto && (
        <ModalCliente
          fecharModal={fecharModal}
          adicionarCliente={adicionarCliente}
        />
      )}

      {/* Informações do cliente */}
      {clienteSelecionado && (
        <InfoCliente
          fecharModal={() => setClienteSelecionado(null)}
          cliente={clienteSelecionado}
          atualizarCliente={atualizarCliente}
        />
      )}

      <div className="px-10 py-8">
        {/* Cabeçalho da página */}
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

        {/* Nenhum cliente cadastrado */}
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

            <div className="text-sm text-center mt-2 text-muted-foreground">
              Cadastre seu primeiro cliente para começar a acompanhar pagamentos
              e tarefas.
            </div>
          </div>
        ) : itensFiltrados.length === 0 ? (
          /* Nenhum resultado da pesquisa */
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              h-60
              border
              border-dashed
              border-border
              rounded-2xl
              bg-card/50
            "
          >
            <div className="text-lg font-semibold">
              Nenhum cliente encontrado
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Nenhum resultado para {buscar}.
            </p>
          </div>
        ) : (
          /* Lista de clientes */
          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            {/* Cabeçalho da tabela */}
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

              <div></div>
            </div>

            {/* Clientes */}
            {itensFiltrados.map((cliente) => (
              <button
                key={cliente.id}
                type="button"
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
                {/* Nome + empresa */}
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {cliente.nome}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Building size={14} className="text-primary" />

                    {cliente.empresa}
                  </div>
                </div>

                {/* Telefone */}
                <div className="text-sm text-white">{cliente.telefone}</div>

                {/* Email */}
                <div className="text-sm text-white">{cliente.email}</div>

                {/* Excluir */}
                <div className="flex justify-end text-white">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deletarCliente(cliente.id);
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
