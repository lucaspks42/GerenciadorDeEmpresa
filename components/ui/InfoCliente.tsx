import { X } from "lucide-react";
import type { Cliente } from "@/types/Cliente";
import { useEffect, useState } from "react";

type InfoClienteProps = {
  fecharModal: () => void;
  cliente: Cliente;
};

type Pagamento = {
  id: number;
  valor: number;
  dia_vencimento: number;
  data_vencimento: string;
  status: string;
};

export default function InfoCliente({
  fecharModal,
  cliente,
}: InfoClienteProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  useEffect(() => {
    async function buscarPagamentos() {
      try {
        const resposta = await fetch(`/api/clientes/${cliente.id}/pagamentos`);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const pagamentosDoBanco: Pagamento[] = await resposta.json();

        setPagamentos(pagamentosDoBanco);
      } catch (erro) {
        console.error(erro);
      }
    }

    buscarPagamentos();
  }, [cliente.id]);

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 font-bold">
      <div className="h-200 w-400 bg-white rounded-lg flex flex-col ">
        <header className="border-b border-gray-300 px-5 py-5 items-center flex justify-between text-2xl">
          {cliente.nome}
          <X
            onClick={fecharModal}
            className="text-gray-500 hover:text-red-600 transition-colors"
          />
        </header>

        <div className="py-8 px-8 gap-16 grid grid-cols-3 ">
          <div className="flex-col flex">
            <label>Nome</label>
            <input
              type="text"
              value={cliente.nome}
              readOnly
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>
          <div className="flex-col flex">
            <label>Empresa</label>
            <input
              type="text"
              value={cliente.empresa}
              readOnly
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>
          <div className="flex-col flex">
            <label>Email</label>
            <input
              type="text"
              value={cliente.email}
              readOnly
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>
          <div className="flex-col flex">
            <label>Telefone</label>
            <input
              type="text"
              value={cliente.telefone}
              readOnly
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>

          <div className="flex-col flex">
            <label>Pagamento</label>

            <input
              type="text"
              readOnly
              value={cliente.valorProduto}
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>
          <div className="flex-col flex">
            <label>Mensalidade</label>

            <input
              type="text"
              readOnly
              value={cliente.valorMensalidade}
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>
          <div className="flex-col flex">
            <label>Data de vencimento</label>
            <input
              type="text"
              readOnly
              value={cliente.diaVencimento}
              className="border border-gray-300 rounded-lg text-black p-2"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
