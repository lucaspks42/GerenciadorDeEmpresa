"use client";

import type { ElementType } from "react";
import {
  Landmark,
  Star,
  Plus,
  Trash2,
  UserRound,
  QrCode,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { EmpresaFormData } from "@/types/Empresa";

export type ContaBancariaEmpresa = {
  id: number;
  banco: string;
  agencia: string;
  conta: string;
  tipo: string;
  principal: boolean;
};

type DadosFinanceirosProps = {
  dados: EmpresaFormData;
  atualizarCampo: <K extends keyof EmpresaFormData>(
    campo: K,
    valor: EmpresaFormData[K],
  ) => void;
  contasBancarias: ContaBancariaEmpresa[];
  setContasBancarias: React.Dispatch<
    React.SetStateAction<ContaBancariaEmpresa[]>
  >;
};

type CabecalhoProps = {
  icon: ElementType;
  titulo: string;
  descricao: string;
};

function Cabecalho({ icon: Icon, titulo, descricao }: CabecalhoProps) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
        <Icon size={19} className="text-blue-400" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-100">{titulo}</h3>
        <p className="mt-1 text-xs text-slate-500">{descricao}</p>
      </div>
    </div>
  );
}

export default function DadosFinanceiros({
  dados,
  atualizarCampo,
  contasBancarias,
  setContasBancarias,
}: DadosFinanceirosProps) {
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  function adicionarConta() {
    setContasBancarias((anterior) => [
      ...anterior,
      {
        id: Math.max(0, ...anterior.map((conta) => conta.id)) + 1,
        banco: "",
        agencia: "",
        conta: "",
        tipo: "corrente",
        principal: anterior.length === 0,
      },
    ]);
  }

  function atualizarConta(
    id: number,
    campo: keyof ContaBancariaEmpresa,
    valor: string | boolean,
  ) {
    setContasBancarias((anterior) =>
      anterior.map((conta) =>
        conta.id === id ? { ...conta, [campo]: valor } : conta,
      ),
    );
  }

  function definirPrincipal(id: number) {
    setContasBancarias((anterior) =>
      anterior.map((conta) => ({
        ...conta,
        principal: conta.id === id,
      })),
    );
  }

  function removerConta(id: number) {
    setContasBancarias((anterior) => {
      const atualizadas = anterior.filter((conta) => conta.id !== id);

      if (
        atualizadas.length > 0 &&
        !atualizadas.some((conta) => conta.principal)
      ) {
        atualizadas[0] = {
          ...atualizadas[0],
          principal: true,
        };
      }

      return atualizadas;
    });
  }

  const placeholderPix: Record<string, string> = {
    cnpj: "00.000.000/0000-00",
    telefone: "(47) 99999-9999",
    email: "empresa@email.com",
    chaveAleatoria: "Informe sua chave aleatória",
  };

  const tituloPix: Record<string, string> = {
    cnpj: "CNPJ da chave",
    telefone: "Telefone da chave",
    email: "E-mail da chave",
    chaveAleatoria: "Chave aleatória",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* CONTAS BANCÁRIAS */}
      <section className={classeCard}>
        <Cabecalho
          icon={Landmark}
          titulo="Contas bancárias"
          descricao="Gerencie as contas bancárias vinculadas à empresa."
        />

        <div className="flex flex-col gap-3">
          {contasBancarias.map((conta, index) => (
            <div
              key={conta.id}
              className="rounded-xl border border-white/[0.07] bg-[#0b0b17]/70 p-4 transition-colors hover:border-white/[0.12]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
                    <CreditCard size={14} className="text-slate-400" />
                  </div>

                  <span className="text-xs font-medium text-slate-300">
                    Conta bancária {index + 1}
                  </span>

                  {conta.principal && (
                    <span className="rounded-md border border-blue-400/20 bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400">
                      Principal
                    </span>
                  )}
                </div>

                {contasBancarias.length > 1 && (
                  <button
                    type="button"
                    title="Remover conta"
                    onClick={() => removerConta(conta.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr_0.8fr_40px]">
                <div>
                  <label className={classeLabel}>Banco</label>
                  <input
                    type="text"
                    placeholder="Nome do banco"
                    value={conta.banco}
                    onChange={(e) =>
                      atualizarConta(conta.id, "banco", e.target.value)
                    }
                    className={classeInput}
                  />
                </div>

                <div>
                  <label className={classeLabel}>Agência</label>
                  <input
                    type="text"
                    placeholder="0000"
                    value={conta.agencia}
                    onChange={(e) =>
                      atualizarConta(conta.id, "agencia", e.target.value)
                    }
                    className={classeInput}
                  />
                </div>

                <div>
                  <label className={classeLabel}>Conta e dígito</label>
                  <input
                    type="text"
                    placeholder="00000-0"
                    value={conta.conta}
                    onChange={(e) =>
                      atualizarConta(conta.id, "conta", e.target.value)
                    }
                    className={classeInput}
                  />
                </div>

                <div>
                  <label className={classeLabel}>Tipo de conta</label>
                  <select
                    value={conta.tipo}
                    onChange={(e) =>
                      atualizarConta(conta.id, "tipo", e.target.value)
                    }
                    className={classeInput}
                  >
                    <option value="corrente">Corrente</option>
                    <option value="poupanca">Poupança</option>
                    <option value="pagamento">Pagamento</option>
                    <option value="investimento">Investimento</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    title={
                      conta.principal
                        ? "Conta principal"
                        : "Definir como principal"
                    }
                    onClick={() => definirPrincipal(conta.id)}
                    className={`flex h-11 w-10 items-center justify-center rounded-xl border transition-all ${
                      conta.principal
                        ? "border-blue-400/20 bg-blue-500/15 text-blue-400"
                        : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-blue-400/20 hover:text-blue-400"
                    }`}
                  >
                    <Star
                      size={18}
                      fill={conta.principal ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={adicionarConta}
          className="mt-4 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/[0.06] hover:text-blue-300"
        >
          <Plus size={17} />
          Adicionar conta bancária
        </button>

        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-4">
          <Star size={13} className="fill-blue-400 text-blue-400" />
          <span className="text-[11px] text-slate-500">
            Selecione a estrela para definir a conta principal.
          </span>
        </div>
      </section>

      {/* TITULARIDADE */}
      <section className={classeCard}>
        <Cabecalho
          icon={UserRound}
          titulo="Titularidade da conta"
          descricao="Identificação do titular responsável pelas movimentações."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Nome do titular</label>
            <input
              type="text"
              placeholder="Nome completo do titular"
              value={dados.titularConta}
              onChange={(e) => atualizarCampo("titularConta", e.target.value)}
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>CPF ou CNPJ do titular</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={dados.documentoTitular}
              onChange={(e) =>
                atualizarCampo("documentoTitular", e.target.value)
              }
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* PIX */}
      <section className={classeCard}>
        <Cabecalho
          icon={QrCode}
          titulo="Chave Pix"
          descricao="Configure a chave Pix utilizada pela empresa para recebimentos."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Tipo de chave</label>

            <select
              value={dados.tipoPix}
              onChange={(e) => atualizarCampo("tipoPix", e.target.value)}
              className={classeInput}
            >
              <option value="cnpj">CNPJ</option>
              <option value="telefone">Telefone</option>
              <option value="email">E-mail</option>
              <option value="chaveAleatoria">Chave aleatória</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>
              {tituloPix[dados.tipoPix] || "Chave Pix"}
            </label>

            <input
              type={dados.tipoPix === "email" ? "email" : "text"}
              placeholder={
                placeholderPix[dados.tipoPix] || "Informe a chave Pix"
              }
              value={dados.chavePix}
              onChange={(e) => atualizarCampo("chavePix", e.target.value)}
              className={classeInput}
            />
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-400/10 bg-blue-500/[0.05] p-4">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-blue-400" />

          <div>
            <p className="text-xs font-medium text-slate-300">
              Informações de recebimento
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Cadastre a chave Pix utilizada pela empresa para facilitar a
              identificação dos dados de recebimento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
