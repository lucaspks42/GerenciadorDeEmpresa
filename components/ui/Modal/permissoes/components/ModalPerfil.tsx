"use client";

import {
  Users,
  X,
  CheckCircle2,
  Settings,
  LayoutDashboard,
  Wallet,
  ShoppingCart,
  Package,
  FileText,
  Building2,
  Truck,
  ChevronDown,
  ShieldCheck,
  Check,
  LoaderCircle,
  Lock,
  Activity,
  ClipboardList,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import Toast from "@/components/ui/Toast";

type ModalPerfilProps = {
  onClose: () => void;
  perfilId?: string;
};

type ToastState = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
};

type Permissao = {
  id: string;
  chave: string;
  nome: string;
  descricao?: string | null;
};

type Modulo = {
  id: string;
  nome: string;
  slug: string;
  descricao?: string | null;
  permissoes: Permissao[];
};

type PerfilResponse = {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  permissoesVizualizacao: string;
  observacoes: string | null;
  permissoes: Permissao[];
};

const iconesModulos: Record<string, ElementType> = {
  dashboard: LayoutDashboard,
  usuarios: Users,
  clientes: Users,
  empresas: Building2,
  financeiro: Wallet,
  vendas: ShoppingCart,
  compras: Truck,
  estoque: Package,
  relatorios: FileText,
  configuracoes: Settings,
  tarefas: ClipboardList,
  auditoria: Activity,
};

const opcoesVisualizacao = [
  {
    valor: "todos",
    titulo: "Todos os registros",
    descricao: "Visualiza informações de todos os usuários.",
  },
  {
    valor: "proprios",
    titulo: "Próprios registros",
    descricao: "Visualiza somente os registros que pertencem a si.",
  },
  {
    valor: "setor",
    titulo: "Mesmo setor",
    descricao: "Visualiza registros dos usuários do mesmo setor.",
  },
  {
    valor: "atribuidos",
    titulo: "Registros atribuídos",
    descricao: "Visualiza somente os registros atribuídos a si.",
  },
];

