import { Usuario } from "@/types/Usuario";
import { useEffect, useState } from "react";

export default function ContadorAtivo() {
  const [ativo, setAtivo] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarAtivo() {
      try {
        const resposta = await fetch("/api/admin/usuarios");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar usuários");
        }

        const usuarios: Usuario[] = await resposta.json();

        const usuariosAtivos = usuarios.filter(
          (usuario) => usuario.status === true,
        );

        setAtivo(usuariosAtivos);
      } catch (erro) {
        console.error("Erro ao buscar usuários ativos:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarAtivo();
  }, []);

  return (
    <div>
      <h2>Usuários ativos</h2>

      <p>{carregando ? "Carregando..." : ativo.length}</p>
    </div>
  );
}
