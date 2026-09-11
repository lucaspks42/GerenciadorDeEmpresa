"use client";

import { InputGroupDemo } from "@/components/ui/InputGroupDemo";
import ModalCliente from "@/components/ui/ModalCliente";
import { Building, Trash } from "lucide-react";

import { useEffect, useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
};

export default function Clientes() {
  const [modalAberto, setModalAberto] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function burcarCliente() {
      try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar clientes");
        }

        const clientesDoBanco: Cliente[] = await resposta.json();

        setClientes(clientesDoBanco);
      } catch (erro) {
        console.error(erro);
      }
    }

    burcarCliente();
  }, []);

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

      <div className="flex gap-4 px-10 py-10 font-bold justify-between">
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
              px-4"
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
        <div className="mx-10 my-10">
          <div className="grid grid-cols-[2fr_1fr_2fr_auto] px-6 py-3 border-b border-gray-300 text-sm font-semibold text-gray-500">
            <div>Cliente</div>
            <div>Telefone</div>
            <div>Email</div>
            <div></div>
          </div>

          {clientes.map((cliente) => (
            <div
              className="grid grid-cols-[2fr_1fr_2fr_auto] items-center px-6 py-4 border-b border-gray-200 hover:bg-gray-50"
              key={cliente.id}
            >
              <div className="self-center">
                <div className="text-lg font-bold text-black">
                  {cliente.nome}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Building size={15} className="text-gray-400" />
                  {cliente.empresa}
                </div>
              </div>

              <div className="text-sm text-gray-700">{cliente.telefone}</div>

              <div className="text-sm text-gray-700">{cliente.email}</div>
              <div className="flex justify-end">
                <Trash
                  size={20}
                  className="text-gray-500 hover:text-red-600 cursor-pointer transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
