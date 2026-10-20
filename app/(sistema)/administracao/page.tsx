"use client";

import ContadoresPendente from "@/components/ui/ContadoresPendente";
import ModalPermissao from "@/components/ui/ModalPermicoes";
import ModalUsuario from "@/components/ui/ModalUsuario";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserRound,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";
import ContadorFuncionarios from "@/components/ui/ContadorUsuarios";

export default function Administracao() {
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState(false);

  const fecharModal = () => {
    setModalAberto(false);
  };

  const fecharUsuario = () => {
    setUsuario(false);
  };

  return (
    <main className="relative h-[calc(100vh-4rem)] overflow-y-auto bg-[#0d0d19] text-white">
      {modalAberto && <ModalPermissao onClose={fecharModal} />}
      {usuario && <ModalUsuario onClose={fecharUsuario} />}

      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="relative mb-9">
          <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-blue-600/[0.07] blur-3xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <ShieldCheck size={15} />
              Gerenciamento do sistema
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Administração
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Gerencie usuários, funcionários e permissões do sistema.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="group relative min-h-44 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/[0.07] blur-3xl transition-all group-hover:bg-blue-500/[0.12]" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
                <ClipboardList size={22} />
              </div>

              <div>
                <p className="text-xl font-semibold text-white">Pendentes</p>

                <div className="mt-2 text-sm text-slate-400">
                  <ContadoresPendente />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative min-h-44 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:shadow-[0_12px_35px_rgba(99,102,241,0.08)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/[0.07] blur-3xl transition-all group-hover:bg-indigo-500/[0.12]" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/[0.09] text-indigo-300">
                <Users size={22} />
              </div>

              <div>
                <div className="mt-2 text-sm text-slate-400">
                  <ContadorFuncionarios />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative min-h-44 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/25 hover:shadow-[0_12px_35px_rgba(168,85,247,0.08)] sm:col-span-2 xl:col-span-1">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/[0.07] blur-3xl transition-all group-hover:bg-purple-500/[0.12]" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/[0.09] text-purple-300">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-xl font-semibold text-white">Permissões</p>

                <p className="mt-2 text-sm text-slate-400">
                  Controle de acesso
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acesso rápido */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">Acesso rápido</h2>

            <p className="mt-1 text-sm text-slate-500">
              Acesse rapidamente as ferramentas de gerenciamento.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Solicitações */}
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 text-left transition-all duration-300 hover:border-blue-400/25 hover:bg-[#151526] hover:shadow-[0_10px_30px_rgba(37,99,235,0.06)] sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300 transition-all group-hover:border-blue-400/30 group-hover:bg-blue-500/[0.15]">
                <ShieldCheck size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Solicitações de acesso ao sistema
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Visualize e gerencie os pedidos de acesso dos usuários.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </button>

            {/* Funcionários */}
            <button
              type="button"
              onClick={() => setUsuario(true)}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 text-left transition-all duration-300 hover:border-indigo-400/25 hover:bg-[#151526] hover:shadow-[0_10px_30px_rgba(99,102,241,0.06)] sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/[0.09] text-indigo-300 transition-all group-hover:border-indigo-400/30 group-hover:bg-indigo-500/[0.15]">
                <UserRound size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">Funcionários</p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Consulte os funcionários e gerencie seus acessos.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-indigo-400"
              />
            </button>
          </div>
        </section>

        {/* Rodapé */}
        <div className="mt-10 border-t border-white/[0.06] pt-5">
          <p className="text-xs text-slate-600">
            Painel de administração · Gerenciamento de usuários e acessos.
          </p>
        </div>
      </div>
    </main>
  );
}
