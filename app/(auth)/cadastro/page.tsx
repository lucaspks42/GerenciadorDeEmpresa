"use client";

import FormCadastro from "@/components/ui/FormCadastro";
import FormLogin from "@/components/ui/FormLogin";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [modoLogin, setModoLogin] = useState(false);

  async function cadastrar(event: React.FormEvent) {
    event.preventDefault();

    setMensagem("");

    const resposta = await fetch("/api/auth/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      setMensagem(dados.erro);
      return;
    }

    setMensagem(dados.mensagem);

    setNome("");
    setEmail("");
    setSenha("");
  }

  const classeInput = `
    border
    border-white/30
    bg-background
    text-foreground
    placeholder:text-muted-foreground
    rounded-xl
    p-3
    outline-none
    transition-all
    focus:border-primary
    focus:ring-2
    focus:ring-primary/20
    w-full
  `;

  return (
    <main className="relative min-h-screen bg-background text-white font-bold">
      <motion.div
        animate={{ left: modoLogin ? "40%" : "0%" }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-0 h-full w-[60%]"
      >
        <Image src="/fundo.svg" alt="" fill priority className="object-cover" />
      </motion.div>

      <motion.div
        animate={{ left: modoLogin ? "0%" : "60%" }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        className="absolute left-[60%] top-0 h-full w-[40%] bg-background"
      >
        <div className="flex h-full flex-col justify-between px-8 py-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-700 via-violet-800 to-violet-950" />

            <span className="text-lg font-semibold">AdminFlow</span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {modoLogin ? (
                  <motion.h1
                    key="titulo-login"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="mb-6 text-xl font-semibold"
                  >
                    Login
                  </motion.h1>
                ) : (
                  <motion.h1
                    key="titulo-cadastro"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="mb-6 text-xl font-semibold"
                  >
                    Cadastro
                  </motion.h1>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {modoLogin ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    key="login"
                  >
                    <FormLogin />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    key="cadastro"
                  >
                    <FormCadastro />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              {modoLogin ? (
                <motion.p
                  key="trocar-cadastro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-center text-sm text-muted-foreground"
                >
                  Não possui uma conta?{" "}
                  <button
                    onClick={() => setModoLogin(false)}
                    className="text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </motion.p>
              ) : (
                <motion.p
                  key="trocar-login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-center text-sm text-muted-foreground"
                >
                  Já possui uma conta?{" "}
                  <button
                    onClick={() => setModoLogin(true)}
                    className="text-primary hover:underline"
                  >
                    Entrar
                  </button>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
