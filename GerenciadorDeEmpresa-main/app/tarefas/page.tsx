"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { Trash } from "lucide-react";

type TarefaTipo = {
  id: number;
  texto: string;
  status: string;
};

type CardTarefaProps = {
  tarefa: TarefaTipo;
  cor: string;

  mudarStatus: (id: number, novoStatus: string) => Promise<void>;

  deletarTarefa: (id: number) => Promise<void>;

  atualizarFeedbackColuna: (x: number, y: number) => void;

  obterColuna: (x: number, y: number) => string | null;

  iniciarDrag: (id: number, status: string) => void;

  finalizarDrag: () => void;
};

function CardTarefa({
  tarefa,
  cor,
  mudarStatus,
  deletarTarefa,
  atualizarFeedbackColuna,
  obterColuna,
  iniciarDrag,
  finalizarDrag,
}: CardTarefaProps) {
  const dragControls = useDragControls();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      layout
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        x,
        y,
      }}
      whileDrag={{
        zIndex: 9999,
        scale: 1.03,
        cursor: "grabbing",
      }}
      onPointerDown={(e) => {
        const elemento = e.target as HTMLElement;

        if (elemento.closest("button")) {
          return;
        }

        if (elemento.closest("select")) {
          return;
        }

        iniciarDrag(tarefa.id, tarefa.status);

        dragControls.start(e);
      }}
      onDrag={(event, info) => {
        atualizarFeedbackColuna(info.point.x, info.point.y);
      }}
      onDragEnd={(event, info) => {
        const colunaDestino = obterColuna(info.point.x, info.point.y);

        x.set(0);
        y.set(0);

        if (colunaDestino !== null && colunaDestino !== tarefa.status) {
          mudarStatus(tarefa.id, colunaDestino);
        }

        finalizarDrag();
      }}
      className="
        relative
        border
        border-gray-300
        rounded-2xl
        p-4
        pt-3
        mb-2
        shadow-md
        cursor-grab
        bg-white
        select-none
      "
    >
      <div className="flex justify-between border-b border-gray-200 pb-4">
        <span>{tarefa.texto}</span>

        <div className={`w-4 h-4 ${cor} rounded-full`} />
      </div>

      <div className="py-2 flex items-center justify-between">
        <select
          value={tarefa.status}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            mudarStatus(tarefa.id, e.target.value);
          }}
          className="
            border
            border-gray-300
            rounded-lg
            px-4
            py-2
            text-black
            bg-white
            cursor-pointer
          "
          name="select"
        >
          <option value="aFazer">A fazer</option>

          <option value="fazendo">Fazendo</option>

          <option value="concluido">Concluído</option>
        </select>

        {/* LIXEIRA */}

        <button
          type="button"
          className="
            flex
            items-center
            justify-center
            cursor-pointer
            text-gray-600
            hover:text-red-500
            transition-colors
          "
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            deletarTarefa(tarefa.id);
          }}
        >
          <Trash size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Tarefa() {
  const [novaTarefa, setNovaTarefa] = useState("");

  const [status, setStatus] = useState("aFazer");

  const [tarefas, setTarefas] = useState<TarefaTipo[]>([]);

  const [tarefaArrastando, setTarefaArrastando] = useState<number | null>(null);

  const [statusArrastando, setStatusArrastando] = useState<string | null>(null);

  const [colunaAtiva, setColunaAtiva] = useState<string | null>(null);

  const colunaAfazer = useRef<HTMLDivElement>(null);

  const colunaFazendo = useRef<HTMLDivElement>(null);

  const colunaConcluido = useRef<HTMLDivElement>(null);

  type TarefaBanco = {
    id: number;
    titulo: string;
    status: string;
  };

  useEffect(() => {
    async function buscarTarefas() {
      try {
        const resposta = await fetch("/api/tarefas");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar tarefas");
        }

        const tarefasDoBanco: TarefaBanco[] = await resposta.json();

        const tarefasFormatadas = tarefasDoBanco.map((tarefa) => ({
          id: tarefa.id,
          texto: tarefa.titulo,
          status: tarefa.status,
        }));

        setTarefas(tarefasFormatadas);
      } catch (erro) {
        console.error("Erro ao buscar tarefas:", erro);
      }
    }

    buscarTarefas();
  }, []);

  const aFazer = tarefas.filter((tarefa) => tarefa.status === "aFazer").length;

  const fazendo = tarefas.filter(
    (tarefa) => tarefa.status === "fazendo",
  ).length;

  const concluidas2 = tarefas.filter(
    (tarefa) => tarefa.status === "concluido",
  ).length;

  function iniciarDrag(id: number, status: string) {
    setTarefaArrastando(id);
    setStatusArrastando(status);
  }

  function finalizarDrag() {
    setTarefaArrastando(null);
    setStatusArrastando(null);
    setColunaAtiva(null);
  }

  async function adicionarTarefa() {
    if (novaTarefa.trim() === "") {
      return;
    }

    try {
      const resposta = await fetch("/api/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: novaTarefa,
          descricao: "",
          status,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao adicionar tarefa");
      }

      const tarefaCriada = await resposta.json();

      console.log("Resposta da API:", tarefaCriada);

      setTarefas((tarefasAnteriores) => [
        ...tarefasAnteriores,
        {
          id: tarefaCriada.id,
          texto: tarefaCriada.titulo,
          status: tarefaCriada.status,
        },
      ]);

      setNovaTarefa("");
    } catch (erro) {
      console.error("Erro ao adicionar tarefa:", erro);
    }
  }

  async function mudarStatus(id: number, novoStatus: string) {
    try {
      const resposta = await fetch(`/api/tarefas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar status");
      }

      setTarefas((tarefasAnteriores) =>
        tarefasAnteriores.map((tarefa) => {
          if (tarefa.id === id) {
            return {
              ...tarefa,
              status: novoStatus,
            };
          }

          return tarefa;
        }),
      );
    } catch (erro) {
      console.error("Erro ao mudar status:", erro);
    }
  }

  function obterColuna(x: number, y: number): string | null {
    if (colunaAfazer.current) {
      const limites = colunaAfazer.current.getBoundingClientRect();

      if (
        x >= limites.left &&
        x <= limites.right &&
        y >= limites.top &&
        y <= limites.bottom
      ) {
        return "aFazer";
      }
    }

    if (colunaFazendo.current) {
      const limites = colunaFazendo.current.getBoundingClientRect();

      if (
        x >= limites.left &&
        x <= limites.right &&
        y >= limites.top &&
        y <= limites.bottom
      ) {
        return "fazendo";
      }
    }

    if (colunaConcluido.current) {
      const limites = colunaConcluido.current.getBoundingClientRect();

      if (
        x >= limites.left &&
        x <= limites.right &&
        y >= limites.top &&
        y <= limites.bottom
      ) {
        return "concluido";
      }
    }

    return null;
  }

  function atualizarFeedbackColuna(x: number, y: number) {
    const coluna = obterColuna(x, y);

    setColunaAtiva(coluna);
  }

  async function deletarTarefa(id: number) {
    console.log("CLIQUEI NA LIXEIRA", id);

    try {
      const resposta = await fetch(`/api/tarefas/${id}`, {
        method: "DELETE",
      });

      console.log("Status da resposta:", resposta.status);

      if (!resposta.ok) {
        throw new Error("Erro ao deletar tarefa");
      }

      const resultado = await resposta.json();

      console.log("Resposta:", resultado);

      setTarefas((tarefasAnteriores) =>
        tarefasAnteriores.filter((tarefa) => tarefa.id !== id),
      );
    } catch (erro) {
      console.error("Erro ao deletar tarefa:", erro);
    }
  }

  function classeColuna(statusColuna: string) {
    const estaAtiva = colunaAtiva === statusColuna;

    const estaArrastandoDaqui =
      statusArrastando === statusColuna && tarefaArrastando !== null;

    return `
      border
      min-h-150
      rounded-2xl
      flex-1
      transition-all
      duration-200
      relative
      ${estaArrastandoDaqui ? "z-50" : "z-0"}
      ${estaAtiva ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}
    `;
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex flex-1 w-full flex-col min-h-screen font-bold">
        {/* 
            HEADER
         */}

        <header className="w-full border-b text-black border-gray-300 h-16 flex items-center justify-start">
          <h1 className="text-black px-4">Planejador de Tarefas</h1>
        </header>

        {/* 
            FORMULÁRIO
         */}

        <div className="flex w-full gap-2 px-4 py-4 font-bold">
          <input
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Descreva uma nova tarefa"
            className="
              flex-1
              border
              border-gray-300
              rounded-lg
              p-3
              text-black
              bg-white
            "
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              border
              border-gray-300
              rounded-lg
              px-4
              text-black
              bg-white
            "
            name="select"
          >
            <option value="aFazer">A fazer</option>

            <option value="fazendo">Fazendo</option>

            <option value="concluido">Concluído</option>
          </select>

          <button
            onClick={adicionarTarefa}
            className="
              border
              border-gray-300
              bg-indigo-600
              hover:bg-indigo-700
              transition-colors
              rounded-lg
              px-4
              text-white
              font-bold
              cursor-pointer
            "
          >
            Adicionar
          </button>
        </div>

        {/* COLUNAS*/}

        <div className="flex gap-4 w-full px-4 py-4">
          {/* A FAZER*/}

          <div ref={colunaAfazer} className={classeColuna("aFazer")}>
            <div className="border-b border-gray-200 pb-4 text-black px-4 py-4 flex justify-between items-center w-full">
              <span>A fazer</span>

              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-3xl">
                {aFazer}
              </span>
            </div>

            <div className="flex flex-col p-4 text-black gap-4">
              {tarefas
                .filter((tarefa) => tarefa.status === "aFazer")
                .map((tarefa) => (
                  <CardTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    cor="bg-red-500"
                    mudarStatus={mudarStatus}
                    deletarTarefa={deletarTarefa}
                    atualizarFeedbackColuna={atualizarFeedbackColuna}
                    obterColuna={obterColuna}
                    iniciarDrag={iniciarDrag}
                    finalizarDrag={finalizarDrag}
                  />
                ))}
            </div>
          </div>

          {/* FAZENDO */}

          <div ref={colunaFazendo} className={classeColuna("fazendo")}>
            <div className="border-b border-gray-200 pb-4 text-black px-4 py-4 flex justify-between items-center w-full">
              <span>Fazendo</span>

              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-3xl">
                {fazendo}
              </span>
            </div>

            <div className="flex flex-col p-4 text-black gap-4">
              {tarefas
                .filter((tarefa) => tarefa.status === "fazendo")
                .map((tarefa) => (
                  <CardTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    cor="bg-yellow-400"
                    mudarStatus={mudarStatus}
                    deletarTarefa={deletarTarefa}
                    atualizarFeedbackColuna={atualizarFeedbackColuna}
                    obterColuna={obterColuna}
                    iniciarDrag={iniciarDrag}
                    finalizarDrag={finalizarDrag}
                  />
                ))}
            </div>
          </div>

          {/* CONCLUÍDO*/}

          <div ref={colunaConcluido} className={classeColuna("concluido")}>
            <div className="border-b border-gray-200 pb-4 text-black px-4 py-4 flex justify-between items-center w-full">
              <span>Concluído</span>

              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-3xl">
                {concluidas2}
              </span>
            </div>

            <div className="flex flex-col p-4 text-black gap-4">
              {tarefas
                .filter((tarefa) => tarefa.status === "concluido")
                .map((tarefa) => (
                  <CardTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    cor="bg-green-500"
                    mudarStatus={mudarStatus}
                    deletarTarefa={deletarTarefa}
                    atualizarFeedbackColuna={atualizarFeedbackColuna}
                    obterColuna={obterColuna}
                    iniciarDrag={iniciarDrag}
                    finalizarDrag={finalizarDrag}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
