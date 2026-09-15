"use client";

import { X, Pen } from "lucide-react";
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

  const [editando, setEditando] = useState(false);

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-6xl max-h-[90vh] bg-card text-card-foreground border border-border rounded-2xl flex flex-col shadow-2xl">
        <header className="border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{cliente.nome}</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Informações do cliente
            </p>
          </div>
          <div>
            <button
              className="
              p-2
              rounded-lg
              text-muted-foreground
              hover:text-green-600
              hover:bg-accent
              transition-colors
            "
            >
              <Pen size={20} />
            </button>

            <button
              onClick={fecharModal}
              className="
              p-2
              rounded-lg
              text-muted-foreground
              hover:text-red-600
              hover:bg-accent
              transition-colors
            "
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 gap-5 grid grid-cols-3 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Nome</label>

            <input
              value={cliente.nome}
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Empresa</label>

            <input
              value={cliente.empresa}
              readOnly
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Email</label>

            <input
              value={cliente.email}
              readOnly
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Telefone</label>

            <input
              value={cliente.telefone}
              readOnly
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Pagamento</label>

            <input
              value={cliente.valorProduto}
              readOnly
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Mensalidade</label>

            <input
              value={cliente.valorMensalidade}
              readOnly
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">
              Dia de vencimento
            </label>

            <input
              value={cliente.diaVencimento}
              readOnly
              className="border border-input bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="col-span-3 border border-border bg-background/50 rounded-2xl p-6 mt-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">Próximos pagamentos</h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Histórico e próximos vencimentos
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {pagamentos.map((pagamento) => {
                const [ano, mes, dia] = pagamento.data_vencimento.split("-");

                return (
                  <div
                    key={pagamento.id}
                    className="
                      border
                      border-border
                      bg-card
                      rounded-xl
                      p-4
                      flex
                      items-center
                      justify-between
                      hover:border-primary/40
                      transition-colors
                    "
                  >
                    <span className="text-sm text-muted-foreground">
                      {dia}/{mes}/{ano}
                    </span>

                    <span className="text-sm font-semibold">
                      {pagamento.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>

                    <span className="text-xs font-medium text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                      {pagamento.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
