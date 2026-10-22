"use client";

import { useState } from "react";
import { Users, ShieldCheck, X } from "lucide-react";

import PerfisAcesso from "./PerfisAcesso";
import GerenciarPermissoes from "./GerenciarPermissoes";

type PermissoesProps = {
  onClose: () => void;
};

export default function Permissoes({ onClose }: PermissoesProps) {
  const [activeTab, setActiveTab] = useState<"perfis" | "permissoes">("perfis");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-2xl">
        {/* HEADER */}
        <header className="border-b border-white/[0.07] px-6 py-5">
          {/* Título e fechar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Perfis de acesso</h2>

              <p className="mt-1 text-xs text-slate-400">
                Gerencie perfis, módulos e permissões.
              </p>
            </div>

            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Navegação */}
          <div className="mt-6 flex gap-2 border-b border-white/[0.06]">
            <button
              onClick={() => setActiveTab("perfis")}
              className={`flex items-center gap-2 border-b-2 px-4 pb-3 text-sm transition-all ${
                activeTab === "perfis"
                  ? "border-blue-500 text-blue-300"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Users size={16} />
              Perfis de acesso
            </button>

            <button
              onClick={() => setActiveTab("permissoes")}
              className={`flex items-center gap-2 border-b-2 px-4 pb-3 text-sm transition-all ${
                activeTab === "permissoes"
                  ? "border-blue-500 text-blue-300"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck size={16} />
              Permissões
            </button>
          </div>
        </header>

        {/* CONTEÚDO */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "perfis" ? (
            <PerfisAcesso
              onGerenciarPermissoes={() => setActiveTab("permissoes")}
            />
          ) : (
            <GerenciarPermissoes />
          )}
        </main>
      </div>
    </div>
  );
}
