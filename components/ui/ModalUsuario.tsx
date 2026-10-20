"use client";

import { Usuario } from "@/types/Usuario";
import {
  X,
  Users,
  UserRound,
  Mail,
  ShieldCheck,
  LoaderCircle,
  Inbox,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import Toast from "./Toast";
import InfoUsuario from "./InfoUsuario";

type ModalUsuariosProps = {
  onClose: () => void;
};

type ToastData = {
  titulo: string;
  mensagem: string;
  tipo: "sucesso" | "erro" | "aviso";
};

export default function ModalUsuario({ onClose }: ModalUsuariosProps) {
  const [funcionarios, setFuncionarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null,
  );

  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  const { buscar } = useSearch();

  const fecharToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    async function buscarFuncionarios() {
      try {
        const resposta = await fetch("/api/admin/usuarios");

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
              `Erro HTTP ${resposta.status} ao buscar funcionários.`,
          );
        }

        setFuncionarios(dados);
      } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);

        setToast({
          titulo: "Erro ao carregar",
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar os funcionários.",
          tipo: "erro",
        });
      } finally {
        setCarregando(false);
      }
    }

    buscarFuncionarios();
  }, []);

  const itemsFiltrados = funcionarios.filter((funcionario) => {
    const pesquisa = buscar.toLowerCase().trim();

    return (
      funcionario.nome.toLowerCase().includes(pesquisa) ||
      funcionario.email.toLowerCase().includes(pesquisa)
    );
  });

  function atualizarUsuario(usuarioAtualizado: Usuario) {
    setFuncionarios((usuariosAtuais) =>
      usuariosAtuais.map((usuario) =>
        usuario.id === usuarioAtualizado.id ? usuarioAtualizado : usuario,
      ),
    );

    setUsuarioSelecionado(usuarioAtualizado);
  }

  if (usuarioSelecionado) {
    return (
      <>
        <InfoUsuario
          fecharModal={() => setUsuarioSelecionado(null)}
          usuario={usuarioSelecionado}
          atualizarUsuario={atualizarUsuario}
        />

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

  return (
    <>
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6">
        <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-[0_25px_100px_rgba(0,0,0,0.55)]">
          {/* Cabeçalho */}
          <header className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-white/[0.07] px-6 py-5 sm:px-8">
            <div className="pointer-events-none absolute -right-12 -top-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-300">
                <Users size={22} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Painel de Funcionários
                  </h2>

                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                    {funcionarios.length} usuários
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Verifique e gerencie os funcionários da empresa.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={18} />
            </button>
          </header>

          {/* Conteúdo */}
          <div className="overflow-y-auto px-6 py-8 sm:px-8">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d19]/60">
              {/* Cabeçalho da tabela */}
              <div className="hidden grid-cols-[1.5fr_1.5fr_0.8fr] items-center gap-4 border-b border-white/[0.07] bg-white/[0.02] px-6 py-4 md:grid">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Funcionário
                </span>

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  E-mail
                </span>

                <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Cargo
                </span>
              </div>

              {carregando ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                  <LoaderCircle
                    size={28}
                    className="animate-spin text-blue-400"
                  />

                  <p className="text-sm text-slate-400">
                    Carregando funcionários...
                  </p>
                </div>
              ) : itemsFiltrados.length > 0 ? (
                itemsFiltrados.map((usuario) => (
                  <button
                    type="button"
                    key={usuario.id}
                    onClick={() => setUsuarioSelecionado(usuario)}
                    className="grid w-full grid-cols-1 gap-5 border-b border-white/[0.06] px-5 py-5 text-left transition-colors last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[1.5fr_1.5fr_0.8fr] md:items-center md:gap-4 md:px-6"
                  >
                    {/* Funcionário */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                        <UserRound size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {usuario.nome}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          Funcionário cadastrado
                        </p>
                      </div>
                    </div>

                    {/* E-mail */}
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                      <Mail size={15} className="shrink-0 text-slate-500" />

                      <span className="truncate">{usuario.email}</span>
                    </div>

                    {/* Cargo */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 md:justify-center">
                      <ShieldCheck
                        size={15}
                        className="shrink-0 text-blue-400"
                      />

                      <span>{usuario.perfil}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                    <Inbox size={25} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-300">
                    {buscar.trim()
                      ? "Nenhum funcionário encontrado"
                      : "Nenhum usuário cadastrado"}
                  </h3>

                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                    {buscar.trim()
                      ? "Tente pesquisar utilizando outro nome ou endereço de e-mail."
                      : "Os usuários cadastrados no sistema aparecerão aqui."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rodapé */}
          <footer className="flex items-center justify-between border-t border-white/[0.07] bg-[#0d0d19]/70 px-6 py-4 sm:px-8">
            <p className="hidden text-xs text-slate-500 sm:block">
              Gerencie os funcionários e suas permissões de acesso.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="ml-auto h-10 rounded-xl border border-white/[0.09] px-5 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white"
            >
              Fechar
            </button>
          </footer>
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
