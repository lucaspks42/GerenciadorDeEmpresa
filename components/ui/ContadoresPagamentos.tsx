"use client";

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

export default function ContadoresPagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  const hoje = new Date();

  const limite = new Date(hoje);

  limite.setDate(hoje.getDate() + 7);

  const pagamentosProximos = pagamentos.filter((pagamentos) => {
    const dataPagamento = new Date(pagamentos.data_vencimento + "T00:00:00");

    return dataPagamento >= hoje && dataPagamento <= limite;
  });

  useEffect(() => {
    async function buscarPagamentos() {
      try {
        const resposta = await fetch("/api/pagamentos");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const dados = await resposta.json();

        setPagamentos(dados);
      } catch (erro) {
        console.error("Erro ao buscar pagamentos:", erro);
      }
    }

    buscarPagamentos();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-5">
      <p className="text-3xl font-bold text-foreground">
        {pagamentosProximos.length}
      </p>
    </div>
  );
}
