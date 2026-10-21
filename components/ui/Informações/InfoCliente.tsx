"use client";

import {
  X,
  Pen,
  UserRound,
  Building,
  Mail,
  Phone,
  CalendarDays,
  Wallet,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

import type { Cliente } from "@/types/Cliente";
import type { Pagamento } from "@/types/Pagamentos";

import ConcluirPagamentos from "../Modal/ConcluirPagamento";

export type InfoClienteProps = {
  fecharModal: () => void;
  cliente: Cliente;
  atualizarCliente: (cliente: Cliente) => void;
};

export default function InfoCliente({
  fecharModal,
  cliente,
  atualizarCliente,
}: InfoClienteProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  const [nome, setNome] = useState(cliente.nome);
  const [empresa, setEmpresa] = useState(cliente.empresa);
  const [telefone, setTelefone] = useState(cliente.telefone);
  const [email, setEmail] = useState(cliente.email);

  const [valorProduto, setValorProduto] = useState(cliente.valorProduto);
  const [valorMensalidade, setValorMensalidade] = useState(
    cliente.valorMensalidade,
  );
  const [diaVencimento, setDiaVencimento] = useState(cliente.diaVencimento);

  const [editando, setEditando] = useState(false);

  const [pagamentoSelecionado, setPagamentoSelecionado] =
    useState<Pagamento | null>(null);

  useEffect(() => {
    async function buscarPagamentos() {
      try {
        const resposta = await fetch(`/api/clientes/${cliente.id}/pagamentos`);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const pagamentosDoBanco: Pagamento[] = await resposta.json();

        setPagamentos(pagamentosDoBanco);
      } catch (erro) {
        console.error("Erro ao buscar pagamentos:", erro);
      }
    }

    buscarPagamentos();
  }, [cliente.id]);

  async function salvarAlterações() {
    const dados = {
      nome,
      empresa,
      telefone,
      email,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    };

    try {
      const resposta = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar alterações");
      }

      const clienteAtualizado: Cliente = {
        ...cliente,
        nome,
        empresa,
        telefone,
        email,
        valorProduto,
        valorMensalidade,
        diaVencimento,
      };

      atualizarCliente(clienteAtualizado);

      setEditando(false);

      const respostaPagamentos = await fetch(
        `/api/clientes/${cliente.id}/pagamentos`,
      );

      if (respostaPagamentos.ok) {
        const pagamentosAtualizados: Pagamento[] =
          await respostaPagamentos.json();

        setPagamentos(pagamentosAtualizados);
      }
    } catch (erro) {
      console.error("Erro ao salvar alterações:", erro);
    }
  }

  const classeInput =
    "w-full rounded-xl border border-white/[0.08] bg-[#0d0d19] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-default disabled:border-white/[0.05] disabled:bg-white/[0.02] disabled:text-slate-300";

  const classeLabel = "text-xs font-medium text-slate-500";

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6">
      {pagamentoSelecionado && (
        <ConcluirPagamentos
          pagamento={pagamentoSelecionado}
          fechar={() => setPagamentoSelecionado(null)}
          atualizarPagamento={(pagamentoAtualizado) => {
            setPagamentos((pagamentosAtuais) =>
              pagamentosAtuais.map((pagamento) =>
                pagamento.id === pagamentoAtualizado.id
                  ? pagamentoAtualizado
                  : pagamento,
              ),
            );
          }}
        />
      )}

      <div className="flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-2xl shadow-black/40">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-white">
                {cliente.nome}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Informações do cliente
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setEditando(!editando)}
              title={editando ? "Modo de edição ativo" : "Editar cliente"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                editando
                  ? "bg-blue-500/10 text-blue-300"
                  : "text-slate-500 hover:bg-blue-500/10 hover:text-blue-300"
              }`}
            >
              <Pen size={18} />
            </button>

            <button
              type="button"
              onClick={fecharModal}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Dados cadastrais
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Informações e dados de contato do cliente.
              </p>
            </div>

            {editando && (
              <span className="rounded-lg border border-blue-400/15 bg-blue-500/[0.08] px-3 py-1.5 text-[11px] font-semibold text-blue-300">
                Editando informações
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Nome</label>

              <div className="relative">
                <UserRound
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  value={nome}
                  disabled={!editando}
                  onChange={(e) => setNome(e.target.value)}
                  className={`${classeInput} pl-11`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Empresa</label>

              <div className="relative">
                <Building
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  value={empresa}
                  disabled={!editando}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className={`${classeInput} pl-11`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>E-mail</label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  value={email}
                  disabled={!editando}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${classeInput} pl-11`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Telefone</label>

              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    value={telefone}
                    disabled={!editando}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={`${classeInput} pl-11`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const numero = telefone.replace(/\D/g, "");

                    if (!numero) return;

                    window.open(`https://wa.me/55${numero}`, "_blank");
                  }}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/[0.08] text-emerald-400 transition-all hover:bg-emerald-500/15 hover:text-emerald-300"
                  title="Abrir WhatsApp"
                >
                  <FaWhatsapp size={21} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Pagamento</label>

              <div className="relative">
                <Wallet
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="number"
                  value={valorProduto}
                  disabled={!editando}
                  onChange={(e) => setValorProduto(Number(e.target.value))}
                  className={`${classeInput} pl-11`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Mensalidade</label>

              <div className="relative">
                <Wallet
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="number"
                  value={valorMensalidade}
                  disabled={!editando}
                  onChange={(e) => setValorMensalidade(Number(e.target.value))}
                  className={`${classeInput} pl-11`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Dia de vencimento</label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="number"
                  value={diaVencimento}
                  disabled={!editando}
                  onChange={(e) => setDiaVencimento(Number(e.target.value))}
                  className={`${classeInput} pl-11`}
                />
              </div>
            </div>
          </div>

          {editando && (
            <div className="mt-6 flex justify-end gap-3 border-b border-white/[0.07] pb-6">
              <button
                type="button"
                onClick={() => {
                  setNome(cliente.nome);
                  setEmpresa(cliente.empresa);
                  setTelefone(cliente.telefone);
                  setEmail(cliente.email);
                  setValorProduto(cliente.valorProduto);
                  setValorMensalidade(cliente.valorMensalidade);
                  setDiaVencimento(cliente.diaVencimento);
                  setEditando(false);
                }}
                className="cursor-pointer rounded-xl border border-white/[0.09] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={salvarAlterações}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                <Save size={16} />
                Salvar alterações
              </button>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0d0d19]/60 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Próximos pagamentos
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Histórico e próximos vencimentos.
                  </p>
                </div>
              </div>

              <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400">
                {pagamentos.length} registros
              </span>
            </div>

            {pagamentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] px-5 py-10 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                  <CalendarDays size={20} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-300">
                  Nenhum pagamento cadastrado
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Os pagamentos deste cliente aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
                {pagamentos.map((pagamento) => {
                  const [ano, mes, dia] = pagamento.data_vencimento.split("-");

                  return (
                    <button
                      type="button"
                      key={pagamento.id}
                      onClick={() => setPagamentoSelecionado(pagamento)}
                      className="flex w-full cursor-pointer flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#11111f] p-4 text-left transition-all hover:border-blue-400/25 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.07] text-blue-300">
                          <CalendarDays size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            Vencimento
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {dia}/{mes}/{ano}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className="text-sm font-semibold text-white">
                          {pagamento.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>

                        <span
                          className={
                            pagamento.status === "Pago"
                              ? "rounded-full border border-emerald-400/15 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-semibold text-emerald-300"
                              : "rounded-full border border-amber-400/15 bg-amber-500/[0.08] px-3 py-1 text-[11px] font-semibold text-amber-300"
                          }
                        >
                          {pagamento.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
