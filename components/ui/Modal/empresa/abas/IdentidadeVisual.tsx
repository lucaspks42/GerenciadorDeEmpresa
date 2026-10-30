"use client";

import type { ChangeEvent, ElementType } from "react";
import {
  ImagePlus,
  Upload,
  Palette,
  Users,
  AlignLeft,
  X,
  Building2,
} from "lucide-react";

import type { EmpresaFormData } from "@/types/Empresa";

type IdentidadeVisualProps = {
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

export default function IdentidadeVisual({
  dados,
  atualizarCampo,
}: IdentidadeVisualProps) {
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  function selecionarLogo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem válido.");
      evento.target.value = "";
      return;
    }

    if (arquivo.size > 1024 * 1024) {
      alert("A imagem deve ter no máximo 1 MB.");
      evento.target.value = "";
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      if (typeof leitor.result === "string") {
        atualizarCampo("logo", leitor.result);
      }
    };

    leitor.onerror = () => {
      alert("Não foi possível carregar o logotipo.");
    };

    leitor.readAsDataURL(arquivo);

    evento.target.value = "";
  }

  function formatarCPF(valor: string) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }

  function atualizarCor(
    campo: "corPrincipal" | "corSecundaria" | "corApoio",
    valor: string,
  ) {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(valor)) {
      atualizarCampo(campo, valor);
    }
  }

  const cores = [
    {
      campo: "corPrincipal" as const,
      titulo: "Cor principal",
    },
    {
      campo: "corSecundaria" as const,
      titulo: "Cor secundária",
    },
    {
      campo: "corApoio" as const,
      titulo: "Cor de apoio",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* LOGOTIPO */}
      <section className={classeCard}>
        <Cabecalho
          icon={ImagePlus}
          titulo="Logotipo"
          descricao="Imagem que representa visualmente sua empresa."
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/[0.14] bg-[#090914]">
            {dados.logo ? (
              <img
                src={dados.logo}
                alt="Logotipo da empresa"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <Building2 size={30} className="text-slate-600" />
            )}
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-sm font-medium text-slate-200">
              Logotipo da empresa
            </span>

            <span className="text-xs text-slate-500">
              PNG, JPG ou SVG, até 1 MB.
            </span>

            <div className="mt-1 flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-400">
                <Upload size={14} />
                Enviar imagem
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={selecionarLogo}
                  className="hidden"
                />
              </label>

              {dados.logo && (
                <button
                  type="button"
                  onClick={() => atualizarCampo("logo", "")}
                  className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <X size={14} />
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* IDENTIDADE VISUAL */}
      <section className={classeCard}>
        <Cabecalho
          icon={Palette}
          titulo="Identidade visual"
          descricao="Personalize as cores e a comunicação visual da empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          {cores.map((cor) => (
            <div key={cor.campo}>
              <label className={classeLabel}>{cor.titulo}</label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={
                    /^#[0-9A-Fa-f]{6}$/.test(dados[cor.campo])
                      ? dados[cor.campo]
                      : "#000000"
                  }
                  onChange={(e) => atualizarCor(cor.campo, e.target.value)}
                  className="h-11 w-12 cursor-pointer rounded-xl border border-white/[0.08] bg-[#090914] p-1"
                />

                <input
                  type="text"
                  value={dados[cor.campo].toUpperCase()}
                  maxLength={7}
                  onChange={(e) => atualizarCor(cor.campo, e.target.value)}
                  className="max-w-32 rounded-lg border border-white/[0.08] bg-[#090914] px-3 py-2.5 font-mono text-xs text-slate-300 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          ))}

          {/* SLOGAN */}
          <div className="sm:col-span-2">
            <label className={classeLabel}>Slogan empresarial</label>

            <input
              type="text"
              value={dados.slogan}
              onChange={(e) => atualizarCampo("slogan", e.target.value)}
              maxLength={150}
              placeholder="Ex: Tecnologia que move negócios"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* RESPONSÁVEIS */}
      <section className={classeCard}>
        <Cabecalho
          icon={Users}
          titulo="Responsáveis"
          descricao="Identifique os responsáveis pela administração da empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Responsável legal</label>

            <input
              type="text"
              value={dados.responsavelLegal}
              onChange={(e) =>
                atualizarCampo("responsavelLegal", e.target.value)
              }
              placeholder="Nome completo"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>CPF do responsável legal</label>

            <input
              type="text"
              inputMode="numeric"
              value={dados.cpfResponsavel}
              onChange={(e) =>
                atualizarCampo("cpfResponsavel", formatarCPF(e.target.value))
              }
              placeholder="000.000.000-00"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Responsável financeiro</label>

            <input
              type="text"
              value={dados.responsavelFinanceiro}
              onChange={(e) =>
                atualizarCampo("responsavelFinanceiro", e.target.value)
              }
              placeholder="Nome do responsável financeiro"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* SOBRE A EMPRESA */}
      <section className={classeCard}>
        <Cabecalho
          icon={AlignLeft}
          titulo="Sobre a empresa"
          descricao="Apresente brevemente a história e as atividades da empresa."
        />

        <div>
          <label className={classeLabel}>Descrição da empresa</label>

          <textarea
            value={dados.descricaoEmpresa}
            onChange={(e) => atualizarCampo("descricaoEmpresa", e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Descreva a empresa, seus serviços, sua história e seus diferenciais..."
            className={`${classeInput} min-h-28 resize-y`}
          />

          <div className="mt-2 text-right text-[11px] text-slate-600">
            {dados.descricaoEmpresa.length}/1000 caracteres
          </div>
        </div>
      </section>
    </div>
  );
}
