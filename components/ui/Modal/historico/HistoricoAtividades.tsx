"use client";

import {
  Activity,
  CalendarDays,
  ClipboardList,
  Eye,
  FileText,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
  ChevronRight,
  History,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import ModalDetalhesHistorico from "./ModalDetalhesHistorico";

type Atividade = {
  id: number;
  usuarioId: number | null;
  usuarioNome: string | null;
  modulo: string;
  acao: string;
  descricao: string;
  entidade: string | null;
  entidadeId: string | null;
  dadosAnteriores: Record<string, unknown> | null;
  dadosNovos: Record<string, unknown> | null;
  ip: string | null;
  userAgent: string | null;
  status: string;
  criadoEm: string;
};

type HistoricoAtividadesProps = {
  onClose: () => void;
};

type Filtros = {
  busca: string;
  modulo: string;
  acao: string;
  status: string;
  dataInicio: string;
  dataFim: string;
};

type RespostaHistorico = {
  atividades: Atividade[];
  pagina: number;
  limite: number;
  temMais: boolean;
  erro?: string;
};

const filtrosIniciais: Filtros = {
  busca: "",
  modulo: "",
  acao: "",
  status: "",
  dataInicio: "",
  dataFim: "",
};

const classeInput =
  "h-11 w-full rounded-xl border border-white/[0.08] bg-[#0b0b15] px-3.5 text-sm text-gray-200 outline-none transition-all placeholder:text-gray-600 hover:border-white/[0.14] focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10";

function formatarData(data: string) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Data não disponível";
  }

  return dataConvertida.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nomeModulo(modulo: string) {
  const nomes: Record<string, string> = {
    USUARIOS: "Usuários",
    CLIENTES: "Clientes",
    FINANCEIRO: "Financeiro",
    EMPRESAS: "Empresas",
    VENDAS: "Vendas",
    COMPRAS: "Compras",
    ESTOQUE: "Estoque",
    CONFIGURACOES: "Configurações",
    RELATORIOS: "Relatórios",
  };

  return nomes[modulo] || modulo;
}

function nomeAcao(acao: string) {
  const nomes: Record<string, string> = {
    CADASTRO: "Cadastro",
    EDICAO: "Edição",
    EXCLUSAO: "Exclusão",
  };

  return nomes[acao] || acao;
}

function iconeAcao(acao: string) {
  switch (acao) {
    case "CADASTRO":
      return <Plus size={17} />;
    case "EDICAO":
      return <Pencil size={16} />;
    case "EXCLUSAO":
      return <Trash2 size={16} />;
    default:
      return <Activity size={16} />;
  }
}

function corAcao(acao: string) {
  switch (acao) {
    case "CADASTRO":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "EDICAO":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    case "EXCLUSAO":
      return "border-red-500/20 bg-red-500/10 text-red-400";
    default:
      return "border-white/10 bg-white/5 text-gray-300";
  }
}

