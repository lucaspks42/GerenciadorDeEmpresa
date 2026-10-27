"use client";

import {
  Building2,
  FileText,
  MapPin,
  Palette,
  Phone,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

import IdentificacaoEmpresa from "./abas/IdentificacaoEmpresa";
import EnderecoEmpresa from "./abas/EnderecoEmpresa ";
import ContatoEmpresa from "./abas/ContatoEmpresa";
import DadosFiscais from "./abas/DadosFiscais";
import DadosFinanceiros from "./abas/DadosFinanceiros";
import IdentidadeVisual from "./abas/IdentidadeVisual";

type ModalEmpresaProps = {
  onClose: () => void;
};

type AbaEmpresa =
  "empresa" | "endereco" | "contato" | "fiscal" | "financeiro" | "visual";

export default function ModalEmpresa({ onClose }: ModalEmpresaProps) {
  const [abaAtiva, setAbaAtiva] = useState<AbaEmpresa>("empresa");

  const abas = [
    { id: "empresa", nome: "Empresa", icone: Building2 },
    { id: "endereco", nome: "Endereço", icone: MapPin },
    { id: "contato", nome: "Contato", icone: Phone },
    { id: "fiscal", nome: "Fiscal", icone: FileText },
    { id: "financeiro", nome: "Financeiro", icone: Wallet },
    { id: "visual", nome: "Identidade Visual", icone: Palette },
  ] as const;

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-[0_25px_100px_rgba(0,0,0,0.55)]">
        {/* Cabeçalho */}
        <header className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-white/[0.07] px-6 py-5 sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative flex min-w-0 items-center gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Dados da Empresa
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Gerencie as informações cadastrais da sua empresa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={18} />
          </button>
        </header>

        {/* Navegação */}
        <div className="border-b border-white/[0.07] px-6 sm:px-8">
          <nav
            aria-label="Abas dos dados da empresa"
            className="flex flex-wrap items-center gap-2 py-3"
          >
            {abas.map((aba) => {
              const Icone = aba.icone;

              return (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    abaAtiva === aba.id
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icone size={17} />
                  {aba.nome}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {abaAtiva === "empresa" && <IdentificacaoEmpresa />}
          {abaAtiva === "endereco" && <EnderecoEmpresa />}
          {abaAtiva === "contato" && <ContatoEmpresa />}
          {abaAtiva === "fiscal" && <DadosFiscais />}
          {abaAtiva === "financeiro" && <DadosFinanceiros />}
          {abaAtiva === "visual" && <IdentidadeVisual />}
        </div>
      </div>
    </main>
  );
}
