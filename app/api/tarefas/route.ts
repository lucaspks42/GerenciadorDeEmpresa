import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function GET() {
  try {
    const plano = db.raw.sql`
  SELECT
    "id",
    "titulo",
    "descricao",
    "status",
    TO_CHAR("criadoEm", 'YYYY-MM-DD"T"HH24:MI:SS') AS "criadoEm"
  FROM "Tarefa"
  ORDER BY "id" ASC
`
      .returnsRow({
        id: db.sql.public.Tarefa.columns.id,
        titulo: db.sql.public.Tarefa.columns.titulo,
        descricao: db.sql.public.Tarefa.columns.descricao,
        status: db.sql.public.Tarefa.columns.status,
        criadoEm: "pg/text@1",
      })
      .build();
    const tarefas = await runtime.query(plano);

    return Response.json(tarefas);
  } catch (erro) {
    console.error("ERRO AO BUSCAR TAREFAS:", erro);

    return Response.json({ erro: "Erro ao buscar tarefas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const { titulo, descricao, status } = dados;

    const plano = db.raw.sql`
  INSERT INTO "Tarefa"
  (
    "titulo",
    "descricao",
    "status"
  )
  VALUES
  (
    ${titulo},
    ${descricao ?? null},
    ${status ?? "aFazer"}
  )
  RETURNING
    "id",
    "titulo",
    "descricao",
    "status",
    TO_CHAR("criadoEm", 'YYYY-MM-DD"T"HH24:MI:SS') AS "criadoEm"
`
      .returnsRow({
        id: db.sql.public.Tarefa.columns.id,
        titulo: db.sql.public.Tarefa.columns.titulo,
        descricao: db.sql.public.Tarefa.columns.descricao,
        status: db.sql.public.Tarefa.columns.status,
        criadoEm: "pg/text@1",
      })
      .build();

    const [tarefa] = await runtime.query(plano);

    return Response.json(tarefa, { status: 201 });
  } catch (erro) {
    console.error("ERRO AO ADICIONAR TAREFA:", erro);

    return Response.json(
      {
        erro: "Erro ao adicionar tarefa",
        detalhe: String(erro),
      },
      { status: 500 },
    );
  }
}