export default function HistoricoAtividades({
  onClose,
}: HistoricoAtividadesProps) {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atividadeSelecionada, setAtividadeSelecionada] =
    useState<Atividade | null>(null);

  const carregarAtividades = useCallback(
    async (paginaSolicitada = 1, filtrosAplicados: Filtros = filtros) => {
      try {
        setCarregando(true);
        setErro("");

        const parametros = new URLSearchParams({
          pagina: String(paginaSolicitada),
          busca: filtrosAplicados.busca,
          modulo: filtrosAplicados.modulo,
          acao: filtrosAplicados.acao,
          status: filtrosAplicados.status,
          dataInicio: filtrosAplicados.dataInicio,
          dataFim: filtrosAplicados.dataFim,
        });

        const resposta = await fetch(
          `/api/admin/historico?${parametros.toString()}`,
          { cache: "no-store" },
        );

        const textoResposta = await resposta.text();

        let resultado: RespostaHistorico;

        try {
          resultado = JSON.parse(textoResposta) as RespostaHistorico;
        } catch {
          console.error(
            "Resposta inválida da API de histórico:",
            resposta.status,
            textoResposta,
          );

          throw new Error(
            `A API retornou uma resposta inválida (HTTP ${resposta.status}).`,
          );
        }

        if (!resposta.ok) {
          throw new Error(
            resultado.erro ||
              `Erro ao carregar histórico (HTTP ${resposta.status}).`,
          );
        }

        if (!Array.isArray(resultado.atividades)) {
          throw new Error("A API retornou uma lista de atividades inválida.");
        }

        setAtividades((anteriores) =>
          paginaSolicitada === 1
            ? resultado.atividades
            : [...anteriores, ...resultado.atividades],
        );

        setPagina(paginaSolicitada);
        setTemMais(Boolean(resultado.temMais));
      } catch (erro) {
        console.error("Erro ao carregar atividades:", erro);

        setErro(
          erro instanceof Error
            ? erro.message
            : "Não foi possível carregar o histórico.",
        );
      } finally {
        setCarregando(false);
      }
    },
    [filtros],
  );

  // Carregamento inicial sem atualização síncrona dentro do efeito.
  useEffect(() => {
    let ativo = true;

    Promise.resolve().then(() => {
      if (ativo) {
        void carregarAtividades(1, filtrosIniciais);
      }
    });

    return () => {
      ativo = false;
    };
  }, [carregarAtividades]);

  // Fechamento pelo Escape.
  useEffect(() => {
    function pressionarEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        if (atividadeSelecionada) {
          setAtividadeSelecionada(null);
        } else {
          onClose();
        }
      }
    }

    window.addEventListener("keydown", pressionarEscape);

    return () => {
      window.removeEventListener("keydown", pressionarEscape);
    };
  }, [atividadeSelecionada, onClose]);

  function atualizarFiltro(campo: keyof Filtros, valor: string) {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
  }

  function aplicarFiltros() {
    if (
      filtros.dataInicio &&
      filtros.dataFim &&
      filtros.dataInicio > filtros.dataFim
    ) {
      setErro("A data inicial não pode ser posterior à data final.");
      return;
    }

    void carregarAtividades(1, filtros);
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais);
    void carregarAtividades(1, filtrosIniciais);
  }

  const totalCadastros = atividades.filter(
    (atividade) => atividade.acao === "CADASTRO",
  ).length;

  const totalEdicoes = atividades.filter(
    (atividade) => atividade.acao === "EDICAO",
  ).length;

  const totalExclusoes = atividades.filter(
    (atividade) => atividade.acao === "EXCLUSAO",
  ).length;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-2 backdrop-blur-md sm:p-5"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-historico"
        className="flex max-h-[94dvh] w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c0c16] shadow-[0_25px_100px_rgba(0,0,0,0.55)]"
      >
        {/* CABEÇALHO */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.07] bg-[#10101c] px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
              <History size={23} />
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                <ShieldCheck size={13} />
                Administração do sistema
              </div>

              <h2
                id="titulo-historico"
                className="text-lg font-semibold tracking-tight text-white sm:text-xl"
              >
                Histórico de atividades
              </h2>

              <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
                Monitoramento e rastreabilidade das ações realizadas no sistema.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar histórico"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={19} />
          </button>
        </header>

        {/* CONTEÚDO */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6 lg:p-7">
          {/* INDICADORES */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/[0.07] bg-[#11111e] p-4 transition hover:border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  Cadastros
                </span>
                <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/10 p-2 text-emerald-400">
                  <Plus size={17} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {totalCadastros}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Registros carregados
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.07] bg-[#11111e] p-4 transition hover:border-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  Edições
                </span>
                <div className="rounded-lg border border-blue-500/15 bg-blue-500/10 p-2 text-blue-400">
                  <Pencil size={16} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {totalEdicoes}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Registros carregados
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.07] bg-[#11111e] p-4 transition hover:border-red-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  Exclusões
                </span>
                <div className="rounded-lg border border-red-500/15 bg-red-500/10 p-2 text-red-400">
                  <Trash2 size={17} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {totalExclusoes}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Registros carregados
              </p>
            </div>
          </div>

          {/* FILTROS */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111e]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Filter size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Filtrar atividades
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    Refine os registros por usuário, módulo, ação ou período.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Pesquisa
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      value={filtros.busca}
                      onChange={(e) => atualizarFiltro("busca", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") aplicarFiltros();
                      }}
                      placeholder="Usuário ou descrição..."
                      className={`${classeInput} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Módulo
                  </label>
                  <select
                    value={filtros.modulo}
                    onChange={(e) => atualizarFiltro("modulo", e.target.value)}
                    className={classeInput}
                  >
                    <option value="">Todos os módulos</option>
                    <option value="USUARIOS">Usuários</option>
                    <option value="CLIENTES">Clientes</option>
                    <option value="FINANCEIRO">Financeiro</option>
                    <option value="EMPRESAS">Empresas</option>
                    <option value="VENDAS">Vendas</option>
                    <option value="COMPRAS">Compras</option>
                    <option value="ESTOQUE">Estoque</option>
                    <option value="CONFIGURACOES">Configurações</option>
                    <option value="RELATORIOS">Relatórios</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Tipo de ação
                  </label>
                  <select
                    value={filtros.acao}
                    onChange={(e) => atualizarFiltro("acao", e.target.value)}
                    className={classeInput}
                  >
                    <option value="">Todas as ações</option>
                    <option value="CADASTRO">Cadastro</option>
                    <option value="EDICAO">Edição</option>
                    <option value="EXCLUSAO">Exclusão</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Status
                  </label>
                  <select
                    value={filtros.status}
                    onChange={(e) => atualizarFiltro("status", e.target.value)}
                    className={classeInput}
                  >
                    <option value="">Todos os status</option>
                    <option value="SUCESSO">Sucesso</option>
                    <option value="ERRO">Erro</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Data inicial
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="date"
                      value={filtros.dataInicio}
                      onChange={(e) =>
                        atualizarFiltro("dataInicio", e.target.value)
                      }
                      className={`${classeInput} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400">
                    Data final
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="date"
                      value={filtros.dataFim}
                      onChange={(e) =>
                        atualizarFiltro("dataFim", e.target.value)
                      }
                      className={`${classeInput} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={limparFiltros}
                  disabled={carregando}
                  className="h-10 rounded-xl border border-white/[0.09] px-4 text-xs font-medium text-gray-300 transition hover:bg-white/[0.05] disabled:opacity-50"
                >
                  Limpar filtros
                </button>

                <button
                  type="button"
                  onClick={aplicarFiltros}
                  disabled={carregando}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search size={15} />
                  Aplicar filtros
                </button>
              </div>
            </div>
          </section>

          {/* LISTAGEM */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111e]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-gray-400">
                  <ClipboardList size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Atividades registradas
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {atividades.length} registros carregados · 30 por consulta
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void carregarAtividades(1, filtros)}
                disabled={carregando}
                aria-label="Atualizar histórico"
                title="Atualizar histórico"
                className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] px-3 text-xs font-medium text-gray-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={carregando ? "animate-spin" : ""}
                />
                Atualizar
              </button>
            </div>

            {erro && (
              <div className="m-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3.5 text-sm text-red-300">
                <Activity size={17} className="mt-0.5 shrink-0" />
                <p>{erro}</p>
              </div>
            )}

            {carregando && atividades.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                <p className="text-xs">Carregando atividades...</p>
              </div>
            ) : atividades.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                  <FileText size={25} className="text-gray-500" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Nenhuma atividade encontrada
                </h3>
                <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                  Não encontramos registros para os filtros selecionados.
                  Experimente alterar os critérios da pesquisa.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {atividades.map((atividade) => (
                  <button
                    key={atividade.id}
                    type="button"
                    onClick={() => setAtividadeSelecionada(atividade)}
                    className="group flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:px-5"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${corAcao(atividade.acao)}`}
                    >
                      {iconeAcao(atividade.acao)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-100 transition group-hover:text-white">
                          {atividade.descricao}
                        </p>

                        <span
                          className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${corAcao(atividade.acao)}`}
                        >
                          {nomeAcao(atividade.acao)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Users size={12} />
                          {atividade.usuarioNome || "Usuário não identificado"}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <ClipboardList size={12} />
                          {nomeModulo(atividade.modulo)}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={12} />
                          {formatarData(atividade.criadoEm)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${
                          atividade.status === "SUCESSO"
                            ? "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-400"
                            : "border-red-500/15 bg-red-500/[0.07] text-red-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            atividade.status === "SUCESSO"
                              ? "bg-emerald-400"
                              : "bg-red-400"
                          }`}
                        />
                        {atividade.status}
                      </span>

                      <ChevronRight
                        size={17}
                        className="text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-indigo-400"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {temMais && (
              <div className="border-t border-white/[0.06] p-4 text-center">
                <button
                  type="button"
                  onClick={() => void carregarAtividades(pagina + 1, filtros)}
                  disabled={carregando}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.09] px-5 text-xs font-semibold text-gray-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:opacity-50"
                >
                  {carregando ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      Carregar mais atividades
                      <ChevronRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* RODAPÉ */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] bg-[#10101c] px-5 py-3 sm:px-7">
          <span className="text-[10px] text-gray-600">
            Registro de auditoria do sistema
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Fechar
          </button>
        </footer>
      </section>

      {atividadeSelecionada && (
        <ModalDetalhesHistorico
          atividade={atividadeSelecionada}
          onClose={() => setAtividadeSelecionada(null)}
        />
      )}
    </div>
  );
}
