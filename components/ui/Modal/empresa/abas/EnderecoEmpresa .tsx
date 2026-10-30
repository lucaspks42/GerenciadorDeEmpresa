"use client";

import { useState } from "react";
import type { ElementType } from "react";
import type { EmpresaFormData } from "@/types/Empresa";
import { MapPin, Store, LoaderCircle } from "lucide-react";

type EnderecoEmpresaProps = {
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

// Máscara de CEP: 00000-000
function formatarCEP(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);

  return numeros.replace(/^(\d{5})(\d)/, "$1-$2");
}

export default function EnderecoEmpresa({
  dados,
  atualizarCampo,
}: EnderecoEmpresaProps) {
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [erroCEP, setErroCEP] = useState("");

  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-wait disabled:opacity-60";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  // Consulta o ViaCEP
  async function buscarCEP(cep: string) {
    const numeros = cep.replace(/\D/g, "");

    if (numeros.length !== 8) {
      setErroCEP("");
      return;
    }

    try {
      setBuscandoCEP(true);
      setErroCEP("");

      const resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);

      if (!resposta.ok) {
        throw new Error("Não foi possível consultar o CEP.");
      }

      const resultado = await resposta.json();

      if (resultado.erro) {
        setErroCEP("CEP não encontrado. Confira os números digitados.");
        return;
      }

      atualizarCampo("logradouro", resultado.logradouro || "");
      atualizarCampo("bairro", resultado.bairro || "");
      atualizarCampo("cidade", resultado.localidade || "");
      atualizarCampo("estado", resultado.estado || resultado.uf || "");
      atualizarCampo("pais", "Brasil");
    } catch (error) {
      console.error("Erro ao consultar CEP:", error);
      setErroCEP("Não foi possível consultar o CEP. Tente novamente.");
    } finally {
      setBuscandoCEP(false);
    }
  }

  function alterarCEP(valor: string) {
    const cepFormatado = formatarCEP(valor);

    atualizarCampo("cep", cepFormatado);
    setErroCEP("");

    if (cepFormatado.replace(/\D/g, "").length === 8) {
      buscarCEP(cepFormatado);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* LOCALIZAÇÃO */}
      <section className={classeCard}>
        <Cabecalho
          icon={MapPin}
          titulo="Localização"
          descricao="Endereço completo da sede ou unidade empresarial."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>CEP</label>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={dados.cep}
                onChange={(e) => alterarCEP(e.target.value)}
                placeholder="00000-000"
                className={`${classeInput} ${buscandoCEP ? "pr-11" : ""}`}
              />

              {buscandoCEP && (
                <LoaderCircle
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
                />
              )}
            </div>

            {buscandoCEP && (
              <p className="mt-2 text-xs text-blue-400">Consultando CEP...</p>
            )}

            {erroCEP && <p className="mt-2 text-xs text-red-400">{erroCEP}</p>}
          </div>

          <div>
            <label className={classeLabel}>País</label>
            <input
              type="text"
              value={dados.pais}
              onChange={(e) => atualizarCampo("pais", e.target.value)}
              placeholder="Brasil"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Estado</label>
            <input
              type="text"
              value={dados.estado}
              onChange={(e) => atualizarCampo("estado", e.target.value)}
              placeholder="Ex: Santa Catarina"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Cidade</label>
            <input
              type="text"
              value={dados.cidade}
              onChange={(e) => atualizarCampo("cidade", e.target.value)}
              placeholder="Nome da cidade"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Bairro</label>
            <input
              type="text"
              value={dados.bairro}
              onChange={(e) => atualizarCampo("bairro", e.target.value)}
              placeholder="Nome do bairro"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Número</label>
            <input
              type="text"
              value={dados.numero}
              onChange={(e) => atualizarCampo("numero", e.target.value)}
              placeholder="Número do imóvel"
              className={classeInput}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={classeLabel}>Logradouro</label>
            <input
              type="text"
              value={dados.logradouro}
              onChange={(e) => atualizarCampo("logradouro", e.target.value)}
              placeholder="Rua, avenida, rodovia..."
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Complemento</label>
            <input
              type="text"
              value={dados.complemento}
              onChange={(e) => atualizarCampo("complemento", e.target.value)}
              placeholder="Sala, bloco, conjunto..."
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Ponto de referência</label>
            <input
              type="text"
              value={dados.pontoReferencia}
              onChange={(e) =>
                atualizarCampo("pontoReferencia", e.target.value)
              }
              placeholder="Referência próxima"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* ESTABELECIMENTO */}
      <section className={classeCard}>
        <Cabecalho
          icon={Store}
          titulo="Tipo de estabelecimento"
          descricao="Identifique a categoria desta unidade empresarial."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Tipo de unidade</label>

            <select
              value={dados.tipoEstabelecimento}
              onChange={(e) =>
                atualizarCampo("tipoEstabelecimento", e.target.value)
              }
              className={classeInput}
            >
              <option value="">Selecione o tipo</option>
              <option value="matriz">Matriz</option>
              <option value="filial">Filial</option>
              <option value="administrativa">Unidade administrativa</option>
              <option value="deposito">Depósito</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
