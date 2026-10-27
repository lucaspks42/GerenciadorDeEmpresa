"use client";

import ContadoresPendente from "@/components/ui/contadores/ContadoresPendente";
import ModalUsuario from "@/components/ui/Modal/ModalUsuario";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserRound,
  ArrowUpRight,
  Clock,
  UserCheck,
  Settings,
  ClipboardList,
  Building2,
  History,
} from "lucide-react";

import ContadorFuncionarios from "@/components/ui/contadores/ContadorUsuarios";
import ContadorAtivo from "@/components/ui/contadores/ContadorAtivo";
import Permissoes from "@/components/ui/Modal/permissoes/Permissoes";
import ModalPermissao from "@/components/ui/Modal/permissoes/ModalPermicoes";
import ModalEmpresa from "@/components/ui/Modal/empresa/ModalEmpresa";

export default function Administracao() {
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState(false);
  const [permissoes, setPermissoes] = useState(false);
  const [empresa, setEmpresa] = useState(false);

  const fecharModal = () => setModalAberto(false);
  const fecharUsuario = () => setUsuario(false);
  const fecharPermissoes = () => setPermissoes(false);
  const fecharEmpresa = () => setEmpresa(false);

  const estiloBotao =
    "group flex min-h-36 w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#11111f] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:bg-[#151526] hover:shadow-[0_10px_30px_rgba(37,99,235,0.06)] sm:p-6";

  const estiloIcone =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300 transition-all group-hover:border-blue-400/30 group-hover:bg-blue-500/[0.15]";

  return (
    <main className="relative h-[calc(100vh-4rem)] overflow-y-auto bg-[#0d0d19] text-white">
      {modalAberto && <ModalPermissao onClose={fecharModal} />}
      {usuario && <ModalUsuario onClose={fecharUsuario} />}
      {permissoes && <Permissoes onClose={fecharPermissoes} />}
      {empresa && <ModalEmpresa onClose={fecharEmpresa} />}

      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-10 lg:px-12">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group relative min-h-32 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.07] blur-3xl transition-all group-hover:bg-blue-500/[0.12]" />

            <div className="relative flex h-full flex-col justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
                <Users size={19} />
              </div>

              <div className="text-sm text-slate-400">
                <ContadorFuncionarios />
              </div>
            </div>
          </div>

          <div className="group relative min-h-32 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:shadow-[0_12px_35px_rgba(99,102,241,0.08)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/[0.07] blur-3xl transition-all group-hover:bg-indigo-500/[0.12]" />

            <div className="relative flex h-full flex-col justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/15 bg-indigo-500/[0.09] text-indigo-300">
                <Clock size={19} />
              </div>

              <div>
                <p className="text-base font-semibold text-white">Pendentes</p>
                <div className="mt-1 text-sm text-slate-400">
                  <ContadoresPendente />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative min-h-32 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11111f] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/25 hover:shadow-[0_12px_35px_rgba(168,85,247,0.08)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/[0.07] blur-3xl transition-all group-hover:bg-purple-500/[0.12]" />

            <div className="relative flex h-full flex-col justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/15 bg-purple-500/[0.09] text-purple-300">
                <UserCheck size={19} />
              </div>

              <div>
                <p className="text-base font-semibold text-white">Ativos</p>
                <ContadorAtivo />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">Gerenciamento</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className={estiloBotao}
            >
              <div className={estiloIcone}>
                <ShieldCheck size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Solicitações de acesso
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

            <button
              type="button"
              onClick={() => setUsuario(true)}
              className={estiloBotao}
            >
              <div className={estiloIcone}>
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
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </button>

            <button
              type="button"
              className={estiloBotao}
              onClick={() => setPermissoes(true)}
            >
              <div className={estiloIcone}>
                <ClipboardList size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">Permissões</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Gerencie as permissões de acesso aos módulos.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </button>

            <button
              type="button"
              className={estiloBotao}
              onClick={() => setEmpresa(true)}
            >
              <div className={estiloIcone}>
                <Building2 size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Dados da empresa
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Configure as informações cadastrais da empresa.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </button>

            <button type="button" className={estiloBotao}>
              <div className={estiloIcone}>
                <History size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Histórico de atividades
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Acompanhe as ações realizadas no sistema.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </button>

            <button type="button" className={estiloBotao}>
              <div className={estiloIcone}>
                <Settings size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Configurações
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Personalize as configurações do sistema.
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
