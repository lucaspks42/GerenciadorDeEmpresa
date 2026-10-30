"use client";

import {
  CalendarDays,
  Globe,
  Monitor,
  UserRound,
  X,
  ClipboardList,
  Database,
  ArrowRight,
  ShieldCheck,
  Clock3,
  FileText,
} from "lucide-react";

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

type ModalDetalhesHistoricoProps = {
  atividade: Atividade;
  onClose: () => void;
};

function formatarData(data: string) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Data não disponível";
  }

  return dataConvertida.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatarValor(valor: unknown) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  if (typeof valor === "object") {
    return JSON.stringify(valor, null, 2);
  }

  if (typeof valor === "boolean") {
    return valor ? "Sim" : "Não";
  }

  return String(valor);
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

function DadosJson({
  titulo,
  descricao,
  dados,
  tipo,
}: {
  titulo: string;
  descricao: string;
  dados: Record<string, unknown> | null;
  tipo: "anterior" | "novo";
}) {
  const ehNovo = tipo === "novo";

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10101c]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              ehNovo
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {ehNovo ? <Database size={17} /> : <FileText size={17} />}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">{titulo}</h3>
            <p className="mt-0.5 text-[11px] text-gray-500">{descricao}</p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-semibold ${
            ehNovo
              ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400"
              : "border-amber-500/20 bg-amber-500/[0.07] text-amber-400"
          }`}
        >
          {ehNovo ? "NOVO" : "ANTERIOR"}
        </span>
      </div>

      <div className="max-h-[340px] space-y-3 overflow-y-auto p-4">
        {!dados || Object.keys(dados).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.035]">
              <FileText size={19} className="text-gray-600" />
            </div>

            <p className="text-xs font-medium text-gray-400">
              Nenhum dado registrado
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
              Não existem informações disponíveis nesta etapa.
            </p>
          </div>
        ) : (
          Object.entries(dados).map(([campo, valor]) => (
            <div
              key={campo}
              className="min-w-0 rounded-xl border border-white/[0.05] bg-[#0b0b15] p-3"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {campo}
              </p>

              <pre className="overflow-x-auto whitespace-pre-wrap break-words font-sans text-xs leading-6 text-gray-200">
                {formatarValor(valor)}
              </pre>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Informacao({
  icone,
  titulo,
  valor,
  complemento,
}: {
  icone: React.ReactNode;
  titulo: string;
  valor: string;
  complemento?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-[#10101c] p-4">
      <div className="mb-3 flex items-center gap-2 text-gray-500">
        {icone}
        <span className="text-[11px] font-medium">{titulo}</span>
      </div>

      <p className="break-words text-sm font-medium text-gray-100">{valor}</p>

      {complemento && (
        <p className="mt-1 text-[11px] text-gray-500">{complemento}</p>
      )}
    </div>
  );
}

export default function ModalDetalhesHistorico({
  atividade,
  onClose,
}: ModalDetalhesHistoricoProps) {
  const sucesso = atividade.status === "SUCESSO";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-5"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalhes-historico"
        className="flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c0c16] shadow-[0_25px_100px_rgba(0,0,0,0.65)]"
      >
        {/* CABEÇALHO */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.07] bg-[#10101c] px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
              <ClipboardList size={21} />
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400">
                  Auditoria do sistema
                </span>

                <span className="text-[10px] text-gray-600">/</span>

                <span className="text-[10px] text-gray-500">
                  Registro #{atividade.id}
                </span>
              </div>

              <h2
                id="titulo-detalhes-historico"
                className="truncate text-lg font-semibold text-white sm:text-xl"
              >
                Detalhes da atividade
              </h2>

              <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
                Visualização completa das informações e alterações registradas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={19} />
          </button>
        </header>

        {/* CONTEÚDO */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6 lg:p-7">
          {/* RESUMO DA ATIVIDADE */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#11111e] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/[0.08] px-2.5 py-1 text-[10px] font-semibold text-indigo-300">
                    {nomeModulo(atividade.modulo)}
                  </span>

                  <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-gray-300">
                    {nomeAcao(atividade.acao)}
                  </span>
                </div>

                <h3 className="text-base font-semibold leading-relaxed text-white sm:text-lg">
                  {atividade.descricao}
                </h3>

                <p className="mt-2 text-xs text-gray-500">
                  Identificador do registro: #{atividade.id}
                </p>
              </div>

              <div
                className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border px-3 py-2 ${
                  sucesso
                    ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400"
                    : "border-red-500/20 bg-red-500/[0.07] text-red-400"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    sucesso ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span className="text-xs font-semibold">
                  {atividade.status}
                </span>
              </div>
            </div>
          </section>

          {/* INFORMAÇÕES GERAIS */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-indigo-500" />
              <h3 className="text-sm font-semibold text-white">
                Informações gerais
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Informacao
                icone={<UserRound size={15} />}
                titulo="Responsável pela ação"
                valor={atividade.usuarioNome || "Usuário não identificado"}
                complemento={`ID: ${atividade.usuarioId ?? "Não disponível"}`}
              />

              <Informacao
                icone={<CalendarDays size={15} />}
                titulo="Data e horário"
                valor={formatarData(atividade.criadoEm)}
              />

              <Informacao
                icone={<Globe size={15} />}
                titulo="Endereço IP"
                valor={atividade.ip || "Não registrado"}
              />

              <Informacao
                icone={<ShieldCheck size={15} />}
                titulo="Resultado da operação"
                valor={atividade.status}
                complemento={
                  sucesso
                    ? "A operação foi registrada com sucesso."
                    : "A operação foi registrada com erro."
                }
              />
            </div>
          </section>

          {/* REGISTRO RELACIONADO */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-indigo-500" />
              <h3 className="text-sm font-semibold text-white">
                Registro relacionado
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Informacao
                icone={<Database size={15} />}
                titulo="Entidade"
                valor={atividade.entidade || "Não informada"}
              />

              <Informacao
                icone={<FileText size={15} />}
                titulo="Identificador da entidade"
                valor={atividade.entidadeId || "Não informado"}
              />
            </div>
          </section>

          {/* COMPARAÇÃO DE DADOS */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-indigo-500" />
                <h3 className="text-sm font-semibold text-white">
                  Comparação de dados
                </h3>
              </div>

              <span className="text-[10px] text-gray-500">
                Antes e depois da operação
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <DadosJson
                titulo="Dados anteriores"
                descricao="Informações antes da alteração"
                dados={atividade.dadosAnteriores}
                tipo="anterior"
              />

              <DadosJson
                titulo="Dados novos"
                descricao="Informações após a operação"
                dados={atividade.dadosNovos}
                tipo="novo"
              />
            </div>
          </section>

          {/* INFORMAÇÕES TÉCNICAS */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-indigo-500" />
              <h3 className="text-sm font-semibold text-white">
                Informações técnicas
              </h3>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#11111e] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-gray-400">
                <Monitor size={16} />
                <span className="text-xs font-medium">
                  Navegador e dispositivo
                </span>
              </div>

              <p className="break-all rounded-xl border border-white/[0.05] bg-[#0b0b15] p-3 text-xs leading-6 text-gray-400">
                {atividade.userAgent || "Informações não registradas."}
              </p>
            </div>
          </section>
        </div>

        {/* RODAPÉ */}
        <footer className="flex shrink-0 flex-col-reverse items-center justify-between gap-3 border-t border-white/[0.07] bg-[#10101c] px-5 py-3 sm:flex-row sm:px-7">
          <div className="flex items-center gap-2 text-[10px] text-gray-600">
            <Clock3 size={13} />
            Registro de auditoria #{atividade.id}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] px-5 text-xs font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white sm:w-auto"
          >
            Fechar detalhes
            <ArrowRight size={14} />
          </button>
        </footer>
      </section>
    </div>
  );
}
