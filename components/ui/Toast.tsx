"use client";

import {
  AlertTriangle,
  CircleCheck,
  CircleX,
  X,
  type LucideIcon,
} from "lucide-react";

import { useEffect, useRef } from "react";

type ToastProps = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
  onClose: () => void;
};

export default function Toast({ titulo, mensagem, tipo, onClose }: ToastProps) {
  const fecharRef = useRef(onClose);

  useEffect(() => {
    fecharRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      fecharRef.current();
    }, 4000);

    return () => window.clearTimeout(temporizador);
  }, []);

  let Icone: LucideIcon;
  let cor: string;
  let fundo: string;
  let borda: string;

  if (tipo === "sucesso") {
    Icone = CircleCheck;
    cor = "text-emerald-400";
    fundo = "bg-emerald-500/10";
    borda = "border-emerald-500/20";
  } else if (tipo === "erro") {
    Icone = CircleX;
    cor = "text-red-400";
    fundo = "bg-red-500/10";
    borda = "border-red-500/20";
  } else {
    Icone = AlertTriangle;
    cor = "text-yellow-400";
    fundo = "bg-yellow-500/10";
    borda = "border-yellow-500/20";
  }

  return (
    <div className="fixed right-5 top-5 z-[200] w-[calc(100%-40px)] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300">
      <div
        className={`flex items-start gap-3 rounded-2xl border ${borda} bg-[#151525] p-4 text-white shadow-2xl`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${fundo}`}
        >
          <Icone size={22} className={cor} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white">{titulo}</h2>

          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            {mensagem}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar notificação"
          className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-[-3px] h-1 overflow-hidden rounded-b-xl bg-white/5">
        <div className="h-full w-full origin-left animate-[toast-progress_4s_linear_forwards] bg-white/30" />
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
