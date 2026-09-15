import { useState } from "react";
import type { Cliente } from "@/types/Cliente";

type ModalClienteProps = {
  fecharModal: () => void;
  adicionarCliente: (cliente: Cliente) => void;
};

export default function ModalCliente({
  fecharModal,
  adicionarCliente,
}: ModalClienteProps) {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [checkbox, setCheckBox] = useState(false);
  const [valorProduto, setValorProduto] = useState("");
  const [valorMensalidade, setValorMensalidade] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");

  const salvarCliente = async () => {
    const cliente = {
      nome,
      empresa,
      telefone,
      email,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    };

    const resposta = await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });

    if (resposta.ok) {
      const dados = await resposta.json();

      adicionarCliente(dados);
      fecharModal();
    }
  };

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return `(${numeros}`;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  const classeInput = `
    border
    border-white/30
    bg-background
    text-foreground
    placeholder:text-muted-foreground
    rounded-xl
    p-3
    outline-none
    transition-all
    focus:border-primary
    focus:ring-2
    focus:ring-primary/20
  `;

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-6">
      <div className="w-full max-w-2xl max-h-[90vh] bg-card text-card-foreground border border-white/30 rounded-2xl flex flex-col shadow-2xl">
        <header className="border-b border-white/30 px-6 py-5">
          <h2 className="text-xl font-semibold">Novo Cliente</h2>

          <p className="text-sm text-muted-foreground mt-1">
            Cadastre as informações do cliente.
          </p>
        </header>

        <div className="py-6 px-6 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm">Nome do cliente</label>

              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João da Silva"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Empresa</label>

              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Empresa Exemplo"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Telefone</label>

              <input
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="algumacoisa@gmail.com"
                className={classeInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Valor cobrado</label>

              <input
                value={valorProduto}
                type="number"
                placeholder="100,00"
                onChange={(e) => setValorProduto(e.target.value)}
                className={classeInput}
              />
            </div>

            <label
              className="
                flex
                items-center
                gap-3
                border
                border-white/30
                rounded-xl
                p-4
                cursor-pointer
                hover:bg-accent
                transition-colors
              "
            >
              <input
                checked={checkbox}
                onChange={(e) => setCheckBox(e.target.checked)}
                type="checkbox"
                className="accent-primary"
              />

              <div>
                <div className="text-sm font-medium">Manutenção mensal</div>

                <div className="text-xs text-muted-foreground">
                  Ative para configurar uma mensalidade.
                </div>
              </div>
            </label>

            {checkbox && (
              <div className="border border-white/30 bg-primary/5 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Valor da mensalidade</label>

                  <input
                    value={valorMensalidade}
                    onChange={(e) => setValorMensalidade(e.target.value)}
                    type="number"
                    className={classeInput}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Dia de vencimento</label>

                  <input
                    value={diaVencimento}
                    type="number"
                    onChange={(e) => setDiaVencimento(e.target.value)}
                    min={1}
                    max={31}
                    placeholder="10"
                    className={classeInput}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end py-5 px-6 border-t border-white/30">
          <button
            onClick={fecharModal}
            className="
              border
              border-white/30
              bg-background
              hover:bg-accent
              text-muted-foreground
              hover:text-foreground
              transition-colors
              rounded-xl
              px-5
              py-2.5
              text-sm
            "
          >
            Cancelar
          </button>

          <button
            onClick={salvarCliente}
            className="
              bg-primary
              hover:bg-primary/85
              text-primary-foreground
              transition-colors
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-semibold
              shadow-lg
              shadow-primary/10
            "
          >
            Salvar cliente
          </button>
        </div>
      </div>
    </main>
  );
}
