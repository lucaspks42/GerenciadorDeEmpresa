"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const campo =
  "w-full rounded-lg bg-neutral-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500";

const rotulo = "mb-1 block text-xs text-neutral-600";

export default function FormCadastro() {
  const router = useRouter();

  const [mostraSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
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

    if (form.senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (form.senha !== form.confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.erro || "Erro ao cadastrar usuário.");
        return;
      }

      setSucesso(resultado.mensagem || "Usuário cadastrado com sucesso!");

      setForm({
        nome: "",
        email: "",
        senha: "",
        confirmar: "",
      });

      // Vai para a Dashboard após o cadastro
      router.push("/");
    } catch (erro) {
      console.error("ERRO NO CADASTRO:", erro);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="w-full space-y-4 text-black">
      <div>
        <label htmlFor="nome" className={rotulo}>
          Nome
        </label>

        <input
          type="text"
          id="nome"
          name="nome"
          required
          placeholder="Seu nome completo"
          value={form.nome}
          onChange={atualizar}
          className={campo}
        />
      </div>

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
            placeholder="Crie sua senha"
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

      <div>
        <label htmlFor="confirmar" className={rotulo}>
          Confirmar senha
        </label>

        <input
          id="confirmar"
          name="confirmar"
          required
          placeholder="Repita a senha"
          type={mostraSenha ? "text" : "password"}
          value={form.confirmar}
          onChange={atualizar}
          className={campo}
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-lg bg-violet-800 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {carregando ? "Cadastrando..." : "Cadastrar"}
      </button>

      <hr className="border-neutral-200" />
    </form>
  );
}
