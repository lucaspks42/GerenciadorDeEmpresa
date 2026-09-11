"use client";

import { InputGroupDemo } from "@/components/ui/InputGroupDemo";
import ModalCliente from "@/components/ui/ModalCliente";
import { Building, CircleUser } from "lucide-react";
import { useState } from "react";

type Cliente = {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
};

export default function Clientes() {
  const [modalAberto, setModalAberto] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fechar = () => {
    setModalAberto(false);
  };

  const adicionarCliente = (cliente: Cliente) => {
    setClientes([...clientes, cliente]);
  };

  return (
    <main className="">
      {modalAberto && (
        <ModalCliente
          fecharModal={fechar}
          adicionarCliente={adicionarCliente}
        />
      )}

      <header className="w-full border-b text-black border-gray-300 h-16 px-10 justify-start content-center">
        Clientes
      </header>

      <div className="flex gap-4 px-10 py-10 font-bold justify-between ">
        <InputGroupDemo />
        <button
          className="border
              border-gray-300
              bg-indigo-600
              hover:bg-indigo-700
              transition-colors
              rounded-lg
              text-white
              cursor-pointer
              whitespace-nowrap
              px-4
              "
          onClick={() => {
            setModalAberto(true);
          }}
        >
          + Novo Cliente
        </button>
      </div>
      {clientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-100 mx-10 border-dashed border-2 my-10">
          <div className="text-lg">Nenhum Cliente Cadastrado</div>

          <div className="text-base text-center text-gray-500">
            Cadastre seu primeiro cliente para começar a acompanhar pagamentos e
            tarefas.
          </div>
        </div>
      ) : (
        <div className="mx-10 my-10 ">
          {clientes.map((cliente) => (
            <div className="border border-gray-300" key={cliente.email}>
              <div className="flex ">{cliente.nome}</div>
              <div className="flex text-">
                <Building size={15} className="text-gray-400" />
                {cliente.empresa}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
