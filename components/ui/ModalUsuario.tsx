import { EllipsisVertical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./Input";

type ModalUsuarioProps = {
  onClose: () => void;
};

type Solicitacao = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

export default function ModalUsuario({ onClose }: ModalUsuarioProps) {
  const [pesquisa, setPesquisa] = useState("");

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  useEffect(() => {
    async function buscarSolicitacoes() {
      try {
        const resposta = await fetch("/api/admin/solicitacoes");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar solicitações");
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
              grid-cols-4
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

            <div className="text-right">Ação</div>
          </div>

          {solicitacoesFiltradas.map((solicitacao) => (
            <div
              key={solicitacao.id}
              className="
                grid
                grid-cols-4
                items-center
                px-6
                py-5
                border-b
                border-border
                last:border-b-0
                hover:bg-accent
                transition-colors
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

              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  <EllipsisVertical size={20} />
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
