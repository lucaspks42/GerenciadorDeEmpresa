"use client";

import { Usuario } from "@/types/Usuario";
import { useEffect, useState } from "react";
import { Users, UserRound } from "lucide-react";

export default function ContadorFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Usuario[]>([]);

  useEffect(() => {
    async function buscarFuncionario() {
      try {
        const resposta = await fetch("/api/admin/usuarios");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar funcionários");
        }

        const dados: Usuario[] = await resposta.json();

        setFuncionarios(dados);
      } catch (erro) {
        console.error("Erro:", erro);
      }
    }

    buscarFuncionario();
  }, []);

  const totalFuncionarios = funcionarios.filter(
    (usuario) => usuario.perfil === "FUNCIONARIO",
  ).length;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xl font-semibold text-white">Funcionários</p>

        <p className="mt-2 text-sm text-slate-400">
          {totalFuncionarios}{" "}
          {totalFuncionarios === 1
            ? "funcionário cadastrado"
            : "funcionários cadastrados"}
        </p>
      </div>
    </div>
  );
}
