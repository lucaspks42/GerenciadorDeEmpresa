"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  UserRound,
  Mail,
  CalendarDays,
  Check,
  XCircle,
  LoaderCircle,
  Inbox,
} from "lucide-react";

import { Input } from "./Input";
import Toast from "./Toast";

type ModalPermissaoProps = {
  onClose: () => void;
};

type Solicitacao = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

type ToastData = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
};

type Processamento = {
  id: number;
  acao: "aprovar" | "recusar";
};

export default function ModalPermissao({ onClose }: ModalPermissaoProps) {
  const [pesquisa, setPesquisa] = useState("");
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [processando, setProcessando] = useState<Processamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  const fecharToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    async function buscarSolicitacoes() {
      try {
        const resposta = await fetch("/api/admin/solicitacoes");

        const texto = await resposta.text();

        let dados;

        try {
          dados = JSON.parse(texto);
        } catch {
          dados = null;
        }

        if (!resposta.ok) {
          console.error("Status HTTP:", resposta.status);
          console.error("Resposta da API:", texto);

          throw new Error(
            dados?.erro ||
              `Erro HTTP ${resposta.status} ao buscar solicitações.`,
          );
        }

        setSolicitacoes(dados);
      } catch (erro) {
        console.error("Erro ao buscar solicitações:", erro);

        setToast({
          titulo: "Erro ao carregar",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar as solicitações.",
          tipo: "erro",
        });
      } finally {
        setCarregando(false);
      }
    }

    buscarSolicitacoes();
  }, []);

  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    const termo = pesquisa.toLowerCase();

    return (
      solicitacao.nome.toLowerCase().includes(termo) ||
      solicitacao.email.toLowerCase().includes(termo)
    );
  });

  async function aprovarSolicitacao(id: number) {
    if (processando) return;

    setProcessando({ id, acao: "aprovar" });

    try {
      const resposta = await fetch(`/api/admin/solicitacoes/${id}/aprovar`, {
        method: "POST",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao aprovar solicitação");
      }

      setSolicitacoes((anterior) =>
        anterior.filter((solicitacao) => solicitacao.id !== id),
      );

      setToast({
        titulo: "Funcionário aprovado!",
        mensagem: dados.mensagem || "O usuário foi aprovado com sucesso.",
        tipo: "sucesso",
      });
    } catch (erro) {
      console.error("Erro ao aprovar solicitação:", erro);

      setToast({
        titulo: "Erro ao aprovar",
        mensagem:
          erro instanceof Error
            ? erro.message
            : "Erro inesperado ao aprovar solicitação.",
        tipo: "erro",
      });
    } finally {
      setProcessando(null);
    }
  }

  async function recusarSolicitacao(id: number) {
    if (processando) return;

    setProcessando({ id, acao: "recusar" });

    try {
      const resposta = await fetch(`/api/admin/solicitacoes/${id}/recusar`, {
        method: "POST",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao recusar solicitação");
      }

      setSolicitacoes((anterior) =>
        anterior.filter((solicitacao) => solicitacao.id !== id),
      );

      setToast({
        titulo: "Solicitação recusada",
        mensagem: dados.mensagem || "A solicitação foi recusada.",
        tipo: "sucesso",
      });
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);

      setToast({
        titulo: "Erro ao recusar",
        mensagem:
          erro instanceof Error
            ? erro.message
            : "Erro inesperado ao recusar solicitação.",
        tipo: "erro",
      });
    } finally {
      setProcessando(null);
    }
  }

  function formatarData(data: string) {
    const dataValida = new Date(data);

    if (Number.isNaN(dataValida.getTime())) {
      return "Data indisponível";
    }

    return dataValida.toLocaleDateString("pt-BR");
  }

  return (
    <>
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6 font-bold">
        <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-[0_25px_100px_rgba(0,0,0,0.55)]">
          <header className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-white/[0.07] px-6 py-5 sm:px-8">
            <div className="pointer-events-none absolute -right-12 -top-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-300">
                <ShieldCheck size={22} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Solicitações de acesso
                  </h2>

                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                    {solicitacoes.length} pendentes
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Verifique e gerencie os pedidos de acesso à empresa.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={18} />
            </button>
          </header>

          <div className="overflow-y-auto px-6 pb-7 sm:px-8 py-10">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d19]/60">
              <div className="hidden grid-cols-[1.5fr_1.5fr_0.8fr_1fr] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-6 py-4 md:grid">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Solicitante
                </span>

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  E-mail
                </span>

                <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Data
                </span>

                <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Ações
                </span>
              </div>

              {carregando ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                  <LoaderCircle
                    size={28}
                    className="animate-spin text-blue-400"
                  />
                  <p className="text-sm text-slate-400">
                    Carregando solicitações...
                  </p>
                </div>
              ) : solicitacoesFiltradas.length > 0 ? (
                solicitacoesFiltradas.map((solicitacao) => (
                  <div
                    key={solicitacao.id}
                    className="grid grid-cols-1 gap-5 border-b border-white/[0.06] px-5 py-5 transition-colors last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[1.5fr_1.5fr_0.8fr_1fr] md:items-center md:gap-4 md:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                        <UserRound size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {solicitacao.nome}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          Novo cadastro
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                      <Mail size={15} className="shrink-0 text-slate-500" />
                      <span className="truncate">{solicitacao.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 md:justify-center">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-slate-500"
                      />
                      <span>{formatarData(solicitacao.criadoEm)}</span>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 md:justify-end">
                      <button
                        onClick={() => aprovarSolicitacao(solicitacao.id)}
                        disabled={processando !== null}
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 md:flex-none"
                      >
                        {processando?.id === solicitacao.id &&
                        processando.acao === "aprovar" ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Aprovar
                      </button>

                      <button
                        onClick={() => recusarSolicitacao(solicitacao.id)}
                        disabled={processando !== null}
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 text-xs font-semibold text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40 md:flex-none"
                      >
                        {processando?.id === solicitacao.id &&
                        processando.acao === "recusar" ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                        Recusar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                    <Inbox size={25} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-300">
                    {pesquisa
                      ? "Nenhum resultado encontrado"
                      : "Nenhuma solicitação pendente"}
                  </h3>

                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                    {pesquisa
                      ? "Tente pesquisar utilizando outro nome ou endereço de e-mail."
                      : "Quando alguém solicitar acesso à empresa, a solicitação aparecerá aqui."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rodapé */}
          <footer className="flex items-center justify-between border-t border-white/[0.07] bg-[#0d0d19]/70 px-6 py-4 sm:px-8">
            <p className="hidden text-xs text-slate-500 sm:block">
              Gerencie cuidadosamente os acessos à empresa.
            </p>

            <button
              onClick={onClose}
              className="ml-auto h-10 rounded-xl border border-white/[0.09] px-5 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white"
            >
              Fechar
            </button>
          </footer>
        </div>
      </main>

      {toast && (
        <Toast
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={fecharToast}
        />
      )}
    </>
  );
}
