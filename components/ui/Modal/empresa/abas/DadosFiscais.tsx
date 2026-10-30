"use client";

import type { ElementType } from "react";
import type { EmpresaFormData } from "@/types/Empresa";
import { Calculator, Scale, ShieldCheck } from "lucide-react";

type DadosFiscaisProps = {
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

export default function DadosFiscais({
  dados,
  atualizarCampo,
}: DadosFiscaisProps) {
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  return (
    <div className="flex flex-col gap-5">
      {/* REGIME TRIBUTÁRIO */}
      <section className={classeCard}>
        <Cabecalho
          icon={Scale}
          titulo="Regime tributário"
          descricao="Configure o enquadramento fiscal e tributário da empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Regime tributário</label>

            <select
              value={dados.regimeTributario}
              onChange={(e) =>
                atualizarCampo("regimeTributario", e.target.value)
              }
              className={classeInput}
            >
              <option value="">Selecione o regime</option>
              <option value="simplesNacional">Simples Nacional</option>
              <option value="lucroPresumido">Lucro Presumido</option>
              <option value="lucroReal">Lucro Real</option>
              <option value="mei">MEI</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>Regime de apuração</label>

            <select
              value={dados.regimeApuracao}
              onChange={(e) => atualizarCampo("regimeApuracao", e.target.value)}
              className={classeInput}
            >
              <option value="">Selecione o regime</option>
              <option value="competencia">Competência</option>
              <option value="caixa">Caixa</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>
              Código de regime tributário (CRT)
            </label>

            <select
              value={dados.crt}
              onChange={(e) => atualizarCampo("crt", e.target.value)}
              className={classeInput}
            >
              <option value="">Selecione o código</option>
              <option value="1">1 - Simples Nacional</option>
              <option value="2">
                2 - Simples Nacional - Excesso de sublimite
              </option>
              <option value="3">3 - Regime Normal</option>
              <option value="4">4 - MEI</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>
              Indicador de contribuinte ICMS
            </label>

            <select
              value={dados.indicadorICMS}
              onChange={(e) => atualizarCampo("indicadorICMS", e.target.value)}
              className={classeInput}
            >
              <option value="">Selecione a situação</option>
              <option value="1">1 - Contribuinte ICMS</option>
              <option value="2">2 - Contribuinte isento</option>
              <option value="9">9 - Não contribuinte</option>
            </select>
          </div>
        </div>
      </section>

      {/* CONTABILIDADE */}
      <section className={classeCard}>
        <Cabecalho
          icon={Calculator}
          titulo="Contabilidade"
          descricao="Informações do profissional responsável pela contabilidade."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Responsável contábil</label>

            <input
              type="text"
              value={dados.responsavelContabil}
              onChange={(e) =>
                atualizarCampo("responsavelContabil", e.target.value)
              }
              placeholder="Nome do contador ou escritório"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>CRC do contador</label>

            <input
              type="text"
              value={dados.crcContador}
              onChange={(e) => atualizarCampo("crcContador", e.target.value)}
              placeholder="Registro profissional"
              className={classeInput}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={classeLabel}>E-mail da contabilidade</label>

            <input
              type="email"
              value={dados.emailContabilidade}
              onChange={(e) =>
                atualizarCampo("emailContabilidade", e.target.value)
              }
              placeholder="contabilidade@empresa.com.br"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* CERTIFICADO DIGITAL */}
      <section className={classeCard}>
        <Cabecalho
          icon={ShieldCheck}
          titulo="Certificado digital"
          descricao="Controle o certificado digital utilizado pela empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Tipo de certificado</label>

            <select
              value={dados.tipoCertificado}
              onChange={(e) =>
                atualizarCampo("tipoCertificado", e.target.value)
              }
              className={classeInput}
            >
              <option value="">Selecione o tipo</option>
              <option value="a1">A1</option>
              <option value="a3">A3</option>
              <option value="naoPossui">Não possui</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>
              Data de validade do certificado
            </label>

            <input
              type="date"
              value={dados.validadeCertificado}
              onChange={(e) =>
                atualizarCampo("validadeCertificado", e.target.value)
              }
              className={classeInput}
              disabled={dados.tipoCertificado === "naoPossui"}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
