"use client";

import {
  AlertTriangle,
  CircleCheck,
  CircleX,
  X,
  type LucideIcon,
} from "lucide-react";

import { useEffect } from "react";

type ToastProps = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
  onClose: () => void;
};

export default function Toast({ titulo, mensagem, tipo, onClose }: ToastProps) {
  let Icone: LucideIcon;
  let cor: string;

  if (tipo === "sucesso") {
    Icone = CircleCheck;
    cor = "text-green-500";
  } else if (tipo === "erro") {
    Icone = CircleX;
    cor = "text-red-500";
  } else {
    Icone = AlertTriangle;
    cor = "text-yellow-500";
  }

  useEffect(() => {
    const temporizador = setTimeout(onClose, 4000);

    return () => clearTimeout(temporizador);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-[100] flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xl">
      <Icone className={`${cor} mt-0.5`} size={24} />

      <div className="flex-1">
        <h2 className="text-sm font-semibold">{titulo}</h2>

        <p className="mt-1 text-sm text-muted-foreground">{mensagem}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X size={18} />
      </button>
    </div>
  );
}
