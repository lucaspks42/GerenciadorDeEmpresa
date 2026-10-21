"use client";

import ContadoresClientes from "@/components/ui/contadores/ContadoresClientes";
import ContadoresTarefas from "../../components/ui/contadores/ContadoresTarefas";
import ContadoresPagamentos from "@/components/ui/contadores/ContadoresPagamentos";
import ReceitaMensal from "@/components/ui/ReceitaMensal";
import { useSearch } from "@/components/context/SearchContext";

import type { Cliente } from "@/types/Cliente";

import {
  Building,
  Users,
  Wallet,
  CalendarDays,
  ClipboardList,
  Search,
  UserRound,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import InfoCliente from "@/components/ui/Informações/InfoCliente";

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );

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
    const pesquisa = buscar.toLowerCase().trim();

    return (
      cliente.nome.toLowerCase().includes(pesquisa) ||
      cliente.empresa.toLowerCase().includes(pesquisa) ||
      cliente.email.toLowerCase().includes(pesquisa) ||
      cliente.telefone.toLowerCase().includes(pesquisa)
    );
  });

  const atualizarCliente = (clienteAtualizado: Cliente) => {
    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente,
      ),
    );

    setClienteSelecionado(clienteAtualizado);
  };

  return (
    <main className="h-[calc(100dvh-4rem)] overflow-hidden bg-[#0d0d19] text-white">
      {clienteSelecionado && (
        <InfoCliente
          fecharModal={() => setClienteSelecionado(null)}
          cliente={clienteSelecionado}
          atualizarCliente={atualizarCliente}
        />
      )}

      {buscar.length === 0 ? (
        <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-6 py-5 sm:px-10 lg:px-12">
          <div className="relative mb-6 shrink-0">
            <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-blue-600/[0.07] blur-3xl" />

            <div className="relative">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                <Building size={15} />
                Painel administrativo
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Visão geral
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Acompanhe seus clientes, pagamentos e tarefas.
              </p>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="group relative min-h-36 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/[0.07] blur-3xl transition-all group-hover:bg-blue-500/[0.12]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Total de clientes
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
                    <Users size={20} />
                  </div>
                </div>

                <div className="mt-4 text-white">
                  <ContadoresClientes />
                </div>
              </div>
            </div>

            <div className="group relative min-h-36 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:shadow-[0_12px_35px_rgba(16,185,129,0.08)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/[0.07] blur-3xl transition-all group-hover:bg-emerald-500/[0.12]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Receita mensal</span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/[0.09] text-emerald-300">
                    <Wallet size={20} />
                  </div>
                </div>

                <div className="mt-4 text-white">
                  <ReceitaMensal />
                </div>
              </div>
            </div>

            <div className="group relative min-h-36 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/25 hover:shadow-[0_12px_35px_rgba(245,158,11,0.08)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/[0.07] blur-3xl transition-all group-hover:bg-amber-500/[0.12]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Pagamentos próximos
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-500/[0.09] text-amber-300">
                    <CalendarDays size={20} />
                  </div>
                </div>

                <div className="mt-4 text-white">
                  <ContadoresPagamentos />
                </div>
              </div>
            </div>

            <div className="group relative min-h-36 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/25 hover:shadow-[0_12px_35px_rgba(168,85,247,0.08)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/[0.07] blur-3xl transition-all group-hover:bg-purple-500/[0.12]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Tarefas pendentes
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/[0.09] text-purple-300">
                    <ClipboardList size={20} />
                  </div>
                </div>

                <div className="mt-4 text-white">
                  <ContadoresTarefas />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f]">
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Próximos pagamentos
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Acompanhe os pagamentos programados.
                  </p>
                </div>
              </div>

              <ArrowUpRight size={18} className="text-slate-600" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                <CalendarDays size={22} />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-300">
                Nenhum pagamento próximo
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Quando houver pagamentos programados, eles aparecerão aqui.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto h-full max-w-7xl overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
              <Search size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Resultados da pesquisa
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {itemsFiltrados.length} clientes encontrados
              </p>
            </div>
          </div>

          <div className="max-h-[calc(100%-5rem)] overflow-y-auto rounded-2xl border border-white/[0.07] bg-[#11111f]">
            <div className="hidden grid-cols-[1.5fr_1fr_1.5fr_1fr] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-6 py-4 md:grid">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Cliente
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Telefone
              </span>

              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                E-mail
              </span>

              <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Empresa
              </span>
            </div>

            {itemsFiltrados.length > 0 ? (
              itemsFiltrados.map((cliente) => (
                <button
                  type="button"
                  key={cliente.id}
                  onClick={() => setClienteSelecionado(cliente)}
                  className="group grid w-full grid-cols-1 gap-4 border-b border-white/[0.06] px-5 py-5 text-left transition-colors last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[1.5fr_1fr_1.5fr_1fr] md:items-center md:gap-4 md:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                      <UserRound size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {cliente.nome}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                        <Building size={13} />
                        {cliente.empresa}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                    <Phone size={14} className="shrink-0 text-slate-500" />
                    <span className="truncate">{cliente.telefone}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                    <Mail size={14} className="shrink-0 text-slate-500" />
                    <span className="truncate">{cliente.email}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm text-slate-400 md:justify-end">
                    <span className="truncate md:hidden">
                      {cliente.empresa}
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="shrink-0 text-slate-600 transition-all group-hover:text-blue-400"
                    />
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                  <Search size={25} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-300">
                  Nenhum cliente encontrado
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  Tente pesquisar utilizando outro nome, empresa, telefone ou
                  endereço de e-mail.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
