import { useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
};

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

  const salvarCliente = async () => {
    const cliente = {
      nome: nome,
      empresa: empresa,
      telefone: telefone,
      email: email,
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

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 font-bold">
      <div className="h-125 w-125 bg-white items-center justify-center rounded-lg">
        <header className="border-b border-gray-300 px-5 py-5 items-center justify-between">
          Novo Cliente
        </header>

        <div className="py-10 px-5 flex flex-col">
          <div className="flex-col flex">
            <label>Nome do cliente</label>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="João da Silva"
              className="border border-gray-300 rounded-lg text-black p-2"
            />

            <label>Empresa</label>

            <input
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Empresa Exemplo"
              className="border border-gray-300 rounded-lg text-black p-2"
            />

            <label>Telefone</label>

            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(47) 9999-9999"
              className="border border-gray-300 rounded-lg text-black p-2"
            />

            <label>Email</label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="algumacoisa@gmail.com"
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>

          <div className="py-8 flex gap-4 justify-end place-content-end">
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
      </div>
    </main>
  );
}
