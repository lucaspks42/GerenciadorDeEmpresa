"use client";

import { useEffect, useState } from "react";

type Tarefa = {
  id: number;
  titulo: string;
  status: string;
};

export default function ContadoresTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    async function buscarTarefas() {
      const resposta = await fetch("/api/tarefas");
      const dados = await resposta.json();
      setTarefas(dados);
    }

    buscarTarefas();
  }, []);

  const aFazer = tarefas.filter((tarefa) => tarefa.status === "aFazer").length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl p-5">
        <p className="text-3xl font-bold text-foreground">{aFazer}</p>
      </div>
    </div>
  );
}
