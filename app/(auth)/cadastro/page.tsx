"use client";

import { event } from "next/dist/build/output/log";
import { FormEvent, useState } from "react";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function cadastrar(event: FormEvent) {
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
    <main>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={cadastrar}
          className="h-150 w-150 border border-border rounded-xl px-10 py-10 flex-col flex gap-8 "
        >
          <header className="-mx-10 w-auto border-b border-border px-10 pb-3 text-2xl">
            Cadastro
          </header>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm">Nome Completo</label>
              <input
                type="text"
                value={nome}
                placeholder="Digite o seu nome"
                className={classeInput}
                onChange={(event) => setNome(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input
                type="text"
                value={email}
                placeholder="Digite o seu email"
                className={classeInput}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Senha</label>
              <input
                type="password"
                value={senha}
                placeholder="Digite sua senha"
                className={classeInput}
                onChange={(event) => setSenha(event.target.value)}
              />
            </div>
            <div className="flex gap-3 justify-end py-5 px-6     border-white/30">
              <button
                className="              border
              border-white/30
              bg-background
              hover:bg-accent
              text-muted-foreground
              hover:text-foreground
              transition-colors
              rounded-xl
              px-5
              py-2.5
              text-sm"
              >
                Cancelar
              </button>
              <button
                className="              bg-primary
              hover:bg-primary/85
              text-primary-foreground
              transition-colors
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-semibold
              shadow-lg
              shadow-primary/10"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
