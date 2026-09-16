"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
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

  const [arrastando, setArrastando] = useState(false);

  const [posicaoInicial, setPosicaoInicial] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  function iniciarArraste(e: ReactPointerEvent<HTMLDivElement>) {
    const elemento = e.target as HTMLElement;

    // Não inicia o arraste ao clicar no botão
    if (elemento.closest("button")) {
      return;
    }

    // Não inicia o arraste ao clicar no select
    if (elemento.closest("select")) {
      return;
    }

    const card = e.currentTarget.getBoundingClientRect();

    setPosicaoInicial({
      left: card.left,
      top: card.top,
      width: card.width,
      height: card.height,
    });

    setArrastando(true);

    iniciarDrag(tarefa.id, tarefa.status);

    requestAnimationFrame(() => {
      dragControls.start(e.nativeEvent);
    });
  }

  function finalizarArraste(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } },
  ) {
    const colunaDestino = obterColuna(info.point.x, info.point.y);

    /*
     * Se soltou dentro de uma coluna diferente,
     * muda o status imediatamente.
     */
    if (colunaDestino !== null && colunaDestino !== tarefa.status) {
      mudarStatus(tarefa.id, colunaDestino);
    }

    setArrastando(false);

    finalizarDrag();

    /*
     * Espera a renderização da nova coluna
     * antes de zerar o movimento.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        x.set(0);
        y.set(0);
      });
    });
  }

  const card = (
    <motion.div
      layout
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        x,
        y,

        ...(arrastando
          ? {
              position: "fixed",
              left: posicaoInicial.left,
              top: posicaoInicial.top,
              width: posicaoInicial.width,
              zIndex: 999999,
            }
          : {}),
      }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 500,
          damping: 35,
          mass: 0.7,
        },

        x: {
          type: "spring",
          stiffness: 500,
          damping: 35,
        },

        y: {
          type: "spring",
          stiffness: 500,
          damping: 35,
        },
      }}
      whileDrag={{
        scale: 1.04,
        rotate: 1,
        cursor: "grabbing",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
      }}
      onPointerDown={iniciarArraste}
      onDrag={(event, info) => {
        atualizarFeedbackColuna(info.point.x, info.point.y);
      }}
      onDragEnd={finalizarArraste}
      className="
        relative
        border
        border-border
        rounded-2xl
        p-4
        pt-3
        shadow-md
        cursor-grab
        bg-card
        text-card-foreground
        select-none
        transition-colors
        hover:border-primary/50
      "
    >
      <div className="flex justify-between border-b border-border pb-4">
        <span className="text-foreground">{tarefa.texto}</span>

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
            border-input
            rounded-lg
            px-4
            py-2
            text-foreground
            bg-background
            cursor-pointer
            focus:outline-none
            focus:ring-2
            focus:ring-primary
          "
          name="select"
        >
          <option value="aFazer">A fazer</option>

          <option value="fazendo">Fazendo</option>

          <option value="concluido">Concluído</option>
        </select>

        <button
          type="button"
          className="
            flex
            items-center
            justify-center
            cursor-pointer
            text-muted-foreground
            hover:text-destructive
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

  /*
   * Enquanto o card estiver sendo arrastado,
   * ele sai da coluna e vai para o body.
   *
   * Isso evita que o overflow-y-auto da coluna
   * corte o card durante o arraste.
   */
  if (arrastando) {
    return (
      <>
        <div
          style={{
            height: posicaoInicial.height,
          }}
        />

        {createPortal(card, document.body)}
      </>
    );
  }

  return card;
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

  /*
   * Busca as tarefas do banco.
   */
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

  /*
   * Começa o arraste.
   */
  function iniciarDrag(id: number, status: string) {
    setTarefaArrastando(id);
    setStatusArrastando(status);
  }

  /*
   * Finaliza o arraste.
   */
  function finalizarDrag() {
    setTarefaArrastando(null);
    setStatusArrastando(null);
    setColunaAtiva(null);
  }

  /*
   * Adiciona uma nova tarefa.
   */
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

  /*
   * Muda o status imediatamente na tela
   * e depois salva no banco.
   */
  async function mudarStatus(id: number, novoStatus: string) {
    /*
     * Atualização otimista.
     *
     * O card muda de coluna imediatamente,
     * sem esperar o banco responder.
     */
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === id
          ? {
              ...tarefa,
              status: novoStatus,
            }
          : tarefa,
      ),
    );

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
    } catch (erro) {
      console.error("Erro ao mudar status:", erro);

      /*
       * Se o banco falhar,
       * busca novamente os dados.
       */
      try {
        const resposta = await fetch("/api/tarefas");

        if (!resposta.ok) {
          return;
        }

        const dados: TarefaBanco[] = await resposta.json();

        setTarefas(
          dados.map((tarefa) => ({
            id: tarefa.id,
            texto: tarefa.titulo,
            status: tarefa.status,
          })),
        );
      } catch (erro) {
        console.error("Erro ao recarregar tarefas:", erro);
      }
    }
  }

  /*
   * Descobre em qual coluna o mouse está.
   */
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

  /*
   * Destaca a coluna enquanto arrasta.
   */
  function atualizarFeedbackColuna(x: number, y: number) {
    const coluna = obterColuna(x, y);

    setColunaAtiva(coluna);
  }

  /*
   * Deleta uma tarefa.
   */
  async function deletarTarefa(id: number) {
    try {
      const resposta = await fetch(`/api/tarefas/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao deletar tarefa");
      }

      await resposta.json();

      setTarefas((tarefasAnteriores) =>
        tarefasAnteriores.filter((tarefa) => tarefa.id !== id),
      );
    } catch (erro) {
      console.error("Erro ao deletar tarefa:", erro);
    }
  }

  /*
   * Classes das colunas.
   */
  function classeColuna(statusColuna: string) {
    const estaAtiva = colunaAtiva === statusColuna;

    const estaArrastandoDaqui =
      statusArrastando === statusColuna && tarefaArrastando !== null;

    return `
      border
      h-[600px]
      rounded-2xl
      flex-1
      flex
      flex-col
      transition-all
      duration-200
      relative

      ${estaArrastandoDaqui ? "z-50" : "z-0"}

      ${
        estaAtiva
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-border bg-card"
      }
    `;
  }

  return (
    <div className="flex flex-col flex-1">
      <main
        className="
          flex
          flex-1
          w-full
          flex-col
          min-h-screen
          bg-background
          text-foreground
          font-bold
        "
      >
        <header
          className="
            w-full
            border-b
            border-border
            h-16
            flex
            items-center
            justify-start
          "
        >
          <h1 className="text-foreground px-4">Planejador de Tarefas</h1>
        </header>

        <div
          className="
            flex
            w-full
            gap-2
            px-4
            py-4
            font-bold
          "
        >
          <input
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Descreva uma nova tarefa"
            className="
              flex-1
              border
              border-input
              rounded-lg
              p-3
              text-foreground
              bg-background
              placeholder:text-muted-foreground
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              border
              border-input
              rounded-lg
              px-4
              text-foreground
              bg-background
              cursor-pointer
              focus:outline-none
              focus:ring-2
              focus:ring-primary
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
              border-primary
              bg-primary
              hover:bg-primary/80
              transition-colors
              rounded-lg
              px-4
              text-primary-foreground
              font-bold
              cursor-pointer
            "
          >
            Adicionar
          </button>
        </div>

        <div className="flex gap-4 w-full px-4 py-4">
          {/* A FAZER */}

          <div ref={colunaAfazer} className={classeColuna("aFazer")}>
            <div
              className="
                shrink-0
                border-b
                border-border
                text-foreground
                px-4
                py-4
                flex
                justify-between
                items-center
                w-full
              "
            >
              <span>A fazer</span>

              <span
                className="
                  bg-primary/15
                  text-primary
                  px-2
                  py-0.5
                  rounded-3xl
                "
              >
                {aFazer}
              </span>
            </div>

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                p-4
                text-foreground
              "
            >
              <div className="flex flex-col gap-4">
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
          </div>

          {/* FAZENDO */}

          <div ref={colunaFazendo} className={classeColuna("fazendo")}>
            <div
              className="
                shrink-0
                border-b
                border-border
                text-foreground
                px-4
                py-4
                flex
                justify-between
                items-center
                w-full
              "
            >
              <span>Fazendo</span>

              <span
                className="
                  bg-primary/15
                  text-primary
                  px-2
                  py-0.5
                  rounded-3xl
                "
              >
                {fazendo}
              </span>
            </div>

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                p-4
                text-foreground
              "
            >
              <div className="flex flex-col gap-4">
                {tarefas
                  .filter((tarefa) => tarefa.status === "fazendo")
                  .map((tarefa) => (
                    <CardTarefa
                      key={tarefa.id}
                      tarefa={tarefa}
                      cor="bg-primary"
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

          {/* CONCLUÍDO */}

          <div ref={colunaConcluido} className={classeColuna("concluido")}>
            <div
              className="
                shrink-0
                border-b
                border-border
                text-foreground
                px-4
                py-4
                flex
                justify-between
                items-center
                w-full
              "
            >
              <span>Concluído</span>

              <span
                className="
                  bg-primary/15
                  text-primary
                  px-2
                  py-0.5
                  rounded-3xl
                "
              >
                {concluidas2}
              </span>
            </div>

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                p-4
                text-foreground
              "
            >
              <div className="flex flex-col gap-4">
                {tarefas
                  .filter((tarefa) => tarefa.status === "concluido")
                  .map((tarefa) => (
                    <CardTarefa
                      key={tarefa.id}
                      tarefa={tarefa}
                      cor="bg-green-400"
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
        </div>
      </main>
    </div>
  );
}
