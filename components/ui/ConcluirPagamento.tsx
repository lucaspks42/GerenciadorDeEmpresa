"use client";

import { Pagamento } from "@/types/Pagamentos";
import { CircleCheck, Pen, X } from "lucide-react";
import { useState } from "react";

type ConcluirPagamentosProps = {
  pagamento: Pagamento;
  fechar: () => void;
  atualizarPagamento: (pagamento: Pagamento) => void;
};

export default function ConcluirPagamentos({
  pagamento,
  fechar,
  atualizarPagamento,
}: ConcluirPagamentosProps) {
  let corStatus = "";

  if (pagamento.status === "Pago") {
    corStatus = "border-green-400 bg-green-500/5";
  } else {
    corStatus = "border-orange-400 bg-orange-600/5";
  }

  const [editando, setEditando] = useState(false);

  const [valor, setValor] = useState(pagamento.valor);

  const [dataVencimento, setDataVencimento] = useState(
    pagamento.data_vencimento,
  );

  function formatarData(data?: string | null) {
    if (!data) {
      return "Não informado";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
  }

  async function confirmarPagamento() {
    try {
      const resposta = await fetch(`/api/pagamentos/${pagamento.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Pago",
        }),
      });

      const dados = await resposta.json();

      console.log("RESPOSTA DA API:", dados);

      if (!resposta.ok) {
        throw new Error("Erro ao confirmar pagamento");
      }

      const pagamentoAtualizado: Pagamento = {
        ...pagamento,
        status: "Pago",
      };

      console.log("ENVIANDO PARA O PAI:", pagamentoAtualizado);

      atualizarPagamento(pagamentoAtualizado);

      fechar();
    } catch (erro) {
      console.error("ERRO AO CONFIRMAR:", erro);
    }
  }

  async function salvarAlterações() {
    try {
      const dados = {
        valor,
        data_vencimento: dataVencimento,
      };

      const resposta = await fetch(`/api/pagamentos/${pagamento.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar alterações");
      }

      const pagamentoAtualizado: Pagamento = {
        ...pagamento,
        valor,
        data_vencimento: dataVencimento,
      };

      atualizarPagamento(pagamentoAtualizado);

      setEditando(false);
    } catch (erro) {
      console.error("ERRO AO SALVAR ALTERAÇÕES:", erro);
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      {" "}
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
        {/* HEADER */}{" "}
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          {" "}
          <div>
            {" "}
            <h2 className="text-xl font-semibold">{pagamento.nome} </h2>
            ```
            <h2>{pagamento.empresa}</h2>
          </div>
          <div className="flex flex-row">
            <button
              onClick={() => setEditando(true)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-green-600"
            >
              <Pen size={20} />
            </button>

            <button
              onClick={fechar}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </header>
        {/* RESUMO */}
        <div className="px-10 py-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Resumo do pagamento</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Confira os dados antes de confirmar o pagamento.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* VALOR */}
            <div className="min-h-40 rounded-2xl border border-green-400/50 bg-green-500/5 p-6 transition-all hover:border-green-400 hover:bg-green-500/10">
              <span className="block text-sm font-medium uppercase tracking-wide text-muted-foreground">
                💰 Valor
              </span>

              <div className="mt-6 text-center text-3xl font-bold">
                {editando ? (
                  <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-3 text-center outline-none"
                  />
                ) : (
                  <div>
                    {pagamento.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* VENCIMENTO */}
            <div
              className={`min-h-40 rounded-2xl border p-6 transition-all ${corStatus}`}
            >
              <span className="block text-sm font-medium uppercase tracking-wide text-muted-foreground">
                📅 Vencimento
              </span>

              <div className="mt-6 text-center text-2xl font-bold">
                {editando ? (
                  <input
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-center outline-none"
                  />
                ) : (
                  <div>{formatarData(pagamento.data_vencimento)}</div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className="min-h-40 rounded-2xl border border-border bg-background/50 p-6 transition-all hover:border-primary/40">
              <span className="block text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </span>

              <div className="mt-6 flex justify-center">
                <span
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    pagamento.status === "Pago"
                      ? "border-green-500/30 bg-green-500/15 text-green-500"
                      : "border-yellow-500/30 bg-yellow-500/15 text-yellow-500"
                  }`}
                >
                  {pagamento.status === "Pago" ? "🟢 Pago" : "🟡 Pendente"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* CONFIRMAÇÃO */}
        <div className="px-10 pb-6">
          <div className="flex gap-4 rounded-2xl border border-primary/20 bg-primary/10 p-6">
            <CircleCheck />

            <div>
              <h2 className="text-base">Confirmação</h2>

              <h3 className="mt-2 text-sm text-muted-foreground">
                O pagamento será marcado como pago após a confirmação
              </h3>
            </div>
          </div>
        </div>
        {/* BOTÕES */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-5">
          {editando ? (
            <>
              <button
                onClick={() => setEditando(false)}
                className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Cancelar
              </button>

              <button
                onClick={salvarAlterações}
                className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-colors hover:bg-green-400"
              >
                Salvar alterações
              </button>
            </>
          ) : (
            <>
              <button
                onClick={fechar}
                className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarPagamento}
                className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-colors hover:bg-green-400"
              >
                Confirmar pagamento
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
