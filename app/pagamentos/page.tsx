"use client";

import { InputGroupDemo } from "@/components/ui/InputGroupDemo";
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
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    async function buscarPagamentos() {
      const resposta = await fetch("/api/pagamentos");
      const dados = await resposta.json();

      setPagamentos(dados);
    }

    buscarPagamentos();
  }, []);

  const itensFiltrados = pagamentos.filter((pagamento) => {
    const pesquisa = buscar.toLowerCase();

    return (
      pagamento.nome.toLowerCase().includes(pesquisa) ||
      pagamento.empresa.toLowerCase().includes(pesquisa) ||
      pagamento.status.toLowerCase().includes(pesquisa)
    );
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-border h-16 px-10 flex items-center">
        <h1 className="text-lg font-semibold">Lista de Pagamentos</h1>
      </header>

      <div className="px-10 py-8">
        <div className="mb-5">
          <InputGroupDemo
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>

        <div className="w-full border border-border rounded-lg overflow-hidden">
          {itensFiltrados.map((pagamento) => {
            const data = new Date(pagamento.data_vencimento + "T00:00:00");

            const dataFormatada = data.toLocaleDateString("pt-BR");

            return (
              <div
                key={pagamento.id}
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
                "
              >
                <div>
                  <p className="font-medium">{pagamento.nome}</p>

                  <p className="text-sm text-muted-foreground">
                    {pagamento.empresa}
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    R$ {pagamento.valor.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                <div>
                  <p className="text-sm">Vencimento: {dataFormatada}</p>
                </div>

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
    </main>
  );
}
