"use client";

import { Users, X, CheckCircle2, Settings } from "lucide-react";
import { useState } from "react";

type ModalPerfilProps = {
  onClose: () => void;
};

export default function ModalPerfil({ onClose }: ModalPerfilProps) {
  const classeInput =
    "w-full rounded-xl border border-white/[0.08] bg-[#0d0d19] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  const classeLabel = "text-xs font-medium text-slate-400";

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-2xl shadow-black/40">
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
              <Users size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
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
        <div className="overflow-y-auto p-6 sm:p-8 items-center ">
          <div className="mb-5 flex items-center gap-2">
            <CheckCircle2 size={17} className="text-blue-400" />
            <p className="text-sm font-semibold text-white">
              Informações básicas
            </p>
          </div>

          {/* NOME */}
          <div className="flex flex-col gap-2 py-2">
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

          {/* DESCRIÇÃO */}
          <div className="flex flex-col gap-2 py-2">
            <label className={classeLabel}>Descrição</label>

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva as responsabilidades desse perfil..."
              className={`${classeInput} min-h-28 resize-none`}
              maxLength={500}
            />

            <span className="text-right text-[11px] text-slate-600">
              {descricao.length}/500
            </span>
          </div>

          {/* STATUS */}
          <div className="border-b border-white/[0.07] py-2 ">
            <label className={classeLabel}>Status do perfil</label>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#0d0d19] p-4">
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
                      ? "Disponível para ser atribuído aos usuários."
                      : "Indisponível para novas atribuições."}
                  </p>
                </div>
              </div>

              {/* SWITCH */}
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
          </div>

          <div className="mb-5 flex items-center gap-2 py-8 ">
            <Settings className="text-blue-400" />
            <p className="text-sm font-semibold text-white">
              Configurações Adicionais
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
