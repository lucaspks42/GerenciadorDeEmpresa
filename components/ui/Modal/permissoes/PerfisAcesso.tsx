"use client";

import {
  ShieldCheck,
  Plus,
  Users,
  Pencil,
  Trash2,
  RefreshCw,
  LoaderCircle,
  X,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Input } from "../../buttons/input";
import { useSearch } from "@/components/context/SearchContext";
import ModalPerfil from "./components/ModalPerfil";
import Toast from "@/components/ui/Toast";

type Perfil = {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  permissoesVizualizacao: string;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
};

type ToastState = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
};

export default function PerfisAcesso() {
  const { buscar, setBuscar } = useSearch();

  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [perfilEditando, setPerfilEditando] = useState<Perfil | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const [perfilParaExcluir, setPerfilParaExcluir] = useState<Perfil | null>(
    null,
  );

  const [toast, setToast] = useState<ToastState | null>(null);

  // Exibe notificações.
  const mostrarToast = useCallback(
    (titulo: string, mensagem: string, tipo: ToastState["tipo"]) => {
      setToast({ titulo, mensagem, tipo });
    },
    [],
  );

  // Fecha notificações.
  const fecharToast = useCallback(() => {
    setToast(null);
  }, []);

  // Busca os perfis cadastrados.
  const carregarPerfis = useCallback(async () => {
    try {
      setCarregando(true);

      const resposta = await fetch("/api/admin/perfis", {
        method: "GET",
        cache: "no-store",
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao carregar os perfis.");
      }

      setPerfis(Array.isArray(resultado) ? resultado : []);
    } catch (error) {
      mostrarToast(
        "Erro ao carregar",
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os perfis.",
        "erro",
      );
    } finally {
      setCarregando(false);
    }
  }, [mostrarToast]);

  // Carregamento inicial.
  useEffect(() => {
    let ativo = true;

    async function buscarPerfisInicial() {
      try {
        const resposta = await fetch("/api/admin/perfis", {
          method: "GET",
          cache: "no-store",
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error(resultado.erro || "Erro ao carregar os perfis.");
        }

        if (ativo) {
          setPerfis(Array.isArray(resultado) ? resultado : []);
        }
      } catch (error) {
        if (ativo) {
          mostrarToast(
            "Erro ao carregar",
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os perfis.",
            "erro",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void buscarPerfisInicial();

    return () => {
      ativo = false;
    };
  }, [mostrarToast]);

  // Pesquisa e filtragem.
  const perfisFiltrados = useMemo(() => {
    const pesquisa = buscar.trim().toLowerCase();

    if (!pesquisa) return perfis;

    return perfis.filter(
      (perfil) =>
        perfil.nome.toLowerCase().includes(pesquisa) ||
        (perfil.descricao ?? "").toLowerCase().includes(pesquisa),
    );
  }, [perfis, buscar]);

  // Abre o cadastro.
  function abrirNovoPerfil() {
    setPerfilEditando(null);
    setModalAberto(true);
  }

  // Abre a edição.
  function abrirEdicao(perfil: Perfil) {
    setPerfilEditando(perfil);
    setModalAberto(true);
  }

  // Fecha o modal e atualiza a lista.
  function fecharModal() {
    setModalAberto(false);
    setPerfilEditando(null);
    void carregarPerfis();
  }

  // Solicita confirmação de exclusão.
  function solicitarExclusao(perfil: Perfil) {
    setPerfilParaExcluir(perfil);
  }

  // Cancela a exclusão.
  function cancelarExclusao() {
    if (excluindo) return;

    setPerfilParaExcluir(null);
  }

  // Confirma e executa a exclusão.
  async function excluirPerfil() {
    if (!perfilParaExcluir || excluindo) return;

    const perfil = perfilParaExcluir;

    try {
      setExcluindo(perfil.id);

      const resposta = await fetch(`/api/admin/perfis/${perfil.id}`, {
        method: "DELETE",
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Não foi possível excluir o perfil.");
      }

      setPerfis((anteriores) =>
        anteriores.filter((item) => item.id !== perfil.id),
      );

      setPerfilParaExcluir(null);

      mostrarToast(
        "Perfil excluído!",
        resultado.mensagem ||
          `O perfil "${perfil.nome}" foi excluído com sucesso.`,
        "sucesso",
      );
    } catch (error) {
      setPerfilParaExcluir(null);

      mostrarToast(
        "Erro ao excluir",
        error instanceof Error ? error.message : "Erro ao excluir perfil.",
        "erro",
      );
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <>
      {/* Modal de cadastro e edição */}
      {modalAberto && (
        <ModalPerfil onClose={fecharModal} perfilId={perfilEditando?.id} />
      )}

      <main className="p-6">
        <div className="flex flex-col gap-5">
          {/* Cabeçalho */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-400" />

                <h2 className="text-lg font-bold text-white">
                  Perfis cadastrados
                </h2>
              </div>

              <p className="mt-1 text-sm font-medium text-slate-400">
                Cadastre perfis e configure todas as permissões de acesso.
              </p>
            </div>
          </div>

          {/* Pesquisa e botões */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="min-w-0 flex-1">
              <Input
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                placeholder="Pesquisar perfil..."
              />
            </div>

            <button
              type="button"
              onClick={() => void carregarPerfis()}
              disabled={carregando}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.05] disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={carregando ? "animate-spin" : ""}
              />
              Atualizar
            </button>

            <button
              type="button"
              onClick={abrirNovoPerfil}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-500"
            >
              <Plus size={17} />
              Novo perfil
            </button>
          </div>

          {/* Indicadores */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-slate-400">
                Total de perfis
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {perfis.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-slate-400">
                Perfis ativos
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {perfis.filter((perfil) => perfil.ativo).length}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-slate-400">
                Perfis inativos
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-400">
                {perfis.filter((perfil) => !perfil.ativo).length}
              </p>
            </div>
          </div>

          {/* Lista de perfis */}
          <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-2">
                <Users size={17} className="text-blue-400" />

                <h3 className="text-sm font-bold text-white">
                  Lista de perfis
                </h3>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {perfisFiltrados.length} resultado(s)
              </span>
            </div>

            {carregando ? (
              <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-400">
                <LoaderCircle size={19} className="animate-spin" />
                Carregando perfis...
              </div>
            ) : perfisFiltrados.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                <ShieldCheck size={30} className="text-slate-600" />

                <p className="mt-3 text-sm font-semibold text-slate-300">
                  Nenhum perfil encontrado
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Cadastre um perfil ou altere sua pesquisa.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {perfisFiltrados.map((perfil) => (
                  <article
                    key={perfil.id}
                    className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-400">
                        <ShieldCheck size={19} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {perfil.nome}
                          </h4>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              perfil.ativo
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-500/10 text-slate-400"
                            }`}
                          >
                            {perfil.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {perfil.descricao || "Sem descrição cadastrada."}
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          Visualização: {perfil.permissoesVizualizacao}
                        </p>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(perfil)}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => solicitarExclusao(perfil)}
                        disabled={!!excluindo}
                        className="flex items-center gap-2 rounded-lg border border-red-500/15 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal personalizado de confirmação */}
      {perfilParaExcluir && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/[0.10] bg-[#141421] shadow-[0_25px_100px_rgba(0,0,0,0.65)] animate-in zoom-in-95 slide-in-from-bottom-3 duration-200">
            {/* Cabeçalho do modal */}
            <div className="relative overflow-hidden border-b border-white/[0.07] px-6 pb-5 pt-6">
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-red-500/[0.08] blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                    <ShieldAlert size={17} className="text-red-400" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-red-400">
                    Ação irreversível
                  </span>
                </div>

                <button
                  type="button"
                  onClick={cancelarExclusao}
                  disabled={!!excluindo}
                  aria-label="Fechar confirmação"
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative mt-6 flex flex-col items-center text-center">
                <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-red-500/20 bg-gradient-to-br from-red-500/20 to-red-900/10 shadow-[0_0_40px_rgba(239,68,68,0.10)]">
                  <Trash2
                    size={32}
                    strokeWidth={1.8}
                    className="text-red-400"
                  />

                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#141421] bg-red-500">
                    <AlertTriangle size={13} className="text-white" />
                  </div>
                </div>

                <h2 className="mt-6 text-xl font-bold tracking-tight text-white">
                  Excluir este perfil?
                </h2>

                <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-slate-400">
                  Tem certeza de que deseja excluir este perfil de acesso?
                  Confira os dados abaixo antes de continuar.
                </p>
              </div>
            </div>

            {/* Identificação do perfil */}
            <div className="px-6 py-5">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d19] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10">
                    <ShieldCheck size={21} className="text-violet-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Perfil selecionado
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-white">
                      {perfilParaExcluir.nome}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {perfilParaExcluir.descricao ||
                        "Sem descrição cadastrada"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      perfilParaExcluir.ativo
                        ? "border border-emerald-500/15 bg-emerald-500/10 text-emerald-400"
                        : "border border-slate-500/15 bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {perfilParaExcluir.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>

              {/* Aviso */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/[0.06] p-3.5">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <p className="text-xs leading-relaxed text-amber-200/80">
                  Essa ação não poderá ser desfeita. Verifique também se existem
                  usuários vinculados a este perfil antes de excluir.
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] bg-white/[0.015] p-5 sm:flex-row">
              <button
                type="button"
                onClick={cancelarExclusao}
                disabled={!!excluindo}
                className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => void excluirPerfil()}
                disabled={!!excluindo}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:from-red-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {excluindo ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Confirmar exclusão
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          key={`${toast.titulo}-${toast.mensagem}`}
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={fecharToast}
        />
      )}
    </>
  );
}
