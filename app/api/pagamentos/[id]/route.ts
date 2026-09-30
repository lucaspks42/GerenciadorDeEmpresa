import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const pagamentoId = Number(id);

    if (!Number.isInteger(pagamentoId)) {
      return Response.json({ mensagem: "ID inválido" }, { status: 400 });
    }

    const dados = await request.json();

    if (dados.status !== undefined) {
      const plano = db.raw.sql`
        UPDATE "Pagamento"
        SET "status" = ${dados.status}
        WHERE "id" = ${pagamentoId}
      `
        .affectedCount()
        .build();

      const resultado = await runtime.execute(plano);

      if (resultado.affectedRows === 0) {
        return Response.json(
          { mensagem: "Pagamento não encontrado" },
          { status: 404 },
        );
      }

      return Response.json({
        mensagem: "Status do pagamento atualizado",
      });
    }

    if (dados.valor !== undefined && dados.data_vencimento !== undefined) {
      const plano = db.raw.sql`
        UPDATE "Pagamento"
        SET
          "valor" = ${dados.valor},
          "dataVencimento" = ${dados.data_vencimento}
        WHERE "id" = ${pagamentoId}
      `
        .affectedCount()
        .build();

      const resultado = await runtime.execute(plano);

      if (resultado.affectedRows === 0) {
        return Response.json(
          { mensagem: "Pagamento não encontrado" },
          { status: 404 },
        );
      }

      return Response.json({
        mensagem: "Pagamento alterado com sucesso",
      });
    }

    return Response.json(
      { mensagem: "Nenhuma alteração enviada" },
      { status: 400 },
    );
  } catch (erro) {
    console.error("ERRO AO ATUALIZAR PAGAMENTO:", erro);

    return Response.json(
      { mensagem: "Erro ao atualizar pagamento" },
      { status: 500 },
    );
  }
}
