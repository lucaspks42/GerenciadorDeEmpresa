"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./Input";
import Toast from "./Toast";

type ModalPermissaoProps = {
  onClose: () => void;
};

type Solicitacao = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

type ToastData = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
};

export default function ModalPermissao({ onClose }: ModalPermissaoProps) {
  const [pesquisa, setPesquisa] = useState("");
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [processando, setProcessando] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const fecharToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    async function buscarSolicitacoes() {
      try {
        const resposta = await fetch("/api/admin/solicitacoes");

        const texto = await resposta.text();

        let dados;

        try {
          dados = JSON.parse(texto);
        } catch {
          dados = null;
        }

        if (!resposta.ok) {
          console.error("Status HTTP:", resposta.status);
          console.error("Resposta da API:", texto);

          throw new Error(
            dados?.erro ||
              `Erro HTTP ${resposta.status} ao buscar solicitações.`,
          );
        }

        setSolicitacoes(dados);
      } catch (erro) {
        console.error("Erro ao buscar solicitações:", erro);

        setToast({
          titulo: "Erro ao carregar",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar as solicitações.",
          tipo: "erro",
        });
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

  async function aprovarSolicitacao(id: number) {
    setProcessando(id);

    try {
      const resposta = await fetch(`/api/admin/solicitacoes/${id}/aprovar`, {
        method: "POST",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao aprovar solicitação");
      }

      setSolicitacoes((anterior) =>
        anterior.filter((solicitacao) => solicitacao.id !== id),
      );

      setToast({
        titulo: "Funcionário aprovado!",
        mensagem: dados.mensagem || "O usuário foi aprovado com sucesso.",
        tipo: "sucesso",
      });
    } catch (erro) {
      console.error("Erro ao aprovar solicitação:", erro);

      setToast({
        titulo: "Erro ao aprovar",
        mensagem:
          erro instanceof Error
            ? erro.message
            : "Erro inesperado ao aprovar solicitação.",
        tipo: "erro",
      });
    } finally {
      setProcessando(null);
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
        throw new Error(dados.erro || "Erro ao recusar solicitação");
      }

      setSolicitacoes((anterior) =>
        anterior.filter((solicitacao) => solicitacao.id !== id),
      );

      setToast({
        titulo: "Solicitação recusada",
        mensagem: dados.mensagem || "A solicitação foi recusada.",
        tipo: "sucesso",
      });
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);

      setToast({
        titulo: "Erro ao recusar",
        mensagem:
          erro instanceof Error
            ? erro.message
            : "Erro inesperado ao recusar solicitação.",
        tipo: "erro",
      });
    } finally {
      setProcessando(null);
    }
  }

  return (
    <>
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
            <div className="grid grid-cols-3 border-b border-border px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <div>Solicitante</div>
              <div className="text-center">Email</div>
              <div className="text-center">Data</div>
            </div>

            {solicitacoesFiltradas.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="grid grid-cols-3 items-center gap-2 border-b border-border px-6 py-5 last:border-b-0 transition-colors hover:bg-accent"
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

                <div className="col-span-3 flex w-full gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => aprovarSolicitacao(solicitacao.id)}
                    disabled={processando !== null}
                    className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processando === solicitacao.id
                      ? "Aprovando..."
                      : "Aprovar"}
                  </button>

                  <button
                    onClick={() => recusarSolicitacao(solicitacao.id)}
                    disabled={processando !== null}
                    className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processando === solicitacao.id
                      ? "Recusando..."
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

      {toast && (
        <Toast
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={fecharToast}
        />
      )}
    </>
  );
}
