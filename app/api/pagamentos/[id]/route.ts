import db from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const pagamentoID = Number(id);

    const resultado = db
      .prepare(`
        UPDATE pagamentos
        SET status = ?
        WHERE id = ?
      `)
      .run("Pago", pagamentoID);

    if (resultado.changes === 0) {
      return Response.json(
        { mensagem: "Pagamento não encontrado" },
        { status: 404 },
      );
    }

    return Response.json({
      mensagem: "Pagamento atualizado com sucesso",
    });
  } catch (erro) {
    console.error(erro);

    return Response.json(
      { mensagem: "Erro ao atualizar pagamento" },
      { status: 500 },
    );
  }
}