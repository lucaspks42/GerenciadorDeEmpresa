"use client";

import { Users, X, CheckCircle2, Settings } from "lucide-react";
import { useState } from "react";

type ModalPerfilProps = {
  onClose: () => void;
};

export default function ModalPerfil({ onClose }: ModalPerfilProps) {
  const classeInput =
    "w-full rounded-xl border border-white/[0.08] bg-[#0d0d19] px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  const classeLabel = "text-xs font-medium text-slate-400";

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [permissoesVizualizacao, setPermissaoVizualizacao] = useState("todos");
  const [observacoes, setOberservacoes] = useState("");

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[95dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-2xl shadow-black/40">
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
              <Users size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Novo perfil de acesso
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Cadastre um novo grupo de acesso ao sistema.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        {/* CONTEÚDO */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 lg:grid-cols-2 lg:overflow-hidden">
          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col gap-4">
            {/* INFORMAÇÕES BÁSICAS */}
            <section className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-400" />
                <p className="text-sm font-semibold text-white">
                  Informações básicas
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className={classeLabel}>
                  Nome do Perfil <span className="text-red-400">*</span>
                </label>

                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Gerente Financeiro"
                  className={classeInput}
                  maxLength={100}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className={classeLabel}>Descrição</label>

                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva as responsabilidades desse perfil..."
                  className={`${classeInput} min-h-20 resize-none`}
                  maxLength={500}
                />

                <span className="text-right text-[11px] text-slate-600">
                  {descricao.length}/500
                </span>
              </div>
            </section>

            {/* STATUS */}
            <section className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
              <label className={classeLabel}>Status do perfil</label>

              <div className="mt-3 flex items-center justify-between gap-3">
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
                    <p className="text-sm font-medium text-white">
                      Perfil {ativo ? "ativo" : "inativo"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {ativo
                        ? "Disponível para novas atribuições."
                        : "Indisponível para novas atribuições."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={ativo}
                  aria-label="Alterar status do perfil"
                  onClick={() => setAtivo(!ativo)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    ativo
                      ? "border-blue-500 bg-blue-600"
                      : "border-white/10 bg-slate-700"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      ativo ? "translate-x-[22px]" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* CONFIGURAÇÕES ADICIONAIS */}
            <section className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
              <div className="mb-4 flex items-center gap-2">
                <Settings size={17} className="text-blue-400" />
                <p className="text-sm font-semibold text-white">
                  Configurações adicionais
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className={classeLabel}>
                  Permissões para visualização de dados
                </label>

                <select
                  value={permissoesVizualizacao}
                  onChange={(e) => setPermissaoVizualizacao(e.target.value)}
                  className={classeInput}
                >
                  <option value="todos">Todos os registros</option>
                  <option value="proprios">Próprios registros</option>
                  <option value="setor">Mesmo setor</option>
                  <option value="atribuidos">Registros atribuídos</option>
                </select>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className={classeLabel}>Observações (opcional)</label>

                <textarea
                  value={observacoes}
                  onChange={(e) => setOberservacoes(e.target.value)}
                  placeholder="Adicione observações sobre esse perfil..."
                  className={`${classeInput} min-h-16 resize-none`}
                  maxLength={300}
                />

                <span className="text-right text-[11px] text-slate-600">
                  {observacoes.length}/300
                </span>
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA */}
          <section className="flex min-h-[300px] flex-col rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Users size={17} className="text-blue-400" />
              <p className="text-sm font-semibold text-white">
                Permissões de acesso
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Selecione quais áreas do sistema esse perfil poderá acessar.
            </p>

            {/* ÁREA PARA AS PERMISSÕES */}
            <div className="mt-4 flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/[0.09]">
              <div className="text-center">
                <Settings size={30} className="mx-auto mb-3 text-slate-600" />
                <p className="text-sm text-slate-400">
                  Configure as permissões deste perfil
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Selecione os módulos e níveis de acesso.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4">
          <p className="hidden text-xs text-slate-500 sm:block">
            Campos com * são obrigatórios.
          </p>

          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={!nome.trim()}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Criar perfil
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
