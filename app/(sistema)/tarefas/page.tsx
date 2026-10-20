"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { Trash, Plus, ClipboardList } from "lucide-react";

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

    if (elemento.closest("button") || elemento.closest("select")) {
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

    if (colunaDestino !== null && colunaDestino !== tarefa.status) {
      mudarStatus(tarefa.id, colunaDestino);
    }

    setArrastando(false);
    finalizarDrag();

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
              position: "fixed" as const,
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
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
      }}
      onPointerDown={iniciarArraste}
      onDrag={(event, info) => {
        atualizarFeedbackColuna(info.point.x, info.point.y);
      }}
      onDragEnd={finalizarArraste}
      className="relative cursor-grab select-none rounded-xl border border-white/[0.07] bg-[#171725] p-4 text-white shadow-sm transition-colors duration-200 hover:border-blue-400/30 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
        <span className="break-words text-sm font-medium leading-relaxed text-slate-200">
          {tarefa.texto}
        </span>

        <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${cor}`} />
      </div>

      <div className="flex items-center justify-between gap-3 pt-3">
        <select
          value={tarefa.status}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => mudarStatus(tarefa.id, e.target.value)}
          className="min-w-0 cursor-pointer rounded-lg border border-white/[0.08] bg-[#11111f] px-3 py-2 text-xs text-slate-300 outline-none transition-colors hover:border-blue-400/30 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10"
          name="select"
        >
          <option value="aFazer">A fazer</option>
          <option value="fazendo">Fazendo</option>
          <option value="concluido">Concluído</option>
        </select>

        <button
          type="button"
          aria-label="Excluir tarefa"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            deletarTarefa(tarefa.id);
          }}
        >
          <Trash size={17} />
        </button>
      </div>
    </motion.div>
  );

  if (arrastando) {
    return (
      <>
        <div style={{ height: posicaoInicial.height }} />
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

  useEffect(() => {
    async function buscarTarefas() {
      try {
        const resposta = await fetch("/api/tarefas");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar tarefas");
        }

        const tarefasDoBanco: TarefaBanco[] = await resposta.json();

        setTarefas(
          tarefasDoBanco.map((tarefa) => ({
            id: tarefa.id,
            texto: tarefa.titulo,
            status: tarefa.status,
          })),
        );
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
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, status: novoStatus } : tarefa,
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
    setColunaAtiva(obterColuna(x, y));
  }

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

  function classeColuna(statusColuna: string) {
    const estaAtiva = colunaAtiva === statusColuna;
    const estaArrastandoDaqui =
      statusArrastando === statusColuna && tarefaArrastando !== null;

    return `
      relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl
      border transition-all duration-200
      ${estaArrastandoDaqui ? "z-50" : ""}
      ${
        estaAtiva
          ? "border-blue-400/40 bg-blue-500/[0.06] shadow-lg shadow-blue-500/[0.05]"
          : "border-white/[0.07] bg-[#11111f]"
      }
    `;
  }

  return (
    <main className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden bg-[#0d0d19] text-white">
      <div className="flex shrink-0 flex-col gap-5 px-6 pb-4 pt-6 sm:px-10 lg:px-12">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
            <ClipboardList size={15} />
            Organização
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Tarefas
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Organize suas atividades e acompanhe o andamento de cada tarefa.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#11111f] p-4 sm:flex-row">
          <input
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                adicionarTarefa();
              }
            }}
            placeholder="Descreva uma nova tarefa..."
            className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#0d0d19] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="cursor-pointer rounded-xl border border-white/[0.08] bg-[#0d0d19] px-4 py-3 text-sm text-slate-300 outline-none transition-colors focus:border-blue-400/50"
            name="select"
          >
            <option value="aFazer">A fazer</option>
            <option value="fazendo">Fazendo</option>
            <option value="concluido">Concluído</option>
          </select>

          <button
            type="button"
            onClick={adicionarTarefa}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <Plus size={17} />
            Adicionar tarefa
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto px-6 pb-6 pt-2 sm:px-10 lg:px-12">
        <div ref={colunaAfazer} className={classeColuna("aFazer")}>
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="text-sm font-semibold text-slate-200">
                A fazer
              </span>
            </div>
            <span className="rounded-lg border border-red-400/15 bg-red-500/[0.08] px-2.5 py-1 text-xs font-semibold tabular-nums text-red-300">
              {aFazer}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {tarefas
                .filter((tarefa) => tarefa.status === "aFazer")
                .map((tarefa) => (
                  <CardTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    cor="bg-red-400"
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

        <div ref={colunaFazendo} className={classeColuna("fazendo")}>
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
              <span className="text-sm font-semibold text-slate-200">
                Fazendo
              </span>
            </div>
            <span className="rounded-lg border border-blue-400/15 bg-blue-500/[0.08] px-2.5 py-1 text-xs font-semibold tabular-nums text-blue-300">
              {fazendo}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {tarefas
                .filter((tarefa) => tarefa.status === "fazendo")
                .map((tarefa) => (
                  <CardTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    cor="bg-blue-400"
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

        <div ref={colunaConcluido} className={classeColuna("concluido")}>
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">
                Concluído
              </span>
            </div>
            <span className="rounded-lg border border-emerald-400/15 bg-emerald-500/[0.08] px-2.5 py-1 text-xs font-semibold tabular-nums text-emerald-300">
              {concluidas2}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {tarefas
                .filter((tarefa) => tarefa.status === "concluido")
                .map((tarefa) => (
                  <CardTarefa
                    key={tarefa.id}
                    tarefa={tarefa}
                    cor="bg-emerald-400"
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
  );
}
