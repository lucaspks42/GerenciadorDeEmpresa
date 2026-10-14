import { Usuario } from "@/types/Usuario";
import { Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";

type ModalUsuariosProps = {
  onClose: () => void;
};

export default function ModalUsuario({ onClose }: ModalUsuariosProps) {
  const [funcionarios, setFuncionario] = useState<Usuario[]>([]);

  const { buscar } = useSearch();

  useEffect(() => {
    async function buscarFuncionarios() {
      try {
        const resposta = await fetch("/api/admin/usuarios");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar funcionarios");
        }

        const funcionariosDoBanco: Usuario[] = await resposta.json();

        setFuncionario(funcionariosDoBanco);
      } catch (erro) {
        console.error("Erro ao buscar funcionario:", erro);
      }
    }

    buscarFuncionarios();
  }, []);

  const itemsFiltrados = funcionarios.filter((funcionario) => {
    const pesquisa = buscar.toLowerCase().trim();

    if (!pesquisa) {
      return true;
    }

    return funcionario.nome.toLowerCase().includes(pesquisa);
  });

  return (
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
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-red-600"
          >
            <X size={20} />
          </button>
        </header>

        <div className="px-10 py-8">
          {funcionarios.length === 0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                h-100
                border
                border-dashed
                border-border
                rounded-2xl
                bg-card/50
              "
            >
              <div className="text-lg font-semibold">
                Nenhum usuário cadastrado
              </div>

              <div className="text-sm text-center mt-2 text-muted-foreground">
                Os usuários cadastrados no sistema aparecerão aqui.
              </div>
            </div>
          ) : itemsFiltrados.length === 0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                h-60
                border
                border-dashed
                border-border
                rounded-2xl
                bg-card/50
              "
            >
              <div className="text-lg font-semibold">
                Nenhum funcionário encontrado
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Nenhum resultado para {buscar}.
              </p>
            </div>
          ) : (
            <div className="border border-border rounded-2xl overflow-hidden bg-card">
              <div
                className="
                  grid
                  grid-cols-[2fr_2fr_1fr_60px]
                  items-center
                  px-6
                  py-4
                  border-b
                  border-border
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                <div>Funcionário</div>
                <div>Email</div>
                <div>Cargo</div>
                <div></div>
              </div>

              {itemsFiltrados.map((usuario) => (
                <div
                  key={usuario.id}
                  className="
                    w-full
                    grid
                    grid-cols-[2fr_2fr_1fr_60px]
                    items-center
                    px-6
                    py-5
                    border-b
                    border-border
                    last:border-b-0
                    hover:bg-accent
                    transition-colors
                  "
                >
                  <div className="text-sm font-semibold text-foreground">
                    {usuario.nome}
                  </div>

                  <div className="text-sm text-foreground">{usuario.email}</div>

                  <div className="text-sm text-foreground">
                    {usuario.perfil}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="
                        p-2
                        rounded-lg
                        hover:text-red-400
                        hover:bg-red-500/10
                        transition-colors
                        text-white
                      "
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
