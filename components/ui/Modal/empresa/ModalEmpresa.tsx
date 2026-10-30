"use client";

import {
  Building2,
  FileText,
  MapPin,
  Palette,
  Phone,
  Wallet,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import IdentificacaoEmpresa from "./abas/IdentificacaoEmpresa";
import EnderecoEmpresa from "./abas/EnderecoEmpresa ";
import ContatoEmpresa from "./abas/ContatoEmpresa";
import DadosFiscais from "./abas/DadosFiscais";
import DadosFinanceiros from "./abas/DadosFinanceiros";
import IdentidadeVisual from "./abas/IdentidadeVisual";

import {
  empresaInicial,
  contaBancariaInicial,
  type EmpresaFormData,
  type ContaBancariaEmpresa,
} from "@/types/Empresa";

type ModalEmpresaProps = {
  onClose: () => void;
};

type AbaEmpresa =
  "empresa" | "endereco" | "contato" | "fiscal" | "financeiro" | "visual";

export default function ModalEmpresa({ onClose }: ModalEmpresaProps) {
  const [abaAtiva, setAbaAtiva] = useState<AbaEmpresa>("empresa");

  const [empresa, setEmpresa] = useState<EmpresaFormData>(empresaInicial);

  const [contasBancarias, setContasBancarias] = useState<
    ContaBancariaEmpresa[]
  >([{ ...contaBancariaInicial }]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const abas = [
    {
      id: "empresa" as const,
      titulo: "Identificação",
      icone: Building2,
    },
    {
      id: "endereco" as const,
      titulo: "Endereço",
      icone: MapPin,
    },
    {
      id: "contato" as const,
      titulo: "Contato",
      icone: Phone,
    },
    {
      id: "fiscal" as const,
      titulo: "Dados fiscais",
      icone: FileText,
    },
    {
      id: "financeiro" as const,
      titulo: "Financeiro",
      icone: Wallet,
    },
    {
      id: "visual" as const,
      titulo: "Identidade visual",
      icone: Palette,
    },
  ];

  // Carrega os dados da empresa
  useEffect(() => {
    async function carregarEmpresa() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch("/api/admin/empresa", {
          method: "GET",
          cache: "no-store",
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.erro || "Não foi possível carregar os dados da empresa.",
          );
        }

        if (resultado.empresa) {
          const dados = { ...empresaInicial };

          for (const campo of Object.keys(dados) as (keyof EmpresaFormData)[]) {
            const valor = resultado.empresa[campo];

            if (valor !== null && valor !== undefined) {
              if (campo === "dataAbertura" || campo === "validadeCertificado") {
                dados[campo] = String(valor).slice(0, 10);
              } else {
                dados[campo] = String(valor);
              }
            }
          }

          setEmpresa(dados);
        }

        if (
          Array.isArray(resultado.contasBancarias) &&
          resultado.contasBancarias.length > 0
        ) {
          setContasBancarias(
            resultado.contasBancarias.map((conta: ContaBancariaEmpresa) => ({
              id: conta.id,
              banco: conta.banco ?? "",
              agencia: conta.agencia ?? "",
              conta: conta.conta ?? "",
              tipo: conta.tipo ?? "corrente",
              principal: Boolean(conta.principal),
            })),
          );
        } else {
          setContasBancarias([{ ...contaBancariaInicial }]);
        }
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Erro inesperado ao carregar os dados.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarEmpresa();
  }, []);

  // Atualiza um campo da empresa
  function atualizarCampo<K extends keyof EmpresaFormData>(
    campo: K,
    valor: EmpresaFormData[K],
  ) {
    setEmpresa((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  // Salva os dados na API
  async function salvarAlteracoes() {
    try {
      setSalvando(true);
      setErro("");
      setSucesso("");

      const contasValidas = contasBancarias.filter(
        (conta) => conta.banco.trim() !== "" || conta.conta.trim() !== "",
      );

      const dados = {
        empresa,
        contasBancarias: contasValidas,
      };
      const resposta = await fetch("/api/admin/empresa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro || "Não foi possível salvar os dados da empresa.",
        );
      }

      setSucesso("Dados da empresa salvos com sucesso!");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao salvar os dados.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm">
      <div className="flex max-h-[95dvh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10101c] shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Building2 size={22} className="text-blue-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Dados da empresa
              </h2>

              <p className="text-sm text-gray-400">
                Gerencie as informações cadastrais da empresa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/[0.08] px-6 py-3">
          {abas.map((aba) => {
            const Icone = aba.icone;
            const ativa = abaAtiva === aba.id;

            return (
              <button
                key={aba.id}
                type="button"
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  ativa
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <Icone size={17} />
                {aba.titulo}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {carregando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <LoaderCircle
                  size={32}
                  className="animate-spin text-blue-400"
                />

                <p className="text-sm text-gray-400">
                  Carregando dados da empresa...
                </p>
              </div>
            </div>
          ) : (
            <>
              {erro && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {sucesso}
                </div>
              )}

              {abaAtiva === "empresa" && (
                <IdentificacaoEmpresa
                  dados={empresa}
                  atualizarCampo={atualizarCampo}
                />
              )}

              {abaAtiva === "endereco" && (
                <EnderecoEmpresa
                  dados={empresa}
                  atualizarCampo={atualizarCampo}
                />
              )}

              {abaAtiva === "contato" && (
                <ContatoEmpresa
                  dados={empresa}
                  atualizarCampo={atualizarCampo}
                />
              )}

              {abaAtiva === "fiscal" && (
                <DadosFiscais dados={empresa} atualizarCampo={atualizarCampo} />
              )}

              {abaAtiva === "financeiro" && (
                <DadosFinanceiros
                  dados={empresa}
                  atualizarCampo={atualizarCampo}
                  contasBancarias={contasBancarias}
                  setContasBancarias={setContasBancarias}
                />
              )}

              {abaAtiva === "visual" && (
                <IdentidadeVisual
                  dados={empresa}
                  atualizarCampo={atualizarCampo}
                />
              )}
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-4">
          <p className="text-xs text-gray-500">
            As informações serão armazenadas no cadastro da empresa.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={salvando}
              className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={salvarAlteracoes}
              disabled={carregando || salvando}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
