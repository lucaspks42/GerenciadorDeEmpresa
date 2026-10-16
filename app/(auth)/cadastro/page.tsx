"use client";
import { CheckCircle2 } from "lucide-react";
import FormCadastro from "@/components/ui/FormCadastro";
import FormLogin from "@/components/ui/FormLogin";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Transition,
  type Variants,
} from "motion/react";
import React, {
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";

/* =========================================================
   AJUSTES DA ANIMAÇÃO
   ========================================================= */

const EASE = [0.22, 1, 0.36, 1] as const;

const FORCA = {
  pontos: 10,
  brilhoAzul: 16,
  brilhoRoxo: 24,
  dashboard: 32,
};

// Configurações do efeito magnético
const MAGNETICO = {
  raio: 450, // Distância máxima de influência do mouse
  forca: 28, // Deslocamento máximo dos cards em pixels
  intensidade: 1, // Intensidade geral do efeito
};

const painelTransicao: Transition = {
  duration: 0.75,
  ease: EASE,
};

const conteudo: Variants = {
  oculto: {},
  visivel: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.35,
    },
  },
  saida: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const item: Variants = {
  oculto: { opacity: 0, y: 16 },
  visivel: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
  saida: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2 },
  },
};

const LARGURA_PAINEL = "max(28vw, 400px)";

const painelBase =
  "absolute top-0 z-50 flex h-full w-full items-center justify-center overflow-hidden bg-[#0d0d19]/0 shadow-2xl shadow-black/50 backdrop-blur-2xl lg:w-[var(--painel)]";

/* =========================================================
   CAMADA COM PARALLAX
   ========================================================= */

