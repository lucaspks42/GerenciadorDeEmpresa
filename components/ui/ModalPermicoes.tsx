import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./Input";

type ModalPermissaoProps = {
  onClose: () => void;
};

type Solicitacao = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

export default function ModalPermissao({ onClose }: ModalPermissaoProps) {
  const [pesquisa, setPesquisa] = useState("");

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  useEffect(() => {
    async function buscarSolicitacoes() {
      try {
        const resposta = await fetch("/api/admin/solicitacoes");

        if (!resposta.ok) {
          const erro = await resposta.json();

          console.error("Erro retornado pela API:", erro);

          throw new Error(erro.erro || "Erro ao buscar solicitações");
        }

        const solicitacoesDoBanco: Solicitacao[] = await resposta.json();

        setSolicitacoes(solicitacoesDoBanco);
      } catch (erro) {
        console.error("Erro ao buscar solicitações:", erro);
      }
    }

    buscarSolicitacoes();
  }, []);

  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    const termo = pesquisa.toLowerCase();

    return (
      solicitacao.nome.toLowerCase().includes(termo) ||
      solicitacao.email.toLowerCase().includes(termo)
    );
  });

  const [processando, setProcessando] = useState<number | null>(null);

  async function aprovarSolicitacao(id: number) {
    setProcessando(id);
    try {
      const resposta = await fetch(`/api/admin/solicitacoes/${id}/aprovar`, {
        method: "POST",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        const erro = await resposta.json();

        console.error("Erro retornado pela API:", erro);

        throw new Error(erro.erro || "Erro ao buscar solicitações");
      }

      setSolicitacoes((anterior) =>
        anterior.filter((solicitacao) => solicitacao.id !== id),
      );

      alert(dados.mensagem);
    } catch (erro) {
      console.error("Erro ao aprovar solicitação:", erro);

      alert(
        erro instanceof Error
          ? erro.message
          : "Erro inesperado ao aprovar solicitação",
      );
    }
  }

  async function recusarSolicitacao(id: number) {
    setProcessando(id);

    try {
      const resposta = await fetch(`/api/admin/solicitacoes/${id}/recusar`, {
        method: "POST",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        const erro = await resposta.json();

        console.error("Erro retornado pela API:", erro);

        throw new Error(erro.erro || "Erro ao buscar solicitações");
      }

      setSolicitacoes((anterior) =>
        anterior.filter((solicitacao) => solicitacao.id !== id),
      );

      alert(dados.mensagem);
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);

      alert(
        erro instanceof Error
          ? erro.message
          : "Erro inesperado ao recusar solicitação",
      );
    } finally {
      setProcessando(null);
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
        <header className="flex justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Solicitações de acesso</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Verifique e gerencie as solicitações de acesso à empresa.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-red-600"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex items-center px-10 py-7">
          <div className="w-full">
            <Input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Pesquisar solicitação..."
            />
          </div>
        </div>

        <div className="mx-10 mb-7 overflow-hidden rounded-2xl border border-border bg-card">
          <div
            className="
              grid
              grid-cols-3
              px-6
              py-4
              border-b
              border-border
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-muted-foreground
            "
          >
            <div>Solicitante</div>

            <div className="text-center">Email</div>

            <div className="text-center">Data</div>
          </div>

          {solicitacoesFiltradas.map((solicitacao) => (
            <div
              key={solicitacao.id}
              className="
                grid
                grid-cols-3
                items-center
                px-6
                py-5
                border-b
                border-border
                last:border-b-0
                hover:bg-accent
                transition-colors
                gap-2
              "
            >
              <div className="text-sm font-semibold text-foreground">
                {solicitacao.nome}
              </div>

              <div className="text-center text-sm text-foreground">
                {solicitacao.email}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {new Date(solicitacao.criadoEm).toLocaleDateString("pt-BR")}
              </div>

              <div className="col-span-3 flex w-full gap-2 border-t border-border pt-4 ">
                <button
                  onClick={() => aprovarSolicitacao(solicitacao.id)}
                  disabled={processando === solicitacao.id}
                  className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processando === solicitacao.id ? "Aprovando..." : "Aprovar"}
                </button>

                <button
                  onClick={() => recusarSolicitacao(solicitacao.id)}
                  disabled={processando === solicitacao.id}
                  className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 "
                >
                  {processando === solicitacao.id
                    ? "Processando..."
                    : "Recusar"}
                </button>
              </div>
            </div>
          ))}

          {solicitacoesFiltradas.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Nenhuma solicitação encontrada.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
