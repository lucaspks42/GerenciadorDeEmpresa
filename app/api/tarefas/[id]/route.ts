import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const tarefaId = Number(id);

    const plano = db.raw.sql`
  SELECT
    "id",
    "titulo",
    "descricao",
    "status",
    TO_CHAR("criadoEm", 'YYYY-MM-DD"T"HH24:MI:SS') AS "criadoEm"
  FROM "Tarefa"
  WHERE "id" = ${tarefaId}
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

    if (!tarefa) {
      return Response.json({ erro: "Tarefa não encontrada" }, { status: 404 });
    }

    return Response.json(tarefa);
  } catch (erro) {
    console.error("ERRO AO BUSCAR TAREFA:", erro);

    return Response.json({ erro: "Erro ao buscar tarefa" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const tarefaId = Number(id);

    const dados = await request.json();

    const { status } = dados;

    const plano = db.raw.sql`
      UPDATE "Tarefa"
      SET "status" = ${status}
      WHERE "id" = ${tarefaId}
    `
      .affectedCount()
      .build();

    const resultado = await runtime.execute(plano);

    if (resultado.affectedRows === 0) {
      return Response.json({ erro: "Tarefa não encontrada" }, { status: 404 });
    }

    return Response.json({
      mensagem: "Tarefa atualizada",
    });
  } catch (erro) {
    console.error("ERRO AO ATUALIZAR TAREFA:", erro);

    return Response.json({ erro: "Erro ao atualizar tarefa" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const tarefaId = Number(id);

    const plano = db.raw.sql`
      DELETE FROM "Tarefa"
      WHERE "id" = ${tarefaId}
    `
      .affectedCount()
      .build();

    const resultado = await runtime.execute(plano);

    if (resultado.affectedRows === 0) {
      return Response.json({ erro: "Tarefa não encontrada" }, { status: 404 });
    }

    return Response.json({
      mensagem: "Tarefa deletada",
    });
  } catch (erro) {
    console.error("ERRO AO DELETAR TAREFA:", erro);

    return Response.json(
      {
        erro: "Erro ao deletar tarefa",
        detalhe: String(erro),
      },
      { status: 500 },
    );
  }
}
