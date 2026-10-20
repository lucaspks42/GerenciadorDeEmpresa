"use client";

import type { Cliente } from "@/types/Cliente";

import InfoCliente from "@/components/ui/InfoCliente";
import ModalCliente from "@/components/ui/ModalCliente";
import { useSearch } from "@/components/context/SearchContext";

import { Building, Trash, Users, Search, Plus } from "lucide-react";
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
        const erroTexto = await resposta.text();

        console.log("STATUS HTTP:", resposta.status);
        console.log("RESPOSTA DA API:", erroTexto);

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
    <main className="min-h-[calc(100dvh-4rem)] bg-[#0d0d19] text-white">
      {modalAberto && (
        <ModalCliente
          fecharModal={fecharModal}
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

      <div className="mx-auto max-w-7xl px-6 py-7 sm:px-10 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <Users size={15} />
              Gerenciamento
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Clientes
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Gerencie seus clientes e acompanhe seus pagamentos.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-500"
          >
            <Plus size={17} />
            Novo cliente
          </button>
        </div>

        {clientes.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#11111f] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
              <Users size={25} />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white">
              Nenhum cliente cadastrado
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Cadastre seu primeiro cliente para começar a acompanhar pagamentos
              e tarefas.
            </p>

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <Plus size={16} />
              Cadastrar primeiro cliente
            </button>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-[#11111f] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-base font-semibold text-slate-300">
              Nenhum cliente encontrado
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Nenhum resultado para {buscar}.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f]">
            <div className="hidden grid-cols-[2fr_1fr_2fr_52px] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-6 py-4 md:grid">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Cliente
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Telefone
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                E-mail
              </span>

              <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Ação
              </span>
            </div>

            {itensFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                className="grid grid-cols-1 items-center gap-4 border-b border-white/[0.06] px-5 py-5 transition-colors last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[2fr_1fr_2fr_52px] md:gap-4 md:px-6"
              >
                <button
                  type="button"
                  onClick={() => setClienteSelecionado(cliente)}
                  className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                    <Building size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {cliente.nome}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {cliente.empresa}
                    </p>
                  </div>
                </button>

                <div className="truncate text-sm text-slate-400">
                  <span className="mr-2 text-xs text-slate-600 md:hidden">
                    Telefone:
                  </span>
                  {cliente.telefone}
                </div>

                <div className="min-w-0 truncate text-sm text-slate-400">
                  <span className="mr-2 text-xs text-slate-600 md:hidden">
                    E-mail:
                  </span>
                  {cliente.email}
                </div>

                <div className="flex justify-end md:justify-center">
                  <button
                    type="button"
                    aria-label={`Excluir ${cliente.nome}`}
                    onClick={() => deletarCliente(cliente.id)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
