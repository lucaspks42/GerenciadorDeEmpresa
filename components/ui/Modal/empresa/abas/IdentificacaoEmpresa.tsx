"use client";

import type { ElementType } from "react";
import type { EmpresaFormData } from "@/types/Empresa";
import { BadgeCheck, Layers } from "lucide-react";

type IdentificacaoEmpresaProps = {
  dados: EmpresaFormData;
  atualizarCampo: <K extends keyof EmpresaFormData>(
    campo: K,
    valor: EmpresaFormData[K],
  ) => void;
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

export default function IdentificacaoEmpresa({
  dados,
  atualizarCampo,
}: IdentificacaoEmpresaProps) {
  function formatarCNPJ(valor: string) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function formatarCNAE(valor: string) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 7)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{2})(\d)/, "$1.$2-$3")
      .replace(/(\d{2}-\d)(\d)/, "$1/$2");
  }
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  return (
    <div className="flex flex-col gap-5">
      <section className={classeCard}>
        <Cabecalho
          icon={BadgeCheck}
          titulo="Identificação empresarial"
          descricao="Informações básicas e dados de registro da empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Razão social</label>
            <input
              type="text"
              value={dados.razaoSocial}
              onChange={(e) => atualizarCampo("razaoSocial", e.target.value)}
              placeholder="Ex: Empresa LTDA"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Nome fantasia</label>
            <input
              type="text"
              value={dados.nomeFantasia}
              onChange={(e) => atualizarCampo("nomeFantasia", e.target.value)}
              placeholder="Nome comercial"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>CNPJ</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={18}
              value={dados.cnpj}
              onChange={(e) =>
                atualizarCampo("cnpj", formatarCNPJ(e.target.value))
              }
              placeholder="00.000.000/0000-00"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Data de abertura</label>
            <input
              type="date"
              value={dados.dataAbertura}
              onChange={(e) => atualizarCampo("dataAbertura", e.target.value)}
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Inscrição estadual</label>
            <input
              type="text"
              value={dados.inscricaoEstadual}
              onChange={(e) =>
                atualizarCampo("inscricaoEstadual", e.target.value)
              }
              placeholder="Número da inscrição estadual"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Inscrição municipal</label>
            <input
              type="text"
              value={dados.inscricaoMunicipal}
              onChange={(e) =>
                atualizarCampo("inscricaoMunicipal", e.target.value)
              }
              placeholder="Número da inscrição municipal"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      <section className={classeCard}>
        <Cabecalho
          icon={Layers}
          titulo="Classificação empresarial"
          descricao="Defina o enquadramento e a situação cadastral."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Natureza jurídica</label>
            <select
              value={dados.naturezaJuridica}
              onChange={(e) =>
                atualizarCampo("naturezaJuridica", e.target.value)
              }
              className={classeInput}
            >
              <option value="">Selecione a natureza jurídica</option>
              <option value="LTDA">Sociedade Limitada (LTDA)</option>
              <option value="EMPRESARIO_INDIVIDUAL">
                Empresário Individual
              </option>
              <option value="SLU">Sociedade Limitada Unipessoal (SLU)</option>
              <option value="MEI">MEI</option>
              <option value="SA">Sociedade Anônima (S.A.)</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>Porte empresarial</label>
            <select
              value={dados.porteEmpresarial}
              onChange={(e) =>
                atualizarCampo("porteEmpresarial", e.target.value)
              }
              className={classeInput}
            >
              <option value="">Selecione o porte</option>
              <option value="ME">Microempresa</option>
              <option value="EPP">Empresa de Pequeno Porte</option>
              <option value="MEDIO">Médio Porte</option>
              <option value="GRANDE">Grande Porte</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>Situação cadastral</label>
            <select
              value={dados.situacaoCadastral}
              onChange={(e) =>
                atualizarCampo("situacaoCadastral", e.target.value)
              }
              className={classeInput}
            >
              <option value="">Selecione a situação</option>
              <option value="ATIVA">Ativa</option>
              <option value="INATIVA">Inativa</option>
              <option value="SUSPENSA">Suspensa</option>
              <option value="BAIXADA">Baixada</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>CNAE principal</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={dados.cnaePrincipal}
              onChange={(e) =>
                atualizarCampo("cnaePrincipal", formatarCNAE(e.target.value))
              }
              placeholder="00.00-0/00"
              className={classeInput}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
