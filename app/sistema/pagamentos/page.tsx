"use client";

import ConcluirPagamentos from "@/components/ui/ConcluirPagamento";
import { useSearch } from "@/components/context/SearchContext";
import { useEffect, useState } from "react";

type Pagamento = {
  id: number;
  cliente_id: number;
  nome: string;
  empresa: string;
  valor: number;
  dia_vencimento: number;
  data_vencimento: string;
  status: string;
  prioridade: number;
};

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  const [pagamentoSelecionado, setPagamentoSelecionado] =
    useState<Pagamento | null>(null);

  const { buscar } = useSearch();

  function atualizarPagamento(pagamentoAtualizado: Pagamento) {
    setPagamentos((pagamentosAtuais) =>
      pagamentosAtuais.map((pagamento) =>
        pagamento.id === pagamentoAtualizado.id
          ? pagamentoAtualizado
          : pagamento,
      ),
    );
  }

  useEffect(() => {
    async function buscarPagamentos() {
      try {
        const resposta = await fetch("/api/pagamentos");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const dados: Pagamento[] = await resposta.json();

        setPagamentos(dados);
      } catch (erro) {
        console.error("Erro:", erro);
      }
    }

    buscarPagamentos();
  }, []);

  const itensFiltrados = pagamentos.filter((pagamento) => {
    const pesquisa = buscar.toLowerCase().trim();

    return (
      pagamento.nome.toLowerCase().includes(pesquisa) ||
      pagamento.empresa.toLowerCase().includes(pesquisa) ||
      pagamento.status.toLowerCase().includes(pesquisa)
    );
  });

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground">
      {pagamentoSelecionado && (
        <ConcluirPagamentos
          pagamento={pagamentoSelecionado}
          fechar={() => setPagamentoSelecionado(null)}
          atualizarPagamento={atualizarPagamento}
        />
      )}

      <div className="px-10 py-8 h-full">
        {itensFiltrados.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-muted-foreground">
              Nenhum pagamento encontrado.
            </p>
          </div>
        ) : (
          <div
            className="
              w-full
              h-full
              border
              border-border
              rounded-lg
              overflow-hidden
              flex
              flex-col
            "
          >
            {/* ÁREA QUE ROLA */}
            <div className="overflow-y-auto flex-1">
              {itensFiltrados.map((pagamento) => {
                const data = new Date(pagamento.data_vencimento + "T00:00:00");

                const dataFormatada = data.toLocaleDateString("pt-BR");

                return (
                  <div
                    key={pagamento.id}
                    onClick={() => {
                      setPagamentoSelecionado(pagamento);
                    }}
                    className="
                      w-full
                      grid
                      grid-cols-[2fr_1fr_2fr_auto]
                      items-center
                      px-6
                      py-5
                      border-b
                      border-border
                      last:border-b-0
                      hover:bg-accent
                      transition-colors
                      text-left
                      cursor-pointer
                    "
                  >
                    {/* CLIENTE */}
                    <div>
                      <p className="font-medium">{pagamento.nome}</p>

                      <p className="text-sm text-muted-foreground">
                        {pagamento.empresa}
                      </p>
                    </div>

                    {/* VALOR */}
                    <div>
                      <p className="font-medium">
                        R$ {pagamento.valor.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    {/* VENCIMENTO */}
                    <div>
                      <p className="text-sm">Vencimento: {dataFormatada}</p>
                    </div>

                    {/* STATUS */}
                    <div>
                      <span
                        className={
                          pagamento.status === "Pago"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {pagamento.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
