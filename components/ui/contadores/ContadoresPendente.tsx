import { useEffect, useState } from "react";

type SolicitacaoCadastro = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

export default function ContadoresPendente() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCadastro[]>([]);

  useEffect(() => {
    async function buscarSolicitacoes() {
      try {
        const resposta = await fetch("/api/admin/solicitacoes");

        if (!resposta.ok) {
          const erro = await resposta.json();

          console.error("Status:", resposta.status);
          console.error("Resposta da API:", erro);

          return;
        }

        const dados: SolicitacaoCadastro[] = await resposta.json();

        setSolicitacoes(dados);
      } catch (erro) {
        console.error(erro);
      }
    }

    buscarSolicitacoes();
  }, []);

  const pendente = solicitacoes.length;

  return (
    <div>
      <p className="text-2xl font-semibold">{pendente}</p>
    </div>
  );
}