function Camada({
  x,
  y,
  forca,
  className,
  style,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  forca: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const tx = useTransform(x, [-0.5, 0.5], [forca, -forca]);
  const ty = useTransform(y, [-0.5, 0.5], [forca, -forca]);

  return (
    <motion.div style={{ ...style, x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}

/* =========================================================
   CARD COM EFEITO MAGNÉTICO
   ========================================================= */

function CardMagnetico({
  mouseX,
  mouseY,
  reduzir,
  className,
  children,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduzir: boolean;
  className?: string;
  children: ReactNode;
}) {
  const referencia = useRef<HTMLElement>(null);

  const deslocamentoX = useMotionValue(0);
  const deslocamentoY = useMotionValue(0);

  // Suaviza o movimento magnético
  const x = useSpring(deslocamentoX, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const y = useSpring(deslocamentoY, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  function calcularMagnetismo() {
    if (reduzir) return;

    const elemento = referencia.current;

    if (!elemento) return;

    const rect = elemento.getBoundingClientRect();

    // Centro do card
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    // Posição do mouse em relação ao centro
    const dx = mouseX.get() - centroX;
    const dy = mouseY.get() - centroY;

    // Distância entre o mouse e o card
    const distancia = Math.hypot(dx, dy);

    // Fora do raio de influência, o card volta ao lugar
    if (distancia >= MAGNETICO.raio || distancia === 0) {
      deslocamentoX.set(0);
      deslocamentoY.set(0);
      return;
    }

    // Quanto mais próximo, maior a influência
    const proximidade = 1 - distancia / MAGNETICO.raio;

    // Curva de intensidade para deixar o efeito mais natural
    const intensidade = proximidade * proximidade * MAGNETICO.intensidade;

    // Direção normalizada do vetor
    const direcaoX = -dx / distancia;
    const direcaoY = -dy / distancia;

    // Deslocamento na direção contrária ao mouse
    deslocamentoX.set(direcaoX * MAGNETICO.forca * intensidade);

    deslocamentoY.set(direcaoY * MAGNETICO.forca * intensidade);
  }

  // Recalcula a posição quando o mouse se movimenta
  React.useEffect(() => {
    const atualizar = () => calcularMagnetismo();

    const elemento = referencia.current;

    if (!elemento) return;

    const pai = elemento.closest("main");

    pai?.addEventListener("mousemove", atualizar);

    return () => {
      pai?.removeEventListener("mousemove", atualizar);
    };
  }, [reduzir]);

  return (
    <motion.article
      ref={referencia}
      style={{
        x,
        y,
      }}
      className={className}
    >
      {children}
    </motion.article>
  );
}

/* =========================================================
   CABEÇALHO
   ========================================================= */

function Cabecalho({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo: string;
}) {
  return (
    <motion.div variants={item} className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 font-bold shadow-xl shadow-violet-500/30">
        A
      </div>

      <h1 className="text-3xl font-bold">{titulo}</h1>

      <p className="mt-2 text-sm text-slate-400">{subtitulo}</p>
    </motion.div>
  );
}

/* =========================================================
   FORMULÁRIO
   ========================================================= */

function Formulario({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={item} className="flex w-full justify-center">
      {children}
    </motion.div>
  );
}

function TelaSucesso({ onVoltar }: { onVoltar: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex w-full max-w-sm flex-col items-center text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 size={42} className="text-emerald-400" />
      </div>

      <h1 className="text-3xl font-bold">Solicitação enviada!</h1>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        Sua solicitação de cadastro foi enviada com sucesso. Aguarde a aprovação
        de um administrador para acessar o sistema.
      </p>

      <button
        type="button"
        onClick={onVoltar}
        className="mt-8 w-full rounded-lg bg-violet-800 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Voltar para o login
      </button>
    </motion.div>
  );
}

/* =========================================================
   PÁGINA DE CADASTRO
   ========================================================= */

export default function Cadastro() {
  const [modoLogin, setModoLogin] = useState(false);

  const [cadastroEnviado, setCadastroEnviado] = useState(false);

  const reduzir = useReducedMotion() ?? false;

  // Posição global do mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  const y = useSpring(mouseY, {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  function aoMoverMouse(e: MouseEvent<HTMLElement>) {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);

    // Coordenadas reais para o efeito magnético
    posicaoMouseX.set(e.clientX);
    posicaoMouseY.set(e.clientY);
  }

  // Coordenadas do mouse em pixels
  const posicaoMouseX = useMotionValue(0);
  const posicaoMouseY = useMotionValue(0);

  function aoSairDoMouse() {
    mouseX.set(0);
    mouseY.set(0);

    posicaoMouseX.set(-10000);
    posicaoMouseY.set(-10000);
  }

  return (
    <MotionConfig reducedMotion="user">
      <main
        onMouseMove={reduzir ? undefined : aoMoverMouse}
        onMouseLeave={aoSairDoMouse}
        style={{ "--painel": LARGURA_PAINEL } as CSSProperties}
        className="relative min-h-screen overflow-hidden bg-[#0d0d19] text-white"
      >
        {/* FUNDO COM PARALLAX */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Camada
            x={x}
            y={y}
            forca={FORCA.brilhoRoxo}
            className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-600/40 blur-3xl"
          />

          <Camada
            x={x}
            y={y}
            forca={FORCA.brilhoAzul}
            className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/25 blur-3xl"
          />

          <Camada
            x={x}
            y={y}
            forca={FORCA.pontos}
            className="absolute -inset-10 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.07) 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* DASHBOARD */}

        <div
          className={`absolute inset-y-0 left-0 w-full transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform lg:w-[calc(100%_-_var(--painel))] ${
            modoLogin ? "lg:translate-x-[var(--painel)]" : ""
          }`}
        >
          <Camada
            x={x}
            y={y}
            forca={FORCA.dashboard}
            className="absolute inset-0"
          >
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:p-10">
              <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 font-semibold shadow-lg shadow-violet-500/30">
                    A
                  </div>

                  <div className="leading-tight">
                    <p className="font-semibold">Assistente</p>
                    <p className="text-xs text-slate-400">Administrativo</p>
                  </div>
                </div>

                <input
                  type="search"
                  placeholder="Pesquisar..."
                  className="hidden w-72 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400 sm:block"
                />
              </header>

              <section className="grid flex-1 content-center gap-6 md:grid-cols-2 lg:grid-cols-12">
                {/* RECEITA */}

                <CardMagnetico
                  mouseX={posicaoMouseX}
                  mouseY={posicaoMouseY}
                  reduzir={reduzir}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-5 lg:-rotate-1"
                >
                  <p className="text-sm text-slate-400">Receita mensal</p>

                  <h2 className="mt-3 text-4xl font-bold">R$ 24.850</h2>

                  <p className="mt-2 text-sm text-emerald-400">
                    +12,5% este mês
                  </p>
                </CardMagnetico>

                {/* CLIENTES */}

                <CardMagnetico
                  mouseX={posicaoMouseX}
                  mouseY={posicaoMouseY}
                  reduzir={reduzir}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-4 lg:rotate-1"
                >
                  <p className="text-sm text-slate-400">Clientes</p>

                  <h2 className="mt-3 text-4xl font-bold">128</h2>

                  <p className="mt-2 text-sm text-slate-400">
                    clientes cadastrados
                  </p>
                </CardMagnetico>

                {/* TAREFAS PENDENTES */}

                <CardMagnetico
                  mouseX={posicaoMouseX}
                  mouseY={posicaoMouseY}
                  reduzir={reduzir}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:col-span-2 lg:col-span-3"
                >
                  <p className="text-sm text-slate-400">Tarefas pendentes</p>

                  <h2 className="mt-3 text-4xl font-bold">17</h2>

                  <p className="mt-2 text-sm text-orange-400">5 para hoje</p>
                </CardMagnetico>

                {/* TAREFAS */}

                <CardMagnetico
                  mouseX={posicaoMouseX}
                  mouseY={posicaoMouseY}
                  reduzir={reduzir}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-5"
                >
                  <p className="text-sm text-slate-400">Tarefas</p>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enviar relatórios</span>

                      <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
                        Fazendo
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Atualizar clientes</span>

                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                        Concluído
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revisar pagamentos</span>

                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">
                        A fazer
                      </span>
                    </div>
                  </div>
                </CardMagnetico>

                {/* PAGAMENTOS */}

                <CardMagnetico
                  mouseX={posicaoMouseX}
                  mouseY={posicaoMouseY}
                  reduzir={reduzir}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-3 lg:rotate-2"
                >
                  <p className="text-sm text-slate-400">Pagamentos</p>

                  <h2 className="mt-3 text-4xl font-bold">R$ 8.420</h2>

                  <p className="mt-2 text-sm text-slate-400">previstos</p>
                </CardMagnetico>

                {/* PRÓXIMOS PAGAMENTOS */}

                <CardMagnetico
                  mouseX={posicaoMouseX}
                  mouseY={posicaoMouseY}
                  reduzir={reduzir}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:col-span-2 lg:col-span-4"
                >
                  <p className="text-sm text-slate-400">Próximos pagamentos</p>

                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Empresa Alpha</span>
                      <span className="text-sm font-semibold">R$ 1.200</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm">Empresa Beta</span>
                      <span className="text-sm font-semibold">R$ 850</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm">Empresa Gamma</span>
                      <span className="text-sm font-semibold">R$ 620</span>
                    </div>
                  </div>
                </CardMagnetico>

                {/* AVISOS */}

                <div className="flex justify-center md:col-span-2 lg:col-span-12">
                  <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-6 py-3 text-sm text-violet-200">
                    Você possui novos avisos no sistema
                  </div>
                </div>
              </section>
            </div>
          </Camada>
        </div>

        {/* PAINÉIS DE CADASTRO E LOGIN */}

        <AnimatePresence initial={false}>
          {!modoLogin ? (
            <motion.div
              key="cadastro"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={painelTransicao}
              className={`${painelBase} right-0`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />

              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" />

              <motion.div
                variants={conteudo}
                initial="oculto"
                animate="visivel"
                exit="saida"
                className="relative flex h-full w-full flex-col items-center justify-center px-12"
              >
                {!cadastroEnviado && (
                  <Cabecalho
                    titulo="Criar conta"
                    subtitulo="Crie sua conta para acessar o sistema"
                  />
                )}

                <AnimatePresence mode="wait" initial={false}>
                  {!cadastroEnviado ? (
                    <motion.div
                      key="formulario"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="w-full"
                    >
                      <Formulario>
                        <FormCadastro
                          onCadastroSucesso={() => setCadastroEnviado(true)}
                        />
                      </Formulario>
                    </motion.div>
                  ) : (
                    <TelaSucesso
                      key="sucesso"
                      onVoltar={() => setModoLogin(true)}
                    />
                  )}
                </AnimatePresence>

                {!cadastroEnviado && (
                  <motion.button
                    variants={item}
                    type="button"
                    onClick={() => setModoLogin(true)}
                    className="mt-6 text-sm text-slate-400 transition hover:text-white"
                  >
                    Já possui uma conta?{" "}
                    <span className="font-semibold text-violet-400">
                      Entrar
                    </span>
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ ...painelTransicao, delay: 0.1 }}
              className={`${painelBase} left-0`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />

              <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" />

              <motion.div
                variants={conteudo}
                initial="oculto"
                animate="visivel"
                exit="saida"
                className="relative flex h-full w-full flex-col items-center justify-center px-12"
              >
                <Cabecalho
                  titulo="Entrar"
                  subtitulo="Entre na sua conta para continuar"
                />

                <Formulario>
                  <FormLogin />
                </Formulario>

                <motion.button
                  variants={item}
                  type="button"
                  onClick={() => setModoLogin(false)}
                  className="mt-6 text-sm text-slate-400 transition hover:text-white"
                >
                  Ainda não possui uma conta?{" "}
                  <span className="font-semibold text-violet-400">
                    Criar conta
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
