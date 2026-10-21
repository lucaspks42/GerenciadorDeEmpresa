"use client";

import ConcluirPagamentos from "@/components/ui/Modal/ConcluirPagamento";
import { useSearch } from "@/components/context/SearchContext";
import type { Pagamento } from "@/types/Pagamentos";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  CircleCheck,
  Clock,
  CreditCard,
  UserRound,
} from "lucide-react";

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [pagamentoSelecionado, setPagamentoSelecionado] =
    useState<Pagamento | null>(null);

  const { buscar } = useSearch();

  function atualizarPagamento(pagamentoAtualizado: Pagamento) {
    setPagamentos((pagamentosAtuais) =>
      pagamentosAtuais.map((pagamento) =>
        pagamento.id === pagamentoAtualizado.id
          ? pagamentoAtualizado
          : pagamento,
      ),
    );
  }

  useEffect(() => {
    async function buscarPagamentos() {
      try {
        const resposta = await fetch("/api/pagamentos");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const dados: Pagamento[] = await resposta.json();

        setPagamentos(dados);
      } catch (erro) {
        console.error("Erro:", erro);
      }
    }

    buscarPagamentos();
  }, []);

  const itensFiltrados = pagamentos.filter((pagamento) => {
    const pesquisa = buscar.toLowerCase().trim();

    return (
      pagamento.nome.toLowerCase().includes(pesquisa) ||
      pagamento.empresa.toLowerCase().includes(pesquisa) ||
      pagamento.status.toLowerCase().includes(pesquisa)
    );
  });

  const totalPago = itensFiltrados
    .filter((pagamento) => pagamento.status === "Pago")
    .reduce((total, pagamento) => total + pagamento.valor, 0);

  const totalPendente = itensFiltrados
    .filter((pagamento) => pagamento.status !== "Pago")
    .reduce((total, pagamento) => total + pagamento.valor, 0);

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-[#0d0d19] text-white">
      {pagamentoSelecionado && (
        <ConcluirPagamentos
          pagamento={pagamentoSelecionado}
          fechar={() => setPagamentoSelecionado(null)}
          atualizarPagamento={atualizarPagamento}
        />
      )}

      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-6 py-6 sm:px-10 lg:px-12">
        <div className="mb-6 grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-[#11111f] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total recebido</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {totalPago.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/[0.08] text-emerald-400">
                <CircleCheck size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#11111f] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total pendente</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {totalPendente.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-500/[0.08] text-amber-400">
                <Clock size={21} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Pagamentos</h1>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhe os pagamentos dos seus clientes.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#11111f] px-3 py-2">
            <CreditCard size={15} className="text-blue-400" />
            <span className="text-xs text-slate-400">
              {itensFiltrados.length}{" "}
              {itensFiltrados.length === 1 ? "pagamento" : "pagamentos"}
            </span>
          </div>
        </div>

        {itensFiltrados.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#11111f]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
              <CreditCard size={25} />
            </div>

            <p className="text-sm font-medium text-slate-300">
              Nenhum pagamento encontrado
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Os pagamentos aparecerão aqui quando estiverem disponíveis.
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto pr-2">
            <div className="space-y-3 pb-2">
              {itensFiltrados.map((pagamento) => {
                const data = new Date(pagamento.data_vencimento + "T00:00:00");

                const dataFormatada = data.toLocaleDateString("pt-BR");

                const pago = pagamento.status === "Pago";

                return (
                  <button
                    type="button"
                    key={pagamento.id}
                    onClick={() => setPagamentoSelecionado(pagamento)}
                    className="group w-full rounded-xl border border-white/[0.07] bg-[#11111f] px-5 py-5 text-left transition-all hover:border-blue-400/20 hover:bg-[#151525]"
                  >
                    <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[2fr_1fr_1.5fr_auto] sm:gap-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-blue-300">
                          <UserRound size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
                            {pagamento.nome}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                            <Building2 size={12} />
                            {pagamento.empresa}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 sm:hidden">
                          Valor
                        </p>

                        <p className="text-sm font-semibold text-white">
                          {pagamento.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 sm:hidden">
                          Vencimento
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-400">
                          <CalendarDays size={15} className="text-slate-500" />
                          {dataFormatada}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                            pago
                              ? "border-emerald-400/15 bg-emerald-500/[0.08] text-emerald-400"
                              : "border-amber-400/15 bg-amber-500/[0.08] text-amber-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              pago ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          {pagamento.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
