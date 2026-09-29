import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useState } from "react";

const campo =
  "w-full rounded-lg bg-neutral-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500";
const rotulo = "mb-1 block text-xs text-neutral-600";

export default function FormCadastro() {
  const [mostraSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
  });

  function atualizar(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();

    if (form.senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (form.senha !== form.confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setErro("");
    console.log("Cadastro:", form); // aqui depois entra o salvamento real
  }

  return (
    <form onSubmit={enviar} className="space-y-4 text-black">
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
            onClick={() => setMostrarSenha(!mostraSenha)}
            aria-label="Mostrar senha oculta"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {mostraSenha ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-violet-800 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Logar
      </button>

      <hr className="border-neutral-200" />
    </form>
  );
}
