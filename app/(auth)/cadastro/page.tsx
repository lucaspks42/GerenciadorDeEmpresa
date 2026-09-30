"use client";

import FormCadastro from "@/components/ui/FormCadastro";
import FormLogin from "@/components/ui/FormLogin";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Cadastro() {
  const [modoLogin, setModoLogin] = useState(false);

  const transicao = {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d0d19] text-white">
      {/* =========================================================
          FUNDO / DASHBOARD
          ========================================================= */}

      <motion.div
        animate={{
          x: modoLogin ? "40vw" : "0vw",
          scale: modoLogin ? 1.04 : 1,
        }}
        transition={transicao}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Glow roxo */}
        <motion.div
          animate={{
            x: modoLogin ? "8%" : "0%",
            y: modoLogin ? "-3%" : "0%",
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-600/40 blur-3xl"
        />

        {/* Glow azul */}
        <motion.div
          animate={{
            x: modoLogin ? "-10%" : "0%",
            y: modoLogin ? "4%" : "0%",
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/25 blur-3xl"
        />

        {/* Pontos */}
        <motion.div
          animate={{
            x: modoLogin ? "5%" : "0%",
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.07) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Dashboard */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:p-10">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 font-semibold shadow-lg shadow-violet-500/30">
                A
              </div>

              <div className="leading-tight">
                <p className="font-semibold">Assistente</p>
                <p className="text-xs text-slate-400">Administrativo</p>
              </div>
            </div>

            <input
              type="search"
              placeholder="Pesquisar..."
              className="hidden w-72 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 sm:block"
            />
          </header>

          <section className="grid flex-1 content-center gap-6 md:grid-cols-2 lg:grid-cols-12">
            {/* Receita */}
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-5 lg:-rotate-1">
              <p className="text-sm text-slate-400">Receita mensal</p>

              <h2 className="mt-3 text-4xl font-bold">R$ 24.850</h2>

              <p className="mt-2 text-sm text-emerald-400">+12,5% este mês</p>
            </article>

            {/* Clientes */}
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-4 lg:rotate-1">
              <p className="text-sm text-slate-400">Clientes</p>

              <h2 className="mt-3 text-4xl font-bold">128</h2>

              <p className="mt-2 text-sm text-slate-400">
                clientes cadastrados
              </p>
            </article>

            {/* Tarefas pendentes */}
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:col-span-2 lg:col-span-3">
              <p className="text-sm text-slate-400">Tarefas pendentes</p>

              <h2 className="mt-3 text-4xl font-bold">17</h2>

              <p className="mt-2 text-sm text-orange-400">5 para hoje</p>
            </article>

            {/* Tarefas */}
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-5">
              <p className="text-sm text-slate-400">Tarefas</p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enviar relatórios</span>
                  <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
                    Fazendo
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Atualizar clientes</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                    Concluído
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Revisar pagamentos</span>
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">
                    A fazer
                  </span>
                </div>
              </div>
            </article>

            {/* Pagamentos */}
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-3 lg:rotate-2">
              <p className="text-sm text-slate-400">Pagamentos</p>

              <h2 className="mt-3 text-4xl font-bold">R$ 8.420</h2>

              <p className="mt-2 text-sm text-slate-400">previstos</p>
            </article>

            {/* Próximos pagamentos */}
            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:col-span-2 lg:col-span-4">
              <p className="text-sm text-slate-400">Próximos pagamentos</p>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Empresa Alpha</span>
                  <span className="text-sm font-semibold">R$ 1.200</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Empresa Beta</span>
                  <span className="text-sm font-semibold">R$ 850</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Empresa Gamma</span>
                  <span className="text-sm font-semibold">R$ 620</span>
                </div>
              </div>
            </article>

            {/* Aviso */}
            <div className="flex justify-center md:col-span-2 lg:col-span-12">
              <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-6 py-3 text-sm text-violet-200">
                Você possui novos avisos no sistema
              </div>
            </div>
          </section>
        </div>
      </motion.div>

      {/* =========================================================
          FORMULÁRIOS
          ========================================================= */}

      <AnimatePresence mode="wait" initial={false}>
        {!modoLogin ? (
          /* =====================================================
             CADASTRO — DIREITA
             ===================================================== */
          <motion.div
            key="cadastro"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute right-0 top-0 z-50 flex h-full w-[40vw] min-w-[420px] items-center justify-center overflow-hidden bg-[#0d0d19]"
          >
            <div className="relative flex h-full w-full flex-col items-center justify-center px-12">
              {/* linha lateral */}
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" />

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 font-bold shadow-xl shadow-violet-500/30">
                  A
                </div>

                <h1 className="text-3xl font-bold">Criar conta</h1>

                <p className="mt-2 text-sm text-slate-400">
                  Crie sua conta para acessar o sistema
                </p>
              </div>

              <FormCadastro />

              <button
                type="button"
                onClick={() => setModoLogin(true)}
                className="mt-6 text-sm text-slate-400 transition hover:text-white"
              >
                Já possui uma conta?{" "}
                <span className="font-semibold text-violet-400">Entrar</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* =====================================================
             LOGIN — ESQUERDA, VINDO DO CANTO DIREITO
             ===================================================== */
          <motion.div
            key="login"
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-0 top-0 z-50 flex h-full w-[40vw] min-w-[420px] items-center justify-center overflow-hidden bg-[#0d0d19]"
          >
            <div className="relative flex h-full w-full flex-col items-center justify-center px-12">
              {/* linha lateral */}
              <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" />

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 font-bold shadow-xl shadow-violet-500/30">
                  A
                </div>

                <h1 className="text-3xl font-bold">Entrar</h1>

                <p className="mt-2 text-sm text-slate-400">
                  Entre na sua conta para continuar
                </p>
              </div>

              <FormLogin />

              <button
                type="button"
                onClick={() => setModoLogin(false)}
                className="mt-6 text-sm text-slate-400 transition hover:text-white"
              >
                Ainda não possui uma conta?{" "}
                <span className="font-semibold text-violet-400">
                  Criar conta
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
