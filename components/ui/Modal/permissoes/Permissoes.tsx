"use client";

import { X, ShieldCheck } from "lucide-react";
import { useState } from "react";

import PerfisAcesso from "./PerfisAcesso";
import Toast from "@/components/ui/Toast";

type PermissoesProps = {
  onClose: () => void;
};

type ToastState = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
};

export default function Permissoes({ onClose }: PermissoesProps) {
  const [toast, setToast] = useState<ToastState | null>(null);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5">
        <div className="flex h-[92dvh] max-h-[900px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/[0.10] bg-[#11111f] text-white shadow-2xl">
          {/* Cabeçalho */}
          <header className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#11111f] px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <ShieldCheck size={22} className="text-violet-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
                  Perfis de acesso
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
                  Gerencie perfis, módulos e permissões de acesso.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition-all hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={20} />
            </button>
          </header>

          {/* Conteúdo */}
          <main className="min-h-0 flex-1 overflow-y-auto">
            <PerfisAcesso />
          </main>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
