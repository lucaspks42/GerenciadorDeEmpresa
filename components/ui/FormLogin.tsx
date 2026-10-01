"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const campo =
  "w-full rounded-lg bg-neutral-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500";

const rotulo = "mb-1 block text-xs text-neutral-600";

export default function FormLogin() {
  const [mostraSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  function atualizar(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((formAtual) => ({
      ...formAtual,
      [e.target.name]: e.target.value,
    }));
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    try {
      setCarregando(true);

      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          senha: form.senha,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.erro || "Erro ao fazer login.");
        return;
      }

      router.push("/");

      setSucesso(resultado.mensagem || "Login realizado com sucesso!");
    } catch (erro) {
      console.error("ERRO NO LOGIN:", erro);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="w-full space-y-4 text-black">
      <div>
        <label htmlFor="email" className={rotulo}>
          E-mail
        </label>

        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="email@gmail.com"
          value={form.email}
          onChange={atualizar}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="senha" className={rotulo}>
          Senha
        </label>

        <div className="relative">
          <input
            type={mostraSenha ? "text" : "password"}
            id="senha"
            name="senha"
            required
            placeholder="Sua senha"
            value={form.senha}
            onChange={atualizar}
            className={campo}
          />

          <button
            type="button"
            onClick={() => setMostrarSenha((valor) => !valor)}
            aria-label="Mostrar senha oculta"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {mostraSenha ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-lg bg-violet-800 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>

      <hr className="border-neutral-200" />
    </form>
  );
}
