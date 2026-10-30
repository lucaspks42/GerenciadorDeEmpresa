"use client";

import type { ElementType } from "react";
import type { EmpresaFormData } from "@/types/Empresa";
import { Globe, Mail, Phone } from "lucide-react";

type ContatoEmpresaProps = {
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

// Formata telefone fixo e celular
function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length === 0) return "";

  if (numeros.length <= 2) {
    return `(${numeros}`;
  }

  if (numeros.length <= 6) {
    return numeros.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  if (numeros.length <= 10) {
    return numeros.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  }

  return numeros.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

export default function ContatoEmpresa({
  dados,
  atualizarCampo,
}: ContatoEmpresaProps) {
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  return (
    <div className="flex flex-col gap-5">
      {/* TELEFONES */}
      <section className={classeCard}>
        <Cabecalho
          icon={Phone}
          titulo="Telefones"
          descricao="Canais telefônicos para contato com a empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Telefone principal</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              value={dados.telefonePrincipal}
              onChange={(e) =>
                atualizarCampo(
                  "telefonePrincipal",
                  formatarTelefone(e.target.value),
                )
              }
              placeholder="(47) 99999-9999"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Telefone secundário</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              value={dados.telefoneSecundario}
              onChange={(e) =>
                atualizarCampo(
                  "telefoneSecundario",
                  formatarTelefone(e.target.value),
                )
              }
              placeholder="(47) 3333-3333"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>WhatsApp</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={15}
              value={dados.whatsapp}
              onChange={(e) =>
                atualizarCampo("whatsapp", formatarTelefone(e.target.value))
              }
              placeholder="(47) 99999-9999"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* E-MAILS */}
      <section className={classeCard}>
        <Cabecalho
          icon={Mail}
          titulo="E-mails"
          descricao="Endereços eletrônicos para comunicação empresarial."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>E-mail principal</label>
            <input
              type="email"
              value={dados.emailPrincipal}
              onChange={(e) => atualizarCampo("emailPrincipal", e.target.value)}
              placeholder="contato@empresa.com.br"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>E-mail financeiro</label>
            <input
              type="email"
              value={dados.emailFinanceiro}
              onChange={(e) =>
                atualizarCampo("emailFinanceiro", e.target.value)
              }
              placeholder="financeiro@empresa.com.br"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>E-mail comercial</label>
            <input
              type="email"
              value={dados.emailComercial}
              onChange={(e) => atualizarCampo("emailComercial", e.target.value)}
              placeholder="comercial@empresa.com.br"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* PRESENÇA ONLINE */}
      <section className={classeCard}>
        <Cabecalho
          icon={Globe}
          titulo="Presença online"
          descricao="Sites e redes sociais oficiais da empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Site institucional</label>
            <input
              type="url"
              value={dados.site}
              onChange={(e) => atualizarCampo("site", e.target.value)}
              placeholder="https://www.empresa.com.br"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Instagram</label>
            <input
              type="url"
              value={dados.instagram}
              onChange={(e) => atualizarCampo("instagram", e.target.value)}
              placeholder="https://instagram.com/empresa"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Facebook</label>
            <input
              type="url"
              value={dados.facebook}
              onChange={(e) => atualizarCampo("facebook", e.target.value)}
              placeholder="https://facebook.com/empresa"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>LinkedIn</label>
            <input
              type="url"
              value={dados.linkedin}
              onChange={(e) => atualizarCampo("linkedin", e.target.value)}
              placeholder="https://linkedin.com/company/empresa"
              className={classeInput}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