export default function ModalPerfil({ onClose, perfilId }: ModalPerfilProps) {
  const classeInput =
    "w-full rounded-xl border border-white/[0.12] bg-[#0d0d19] px-3 py-2.5 text-sm font-medium text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15";

  const classeLabel = "text-sm font-semibold text-slate-200";

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [permissoesVizualizacao, setPermissaoVizualizacao] = useState("todos");
  const [observacoes, setObservacoes] = useState("");

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloAberto, setModuloAberto] = useState("");

  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<
    string[]
  >([]);

  const [carregandoModulos, setCarregandoModulos] = useState(true);
  const [carregandoPerfil, setCarregandoPerfil] = useState(Boolean(perfilId));
  const [salvando, setSalvando] = useState(false);

  const [erroCarregamento, setErroCarregamento] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const editando = Boolean(perfilId);

  const fecharToast = useCallback(() => {
    setToast(null);
  }, []);

  // CARREGAR MÓDULOS E PERMISSÕES DO BANCO

  useEffect(() => {
    let cancelado = false;

    async function carregarModulos() {
      try {
        const resposta = await fetch("/api/admin/permissoes", {
          method: "GET",
          cache: "no-store",
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.erro || "Não foi possível carregar os módulos.",
          );
        }

        if (cancelado) return;

        const lista: Modulo[] = Array.isArray(resultado) ? resultado : [];

        setModulos(lista);
        setModuloAberto(lista[0]?.slug ?? "");
        setErroCarregamento("");
      } catch (error) {
        if (!cancelado) {
          setErroCarregamento(
            error instanceof Error
              ? error.message
              : "Erro ao carregar os módulos.",
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoModulos(false);
        }
      }
    }

    void carregarModulos();

    return () => {
      cancelado = true;
    };
  }, []);

  // CARREGAR PERFIL PARA EDIÇÃO

  useEffect(() => {
    let cancelado = false;

    async function carregarPerfil() {
      if (!perfilId) return;

      try {
        const resposta = await fetch(`/api/admin/perfis/${perfilId}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.erro ||
              resultado.mensagem ||
              "Não foi possível carregar o perfil.",
          );
        }

        if (cancelado) return;

        const perfil: PerfilResponse = resultado.perfil ?? resultado;

        setNome(perfil.nome ?? "");
        setDescricao(perfil.descricao ?? "");
        setAtivo(perfil.ativo ?? true);
        setPermissaoVizualizacao(perfil.permissoesVizualizacao ?? "todos");
        setObservacoes(perfil.observacoes ?? "");

        setPermissoesSelecionadas(
          Array.isArray(perfil.permissoes)
            ? perfil.permissoes
                .map((permissao) => permissao.chave)
                .filter(Boolean)
            : [],
        );
      } catch (error) {
        if (!cancelado) {
          setToast({
            titulo: "Erro ao carregar perfil",
            mensagem:
              error instanceof Error
                ? error.message
                : "Não foi possível carregar o perfil.",
            tipo: "erro",
          });
        }
      } finally {
        if (!cancelado) {
          setCarregandoPerfil(false);
        }
      }
    }

    void carregarPerfil();

    return () => {
      cancelado = true;
    };
  }, [perfilId]);

  // CONTADORES

  const totalPermissoes = useMemo(
    () =>
      modulos.reduce((total, modulo) => total + modulo.permissoes.length, 0),
    [modulos],
  );

  const totalSelecionadas = permissoesSelecionadas.length;

  const percentual =
    totalPermissoes > 0
      ? Math.min(100, (totalSelecionadas / totalPermissoes) * 100)
      : 0;

  // SELECIONAR OU DESMARCAR UMA PERMISSÃO

  function alternarPermissao(chave: string) {
    setPermissoesSelecionadas((anteriores) =>
      anteriores.includes(chave)
        ? anteriores.filter((item) => item !== chave)
        : [...anteriores, chave],
    );
  }

  // SELECIONAR OU DESMARCAR TODAS AS PERMISSÕES DO MÓDULO

  function alternarModulo(modulo: Modulo) {
    const chaves = modulo.permissoes.map((permissao) => permissao.chave);

    const todasSelecionadas =
      chaves.length > 0 &&
      chaves.every((chave) => permissoesSelecionadas.includes(chave));

    setPermissoesSelecionadas((anteriores) => {
      if (todasSelecionadas) {
        return anteriores.filter((chave) => !chaves.includes(chave));
      }

      return Array.from(new Set([...anteriores, ...chaves]));
    });
  }

  function quantidadeSelecionada(modulo: Modulo) {
    return modulo.permissoes.filter((permissao) =>
      permissoesSelecionadas.includes(permissao.chave),
    ).length;
  }

  // SALVAR PERFIL

  async function salvarPerfil() {
    if (!nome.trim()) {
      setToast({
        titulo: "Campo obrigatório",
        mensagem: "Informe o nome do perfil.",
        tipo: "aviso",
      });
      return;
    }

    try {
      setSalvando(true);

      const resposta = await fetch(
        editando ? `/api/admin/perfis/${perfilId}` : "/api/admin/perfis",
        {
          method: editando ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nome.trim(),
            descricao: descricao.trim() || null,
            ativo,
            permissoesVizualizacao,
            observacoes: observacoes.trim() || null,
            permissoes: permissoesSelecionadas,
          }),
        },
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            resultado.mensagem ||
            `Não foi possível ${editando ? "atualizar" : "cadastrar"} o perfil.`,
        );
      }

      setToast({
        titulo: editando ? "Perfil atualizado!" : "Perfil cadastrado!",
        mensagem: editando
          ? "As informações e permissões foram atualizadas com sucesso. Feche esta janela para atualizar a listagem."
          : "O perfil foi criado com sucesso. Feche esta janela para atualizar a listagem.",
        tipo: "sucesso",
      });
    } catch (error) {
      setToast({
        titulo: editando ? "Erro ao atualizar" : "Erro ao cadastrar",
        mensagem:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado.",
        tipo: "erro",
      });
    } finally {
      setSalvando(false);
    }
  }

  const carregando = carregandoModulos || carregandoPerfil;

  return (
    <main className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex h-[95dvh] max-h-[95dvh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-2xl shadow-black/40">
        {/* CABEÇALHO */}

        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
              <Users size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                {editando ? "Editar perfil de acesso" : "Novo perfil de acesso"}
              </h2>

              <p className="mt-0.5 text-sm font-medium text-slate-400">
                Configure as informações e permissões deste perfil.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            aria-label="Fechar modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        {carregando ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-sm font-medium text-slate-300">
            <LoaderCircle size={28} className="animate-spin text-blue-400" />
            Carregando informações...
          </div>
        ) : erroCarregamento ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <X size={30} className="text-red-400" />
            <p className="text-sm font-semibold text-red-300">
              {erroCarregamento}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[0.9fr_1.1fr]">
              {/* COLUNA ESQUERDA */}

              <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
                {/* INFORMAÇÕES BÁSICAS */}

                <section className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-blue-400" />
                    <p className="text-base font-bold text-white">
                      Informações básicas
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={classeLabel}>
                      Nome do perfil <span className="text-red-400">*</span>
                    </label>

                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex.: Gerente Financeiro"
                      className={classeInput}
                      maxLength={100}
                    />
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5">
                    <label className={classeLabel}>Descrição</label>

                    <textarea
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descreva as responsabilidades desse perfil..."
                      className={`${classeInput} min-h-24 resize-none`}
                      maxLength={500}
                    />

                    <span className="text-right text-xs font-medium text-slate-400">
                      {descricao.length}/500
                    </span>
                  </div>
                </section>

                {/* STATUS */}

                <section className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
                  <label className={classeLabel}>Status do perfil</label>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          ativo
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        <CheckCircle2 size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Perfil {ativo ? "ativo" : "inativo"}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-400">
                          {ativo
                            ? "Disponível para atribuições."
                            : "Indisponível para novas atribuições."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={ativo}
                      aria-label="Alterar status do perfil"
                      onClick={() => setAtivo((atual) => !atual)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all ${
                        ativo
                          ? "border-blue-500 bg-blue-600"
                          : "border-white/10 bg-slate-700"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
                          ativo ? "translate-x-[22px]" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </section>

                {/* CONFIGURAÇÕES ADICIONAIS */}

                <section className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <Settings size={18} className="text-blue-400" />
                    <p className="text-base font-bold text-white">
                      Configurações adicionais
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={classeLabel}>
                      Visibilidade dos dados
                    </label>

                    <select
                      value={permissoesVizualizacao}
                      onChange={(e) => setPermissaoVizualizacao(e.target.value)}
                      className={classeInput}
                    >
                      {opcoesVisualizacao.map((opcao) => (
                        <option key={opcao.valor} value={opcao.valor}>
                          {opcao.titulo}
                        </option>
                      ))}
                    </select>

                    <p className="text-xs font-medium leading-relaxed text-slate-400">
                      {
                        opcoesVisualizacao.find(
                          (opcao) => opcao.valor === permissoesVizualizacao,
                        )?.descricao
                      }
                    </p>
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5">
                    <label className={classeLabel}>
                      Observações (opcional)
                    </label>

                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Adicione observações sobre esse perfil..."
                      className={`${classeInput} min-h-24 resize-none`}
                      maxLength={300}
                    />

                    <span className="text-right text-xs font-medium text-slate-400">
                      {observacoes.length}/300
                    </span>
                  </div>
                </section>
              </div>

              {/* COLUNA DIREITA: PERMISSÕES */}

              <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015]">
                {/* CABEÇALHO DAS PERMISSÕES */}

                <div className="shrink-0 border-b border-white/[0.07] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={19} className="text-blue-400" />
                      <p className="text-base font-bold text-white">
                        Permissões de acesso
                      </p>
                    </div>

                    <span className="rounded-lg border border-blue-500/30 bg-blue-500/15 px-3 py-1.5 text-xs font-bold text-blue-200">
                      {totalSelecionadas}/{totalPermissoes} selecionadas
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm font-medium text-slate-400">
                    Selecione os módulos e as ações permitidas para este perfil.
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                </div>

                {/* LISTA DE MÓDULOS */}

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
                  {modulos.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <Lock size={28} className="text-slate-400" />
                      <p className="mt-2 text-sm font-semibold text-slate-300">
                        Nenhum módulo disponível.
                      </p>
                    </div>
                  ) : (
                    modulos.map((modulo) => {
                      const Icone = iconesModulos[modulo.slug] ?? Lock;
                      const aberto = moduloAberto === modulo.slug;
                      const selecionadas = quantidadeSelecionada(modulo);

                      const todasSelecionadas =
                        modulo.permissoes.length > 0 &&
                        selecionadas === modulo.permissoes.length;

                      return (
                        <div
                          key={modulo.id}
                          className={`overflow-hidden rounded-xl border transition-all ${
                            aberto
                              ? "border-blue-500/30 bg-blue-500/[0.035]"
                              : "border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.03]"
                          }`}
                        >
                          {/* CABEÇALHO DO MÓDULO */}

                          <div className="flex items-center gap-2 p-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                setModuloAberto(aberto ? "" : modulo.slug)
                              }
                              className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                  aberto
                                    ? "bg-blue-500/15 text-blue-400"
                                    : "bg-white/[0.04] text-slate-300"
                                }`}
                              >
                                <Icone size={18} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white">
                                  {modulo.nome}
                                </p>
                                <p className="truncate text-xs font-medium text-slate-400">
                                  {modulo.descricao || "Permissões do módulo"}
                                </p>
                              </div>

                              <span className="shrink-0 rounded-md bg-white/[0.06] px-2 py-1 text-xs font-bold text-slate-300">
                                {selecionadas}/{modulo.permissoes.length}
                              </span>

                              <ChevronDown
                                size={17}
                                className={`shrink-0 text-slate-400 transition-transform ${
                                  aberto ? "rotate-180 text-blue-400" : ""
                                }`}
                              />
                            </button>

                            {/* SELECIONAR TODAS DO MÓDULO */}

                            <button
                              type="button"
                              onClick={() => alternarModulo(modulo)}
                              aria-label={
                                todasSelecionadas
                                  ? `Desmarcar permissões de ${modulo.nome}`
                                  : `Selecionar permissões de ${modulo.nome}`
                              }
                              disabled={modulo.permissoes.length === 0}
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-30 ${
                                todasSelecionadas
                                  ? "border-blue-500 bg-blue-600 text-white"
                                  : selecionadas > 0
                                    ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-blue-500/40"
                              }`}
                            >
                              {todasSelecionadas ? (
                                <Check size={15} />
                              ) : selecionadas > 0 ? (
                                <span className="text-sm font-bold">−</span>
                              ) : null}
                            </button>
                          </div>

                          {/* PERMISSÕES DO MÓDULO */}

                          {aberto && (
                            <div className="border-t border-white/[0.06] px-3 py-2">
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                  Permissões disponíveis
                                </span>

                                <button
                                  type="button"
                                  onClick={() => alternarModulo(modulo)}
                                  disabled={modulo.permissoes.length === 0}
                                  className="text-xs font-bold text-blue-400 transition-colors hover:text-blue-300 disabled:opacity-40"
                                >
                                  {todasSelecionadas
                                    ? "Desmarcar todas"
                                    : "Selecionar todas"}
                                </button>
                              </div>

                              <div className="space-y-1">
                                {modulo.permissoes.map((permissao) => {
                                  const marcada =
                                    permissoesSelecionadas.includes(
                                      permissao.chave,
                                    );

                                  return (
                                    <label
                                      key={permissao.id}
                                      className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                                        marcada
                                          ? "border-blue-500/25 bg-blue-500/[0.06]"
                                          : "border-transparent bg-white/[0.015] hover:border-white/[0.07] hover:bg-white/[0.035]"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={marcada}
                                        onChange={() =>
                                          alternarPermissao(permissao.chave)
                                        }
                                        className="sr-only"
                                      />

                                      <span
                                        className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-md border ${
                                          marcada
                                            ? "border-blue-500 bg-blue-600 text-white"
                                            : "border-slate-500 bg-[#0d0d19] text-transparent group-hover:border-blue-400/60"
                                        }`}
                                      >
                                        {marcada && (
                                          <Check size={13} strokeWidth={3} />
                                        )}
                                      </span>

                                      <div className="min-w-0 flex-1">
                                        <p
                                          className={`text-sm font-semibold ${
                                            marcada
                                              ? "text-blue-200"
                                              : "text-white"
                                          }`}
                                        >
                                          {permissao.nome}
                                        </p>

                                        {permissao.descricao && (
                                          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-400">
                                            {permissao.descricao}
                                          </p>
                                        )}

                                        <p className="mt-1 break-all text-[11px] font-medium text-slate-400">
                                          {permissao.chave}
                                        </p>
                                      </div>

                                      {marcada && (
                                        <CheckCircle2
                                          size={16}
                                          className="shrink-0 text-blue-400"
                                        />
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* RODAPÉ DAS PERMISSÕES */}

                <div className="shrink-0 border-t border-white/[0.07] bg-white/[0.015] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={17} className="text-emerald-400" />
                      <span className="text-sm font-semibold text-slate-300">
                        {totalSelecionadas} permissões selecionadas
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPermissoesSelecionadas([])}
                      disabled={totalSelecionadas === 0}
                      className="text-sm font-semibold text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Limpar todas
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* RODAPÉ PRINCIPAL */}

            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-3">
              <p className="hidden text-sm font-medium text-slate-400 sm:block">
                Campos com * são obrigatórios.
              </p>

              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={salvando}
                  className="rounded-xl border border-white/[0.10] px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={!nome.trim() || salvando}
                  onClick={salvarPerfil}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvando && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}

                  {salvando
                    ? "Salvando..."
                    : editando
                      ? "Salvar alterações"
                      : "Criar perfil"}
                </button>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* TOAST */}

      {toast && (
        <Toast
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={fecharToast}
        />
      )}
    </main>
  );
}
