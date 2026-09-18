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

  function formatarData(data: string) {
    const [ano, mes, dia] = data.split("-");
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

      atualizarPagamento({
        ...pagamento,
        valor,
        data_vencimento: dataVencimento,
      });

      setEditando(false);
    } catch (erro) {
      console.error(erro);
    }
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-4xl max-h-[90vh] bg-card text-card-foreground border border-border gap-4 rounded-2xl flex flex-col shadow-2xl">
        <header className="border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{pagamento.nome}</h2>
            <h2>{pagamento.empresa}</h2>
          </div>

          <div className="flex flex-row">
            <button
              onClick={() => setEditando(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-green-600 hover:bg-accent transition-colors"
            >
              <Pen size={20} />
            </button>

            <button
              onClick={fechar}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-accent transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="px-10 py-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Resumo do pagamento</h3>

            <p className="text-sm text-muted-foreground mt-1">
              Confira os dados antes de confirmar o pagamento.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* VALOR */}
            <div className="border border-green-400/50 bg-green-500/5 rounded-2xl p-6 min-h-40 transition-all hover:border-green-400 hover:bg-green-500/10">
              <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wide">
                💰 Valor
              </span>

              <div className="mt-6 text-3xl font-bold text-center">
                {editando ? (
                  <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                    className="w-full border border-border bg-background rounded-xl p-3 text-center outline-none"
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
              className={`border ${corStatus} rounded-2xl p-6 min-h-40 transition-all`}
            >
              <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wide">
                📅 Vencimento
              </span>

              <div className="mt-6 text-2xl font-bold text-center">
                {editando ? (
                  <input
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="w-full border border-border bg-background rounded-xl p-3 text-center outline-none"
                  />
                ) : (
                  <div>{formatarData(pagamento.data_vencimento)}</div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className="border border-border bg-background/50 rounded-2xl p-6 min-h-40 transition-all hover:border-primary/40">
              <span className="block text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </span>

              <div className="mt-6 flex justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    pagamento.status === "Pago"
                      ? "bg-green-500/15 text-green-500 border border-green-500/30"
                      : "bg-yellow-500/15 text-yellow-500 border border-yellow-500/30"
                  }`}
                >
                  {pagamento.status === "Pago" ? "🟢 Pago" : "🟡 Pendente"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 pb-6">
          <div className="border border-primary/20 bg-primary/10 rounded-2xl p-6 flex gap-4">
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
        <div className="flex gap-3 justify-end py-5 px-6 border-t border-border">
          {editando ? (
            <>
              <button
                onClick={() => setEditando(false)}
                className="border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors rounded-xl px-5 py-2.5 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={salvarAlterações}
                className="bg-green-500 hover:bg-green-400 text-primary-foreground transition-colors rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg shadow-primary/10"
              >
                Salvar alterações
              </button>
            </>
          ) : (
            <>
              <button
                onClick={fechar}
                className="border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors rounded-xl px-5 py-2.5 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarPagamento}
                className="bg-green-500 hover:bg-green-400 text-primary-foreground transition-colors rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg shadow-primary/10"
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
