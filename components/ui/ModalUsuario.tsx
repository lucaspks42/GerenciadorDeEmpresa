"use client";

import { Usuario } from "@/types/Usuario";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
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

  const [toast, setToast] = useState<ToastData | null>(null);

  const { buscar } = useSearch();

  useEffect(() => {
    async function buscarFuncionarios() {
      try {
        const resposta = await fetch("/api/admin/usuarios");

        if (!resposta.ok) {
          const erro = await resposta.json();

          console.error("STATUS HTTP:", resposta.status);
          console.error("ERRO DA API:", erro);

          setToast({
            titulo: "Erro",
            mensagem: "Não foi possível carregar os funcionários.",
            tipo: "erro",
          });

          return;
        }

        const funcionariosDoBanco: Usuario[] = await resposta.json();

        setFuncionarios(funcionariosDoBanco);
      } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);

        setToast({
          titulo: "Erro",
          mensagem: "Não foi possível carregar os funcionários.",
          tipo: "erro",
        });
      }
    }

    buscarFuncionarios();
  }, []);

  const itemsFiltrados = funcionarios.filter((funcionario) => {
    const pesquisa = buscar.toLowerCase().trim();

    if (!pesquisa) {
      return true;
    }

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

  // Se um funcionário estiver selecionado,
  // mostra somente o componente de informações.
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
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
        <div className="flex max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
          <header className="flex justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">Painel de Funcionários</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Verifique e gerencie os funcionários
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-red-600"
            >
              <X size={20} />
            </button>
          </header>

          <div className="overflow-y-auto px-10 py-8">
            {funcionarios.length === 0 ? (
              <div className="flex h-100 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50">
                <div className="text-lg font-semibold">
                  Nenhum usuário cadastrado
                </div>

                <div className="mt-2 text-center text-sm text-muted-foreground">
                  Os usuários cadastrados no sistema aparecerão aqui.
                </div>
              </div>
            ) : itemsFiltrados.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50">
                <div className="text-lg font-semibold">
                  Nenhum funcionário encontrado
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Nenhum resultado para {buscar}.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="max-h-[400px] overflow-y-auto">
                  <div
                    className="
                      sticky top-0 z-10
                      grid grid-cols-[2fr_2fr_1fr]
                      items-center border-b border-border
                      bg-card px-6 py-4
                      text-xs font-semibold uppercase
                      tracking-wide text-muted-foreground
                    "
                  >
                    <div>Funcionário</div>
                    <div>Email</div>
                    <div>Cargo</div>
                  </div>

                  {itemsFiltrados.map((usuario) => (
                    <button
                      type="button"
                      key={usuario.id}
                      onClick={() => setUsuarioSelecionado(usuario)}
                      className="
                        w-full grid grid-cols-[2fr_2fr_1fr]
                        items-center border-b border-border
                        px-6 py-5 text-left
                        last:border-b-0
                        transition-colors hover:bg-accent
                      "
                    >
                      <div className="truncate text-sm font-semibold text-foreground">
                        {usuario.nome}
                      </div>

                      <div className="truncate text-sm text-foreground">
                        {usuario.email}
                      </div>

                      <div className="text-sm text-foreground">
                        {usuario.perfil}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
