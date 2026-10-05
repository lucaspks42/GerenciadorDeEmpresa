"use client";

import ConcluirPagamentos from "@/components/ui/ConcluirPagamento";
import { useSearch } from "@/components/context/SearchContext";
import type { Pagamento } from "@/types/Pagamentos";
import { useEffect, useState } from "react";

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

      <div className="h-full px-10 py-8">
        {itensFiltrados.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-muted-foreground">
              Nenhum pagamento encontrado.
            </p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            <div className="space-y-3">
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
                  rounded-lg
                  border
                  border-border
                  bg-card
                  px-6
                  py-5
                  transition-colors
                  hover:bg-accent
                  cursor-pointer
                "
                  >
                    <div className="grid grid-cols-[2fr_1fr_2fr_auto] items-center gap-6">
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
                      <div className="text-right">
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
