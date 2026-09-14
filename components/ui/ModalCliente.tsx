import { useState } from "react";
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
      nome: nome,
      empresa: empresa,
      telefone: telefone,
      email: email,
      valorProduto: valorProduto,
      valorMensalidade: valorMensalidade,
      diaVencimento: diaVencimento,
    };

    const resposta = await fetch("/api/clientes", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(cliente),
    });

    if (resposta.ok) {
      console.log("cliente cadastrado!");

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

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 font-bold">
      <div className="w-200 h-200 bg-white rounded-lg flex flex-col">
        <header className="border-b border-gray-300 px-5 py-5 items-center justify-between text-2xl">
          Novo Cliente
        </header>

        <div className="py-10 px-5 flex flex-col flex-1 overflow-y-auto">
          <div className="flex-col flex gap-4">
            <div className="flex-col flex">
              <label>Nome do cliente</label>

              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João da Silva"
                className="border border-gray-300 rounded-lg text-black p-2"
              />
            </div>

            <div className="flex-col flex">
              <label>Empresa</label>

              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Empresa Exemplo"
                className="border border-gray-300 rounded-lg text-black p-2"
              />
            </div>

            <div className="flex-col flex">
              <label>Telefone</label>

              <input
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                className="border border-gray-300 rounded-lg text-black p-2"
              />
            </div>

            <div className="flex-col flex">
              <label>Email</label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="algumacoisa@gmail.com"
                className="border border-gray-300 rounded-lg text-black p-2"
              />
            </div>

            <div className="flex-col flex">
              <label>Valor cobrado</label>

              <input
                value={valorProduto}
                type="number"
                placeholder="100,00"
                onChange={(e) => setValorProduto(e.target.value)}
                className="border border-gray-300 rounded-lg text-black p-2"
              />
            </div>

            <div className="flex gap-4">
              <label>Manutenção</label>

              <input
                checked={checkbox}
                onChange={(e) => setCheckBox(e.target.checked)}
                type="checkbox"
              />
            </div>

            {checkbox && (
              <div className="flex flex-col gap-1">
                <label>Valor</label>

                <input
                  value={valorMensalidade}
                  onChange={(e) => setValorMensalidade(e.target.value)}
                  type="number"
                  className="border border-gray-300 rounded-lg text-black p-2"
                />

                <label>Data de vencimento</label>

                <input
                  value={diaVencimento}
                  type="number"
                  onChange={(e) => setDiaVencimento(e.target.value)}
                  min={1}
                  max={31}
                  placeholder="10"
                  className="border border-gray-300 rounded-lg text-black p-2"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-end py-5 px-5 border-t border-gray-200">
          <button
            onClick={fecharModal}
            className="border border-gray-300 hover:bg-gray-400 rounded-lg p-2"
          >
            Cancelar
          </button>

          <button
            onClick={salvarCliente}
            className="border border-gray-300 rounded-lg p-2 bg-indigo-600 text-white px-4 hover:bg-indigo-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </main>
  );
}
