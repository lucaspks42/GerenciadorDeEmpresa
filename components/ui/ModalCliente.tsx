"use client";

import { useState } from "react";
import { X, UserPlus, Wrench } from "lucide-react";
import type { Cliente } from "@/types/Cliente";

type ModalClienteProps = {
  fecharModal: () => void;
  adicionarCliente: (cliente: Cliente) => void;
};

export default function ModalCliente({
  fecharModal,
  adicionarCliente,
}: ModalClienteProps) {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [valorProduto, setValorProduto] = useState("");
  const [valorMensalidade, setValorMensalidade] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");

  const salvarCliente = async () => {
    const cliente = {
      nome,
      empresa,
      telefone,
      email,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    };

    const resposta = await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });

    if (resposta.ok) {
      const dados = await resposta.json();

      adicionarCliente(dados);
      fecharModal();
    }
  };

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return `(${numeros}`;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  const classeInput =
    "w-full rounded-xl border border-white/[0.08] bg-[#0d0d19] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  const classeLabel = "text-xs font-medium text-slate-400";

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-2xl shadow-black/40">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.09] text-blue-300">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Novo cliente</h2>

              <p className="mt-1 text-xs text-slate-500">
                Cadastre as informações do cliente.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fecharModal}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Nome do cliente</label>

              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João da Silva"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Empresa</label>

              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Empresa Exemplo"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>Telefone</label>

              <input
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={classeLabel}>E-mail</label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={classeLabel}>Valor cobrado</label>

              <input
                value={valorProduto}
                type="number"
                placeholder="100,00"
                onChange={(e) => setValorProduto(e.target.value)}
                className={classeInput}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d0d19] p-4 transition-colors hover:border-blue-400/25 sm:col-span-2">
              <input
                checked={checkbox}
                onChange={(e) => setCheckBox(e.target.checked)}
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-blue-500"
              />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                <Wrench size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Manutenção mensal
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Ative para configurar uma mensalidade.
                </p>
              </div>
            </label>

            {checkbox && (
              <div className="grid grid-cols-1 gap-5 rounded-xl border border-blue-400/15 bg-blue-500/[0.04] p-5 sm:col-span-2 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={classeLabel}>Valor da mensalidade</label>

                  <input
                    value={valorMensalidade}
                    onChange={(e) => setValorMensalidade(e.target.value)}
                    type="number"
                    placeholder="150,00"
                    className={classeInput}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={classeLabel}>Dia de vencimento</label>

                  <input
                    value={diaVencimento}
                    type="number"
                    onChange={(e) => setDiaVencimento(e.target.value)}
                    min={1}
                    max={31}
                    placeholder="10"
                    className={classeInput}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-white/[0.07] px-6 py-5">
          <button
            type="button"
            onClick={fecharModal}
            className="cursor-pointer rounded-xl border border-white/[0.09] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvarCliente}
            className="cursor-pointer rounded-xl border border-blue-400/20 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-500"
          >
            Salvar cliente
          </button>
        </footer>
      </div>
    </main>
  );
}
