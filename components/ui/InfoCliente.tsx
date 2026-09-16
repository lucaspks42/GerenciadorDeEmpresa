"use client";

import { X, Pen } from "lucide-react";

import type { Cliente } from "@/types/Cliente";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

type InfoClienteProps = {
  fecharModal: () => void;
  cliente: Cliente;
  atualizarCliente: (cliente: Cliente) => void;
};

type Pagamento = {
  id: number;
  valor: number;
  dia_vencimento: number;
  data_vencimento: string;
  status: string;
};

export default function InfoCliente({
  fecharModal,
  cliente,
  atualizarCliente,
}: InfoClienteProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  useEffect(() => {
    async function buscarPagamentos() {
      try {
        const resposta = await fetch(`/api/clientes/${cliente.id}/pagamentos`);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar pagamentos");
        }

        const pagamentosDoBanco: Pagamento[] = await resposta.json();

        setPagamentos(pagamentosDoBanco);
      } catch (erro) {
        console.error(erro);
      }
    }

    buscarPagamentos();
  }, [cliente.id]);

  async function salvarAlterações() {
    const dados = {
      nome,
      empresa,
      telefone,
      email,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    };

    try {
      const resposta = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar alterações");
      }

      const clienteAtualizado: Cliente = {
        ...cliente,
        nome,
        empresa,
        telefone,
        email,
        valorProduto,
        valorMensalidade,
        diaVencimento,
      };

      atualizarCliente(clienteAtualizado);

      setEditando(false);

      const respostaPagamentos = await fetch(
        `/api/clientes/${cliente.id}/pagamentos`,
      );

      if (respostaPagamentos.ok) {
        const pagamentosAtualizados: Pagamento[] =
          await respostaPagamentos.json();

        setPagamentos(pagamentosAtualizados);
      }

      console.log("Alterações salvas:", clienteAtualizado);
    } catch (erro) {
      console.error(erro);
    }
  }

  const fecharAlteracao = () => {
    setEditando(false);
  };

  const [nome, setNome] = useState(cliente.nome);
  const [empresa, setEmpresa] = useState(cliente.empresa);
  const [telefone, setTelefone] = useState(cliente.telefone);
  const [email, setEmail] = useState(cliente.email);

  const [valorProduto, setValorProduto] = useState(cliente.valorProduto);

  const [valorMensalidade, setValorMensalidade] = useState(
    cliente.valorMensalidade,
  );

  const [diaVencimento, setDiaVencimento] = useState(cliente.diaVencimento);

  const [editando, setEditando] = useState(false);

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-6xl max-h-[90vh] bg-card text-card-foreground border border-border rounded-2xl flex flex-col shadow-2xl">
        <header className="border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{cliente.nome}</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Informações do cliente
            </p>
          </div>

          <div>
            <div className="flex flex-row">
              <button
                onClick={() => setEditando(true)}
                className="
                  p-2
                  rounded-lg
                  text-muted-foreground
                  hover:text-green-600
                  hover:bg-accent
                  transition-colors
                "
              >
                <Pen size={20} />
              </button>

              <button
                onClick={fecharModal}
                className="
                  p-2
                  rounded-lg
                  text-muted-foreground
                  hover:text-red-600
                  hover:bg-accent
                  transition-colors
                "
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 gap-5 grid grid-cols-3 ">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Nome</label>

            <input
              value={nome}
              disabled={!editando}
              onChange={(e) => setNome(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Empresa</label>

            <input
              value={empresa}
              disabled={!editando}
              onChange={(e) => setEmpresa(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Email</label>

            <input
              value={email}
              disabled={!editando}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Telefone</label>

            <div className="flex items-center gap-3">
              <input
                value={telefone}
                disabled={!editando}
                onChange={(e) => setTelefone(e.target.value)}
                className="flex-1 border border-border bg-background text-foreground rounded-xl p-3 outline-none focus:border-green-500 transition-colors"
              />

              <button
                type="button"
                onClick={() => {
                  const numero = telefone.replace(/\D/g, "");

                  if (!numero) return;

                  window.open(`https://wa.me/55${numero}`, "_blank");
                }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border text-white shadow-sm transition-all hover:scale-105 hover:bg-green-600 hover:shadow-md active:scale-95"
                title="Abrir WhatsApp"
              >
                <FaWhatsapp size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Pagamento</label>

            <input
              type="number"
              value={valorProduto}
              disabled={!editando}
              onChange={(e) => setValorProduto(Number(e.target.value))}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Mensalidade</label>

            <input
              type="number"
              value={valorMensalidade}
              disabled={!editando}
              onChange={(e) => setValorMensalidade(Number(e.target.value))}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">
              Dia de vencimento
            </label>

            <input
              type="number"
              value={diaVencimento}
              disabled={!editando}
              onChange={(e) => setDiaVencimento(Number(e.target.value))}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          {editando && (
            <div className="col-start-3 flex justify-end mt-6 gap-2">
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/85 rounded-xl px-5 h-12.5"
                onClick={salvarAlterações}
              >
                Salvar
              </button>

              <button
                className="border border-border rounded-xl px-3 h-12.5"
                onClick={fecharAlteracao}
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="col-span-3 border border-border bg-background/50 rounded-2xl p-6 mt-2">
            {pagamentos.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Esse cliente não possui pagamentos
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5 ">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Próximos pagamentos
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Histórico e próximos vencimentos
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 ">
                  {pagamentos.map((pagamento) => {
                    const [ano, mes, dia] =
                      pagamento.data_vencimento.split("-");

                    return (
                      <div
                        key={pagamento.id}
                        className="
                border
                border-border
                bg-card
                rounded-xl
                p-4
                flex
                items-center
                justify-between
                hover:border-primary/40
                transition-colors
                
              "
                      >
                        <span className="text-sm text-muted-foreground">
                          {dia}/{mes}/{ano}
                        </span>

                        <span className="text-sm font-semibold">
                          {pagamento.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>

                        <span className="text-xs font-medium text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                          {pagamento.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
