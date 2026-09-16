"use client";

import { useEffect, useState } from "react";

type ClientePagamento = {
  valorMensalidade: number;
  valorProduto: number;
};

export default function ReceitaMensal() {
  const [receita, setReceita] = useState<number>(0);

  useEffect(() => {
    async function buscarReceita() {
      try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar clientes");
        }

        const dados: ClientePagamento[] = await resposta.json();

        const total = dados.reduce((total, cliente) => {
          return (
            total +
            Number(cliente.valorProduto) +
            Number(cliente.valorMensalidade)
          );
        }, 0);

        setReceita(total);
      } catch (erro) {
        console.error("Erro ao buscar receita:", erro);
      }
    }

    buscarReceita();
  }, []);

  return (
    <div className="p-5">
      <p className="text-3xl font-bold text-foreground">
        R$ {receita.toFixed(2).replace(".", ",")}
      </p>
    </div>
  );
}
